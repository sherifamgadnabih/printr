var express = require('express')
var app = express()
var config = require('./Config.js')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use('/static', express.static('Static'))
app.use('/node_modules', express.static('node_modules'))
app.use('/Src', express.static('Src'))
var AdminFilter = require('./MiddleWares/AdminFilter.js') 
app.use(AdminFilter)
var featureRoutes = require('./Routes/Feature.js')(app)
var UserRoutes = require('./Routes/User.js')(app)

mongoose.connect(config.Database)


var Features = require('./Models/Feature.js')


app.listen(8080, function () {
  console.log('server is runnig')
})
