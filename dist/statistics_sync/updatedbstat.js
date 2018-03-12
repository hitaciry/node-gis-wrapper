'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStatistics = exports.updateLCs = undefined;

var _mongodb = require('mongodb');

var _credentials = require('../credentials');

//"mongodb+srv://kay:myRealPassword@cluster0.mongodb.net/test";

var db = function db(action) {
  _mongodb.MongoClient.connect(_credentials.mongodbUri, function (err, client) {
    client;
    action(client);
  });
};

var updateLCs = function updateLCs(LCs) {
  db(function (client) {

    var dbLCs = client.collection("LC");
    LCs.forEach(function (element) {
      dbLCs.updateOne({ id: element.id }, element, { upsert: true });
    });
    client.close();
  });
};

var updateStatistics = function updateStatistics(Statistics) {
  db(function (client) {
    var dbStatistics = client.collection("Statistics");
    if (Statistics.plan) dbStatistics.updateOne({
      type: Statistics.type,
      year: Statistics.month,
      month: Statistics.year,
      program: Statistics.program
    }, {
      $set: { plans: Statistics.plans } }, { upsert: true });
    if (Statistics.facts) dbStatistics.updateOne({
      type: Statistics.type,
      year: Statistics.month,
      month: Statistics.year,
      program: Statistics.program
    }, {
      $set: { facts: Statistics.facts } }, { upsert: true });
    client.close();
  });
};

exports.updateLCs = updateLCs;
exports.updateStatistics = updateStatistics;