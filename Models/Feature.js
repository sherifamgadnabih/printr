var mongoose = require('mongoose')

var FeatureSchema = mongoose.Schema({
  Name: String,
  Tags: String,
  Images: [],
  User: {
   username:String,
   profileimage:String,
   password:String,
   Role:String
  },
  PublishingDate:Date,
  Active:Boolean,
  Type: String
})

module.exports = mongoose.model('Features', FeatureSchema)
