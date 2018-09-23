// https://medium.com/dailyjs/building-a-react-component-with-webpack-publish-to-npm-deploy-to-github-guide-6927f60b3220

import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import * as d3Selection from 'd3-selection';
import * as d3TimeFormat from 'd3-time-format';
import * as d3Time from 'd3-time';
import * as d3Array from 'd3-array';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';
import * as d3Voronoi from 'd3-voronoi';
import { getWeatherData } from './api/weatherApi';
import RadioButtons from './utils/radio-buttons';
import ToolTip from './components/tooltip';
import { toggleElements, resetElements } from './utils/toggleElements';
import { setCanvasDataState, setD3Scales } from './utils/canvasScaffold';

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
        weatherData: w,
        canvas: {
          ...prevState.canvas,
          ...setCanvasDataState(prevState.canvas.margin, graphDiv),
        },
      }));
      this.setState((prevState) => ({
        scales: setD3Scales(prevState),
      }));

      this.setAxis();
      this.plotLineGraph();
      this.plotVoronoi();
      this.plotArea();
    }
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
    const line = d3Shape
      .line()
      .curve(d3Shape.curveNatural)
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
          name: d.name,
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
    const { svgElements } = this.state;
    const el = svgElements[d.data.name];
    this.setState({
      svgElements: toggleElements(svgElements, el),
    });
  };

  mouseOut = (d) => {
    const { svgElements } = this.state;
    this.setState({
      svgElements: resetElements(svgElements),
    });
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

  render() {
    const { select, svgElements } = this.state;
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
          <ToolTip elements={svgElements} />
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
