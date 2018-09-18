// https://medium.com/dailyjs/building-a-react-component-with-webpack-publish-to-npm-deploy-to-github-guide-6927f60b3220

import React, { Component } from 'react';
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
import weatherFetch from './api/weatherApi';
import testData from './test/testData';
import { canvas } from './utils/d3-helpers';

class D3Weather extends Component {
  state = {
    weatherData: null,
    localCanvas: null,
  };

  populateWeather = async () => {
    const w = await this.getWeatherData();
    if (w && w.apiResults.results.length > 0) {
      this.setState({
        weatherData: await this.getWeatherData(),
      });
      this.setState({
        localCanvas: this.scaffoldCanvas(),
      });
      this.populateGraph();
    }
  };

  getWeatherData = async () => {
    if (process.env.NODE_ENV === 'development') {
      return testData;
    }
    const weatherData = await weatherFetch();
    const weatherResults = await Promise.all(weatherData.apiResults.results);
    // var _extends =
    //   Object.assign ||
    //   function(target) {
    //     for (var i = 1; i < arguments.length; i++) {
    //       var source = arguments[i];
    //       for (var key in source) {
    //         if (Object.prototype.hasOwnProperty.call(source, key)) {
    //           target[key] = source[key];
    //         }
    //       }
    //     }
    //     return target;
    //   };

    // return _extends({}, weatherData, {
    //   apiResults: _extends({}, weatherData.apiResults, {
    //     results: weatherResults,
    //   }),
    // });

    return {
      ...weatherData,
      apiResults: {
        ...weatherData.apiResults,
        results: weatherResults,
      },
    };
  };

  scaffoldCanvas = () => {
    const { weatherData } = this.state;
    const graphDiv = '.graph-canvas';
    const containerDiv = document.getElementById('graph-canvas-weather');
    const svg = d3Selection
      .select(graphDiv)
      .append('svg')
      .attr('height', containerDiv.clientHeight)
      .attr('width', containerDiv.clientWidth);
    const x =
      containerDiv.clientWidth - (canvas.margin.left + canvas.margin.right);
    const y =
      containerDiv.clientHeight - (canvas.margin.top + canvas.margin.bottom);
    const node = svg
      .append('g')
      .attr(
        'transform',
        `translate(${canvas.margin.left},${canvas.margin.top})`,
      );
    const dataset = d3Collection
      .nest()
      .key((d) => d.name)
      .rollup((d) => d[0])
      .entries(weatherData.apiResults.results);
    return {
      ...canvas,
      ...{
        x,
        y,
        node,
        dataset,
      },
    };
  };

  populateGraph = () => {
    const { localCanvas, weatherData } = this.state;
    const timeParse = d3TimeFormat.timeParse('%Y-%m-%dT%H:%M');
    const formatTime = d3TimeFormat.timeFormat('%Y-%m-%dT%H:%M');
    const arr = localCanvas.dataset[0].value.forecast;
    const range = [
      d3Array.extent(
        localCanvas.dataset[0].value.forecast,
        (d) => new Date(d.dateTime * 1000),
      ),
    ];

    const x = d3Scale
      .scaleTime()
      .range([0, localCanvas.x])
      .domain(range[0]);

    const tempVariance = d3Collection
      .nest()
      .key((d) =>
        d3Array.max(d.value.forecast, function(d) {
          return d.temp;
        }),
      )
      .map(localCanvas.dataset)
      .keys();

    const highestTemp = d3Array.max(tempVariance);
    const lowestTemp = d3Array.min(tempVariance);

    const y = d3Scale
      .scaleLinear()
      .range([localCanvas.y, 0])
      .domain([lowestTemp - 50, highestTemp]);

    const z = d3Scale
      .scaleOrdinal(d3ScaleChromatic.schemeCategory10)
      .domain(weatherData.apiResults.results.map((d) => d.name));

    const line = d3Shape
      .line()
      // .interpolate('basis')
      .curve(d3Shape.curveNatural)
      //   .curve(d3.curveStepAfter)
      .x((d) => x(new Date(d.dateTime * 1000)))
      .y((d) => y(d.temp));

    const area = d3Shape
      .area()
      .curve(d3Shape.curveStepAfter)
      .x((d) => x(new Date(d.dateTime * 1000)))
      .y0(localCanvas.x)
      .y1((d) => y(d.temp));

    const lineGraph = localCanvas.node.append('g');

    const location = localCanvas.node
      .append('g')
      .selectAll('.location')
      .data(weatherData.apiResults.results)
      .enter()
      .append('g')
      .attr('class', 'location');

    location
      .append('path')
      .attr('class', 'line')
      .attr('d', (d) => line(d.forecast))
      .style('stroke', (d) => z(d.name))
      .attr('fill', 'none');
    localCanvas.node
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${localCanvas.y})`)
      .call(
        d3Axis.axisBottom(x).tickFormat((d) => {
          const formatMillisecond = d3TimeFormat.timeFormat('.%L');
          const formatSecond = d3TimeFormat.timeFormat(':%S');
          const formatMinute = d3TimeFormat.timeFormat('%H:%M');
          const formatHour = d3TimeFormat.timeFormat('%H:00');
          const formatDay = d3TimeFormat.timeFormat('%a %d');
          const formatWeek = d3TimeFormat.timeFormat('%b %d');
          const formatMonth = d3TimeFormat.timeFormat('%B');
          const formatYear = d3TimeFormat.timeFormat('%Y');
          const multiFormat = function(date) {
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

    localCanvas.node
      .append('g')
      .attr('class', 'axis y-axis')
      .call(
        d3Axis
          .axisLeft(y)
          .ticks(
            Math.min(
              Math.round(Math.floor(localCanvas.y / 35) + 1),
              highestTemp,
            ),
            '.0f',
          ),
      )
      .append('text')
      .attr(
        'transform',
        `rotate(-90) translate(${-(localCanvas.y / 2)}, ${-localCanvas.margin
          .left * 0.8})`,
      )
      .attr('class', 'label')
      .attr('text-anchor', 'middle')
      .style('font-weight', 'normal')
      .style('font-size', '12px')
      .attr('y', 6)
      .attr('dy', '.35em')
      .attr('fill', '#666')
      .text('Temp °C');
    localCanvas.node.selectAll('.y-axis g text').attr('fill', '#666');
    localCanvas.node.selectAll('.y-axis g line').attr('stroke', '#666');
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <Button onClick={() => this.populateWeather()}>
            Press For Weather
          </Button>
          To get started, edit
          <code>src/App.js</code>
          and save to reload.
        </p>
        <div className="header">
          <h3 className="text-muted">D3 Implementations</h3>
        </div>

        <div
          style={{
            textAlign: 'center',
            borderBottom: '1px solid #e5e5e5',
            padding: '0',
            minHeight: '300px',
          }}
          className="jumbotron graph-canvas"
          id="graph-canvas-weather"
        />
        <div className="bs-callout bs-callout-danger">
          <h4>Line Graph of Temperature Forecasts</h4>
          <p>To add labeling, area fill and hover</p>
        </div>
      </div>
    );
  }
}

export default D3Weather;
