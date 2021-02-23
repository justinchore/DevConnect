const express = require('express'); //get express
const router = express.Router(); //to set up routes

// @route  GET api/posts
// @desc   Test route
// @access Public (no token needed)
router.get('/', (req, res) => res.send('Posts route'));

module.exports = router;