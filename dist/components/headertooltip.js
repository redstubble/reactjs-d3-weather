"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _d3Helpers = require("../utils/d3-helpers");

var HeaderToolTip =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(HeaderToolTip, _React$Component);

  function HeaderToolTip() {
    (0, _classCallCheck2.default)(this, HeaderToolTip);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(HeaderToolTip).apply(this, arguments));
  }

  (0, _createClass2.default)(HeaderToolTip, [{
    key: "render",
    value: function render() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props,
          d3populated = _ref.d3populated,
          element = _ref.element;

      if (!d3populated) {
        return null;
      }

      if (element) {
        return _react.default.createElement(_semanticUiReact.Card, {
          centered: true
        }, _react.default.createElement(_semanticUiReact.Card.Content, {
          style: {
            minHeight: '100px'
          },
          textAlign: 'center'
        }, _react.default.createElement(_semanticUiReact.Card.Header, null, element.name), _react.default.createElement(_semanticUiReact.Card.Meta, null, (0, _d3Helpers.formatDate)(element.time)), _react.default.createElement(_semanticUiReact.Card.Description, null, "Temp: ", element.temp, " \xB0C")));
      }

      return _react.default.createElement(_semanticUiReact.Card, {
        centered: true
      }, _react.default.createElement(_semanticUiReact.Card.Content, {
        style: {
          minHeight: '100px'
        },
        textAlign: 'center'
      }, _react.default.createElement(_semanticUiReact.Card.Header, null, "5 Day Weather Forecast"), _react.default.createElement(_semanticUiReact.Card.Meta, null), _react.default.createElement(_semanticUiReact.Card.Description, null)));
    }
  }]);
  return HeaderToolTip;
}(_react.default.Component);

var _default = HeaderToolTip;
exports.default = _default;