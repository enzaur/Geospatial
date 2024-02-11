const jwt = require('jsonwebtoken');
const secretKey = 'lorenzo-secret-key';

// authentication of user start //
function authenticateToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token){
        return res.status(401).json({error: "Unathorized"})
    }

    jwt.verify(token, secretKey, (err, user) => {
        if(err) {
            return res.status(403).json({error: "Forbidden"});
        }

        req.user = user;
        next();
    });
}
// authenticating user end //

module.exports = authenticateToken;