"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.highlight = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _ramda = require("ramda");

var _semanticUiReact = require("semantic-ui-react");

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n  font-weight: ", ";\n  opacity: ", "};\n  font-size: 0.8em;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n  &&& {\n    width: 100%;\n    min-width: 1em;\n    background-color: ", ";\n    opacity: ", ";\n    border: ", ";\n    min-height: 1em;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var NoDecorationLink = {
  textDecoration: 'none',
  color: 'inherit'
};

var ColorContainer = _styledComponents.default.div(_templateObject(), function (props) {
  return props.color;
}, function (props) {
  return props.opacity;
}, function (props) {
  return props.border ? '3px solid black' : 'none';
});

var TextContainer = _styledComponents.default.span(_templateObject2(), function (props) {
  return props.highlight ? 'bold' : 'normal';
}, function (props) {
  return props.highlight;
});

var highlight = function highlight(bool) {
  return bool ? '1' : '0.8';
};

exports.highlight = highlight;

var tooltip =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(tooltip, _React$Component);

  function tooltip() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, tooltip);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(tooltip)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "state", {});
    return _this;
  }

  (0, _createClass2.default)(tooltip, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          d3populated = _this$props.d3populated,
          elements = _this$props.elements,
          handleChange = _this$props.handleChange;
      if (!d3populated) return null;
      return _react.default.createElement("div", {
        className: "d3-weather-tooltip-legend  legend",
        style: {
          border: '1px solid black',
          padding: '10px'
        }
      }, _react.default.createElement("p", {
        className: "header"
      }, "Legend"), _react.default.createElement(_semanticUiReact.Grid, {
        divided: "vertically"
      }, (0, _ramda.keys)(elements).map(function (a) {
        var el = elements[a];
        var highlighted = highlight(el.live);
        return _react.default.createElement(_react.default.Fragment, {
          key: el.name
        }, _react.default.createElement(_semanticUiReact.Grid.Column, {
          width: 3,
          mobile: 5,
          style: {
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }
        }, _react.default.createElement(TextContainer, {
          highlight: highlighted
        }, el.name)), _react.default.createElement(_semanticUiReact.Grid.Column, {
          width: 1
        }, _react.default.createElement(ColorContainer, {
          color: el.color,
          border: el.live,
          opacity: highlighted
        })), _react.default.createElement(_semanticUiReact.Grid.Column, {
          width: 1
        }, _react.default.createElement(_semanticUiReact.Checkbox, {
          checked: !el.hide,
          value: el.name,
          onClick: handleChange
        })));
      })));
    }
  }]);
  return tooltip;
}(_react.default.Component);

var _default = tooltip;
exports.default = _default;