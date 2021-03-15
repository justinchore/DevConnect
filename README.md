# DevConnect
DevConnect is a social media platform for developers, allowing users to create a profile and communicate with others through posts and comments. This website was created follwowing Brad Traversy's course on Node.js, MongoDB, React and Redux.
## Technologies Used
* MongoDB - Storing profiles, login information, posts, and comments
* Node.js, Express
* Mongoose - For data managing, schema validation, and connection between MongoDB and Node.js
* Bcrypt - Hashing user passwords
* jsonwebtokrn - For session authentication
* React, Redux, HTML, CSS 
## Knowledge Acquired
Below is a list of some useful tricks/processes I picked up during the website's creation.
### Backend: Implemntation of Middleware into Routes
Instead of manually checking for a valid token at every express route that requires a user to be logged in, implenmenting an authorization middleware to insert at every "private" route definition was done. This allowed for much modular process while constructing API endpoints. 
```
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) { //middleware arguments
    //Get token from header
    const token = req.header('x-auth-token'); //get token from the header

    // Check if no token 
    if(!token) {
        return res.status(401).json({ msg: 'No token, authorization denied'}); //ends here
    } 

    //Verify Token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user //payload decoded includes the user - "req.user" now can be accessed in the route. 
        next(); //goes on to the rest of the request
    } catch {
        res.status(401).json({ msg: 'Token is not valid'});
    }
}
```
Auth middleware in use:
```
// @route  GET api/auth
// @desc   Validate Token in header
// @access Protected
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
```
