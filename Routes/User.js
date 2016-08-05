var Users = require('../Models/Feature.js')
module.exports = function (app) {

    app.get('/getUsers', function (request, response) {
        Users.find({}).distinct('User').exec(function (err, users) {

            if (err) {
                response.json({ Success: false, message: 'Error while retrieving users' });
            }
            else {
                response.json({ Success: true, Users: users });
            }
            response.end();
        })

    })

    app.post('/AddAdmin', function (request, response) {
        var newuser = new Users()
        newuser.User.Role = "Admin"
        newuser.User.username = request.body.username
         newuser.User.password = request.body.password
        newuser.save(function (err) {
            if (err) {
                response.json({ Success: false, message: 'Error while adding admin' });
            }
            else {
                response.json({ Success: true, message: 'Admin Added Successfully'  });
            }
             response.end();
        })



    })

}