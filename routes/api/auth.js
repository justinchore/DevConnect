const express = require('express'); //get express
const router = express.Router(); //to set up routes

// @route  GET api/auth
// @desc   Test route
// @access Public (no token needed)
router.get('/', (req, res) => res.send('Auth route'));

module.exports = router;