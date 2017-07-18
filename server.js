'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _battles = require('./routes/battles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Set up app and use morgan logger
var app = (0, _express2.default)();

//import api end points

app.use((0, _morgan2.default)('dev'));

// API routes
app.route('/list').get(_battles.getList);
app.route('/count').get(_battles.getCount);
app.route('/stats').get(_battles.getStats);
app.route('/search').get(_battles.searchBattles);

// ...For all the other requests just send error message
app.route("*").get(function (req, res) {
        var err = new Error('Not found');
        res.status(404);
        res.send(err);
});

app.listen(process.env.PORT || 3000);

console.log('App started');

