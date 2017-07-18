'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.searchBattles = exports.getStats = exports.getCount = exports.getList = undefined;

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Database connection setup
var MongoClient = _mongodb2.default.MongoClient;
var db;

// Initialize connection once
MongoClient.connect("mongodb://demo:demo@ds161742.mlab.com:61742/got-battle-db", function (err, database) {
	if (err) return console.error(err);
	db = database;
});

// Defining all end points below

var getList = function getList(req, res) {
	db.collection("battles").distinct("location", { 'location': { "$exists": true, "$type": 2, "$ne": "" } }, function (err, locations) {
		if (err) {
			res.send(err);
		}
		res.json(locations);
	});
};

var getCount = function getCount(req, res) {
	db.collection("battles").count(function (err, count) {
		if (err) {
			res.send(err);
		}
		res.json(count);
	});
};

var getStats = function getStats(req, res) {
	var result = {
		'most_active': {
			'attacker_king': null,
			'defender_king': null,
			'region': null,
			'name': null
		},
		'attacker_outcome': {
			'win': null,
			'loss': null
		},
		'battle_type': [],
		'defender_size': {
			'average': null,
			'min': null,
			'max': null
		}
	};

	_async2.default.parallel([
	// get most_active things
	function (callback) {
		db.collection('battles').aggregate({ $group: { _id: "$attacker_king", "count": { $sum: 1 } } }, { $sort: { "count": -1 } }, { $limit: 1 }).toArray(function (err, object) {
			if (err) {
				callback(err);
			}
			result['most_active']['attacker_king'] = object[0]["_id"];
			callback();
		});
	}, function (callback) {
		db.collection('battles').aggregate({ $group: { _id: "$defender_king", "count": { $sum: 1 } } }, { $sort: { "count": -1 } }, { $limit: 1 }).toArray(function (err, object) {
			if (err) {
				callback(err);
			}
			result['most_active']['defender_king'] = object[0]["_id"];
			callback();
		});
	}, function (callback) {
		db.collection('battles').aggregate({ $group: { _id: "$region", "count": { $sum: 1 } } }, { $sort: { "count": -1 } }, { $limit: 1 }).toArray(function (err, object) {
			if (err) {
				callback(err);
			}
			result['most_active']['region'] = object[0]["_id"];
			callback();
		});
	}, function (callback) {
		db.collection('battles').find({ attacker_size: { $gt: 0 } }).sort({ "attacker_size": -1 }).limit(1).toArray(function (err, object) {
			if (err) {
				callback(err);
			}
			result['most_active']['name'] = object[0]["name"];
			callback();
		});
	},

	//get attacker_outcome things
	function (callback) {
		db.collection('battles').aggregate({ $match: { 'attacker_outcome': { "$ne": "" } } }, { $group: { _id: "$attacker_outcome", "count": { $sum: 1 } } }, function (err, object) {
			if (err) {
				callback(err);
			}
			if (object[0]["_id"] == "loss") {
				result['attacker_outcome']['loss'] = object[0]["count"];
				result['attacker_outcome']['win'] = object[1]["count"];
			} else {
				result['attacker_outcome']['loss'] = object[1]["count"];
				result['attacker_outcome']['win'] = object[0]["count"];
			}

			callback();
		});
	},

	//get battle_type array
	function (callback) {
		db.collection('battles').distinct('battle_type', { 'battle_type': { "$exists": true, "$type": 2, "$ne": "" } }, function (err, battleTypes) {
			if (err) {
				callback(err);
			}
			result['battle_type'] = battleTypes;
			callback();
		});
	},

	//get defender_size things

	function (callback) {
		db.collection('battles').aggregate({ $match: { 'defender_size': { "$ne": "" } } }, { $group: { _id: null, maxSize: { $max: "$defender_size" }, minSize: { $min: "$defender_size" }, avgSize: { $avg: "$defender_size" } } }, function (err, object) {
			if (err) {
				callback(err);
			}
			result['defender_size']['average'] = object[0]['avgSize'];
			result['defender_size']['max'] = object[0]['maxSize'];
			result['defender_size']['min'] = object[0]['minSize'];
			callback();
		});
	}], function (err) {
		if (err) {
			res.send(err);
		}
		res.json(result);
	});
};

var searchBattles = function searchBattles(req, res) {
	var king = req.query.king;
	var location = req.query.location;
	var type = req.query.type;

	if (king != null && king.length != 0) {
		if (location != null && location.length != 0 && type != null && type.length != 0) {
			db.collection("battles").find({
				$or: [{ attacker_king: king }, { defender_king: king }],
				'location': location,
				'battle_type': type
			}).toArray(function (err, docs) {
				if (err) {
					res.send(err);
				}
				res.json(docs);
			});
		} else {
			db.collection("battles").find({
				$or: [{ attacker_king: king }, { defender_king: king }]
			}).toArray(function (err, docs) {
				if (err) {
					res.send(err);
				}
				res.json(docs);
			});
		}
	} else {
		res.status(404);
		res.send(new Error('Specify query parameters'));
	}
};

exports.getList = getList;
exports.getCount = getCount;
exports.getStats = getStats;
exports.searchBattles = searchBattles;
