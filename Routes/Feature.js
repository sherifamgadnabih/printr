var Features = require('../Models/Feature.js')
var jwt = require('jsonwebtoken')
var Config = require('../Config.js')
module.exports = function (app) {

    app.post('/Authenticate', function (request, response) {
        var username = request.body.username
        var password = request.body.password
        Features.findOne({ 'User.username': username, 'User.password': password }, function (err, data) {
            if (err) {
                response.json({ Success: false, message: 'Cannot find a user with specified credentials' })
            }
            else {
                if(data){
                var token = jwt.sign(data.User, Config.Secret);
                response.json({ Success: true, token: token, User:data.User, message: 'user is found Successfully' })
                }
                else {
                     response.json({ Success: false, message: 'Cannot find a user with specified credentials' })
                }
            }
            response.end()
        })


    })
    app.get('/GetFeatures', function (request, response) {
        Features.find({ Active: true }).or([{ Type: 'app' }, { Type: 'account' }, { Type: 'modelfile' }]).exec(function (err, features) {
            if (err) {

                response.json({ Err: 'there was an error fetching the Features' })
            }
            else {
                response.json({ Features: features })
            }
            response.end()
        })

    })

    app.post('/AddFeature', function (request, response) {
        var newfeature = Features(request.body)
        console.log(newfeature)
        newfeature.save(function (err) {
            if (err) {
                console.log(err)
                response.json({Success:false})
            } else {
                response.json({Success:true, Id:newfeature._id})
            }

            response.end()
        })
    })

    app.get('/GetFeaturesForAdmins', function (request, response) {
        Features.find(function (err, features) {
            if (err) {
                response.json({ info: 'error during find features', error: err })
            }
            else {
                response.json({ info: 'Features found successfully', Features: features })
            }
            response.end()
        })

    })



    app.put('/DeactivateFeature/:Id', function (request, response) {
        Features.findById(request.params.Id, function (err, feature) {
            if (err) {
                response.json({Success:false ,info: 'error during find feature', error: err })
            };
            feature.Active = false
            feature.save()
            response.json({ Success:true ,info: 'feature deactivated successfully' })
        })
    })

     app.put('/updateFeature', function (request, response) {
         var featuretoupdate = new Features(request.body)
        Features.findById(featuretoupdate._id, function (err, feature) {
            if (err) {
                response.json({Success:false ,info: 'error during find feature', error: err })
            };
            feature.Name = featuretoupdate.Name
            feature.Tags = featuretoupdate.Tags
            feature.Type = featuretoupdate.Type
            feature.PublishingDate = featuretoupdate.PublishingDate
            feature.Images = featuretoupdate.Images
            feature.save()
            response.json({ Success:true ,info: 'feature updated successfully' })
        })
    })
}