var jwt = require('jsonwebtoken')
var Config = require('../Config.js')
var VerifyUser = function (req, res, next) {
  var token = (req.body && req.body.token) || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, Config.Secret, function (err, User) {
      if (err) {
        res.json({ success: false, message: 'Failed to authenticate token.' });
        res.end()
      } else {

        if (User.Role == 'Admin') {
          next();

        }
        else {
          res.json({ success: false, message: 'user must be admin to access this route' });
          res.end()

        }

      }
    })
  }
  else {
    res.json({ success: false, message: 'user is not authenticated' });
    res.end()
  }
}

module.exports = function (req, res, next) {
  if (req._parsedUrl.pathname === '/AddFeature' || req._parsedUrl.pathname === '/GetFeaturesForAdmins' || req._parsedUrl.pathname === '/DeactivateFeature') {
    VerifyUser(req, res, next)
  } else {

    next()
  }
}