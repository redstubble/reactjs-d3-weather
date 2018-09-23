"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.highlight = void 0;

var _react = _interopRequireDefault(require("react"));

var _ramda = require("ramda");

var _semanticUiReact = require("semantic-ui-react");

var _this = void 0;

var NoDecorationLink = {
  textDecoration: 'none',
  color: 'inherit'
};

var highlight = function highlight(bool) {
  var opacity = bool ? '1' : '0.5';
  return {
    opacity: opacity
  };
};

exports.highlight = highlight;

var _default = function _default() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props,
      elements = _ref.elements;

  return _react.default.createElement("div", {
    className: "dashboard-tooltip tooltip-distribution-history"
  }, _react.default.createElement("p", {
    className: "header"
  }, "Legend"), _react.default.createElement(_semanticUiReact.Grid, null, (0, _ramda.keys)(elements).map(function (a) {
    var el = elements[a];
    return _react.default.createElement(_react.default.Fragment, {
      key: el.name
    }, _react.default.createElement(_semanticUiReact.Grid.Column, {
      style: highlight(el.live),
      width: 6
    }, el.name), _react.default.createElement(_semanticUiReact.Grid.Column, {
      style: ([{
        height: '18px',
        backgroundColor: el.color
      }], highlight(el.live)),
      width: 6
    }));
  })));
};

exports.default = _default;