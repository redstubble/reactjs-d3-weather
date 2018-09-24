"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var D3CheckboxRadioGroup =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(D3CheckboxRadioGroup, _Component);

  function D3CheckboxRadioGroup() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, D3CheckboxRadioGroup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(D3CheckboxRadioGroup)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "state", {});
    return _this;
  }

  (0, _createClass2.default)(D3CheckboxRadioGroup, [{
    key: "render",
    value: function render() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props,
          handleChange = _ref.handleChange,
          parentState = _ref.parentState;

      return _react.default.createElement(_semanticUiReact.Form, null, _react.default.createElement(_semanticUiReact.Form.Group, {
        inline: true
      }, _react.default.createElement(_semanticUiReact.Form.Field, null, _react.default.createElement(_semanticUiReact.Checkbox, {
        radio: true,
        label: "Clear",
        name: "checkboxRadioGroup",
        value: "clear",
        checked: parentState === 'clear',
        onChange: handleChange
      })), _react.default.createElement(_semanticUiReact.Form.Field, null, _react.default.createElement(_semanticUiReact.Checkbox, {
        radio: true,
        label: "Weather Data",
        name: "checkboxRadioGroup",
        value: "weather",
        checked: parentState === 'weather',
        onChange: handleChange
      }))));
    }
  }]);
  return D3CheckboxRadioGroup;
}(_react.Component);

exports.default = D3CheckboxRadioGroup;