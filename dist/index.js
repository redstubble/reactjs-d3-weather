"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var d3Selection = _interopRequireWildcard(require("d3-selection"));

var d3Array = _interopRequireWildcard(require("d3-array"));

var d3Shape = _interopRequireWildcard(require("d3-shape"));

var d3Voronoi = _interopRequireWildcard(require("d3-voronoi"));

var _weatherApi = require("./api/weatherApi");

var _radioButtons = _interopRequireDefault(require("./utils/radio-buttons"));

var _tooltip = _interopRequireDefault(require("./components/tooltip"));

var _toggleElements = require("./utils/toggleElements");

var _canvasScaffold = require("./utils/canvasScaffold");

// https://medium.com/dailyjs/building-a-react-component-with-webpack-publish-to-npm-deploy-to-github-guide-6927f60b3220
var graphDiv = '.graph-canvas';

var D3Weather =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(D3Weather, _Component);

  function D3Weather() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, D3Weather);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(D3Weather)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "state", {
      weatherData: null,
      canvas: {
        width: null,
        height: null,
        node: null,
        margin: {
          top: 25,
          right: 10,
          bottom: 25,
          left: 50
        }
      },
      scales: {
        x: null,
        y: null,
        z: null
      },
      svgElements: {},
      select: 'clear',
      d3populated: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "handleSelectChange", function (e, _ref) {
      var value = _ref.value;

      _this.setState({
        select: value
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "componentDidUpdate", function () {
      var _this$state = _this.state,
          select = _this$state.select,
          d3populated = _this$state.d3populated;

      if (select === 'weather' && !d3populated) {
        _this.setState({
          d3populated: true
        });

        _this.populateWeather();
      }

      if (select === 'clear' && d3populated) {
        _this.setState({
          d3populated: false
        });

        d3Selection.select(graphDiv).selectAll('svg').remove();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "clearGraph", function () {
      d3Selection.select(graphDiv).selectAll('*').remove();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "populateWeather",
    /*#__PURE__*/
    (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      var w;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _weatherApi.getWeatherData)();

            case 2:
              w = _context.sent;

              if (w && w.apiResults.results.length > 0) {
                _this.setState(function (prevState) {
                  return {
                    weatherData: w,
                    canvas: (0, _objectSpread2.default)({}, prevState.canvas, (0, _canvasScaffold.setCanvasDataState)(prevState.canvas.margin, graphDiv))
                  };
                });

                _this.setState(function (prevState) {
                  return {
                    scales: (0, _canvasScaffold.setD3Scales)(prevState)
                  };
                });

                (0, _canvasScaffold.setAxis)(_this.state);

                _this.plotLineGraph();

                _this.plotArea();

                _this.plotVoronoi();
              }

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "plotLineGraph", function () {
      var _this$state2 = _this.state,
          _this$state2$scales = _this$state2.scales,
          x = _this$state2$scales.x,
          y = _this$state2$scales.y,
          z = _this$state2$scales.z,
          canvas = _this$state2.canvas,
          weatherData = _this$state2.weatherData,
          svgElements = _this$state2.svgElements;
      var line = d3Shape.line().curve(d3Shape.curveNatural).x(function (d) {
        return x(new Date(d.dateTime * 1000));
      }).y(function (d) {
        return y(d.temp);
      });
      var location = canvas.node.append('g').selectAll('.location').data(weatherData.apiResults.results).enter().append('g').attr('class', 'location');
      location.append('path').attr('class', 'line').attr('d', function fn(d) {
        svgElements[d.name] = {
          line: this,
          color: z(d.name),
          name: d.name
        };
        return line(d.forecast);
      }).style('stroke', function (d) {
        return z(d.name);
      }).attr('fill', 'none');

      _this.setState({
        svgElements: svgElements
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "plotVoronoi", function () {
      var _this$state3 = _this.state,
          _this$state3$scales = _this$state3.scales,
          x = _this$state3$scales.x,
          y = _this$state3$scales.y,
          canvas = _this$state3.canvas,
          weatherData = _this$state3.weatherData;
      var reactScope = (0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this));
      var voronoi = d3Voronoi.voronoi().x(function (d) {
        return x(new Date(d.dateTime * 1000));
      }).y(function (d) {
        return y(d.temp);
      }).extent([[-canvas.margin.left, -canvas.margin.top], [canvas.width + canvas.margin.right, canvas.height + canvas.margin.bottom]]);

      function voroniPolygons(data) {
        return d3Array.merge(data.map(function (d) {
          return d.forecast.map(function (e) {
            return (0, _objectSpread2.default)({}, e, {
              name: d.name,
              line: d.line
            });
          });
        }));
      }

      var voronoiGroup = canvas.node.append('g').attr('class', 'voronoi');
      voronoiGroup.selectAll('path').data(voronoi.polygons(voroniPolygons(weatherData.apiResults.results))).enter().append('path').attr('d', function (d) {
        return d ? "M".concat(d.join('L'), "Z") : null;
      }).attr('pointer-events', 'all').attr('fill', 'none').on('mouseover', reactScope.mouseOver).on('mouseout', reactScope.mouseOut);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "plotArea", function () {
      var _this$state4 = _this.state,
          _this$state4$scales = _this$state4.scales,
          x = _this$state4$scales.x,
          y = _this$state4$scales.y,
          canvas = _this$state4.canvas,
          svgElements = _this$state4.svgElements,
          weatherData = _this$state4.weatherData;
      var area = d3Shape.area().curve(d3Shape.curveNatural).x(function (d) {
        return x(new Date(d.dateTime * 1000));
      }).y0(canvas.height).y1(function (d) {
        return y(d.temp);
      });
      var location = canvas.node.append('g').selectAll('.location').data(weatherData.apiResults.results).enter().append('g').attr('class', 'location');
      location.append('path').attr('class', 'area').attr('d', function fn(d) {
        svgElements[d.name] = (0, _objectSpread2.default)({}, svgElements[d.name], {
          area: this
        });
        return area(d.forecast);
      }).attr('fill', 'none');
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "mouseOver", function (d) {
      var svgElements = _this.state.svgElements;
      var el = svgElements[d.data.name];

      _this.setState({
        svgElements: (0, _toggleElements.toggleElements)(svgElements, el)
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "mouseOut", function (d) {
      var svgElements = _this.state.svgElements;

      _this.setState({
        svgElements: (0, _toggleElements.resetElements)(svgElements)
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "focus", function () {
      var canvas = _this.state.canvas;
      var focus = canvas.node.append('g').attr('transform', 'translate(-100,-100)').attr('class', 'focus');
      focus.append('circle').attr('r', 3.5);
      focus.append('text').attr('y', -10);
      return focus;
    });
    return _this;
  }

  (0, _createClass2.default)(D3Weather, [{
    key: "render",
    value: function render() {
      var _this$state5 = this.state,
          select = _this$state5.select,
          svgElements = _this$state5.svgElements;
      return _react.default.createElement(_semanticUiReact.Container, null, _react.default.createElement("div", {
        className: "App"
      }, _react.default.createElement(_radioButtons.default, {
        handleChange: this.handleSelectChange,
        parentState: select
      }), _react.default.createElement("div", {
        className: "header"
      }, _react.default.createElement("h3", {
        className: "text-muted"
      }, "D3 Implementations")), _react.default.createElement("div", {
        style: {
          textAlign: 'center',
          borderBottom: '1px solid #e5e5e5',
          padding: '0',
          minHeight: '300px'
        },
        className: "jumbotron graph-canvas",
        id: "graph-canvas-weather"
      }), _react.default.createElement(_tooltip.default, {
        elements: svgElements
      }), _react.default.createElement("div", {
        className: "bs-call-out bs-call-out-danger"
      }, _react.default.createElement("h4", null, "Line Graph of Temperature Forecasts"), _react.default.createElement("p", null, "To add labeling, area fill and hover"))));
    }
  }]);
  return D3Weather;
}(_react.Component);

var _default = D3Weather;
exports.default = _default;