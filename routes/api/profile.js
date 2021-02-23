const express = require('express'); //get express
const router = express.Router(); //to set up routes

// @route  GET api/profile
// @desc   Test route
// @access Public (no token needed)
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;