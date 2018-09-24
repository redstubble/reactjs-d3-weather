"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatDate = exports.canvas = void 0;
var canvas = {
  dataset: [5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25]
};
exports.canvas = canvas;

var formatDate = function formatDate(dt) {
  var date = new Date(dt);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'

  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + '  ' + strTime;
};

exports.formatDate = formatDate;