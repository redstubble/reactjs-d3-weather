"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAxis = exports.setD3Scales = exports.setCanvasDataState = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var d3Selection = _interopRequireWildcard(require("d3-selection"));

var d3Scale = _interopRequireWildcard(require("d3-scale"));

var d3Collection = _interopRequireWildcard(require("d3-collection"));

var d3ScaleChromatic = _interopRequireWildcard(require("d3-scale-chromatic"));

var d3Array = _interopRequireWildcard(require("d3-array"));

var d3TimeFormat = _interopRequireWildcard(require("d3-time-format"));

var d3Time = _interopRequireWildcard(require("d3-time"));

var d3Voronoi = _interopRequireWildcard(require("d3-voronoi"));

var d3Axis = _interopRequireWildcard(require("d3-axis"));

var setCanvasDataState = function setCanvasDataState(_ref, el) {
  var top = _ref.top,
      right = _ref.right,
      bottom = _ref.bottom,
      left = _ref.left;
  var canvasContainer = document.getElementById('graph-canvas-weather');
  var width = canvasContainer.clientWidth - (left + right);
  var height = canvasContainer.clientHeight - (top + bottom);
  var svg = d3Selection.select(el).append('svg').attr('height', canvasContainer.clientHeight).attr('width', canvasContainer.clientWidth);
  var node = svg.append('g').attr('class', 'canvas-node').attr('transform', "translate(".concat(left, ",").concat(top, ")"));
  return {
    width: width,
    height: height,
    node: node
  };
};

exports.setCanvasDataState = setCanvasDataState;

var setD3Scales = function setD3Scales(_ref2) {
  var canvas = _ref2.canvas,
      weatherData = _ref2.weatherData;
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
  var voronoi = d3Voronoi.voronoi().x(function (d) {
    return x(new Date(d.dateTime * 1000));
  }).y(function (d) {
    return y(d.temp);
  }).extent([[-canvas.margin.left, -canvas.margin.top], [canvas.width + canvas.margin.right, canvas.height + canvas.margin.bottom]]);

  var voroniPolygons = function voroniPolygons(data) {
    return d3Array.merge(data.map(function (d) {
      return d.forecast.map(function (e) {
        return (0, _objectSpread2.default)({}, e, {
          name: d.name,
          line: d.line
        });
      });
    }));
  };

  return {
    x: x,
    y: y,
    z: z,
    voronoi: voronoi,
    voroniPolygons: voroniPolygons,
    highestTemp: highestTemp
  };
};

exports.setD3Scales = setD3Scales;

var setAxis = function setAxis(_ref3) {
  var _ref3$scales = _ref3.scales,
      x = _ref3$scales.x,
      y = _ref3$scales.y,
      highestTemp = _ref3$scales.highestTemp,
      canvas = _ref3.canvas;
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
};

exports.setAxis = setAxis;