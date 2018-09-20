"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _locations = require("./locations");

var _default =
/*#__PURE__*/
(0, _asyncToGenerator2.default)(
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
                      return fetch("http://api.openweathermap.org/data/2.5/forecast?id=".concat(loc._id, "&units=metric&APPID=").concat(_locations.key));

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
                      location = item.city.name + ', ' + item.city.country;
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

exports.default = _default;