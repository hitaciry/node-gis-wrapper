"use strict";

var _getexpastat = require("./getexpastat");

var _updatedbstat = require("./updatedbstat");

_getexpastat.getLCs.then(_updatedbstat.updateLCs);

var years = [2017, 2018];
var months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var firstDayOfMonth = function firstDayOfMonth(year, month) {
  return new Date(year, month, 1);
};
var lastDayOfMonth = function lastDayOfMonth(year, month) {
  return new Date(year, month, -1);
};

var types = ["person", "opportunity"];
var programs = { 1: "GV", 2: "GT", 5: "GE" };

years.forEach(function (year) {
  months.forEach(function (month) {
    var startDate = firstDayOfMonth(year, month);
    var lastDate = lastDayOfMonth(year, month);
    types.forEach(function (type) {
      Object.keys(programs).forEach(function (program) {
        (0, _getexpastat.getStatistics)(startDate, lastDate, program, type).then(function (expaStat) {
          expaStat.month = month;
          expaStat.year = year;
          (0, _updatedbstat.updateStatistics)(expaStat);
        });
      });
    });
  });
});