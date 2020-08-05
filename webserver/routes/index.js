
var mqtt_module = require('../public/javascripts/mqtt');



var express = require('express');
var router = express.Router();
var requestify = require('requestify');


/* GET home page. */

router.get('/', function (req, res) {
  res.render('index', { title: 'index', message: 'Hello index' })
})

router.get('/drone', function(req, res, next) {
  res.render('drone', { title: 'drone', message: 'Hello drone' })
});

// router.get('/weather', function(req, res, next) {
	
// 	var json_log = mqtt_module.json_log
// 	console.log('router' + json_log);
//     res.render('weather', { title: 'weather',
//       message: (json_log) 
// });
//     })






module.exports = router;