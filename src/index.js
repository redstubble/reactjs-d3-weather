// https://medium.com/dailyjs/building-a-react-component-with-webpack-publish-to-npm-deploy-to-github-guide-6927f60b3220

import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
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
import { canvas as canvasProps } from './utils/d3-helpers';
import RadioButtons from './utils/radio-buttons';

const graphDiv = '.graph-canvas';

class D3Weather extends Component {
  state = {
    weatherData: null,
    canvas: null,
    select: 'clear',
    d3populated: false,
  };

  handleSelectChange = (e, { value }) => {
    this.setState({
      select: value,
    });
  };

  clearGraph = () => {
    d3Selection
      .select(graphDiv)
      .selectAll('*')
      .remove();
  };

  populateWeather = async () => {
    const w = await this.getWeatherData();
    if (w && w.apiResults.results.length > 0) {
      this.setState({
        weatherData: await this.getWeatherData(),
      });
      this.setState({
        canvas: this.scaffoldCanvas(),
      });
      this.populateGraph();
    }
  };

  componentDidUpdate = () => {
    const { select, d3populated } = this.state;
    if (select === 'weather' && !d3populated) {
      this.setState({
        d3populated: true,
      });
      this.populateWeather();
    }
    if (select === 'clear' && d3populated) {
      this.setState({
        d3populated: false,
      });
      d3Selection
        .select(graphDiv)
        .selectAll('svg')
        .remove();
    }
  };

  getWeatherData = async () => {
    if (process.env.NODE_ENV === 'development') {
      return testData;
    }
    const weatherData = await weatherFetch();
    const weatherResults = await Promise.all(weatherData.apiResults.results);
    return {
      ...weatherData,
      apiResults: {
        ...weatherData.apiResults,
        results: weatherResults,
      },
    };
  };

  scaffoldCanvas = () => {
    const containerDiv = document.getElementById('graph-canvas-weather');
    const { weatherData } = this.state;
    const svg = d3Selection
      .select(graphDiv)
      .append('svg')
      .attr('height', containerDiv.clientHeight)
      .attr('width', containerDiv.clientWidth);
    const x =
      containerDiv.clientWidth -
      (canvasProps.margin.left + canvasProps.margin.right);
    const y =
      containerDiv.clientHeight -
      (canvasProps.margin.top + canvasProps.margin.bottom);
    const node = svg
      .append('g')
      .attr(
        'transform',
        `translate(${canvasProps.margin.left},${canvasProps.margin.top})`,
      );
    const dataset = d3Collection
      .nest()
      .key((d) => d.name)
      .rollup((d) => d[0])
      .entries(weatherData.apiResults.results);
    return {
      ...canvasProps,
      ...{
        x,
        y,
        node,
        dataset,
      },
    };
  };

  populateGraph = () => {
    const { canvas, weatherData } = this.state;
    // const timeParse = d3TimeFormat.timeParse('%Y-%m-%dT%H:%M');
    // const formatTime = d3TimeFormat.timeFormat('%Y-%m-%dT%H:%M');
    // const arr = this.state.canvas.dataset[0].value.forecast;
    const range = [
      d3Array.extent(
        canvas.dataset[0].value.forecast,
        (d) => new Date(d.dateTime * 1000),
      ),
    ];

    const x = d3Scale
      .scaleTime()
      .range([0, canvas.x])
      .domain(range[0]);

    const tempVariance = d3Collection
      .nest()
      .key((d) => d3Array.max(d.value.forecast, (e) => e.temp))
      .map(canvas.dataset)
      .keys();

    const highestTemp = d3Array.max(tempVariance);
    const lowestTemp = d3Array.min(tempVariance);

    const y = d3Scale
      .scaleLinear()
      .range([canvas.y, 0])
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

    // const area = d3Shape
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

    const location = canvas.node
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
    canvas.node
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${canvas.y})`)
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
          const multiFormat = (date) => {
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
        `rotate(-90) translate(${-(canvas.y / 2)}, ${-canvas.margin.left *
          0.8})`,
      )
      .attr('class', 'label')
      .attr('text-anchor', 'middle')
      .style('font-weight', 'normal')
      .style('font-size', '12px')
      .attr('y', 6)
      .attr('dy', '.35em')
      .attr('fill', '#666')
      .text('Temp °C');
    canvas.node.selectAll('.y-axis g text').attr('fill', '#666');
    canvas.node.selectAll('.y-axis g line').attr('stroke', '#666');
  };

  render() {
    const { select } = this.state;
    return (
      <Container>
        <div className="App">
          <RadioButtons
            handleChange={this.handleSelectChange}
            parentState={select}
          />
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
      </Container>
    );
  }
}

export default D3Weather;
