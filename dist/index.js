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

var _reactDom = _interopRequireDefault(require("react-dom"));

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

var d3Voronoi = _interopRequireWildcard(require("d3-voronoi"));

var _weatherApi = require("./api/weatherApi");

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
                    canvas: (0, _objectSpread2.default)({}, prevState.canvas, _this.setCanvasDataState()),
                    weatherData: w
                  };
                });

                _this.setState({
                  scales: _this.setD3Scales()
                });

                _this.setAxis();

                _this.plotLineGraph();

                _this.plotVoronoi();

                _this.plotArea();
              }

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "setCanvasDataState", function () {
      var _this$state$canvas$ma = _this.state.canvas.margin,
          top = _this$state$canvas$ma.top,
          right = _this$state$canvas$ma.right,
          bottom = _this$state$canvas$ma.bottom,
          left = _this$state$canvas$ma.left;
      var canvasContainer = document.getElementById('graph-canvas-weather');
      var width = canvasContainer.clientWidth - (left + right);
      var height = canvasContainer.clientHeight - (top + bottom);
      var svg = d3Selection.select(graphDiv).append('svg').attr('height', canvasContainer.clientHeight).attr('width', canvasContainer.clientWidth);
      var node = svg.append('g').attr('class', 'canvas-node').attr('transform', "translate(".concat(left, ",").concat(top, ")"));
      return {
        width: width,
        height: height,
        node: node
      };
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "setD3Scales", function () {
      var _this$state2 = _this.state,
          canvas = _this$state2.canvas,
          weatherData = _this$state2.weatherData;
      var reactScope = (0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this));
      var dataset = d3Collection.nest().key(function (d) {
        return d.name;
      }).rollup(function (d) {
        return d[0];
      }).entries(weatherData.apiResults.results);
      var range = [d3Array.extent(dataset[0].value.forecast, function (d) {
        return new Date(d.dateTime * 1000);
      })];
      var x = d3Scale.scaleTime().range([0, canvas.width]).domain(range[0]);
      var tempVariance = d3Collection.nest().key(function (d) {
        return d3Array.max(d.value.forecast, function (e) {
          return e.temp;
        });
      }).map(dataset).keys();
      var highestTemp = d3Array.max(tempVariance);
      var lowestTemp = d3Array.min(tempVariance);
      var y = d3Scale.scaleLinear().range([canvas.height, 0]).domain([lowestTemp - 15, highestTemp]);
      var z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10).domain(weatherData.apiResults.results.map(function (d) {
        return d.name;
      }));
      return {
        x: x,
        y: y,
        z: z,
        highestTemp: highestTemp
      };
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "setAxis", function () {
      var _this$state3 = _this.state,
          _this$state3$scales = _this$state3.scales,
          x = _this$state3$scales.x,
          y = _this$state3$scales.y,
          highestTemp = _this$state3$scales.highestTemp,
          canvas = _this$state3.canvas;
      canvas.node.append('g').attr('class', 'axis axis--x').attr('transform', "translate(0, ".concat(canvas.height, ")")).call(d3Axis.axisBottom(x).tickFormat(function (d) {
        var formatMillisecond = d3TimeFormat.timeFormat('.%L');
        var formatSecond = d3TimeFormat.timeFormat(':%S');
        var formatMinute = d3TimeFormat.timeFormat('%H:%M');
        var formatHour = d3TimeFormat.timeFormat('%H:00');
        var formatDay = d3TimeFormat.timeFormat('%a %d');
        var formatWeek = d3TimeFormat.timeFormat('%b %d');
        var formatMonth = d3TimeFormat.timeFormat('%B');
        var formatYear = d3TimeFormat.timeFormat('%Y');

        var multiFormat = function multiFormat(date) {
          var formatTime = formatYear;

          if (d3Time.timeSecond(date) < date) {
            formatTime = formatMillisecond;
          } else if (d3Time.timeMinute(date) < date) {
            formatTime = formatSecond;
          } else if (d3Time.timeHour(date) < date) {
            formatTime = formatMinute;
          } else if (d3Time.timeDay(date) < date) {
            formatTime = formatHour;
          } else if (d3Time.timeMonth(date) < date) {
            if (d3Time.timeWeek(date) < date) {
              formatTime = formatDay;
            } else {
              formatTime = formatWeek;
            }
          } else if (d3Time.timeYear(date) < date) {
            formatTime = formatMonth;
          }

          return formatTime(date);
        };

        return multiFormat(d);
      }));
      canvas.node.append('g').attr('class', 'axis y-axis').call(d3Axis.axisLeft(y).ticks(Math.min(Math.round(Math.floor(canvas.height / 35) + 1), highestTemp), '.0f')).append('text').attr('transform', "rotate(-90) translate(".concat(-(canvas.height / 2), ", ").concat(-canvas.margin.left * 0.8, ")")).attr('class', 'label').attr('text-anchor', 'middle').style('font-weight', 'normal').style('font-size', '12px').attr('y', 6).attr('dy', '.35em').attr('fill', '#666').text('Temp °C');
      canvas.node.selectAll('.y-axis g text').attr('fill', '#666');
      canvas.node.selectAll('.y-axis g line').attr('stroke', '#666');
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "plotLineGraph", function () {
      var _this$state4 = _this.state,
          _this$state4$scales = _this$state4.scales,
          x = _this$state4$scales.x,
          y = _this$state4$scales.y,
          z = _this$state4$scales.z,
          canvas = _this$state4.canvas,
          weatherData = _this$state4.weatherData,
          svgElements = _this$state4.svgElements;
      var reactScope = (0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this));
      var line = d3Shape.line() // .interpolate('basis')
      .curve(d3Shape.curveNatural) //   .curve(d3.curveStepAfter)
      .x(function (d) {
        return x(new Date(d.dateTime * 1000));
      }).y(function (d) {
        return y(d.temp);
      });
      var location = canvas.node.append('g').selectAll('.location').data(weatherData.apiResults.results).enter().append('g').attr('class', 'location');
      location.append('path').attr('class', 'line').attr('d', function fn(d) {
        svgElements[d.name] = {
          line: this,
          color: z(d.name)
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
      var _this$state5 = _this.state,
          _this$state5$scales = _this$state5.scales,
          x = _this$state5$scales.x,
          y = _this$state5$scales.y,
          canvas = _this$state5.canvas,
          weatherData = _this$state5.weatherData;
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
      var _this$state6 = _this.state,
          _this$state6$scales = _this$state6.scales,
          x = _this$state6$scales.x,
          y = _this$state6$scales.y,
          canvas = _this$state6.canvas,
          svgElements = _this$state6.svgElements,
          weatherData = _this$state6.weatherData;
      var area = d3Shape.area().curve(d3Shape.curveNatural).x(function (d) {
        return x(new Date(d.dateTime * 1000));
      }).y0(canvas.height).y1(function (d) {
        return y(d.temp);
      });
      var location = canvas.node.append('g').selectAll('.location').data(weatherData.apiResults.results).enter().append('g').attr('class', 'location');
      location.append('path').attr('class', 'area').attr('d', function (d) {
        svgElements[d.name] = (0, _objectSpread2.default)({}, svgElements[d.name], {
          area: this
        });
        return area(d.forecast);
      }).attr('fill', 'none');
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "mouseOver", function (d) {
      var _this$state7 = _this.state,
          _this$state7$scales = _this$state7.scales,
          x = _this$state7$scales.x,
          y = _this$state7$scales.y,
          svgElements = _this$state7.svgElements;
      var el = svgElements[d.data.name]; // debugger;

      d3Selection.select(el.line).classed('city--hover', true).style('stroke-width', 3);
      d3Selection.select(el.area).attr('fill', el.color).attr('opacity', 0.5); // .classed('city--hover', true)
      // .style('stroke-width', 3);
      // .style('stroke', d3Color.hsl(z(d.data.name)).brighter(1));
      // d.data.city.line.parentNode.appendChild(d.data.city.line);

      _this.focus().attr('transform', "translate(".concat(x(d.data.dateTime), ",").concat(y(d.data.temp), ")"));

      _this.focus().select('text').text(d.data.name);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "mouseOut", function (d) {
      var svgElements = _this.state.svgElements;
      var el = svgElements[d.data.name];
      d3Selection.select(el.line).classed('city--hover', true).style('stroke-width', 1);
      d3Selection.select(el.area).attr('fill', 'none').attr('opacity', 0.5);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "focus", function () {
      var canvas = _this.state.canvas;
      var focus = canvas.node.append('g').attr('transform', 'translate(-100,-100)').attr('class', 'focus');
      focus.append('circle').attr('r', 3.5);
      focus.append('text').attr('y', -10);
      return focus;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "mouseMove", function () {
      // const { x } = this.state;
      // console.log(this);
      console.log((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
      var x = _this.state.x;
      console.log(d3Selection.mouse((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)))[0]);
      console.log(x.invert(d3Selection.mouse((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)))[0]));
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
        className: "bs-call-out bs-call-out-danger"
      }, _react.default.createElement("h4", null, "Line Graph of Temperature Forecasts"), _react.default.createElement("p", null, "To add labeling, area fill and hover"))));
    }
  }]);
  return D3Weather;
}(_react.Component);

var _default = D3Weather;
exports.default = _default;