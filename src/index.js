// https://medium.com/dailyjs/building-a-react-component-with-webpack-publish-to-npm-deploy-to-github-guide-6927f60b3220

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
import * as d3Voronoi from 'd3-voronoi';
import { getWeatherData } from './api/weatherApi';
import { canvas as canvasProps } from './utils/d3-helpers';
import RadioButtons from './utils/radio-buttons';

const graphDiv = '.graph-canvas';

class D3Weather extends Component {
  state = {
    weatherData: null,
    canvas: {
      width: null,
      height: null,
      node: null,
      margin: {
        top: 25,
        right: 10,
        bottom: 25,
        left: 50,
      },
    },
    scales: {
      x: null,
      y: null,
      z: null,
    },
    svgElements: {},
    select: 'clear',
    d3populated: false,
  };

  handleSelectChange = (e, { value }) => {
    this.setState({
      select: value,
    });
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

  clearGraph = () => {
    d3Selection
      .select(graphDiv)
      .selectAll('*')
      .remove();
  };

  populateWeather = async () => {
    const w = await getWeatherData();
    if (w && w.apiResults.results.length > 0) {
      this.setState((prevState) => ({
        canvas: {
          ...prevState.canvas,
          ...this.setCanvasDataState(),
        },
        weatherData: w,
      }));
      this.setState({
        scales: this.setD3Scales(),
      });

      this.setAxis();
      this.plotLineGraph();
      this.plotVoronoi();
      this.plotArea();
    }
  };

  setCanvasDataState = () => {
    const { top, right, bottom, left } = this.state.canvas.margin;
    const canvasContainer = document.getElementById('graph-canvas-weather');
    const width = canvasContainer.clientWidth - (left + right);
    const height = canvasContainer.clientHeight - (top + bottom);
    const svg = d3Selection
      .select(graphDiv)
      .append('svg')
      .attr('height', canvasContainer.clientHeight)
      .attr('width', canvasContainer.clientWidth);
    const node = svg
      .append('g')
      .attr('class', 'canvas-node')
      .attr('transform', `translate(${left},${top})`);
    return {
      width,
      height,
      node,
    };
  };

  setD3Scales = () => {
    const { canvas, weatherData } = this.state;
    const reactScope = this;

    const dataset = d3Collection
      .nest()
      .key((d) => d.name)
      .rollup((d) => d[0])
      .entries(weatherData.apiResults.results);

    const range = [
      d3Array.extent(
        dataset[0].value.forecast,
        (d) => new Date(d.dateTime * 1000),
      ),
    ];

    const x = d3Scale
      .scaleTime()
      .range([0, canvas.width])
      .domain(range[0]);

    const tempVariance = d3Collection
      .nest()
      .key((d) => d3Array.max(d.value.forecast, (e) => e.temp))
      .map(dataset)
      .keys();

    const highestTemp = d3Array.max(tempVariance);
    const lowestTemp = d3Array.min(tempVariance);

    const y = d3Scale
      .scaleLinear()
      .range([canvas.height, 0])
      .domain([lowestTemp - 15, highestTemp]);

    const z = d3Scale
      .scaleOrdinal(d3ScaleChromatic.schemeCategory10)
      .domain(weatherData.apiResults.results.map((d) => d.name));

    return {
      x,
      y,
      z,
      highestTemp,
    };
  };

  setAxis = () => {
    const {
      scales: { x, y, highestTemp },
      canvas,
    } = this.state;
    canvas.node
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${canvas.height})`)
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
            let formatTime = formatYear;
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
        }),
      );

    canvas.node
      .append('g')
      .attr('class', 'axis y-axis')
      .call(
        d3Axis
          .axisLeft(y)
          .ticks(
            Math.min(
              Math.round(Math.floor(canvas.height / 35) + 1),
              highestTemp,
            ),
            '.0f',
          ),
      )
      .append('text')
      .attr(
        'transform',
        `rotate(-90) translate(${-(canvas.height / 2)}, ${-canvas.margin.left *
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

  plotLineGraph = () => {
    const {
      scales: { x, y, z },
      canvas,
      weatherData,
      svgElements,
    } = this.state;
    const reactScope = this;

    const line = d3Shape
      .line()
      // .interpolate('basis')
      .curve(d3Shape.curveNatural)
      //   .curve(d3.curveStepAfter)
      .x((d) => x(new Date(d.dateTime * 1000)))
      .y((d) => y(d.temp));

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
      .attr('d', function fn(d) {
        svgElements[d.name] = {
          line: this,
          color: z(d.name),
        };
        return line(d.forecast);
      })
      .style('stroke', (d) => {
        return z(d.name);
      })
      .attr('fill', 'none');
    this.setState({ svgElements });
  };

  plotVoronoi = () => {
    const {
      scales: { x, y },
      canvas,
      weatherData,
    } = this.state;
    const reactScope = this;
    const voronoi = d3Voronoi
      .voronoi()
      .x((d) => x(new Date(d.dateTime * 1000)))
      .y((d) => y(d.temp))
      .extent([
        [-canvas.margin.left, -canvas.margin.top],
        [
          canvas.width + canvas.margin.right,
          canvas.height + canvas.margin.bottom,
        ],
      ]);

    function voroniPolygons(data) {
      return d3Array.merge(
        data.map((d) => {
          return d.forecast.map((e) => {
            return {
              ...e,
              name: d.name,
              line: d.line,
            };
          });
        }),
      );
    }

    const voronoiGroup = canvas.node.append('g').attr('class', 'voronoi');

    voronoiGroup
      .selectAll('path')
      .data(voronoi.polygons(voroniPolygons(weatherData.apiResults.results)))
      .enter()
      .append('path')
      .attr('d', (d) => (d ? `M${d.join('L')}Z` : null))
      .attr('pointer-events', 'all')
      .attr('fill', 'none')
      .on('mouseover', reactScope.mouseOver)
      .on('mouseout', reactScope.mouseOut);
  };

  plotArea = () => {
    const {
      scales: { x, y },
      canvas,
      svgElements,
      weatherData,
    } = this.state;
    const area = d3Shape
      .area()
      .curve(d3Shape.curveNatural)
      .x((d) => x(new Date(d.dateTime * 1000)))
      .y0(canvas.height)
      .y1((d) => y(d.temp));

    const location = canvas.node
      .append('g')
      .selectAll('.location')
      .data(weatherData.apiResults.results)
      .enter()
      .append('g')
      .attr('class', 'location');

    location
      .append('path')
      .attr('class', 'area')
      .attr('d', function(d) {
        svgElements[d.name] = {
          ...svgElements[d.name],
          area: this,
        };
        return area(d.forecast);
      })
      .attr('fill', 'none');
  };

  mouseOver = (d) => {
    const {
      scales: { x, y },
      svgElements,
    } = this.state;
    const el = svgElements[d.data.name];
    // debugger;
    d3Selection
      .select(el.line)
      .classed('city--hover', true)
      .style('stroke-width', 3);
    d3Selection
      .select(el.area)
      .attr('fill', el.color)
      .attr('opacity', 0.5);
    // .classed('city--hover', true)
    // .style('stroke-width', 3);
    // .style('stroke', d3Color.hsl(z(d.data.name)).brighter(1));
    // d.data.city.line.parentNode.appendChild(d.data.city.line);
    this.focus().attr(
      'transform',
      `translate(${x(d.data.dateTime)},${y(d.data.temp)})`,
    );
    this.focus()
      .select('text')
      .text(d.data.name);
  };

  mouseOut = (d) => {
    const { svgElements } = this.state;
    const el = svgElements[d.data.name];
    d3Selection
      .select(el.line)
      .classed('city--hover', true)
      .style('stroke-width', 1);
    d3Selection
      .select(el.area)
      .attr('fill', 'none')
      .attr('opacity', 0.5);
  };

  focus = () => {
    const { canvas } = this.state;
    const focus = canvas.node
      .append('g')
      .attr('transform', 'translate(-100,-100)')
      .attr('class', 'focus');
    focus.append('circle').attr('r', 3.5);
    focus.append('text').attr('y', -10);
    return focus;
  };

  mouseMove = () => {
    // const { x } = this.state;
    // console.log(this);
    console.log(this);
    const { x } = this.state;
    console.log(d3Selection.mouse(this)[0]);
    console.log(x.invert(d3Selection.mouse(this)[0]));
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
          <div className="bs-call-out bs-call-out-danger">
            <h4>Line Graph of Temperature Forecasts</h4>
            <p>To add labeling, area fill and hover</p>
          </div>
        </div>
      </Container>
    );
  }
}

export default D3Weather;
