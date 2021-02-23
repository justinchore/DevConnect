const express = require('express'); //get express
const router = express.Router(); //to set up routes

// @route  GET api/users
// @desc   Test route
// @access Public (no token needed)
router.get('/', (req, res) => res.send('User route'));

module.exports = router;