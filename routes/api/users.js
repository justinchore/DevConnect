const express = require('express'); //get express
const router = express.Router(); //to set up routes
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check')
const config = require('config')

const User = require('../../models/User'); //access database model

// @route  POST api/users
// @desc   Register route
// @access Public (no token needed)
router.post('/', [
    check('name', 'Name is Required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() })
    }

    const { name, email, password } = req.body //destructure

    try {
    // See if user exists
    let user = await User.findOne({ email: email });

    if(user) {
        return res.status(400).json( {errors: [{msg: 'User already exists'}]}); //same format as validation errors
    }
    // Get users gravatar
    const avatar = gravatar.url(email, {
        s: '200',//size
        r: 'pg',//rating
        d: 'mm' //default img
    });

    //creates a new user. does not save!
    user = new User({
        name, 
        email,
        avatar,
        password
    }) 
    // Encrypt password using bcrypt
    // Create salt to hash the password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();
    // Return jsonwebtoken (automatic login after registration)
    
    const payload = {
        user: {
            id: user.id //automatically generated
        }
    }

    jwt.sign(
        payload, 
        config.get('jwtSecret'), //from config
        { expiresIn: 360000 }, //long for testing purposes
        (err, token) => {
            if(err) throw err;
            res.json({ token });
        }
      );
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

module.exports = router;