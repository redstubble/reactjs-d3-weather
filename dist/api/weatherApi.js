"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWeatherData = exports.weatherFetch = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _locations = require("./locations");

var _testData = _interopRequireDefault(require("../test/testData"));

var weatherFetch =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3() {
    var dataArray, locationResults;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            dataArray = _locations.locations.map(
            /*#__PURE__*/
            function () {
              var _ref2 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee(loc) {
                var response, data;
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return fetch("https://api.openweathermap.org/data/2.5/forecast?id=".concat(loc._id, "&units=metric&APPID=").concat(_locations.key));

                      case 2:
                        response = _context.sent;
                        _context.next = 5;
                        return response.json();

                      case 5:
                        data = _context.sent;
                        return _context.abrupt("return", data);

                      case 7:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }());
            locationResults = dataArray.map(
            /*#__PURE__*/
            function () {
              var _ref3 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee2(data) {
                var item, location, forecast;
                return _regenerator.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return data;

                      case 2:
                        item = _context2.sent;
                        location = "".concat(item.city.name, ", ").concat(item.city.country);
                        forecast = item.list.map(function (ts) {
                          return {
                            dateTime: ts.dt,
                            temp: ts.main.temp,
                            humidity: ts.main.humidity
                          };
                        });
                        return _context2.abrupt("return", {
                          name: location,
                          forecast: forecast
                        });

                      case 6:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }());
            return _context3.abrupt("return", {
              apiResults: {
                response: 'success',
                results: locationResults
              }
            });

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function weatherFetch() {
    return _ref.apply(this, arguments);
  };
}();

exports.weatherFetch = weatherFetch;

var getWeatherData =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4() {
    var weatherData, weatherResults;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(process.env.NODE_ENV === 'development')) {
              _context4.next = 2;
              break;
            }

            return _context4.abrupt("return", _testData.default);

          case 2:
            _context4.next = 4;
            return weatherFetch();

          case 4:
            weatherData = _context4.sent;
            _context4.next = 7;
            return Promise.all(weatherData.apiResults.results);

          case 7:
            weatherResults = _context4.sent;
            return _context4.abrupt("return", (0, _objectSpread2.default)({}, weatherData, {
              apiResults: (0, _objectSpread2.default)({}, weatherData.apiResults, {
                results: weatherResults
              })
            }));

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getWeatherData() {
    return _ref4.apply(this, arguments);
  };
}();

exports.getWeatherData = getWeatherData;