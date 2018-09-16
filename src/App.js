import React, { Component } from 'react';
import weatherFetch from './api/weatherApi';
import { Button } from 'semantic-ui-react';
import * as d3Selection from 'd3-selection';
import * as d3Collection from 'd3-collection';
import * as d3TimeFormat from 'd3-time-format';
import * as d3Time from 'd3-time';
import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    weatherData: null,
  };
  getWeather = async () => {
    const weatherData = await weatherFetch();
    this.setState({
      weatherData: weatherData,
    });
  };

  scaffold = (results) => () => {
    const graphDiv = 'graph-canvas';
    var containerDiv = document.getElementById('graph-canvas-weather');
    canvas.x =
      containerDiv.clientWidth - (canvas.margin.left + canvas.margin.right);
    console.log(canvas.x);
    canvas.y =
      containerDiv.clientHeight - (canvas.margin.top + canvas.margin.bottom);
    console.log(canvas.y);

    var svg = d3Selection
      .select(graphDiv)
      .append('svg')
      .attr('height', containerDiv.clientHeight)
      .attr('width', containerDiv.clientWidth);
    canvas.node = svg
      .append('g')
      .attr(
        'transform',
        'translate(' + canvas.margin.left + ',' + canvas.margin.top + ')',
      );

    canvas.dataset = d3Collection
      .nest()
      .key(function(d) {
        return d.name;
      })
      .rollup(function(d) {
        return d[0];
      })
      .entries(results);
  };

  populateGraph = () => {
    var timeParse = d3TimeFormat.timeParse('%Y-%m-%dT%H:%M');
    var formatTime = d3TimeFormat.timeFormat('%Y-%m-%dT%H:%M');
    var arr = canvas.dataset[0].value.forecast;
    var range = [
      d3Array.extent(canvas.dataset[0].value.forecast, function(d) {
        return new Date(d.dateTime * 1000);
      }),
    ];

    var x = d3Scale
      .scaleTime()
      .range([0, canvas.x])
      .domain(range[0]);

    var tempVariance = d3Collection
      .nest()
      .key(function(d) {
        return d3Array.max(d.value.forecast, function(d) {
          return d.temp;
        });
      })
      .map(canvas.dataset)
      .keys();

    var highestTemp = d3Array.max(tempVariance);
    var lowestTemp = d3Array.min(tempVariance);

    var y = d3Scale
      .scaleLinear()
      .range([canvas.y, 0])
      .domain([lowestTemp - 50, highestTemp]);

    var z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10).domain(
      this.state.weatherData.apiResults.results.map(function(d) {
        return d.name;
      }),
    );

    var line = d3Shape
      .line()
      // .interpolate('basis')
      .curve(d3Shape.curveNatural)
      //   .curve(d3.curveStepAfter)
      .x(function(d) {
        return x(new Date(d.dateTime * 1000));
      })
      .y(function(d) {
        return y(d.temp);
      });

    var area = d3Shape
      .area()
      .curve(d3Shape.curveStepAfter)
      .x(function(d) {
        return x(new Date(d.dateTime * 1000));
      })
      .y0(canvas.x)
      .y1(function(d) {
        return y(d.temp);
      });

    var lineGraph = canvas.node.append('g');

    var location = canvas.node
      .append('g')
      .selectAll('.location')
      .data(this.state.weatherData.apiResults.results)
      .enter()
      .append('g')
      .attr('class', 'location');

    location
      .append('path')
      .attr('class', 'line')
      .attr('d', function(d) {
        return line(d.forecast);
      })
      .style('stroke', function(d) {
        return z(d.name);
      })
      .attr('fill', 'none');

    canvas.node
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + canvas.y + ')')
      .call(
        d3Axis.axisBottom(x).tickFormat(function(d) {
          var formatMillisecond = d3TimeFormat.timeFormat('.%L'),
            formatSecond = d3TimeFormat.timeFormat(':%S'),
            formatMinute = d3TimeFormat.timeFormat('%H:%M'),
            formatHour = d3TimeFormat.timeFormat('%H:00'),
            formatDay = d3TimeFormat.timeFormat('%a %d'),
            formatWeek = d3TimeFormat.timeFormat('%b %d'),
            formatMonth = d3TimeFormat.timeFormat('%B'),
            formatYear = d3TimeFormat.timeFormat('%Y'),
            multiFormat = function(date) {
              return (d3Time.timeSecond(date) < date
                ? formatMillisecond
                : d3Time.timeMinute(date) < date
                  ? formatSecond
                  : d3Time.timeHour(date) < date
                    ? formatMinute
                    : d3Time.timeDay(date) < date
                      ? formatHour
                      : d3Time.timeMonth(date) < date
                        ? d3Time.timeWeek(date) < date
                          ? formatDay
                          : formatWeek
                        : d3Time.timeYear(date) < date
                          ? formatMonth
                          : formatYear)(date);
            };
          return multiFormat(d);
        }),
      );

    canvas.node
      .append('g')
      .attr('class', 'axis y-axis')
      .call(
        d3Axis
          .axisLeft(y)
          .ticks(
            Math.min(Math.round(Math.floor(canvas.y / 35) + 1), highestTemp),
            '.0f',
          ),
      )
      .append('text')
      .attr(
        'transform',
        'rotate(-90) translate(' +
          -(canvas.y / 2) +
          ', ' +
          -canvas.margin.left * 0.8 +
          ')',
      )
      .attr('class', 'label')
      .attr('text-anchor', 'middle')
      .style('font-weight', 'normal')
      .style('font-size', '12px')
      .attr('y', 6)
      .attr('dy', '.35em')
      .attr('fill', '#666')
      .text('Temp');
    canvas.node.selectAll('.y-axis g text').attr('fill', '#666');
    canvas.node.selectAll('.y-axis g line').attr('stroke', '#666');
  };

  render() {
    if (
      this.state.weatherData &&
      this.state.weatherData.apiResults.results.length > 0
    )
      var t = this.scaffold(this.state.weatherData);
    //   canvas.populateGraph();

    //   $.getScript('scripts/tempApiData.js', function () {
    //     this.state.weatherData.apiResults.results = apiData;
    //     canvas.scaffold();
    //     canvas.populateGraph();
    //   });
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <Button
            onClick={() => {
              const weatherData = this.getWeather();
            }}
          >
            Press For Weather
          </Button>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div class="header">
          <h3 class="text-muted">D3 Implementations</h3>
        </div>

        <div class="jumbotron graph-canvas" id="graph-canvas-weather" />
        <div class="bs-callout bs-callout-danger">
          <h4>Line Graph of Temperature Forecasts</h4>
          <p>To add labeling, area fill and hover</p>
        </div>
      </div>
    );
  }
}

export default App;

var canvas = {
  dataset: [
    5,
    10,
    13,
    19,
    21,
    25,
    22,
    18,
    15,
    13,
    11,
    12,
    15,
    20,
    18,
    17,
    16,
    18,
    23,
    25,
  ],
  node: null,
  x: null,
  y: null,
  margin: {
    top: 25,
    right: 10,
    bottom: 25,
    left: 50,
  },
};

// $(function () {
//   if (typeof d3 !== 'undefined') init();
//   else {
//     setTimeout(function () {
//       self.defer()
//     }, 50);
//   }
// });
