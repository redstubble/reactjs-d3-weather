"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

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

var d3Collection = _interopRequireWildcard(require("d3-collection"));

var d3TimeFormat = _interopRequireWildcard(require("d3-time-format"));

var d3Time = _interopRequireWildcard(require("d3-time"));

var d3Array = _interopRequireWildcard(require("d3-array"));

var d3Scale = _interopRequireWildcard(require("d3-scale"));

var d3ScaleChromatic = _interopRequireWildcard(require("d3-scale-chromatic"));

var d3Shape = _interopRequireWildcard(require("d3-shape"));

var d3Axis = _interopRequireWildcard(require("d3-axis"));

var _weatherApi = _interopRequireDefault(require("./api/weatherApi"));

var _testData = _interopRequireDefault(require("./test/testData"));

var _d3Helpers = require("./utils/d3-helpers");

var _radioButtons = _interopRequireDefault(require("./utils/radio-buttons"));

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
      canvas: null,
      select: 'clear',
      d3populated: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "handleSelectChange", function (e, _ref) {
      var value = _ref.value;

      _this.setState({
        select: value
      });
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
              return _this.getWeatherData();

            case 2:
              w = _context.sent;

              if (!(w && w.apiResults.results.length > 0)) {
                _context.next = 12;
                break;
              }

              _context.t0 = _this;
              _context.next = 7;
              return _this.getWeatherData();

            case 7:
              _context.t1 = _context.sent;
              _context.t2 = {
                weatherData: _context.t1
              };

              _context.t0.setState.call(_context.t0, _context.t2);

              _this.setState({
                canvas: _this.scaffoldCanvas()
              });

              _this.populateGraph();

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "getWeatherData",
    /*#__PURE__*/
    (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee2() {
      var weatherData, weatherResults;
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(process.env.NODE_ENV === 'development')) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", _testData.default);

            case 2:
              _context2.next = 4;
              return (0, _weatherApi.default)();

            case 4:
              weatherData = _context2.sent;
              _context2.next = 7;
              return Promise.all(weatherData.apiResults.results);

            case 7:
              weatherResults = _context2.sent;
              return _context2.abrupt("return", (0, _objectSpread2.default)({}, weatherData, {
                apiResults: (0, _objectSpread2.default)({}, weatherData.apiResults, {
                  results: weatherResults
                })
              }));

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "scaffoldCanvas", function () {
      var containerDiv = document.getElementById('graph-canvas-weather');
      var weatherData = _this.state.weatherData;
      var svg = d3Selection.select(graphDiv).append('svg').attr('height', containerDiv.clientHeight).attr('width', containerDiv.clientWidth);
      var x = containerDiv.clientWidth - (_d3Helpers.canvas.margin.left + _d3Helpers.canvas.margin.right);
      var y = containerDiv.clientHeight - (_d3Helpers.canvas.margin.top + _d3Helpers.canvas.margin.bottom);
      var node = svg.append('g').attr('transform', "translate(".concat(_d3Helpers.canvas.margin.left, ",").concat(_d3Helpers.canvas.margin.top, ")"));
      var dataset = d3Collection.nest().key(function (d) {
        return d.name;
      }).rollup(function (d) {
        return d[0];
      }).entries(weatherData.apiResults.results);
      return (0, _objectSpread2.default)({}, _d3Helpers.canvas, {
        x: x,
        y: y,
        node: node,
        dataset: dataset
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "populateGraph", function () {
      var _this$state2 = _this.state,
          canvas = _this$state2.canvas,
          weatherData = _this$state2.weatherData; // const timeParse = d3TimeFormat.timeParse('%Y-%m-%dT%H:%M');
      // const formatTime = d3TimeFormat.timeFormat('%Y-%m-%dT%H:%M');
      // const arr = this.state.canvas.dataset[0].value.forecast;

      var range = [d3Array.extent(canvas.dataset[0].value.forecast, function (d) {
        return new Date(d.dateTime * 1000);
      })];
      var x = d3Scale.scaleTime().range([0, canvas.x]).domain(range[0]);
      var tempVariance = d3Collection.nest().key(function (d) {
        return d3Array.max(d.value.forecast, function (e) {
          return e.temp;
        });
      }).map(canvas.dataset).keys();
      var highestTemp = d3Array.max(tempVariance);
      var lowestTemp = d3Array.min(tempVariance);
      var y = d3Scale.scaleLinear().range([canvas.y, 0]).domain([lowestTemp - 50, highestTemp]);
      var z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10).domain(weatherData.apiResults.results.map(function (d) {
        return d.name;
      }));
      var line = d3Shape.line() // .interpolate('basis')
      .curve(d3Shape.curveNatural) //   .curve(d3.curveStepAfter)
      .x(function (d) {
        return x(new Date(d.dateTime * 1000));
      }).y(function (d) {
        return y(d.temp);
      }); // const area = d3Shape
      //   .area()
      //   .curve(d3Shape.curveStepAfter)
      //   .x(function(d) {
      //     return x(new Date(d.dateTime * 1000));
      //   })
      //   .y0(canvas.x)
      //   .y1(function(d) {
      //     return y(d.temp);
      //   });
      // const lineGraph = canvas.node.append('g');

      var location = canvas.node.append('g').selectAll('.location').data(weatherData.apiResults.results).enter().append('g').attr('class', 'location');
      location.append('path').attr('class', 'line').attr('d', function (d) {
        return line(d.forecast);
      }).style('stroke', function (d) {
        return z(d.name);
      }).attr('fill', 'none');
      canvas.node.append('g').attr('class', 'axis axis--x').attr('transform', "translate(0, ".concat(canvas.y, ")")).call(d3Axis.axisBottom(x).tickFormat(function (d) {
        var formatMillisecond = d3TimeFormat.timeFormat('.%L');
        var formatSecond = d3TimeFormat.timeFormat(':%S');
        var formatMinute = d3TimeFormat.timeFormat('%H:%M');
        var formatHour = d3TimeFormat.timeFormat('%H:00');
        var formatDay = d3TimeFormat.timeFormat('%a %d');
        var formatWeek = d3TimeFormat.timeFormat('%b %d');
        var formatMonth = d3TimeFormat.timeFormat('%B');
        var formatYear = d3TimeFormat.timeFormat('%Y');

        var multiFormat = function multiFormat(date) {
          return (d3Time.timeSecond(date) < date ? formatMillisecond : d3Time.timeMinute(date) < date ? formatSecond : d3Time.timeHour(date) < date ? formatMinute : d3Time.timeDay(date) < date ? formatHour : d3Time.timeMonth(date) < date ? d3Time.timeWeek(date) < date ? formatDay : formatWeek : d3Time.timeYear(date) < date ? formatMonth : formatYear)(date);
        };

        return multiFormat(d);
      }));
      canvas.node.append('g').attr('class', 'axis y-axis').call(d3Axis.axisLeft(y).ticks(Math.min(Math.round(Math.floor(canvas.y / 35) + 1), highestTemp), '.0f')).append('text').attr('transform', "rotate(-90) translate(".concat(-(canvas.y / 2), ", ").concat(-canvas.margin.left * 0.8, ")")).attr('class', 'label').attr('text-anchor', 'middle').style('font-weight', 'normal').style('font-size', '12px').attr('y', 6).attr('dy', '.35em').attr('fill', '#666').text('Temp °C');
      canvas.node.selectAll('.y-axis g text').attr('fill', '#666');
      canvas.node.selectAll('.y-axis g line').attr('stroke', '#666');
    });
    return _this;
  }

  (0, _createClass2.default)(D3Weather, [{
    key: "render",
    value: function render() {
      var select = this.state.select;
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
      }), _react.default.createElement("div", {
        className: "bs-callout bs-callout-danger"
      }, _react.default.createElement("h4", null, "Line Graph of Temperature Forecasts"), _react.default.createElement("p", null, "To add labeling, area fill and hover"))));
    }
  }]);
  return D3Weather;
}(_react.Component);

var _default = D3Weather;
exports.default = _default;