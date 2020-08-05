var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/weather');
//var mqttRouter = require('./routes/sendMqtt');

var app = express();


var mqttHandler = require('./public/javascripts/mqtt');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

var mqttClient = new mqttHandler();
mqttClient.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/weather', usersRouter);
//app.use('/sendMqtt', mqttRouter);
app.get('/weather', function(req, res, next) {
        console.log('router' + mqttClient.json_log);
        res.render('weather', {
            title: 'weather',
            message: (mqttClient.json_log)
        });
    })
    // catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;