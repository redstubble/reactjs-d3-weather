"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyHoverStyles = exports.resetElements = exports.toggleElements = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _ramda = require("ramda");

var d3Selection = _interopRequireWildcard(require("d3-selection"));

var toggleElements = function toggleElements(elObj, el) {
  var newElObj = {};
  (0, _ramda.keys)(elObj).forEach(function (n) {
    newElObj[n] = (0, _objectSpread2.default)({}, elObj[n], {
      live: n === el.name
    });
  });
  applyHoverStyles(newElObj);
  return newElObj;
};

exports.toggleElements = toggleElements;

var resetElements = function resetElements(elObj) {
  var newElObj = {};
  (0, _ramda.keys)(elObj).forEach(function (n) {
    newElObj[n] = (0, _objectSpread2.default)({}, elObj[n], {
      live: false
    });
  });
  applyHoverStyles(newElObj);
  return newElObj;
};

exports.resetElements = resetElements;

var applyHoverStyles = function applyHoverStyles(elObj) {
  (0, _ramda.keys)(elObj).forEach(function (n) {
    if (elObj[n]['live']) {
      d3Selection.select(elObj[n].line).classed('city--hover', true).style('stroke-width', 3);
      d3Selection.select(elObj[n].area).attr('fill', elObj[n].color).attr('opacity', 0.5);
    } else {
      d3Selection.select(elObj[n].line).classed('city--hover', false).style('stroke-width', 1);
      d3Selection.select(elObj[n].area).attr('fill', 'none').attr('opacity', 0.5);
    }
  });
}; // this.focus().attr(
//   'transform',
//   `translate(${x(d.data.dateTime)},${y(d.data.temp)})`,
// );
// this.focus()
//   .select('text')
//   .text(d.data.name);


exports.applyHoverStyles = applyHoverStyles;