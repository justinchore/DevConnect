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

        req.user = decoded.user //payload decoded includes the user
        next(); //goes on to the rest of the request
    } catch {
        res.status(401).json({ msg: 'Token is not valid'});
    }
}