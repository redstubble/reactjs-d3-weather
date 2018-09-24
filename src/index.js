// https://medium.com/dailyjs/building-a-react-component-with-webpack-publish-to-npm-deploy-to-github-guide-6927f60b3220
import 'semantic-ui-css/semantic.min.css';
import './styles.css';
import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import * as d3Selection from 'd3-selection';
import * as d3Array from 'd3-array';
import * as d3Shape from 'd3-shape';
import { getWeatherData } from './api/weatherApi';
import RadioButtons from './utils/radio-buttons';
import ToolTip from './components/tooltip';
import HeaderToolTip from './components/headertooltip';
import { toggleElements, resetElements } from './utils/toggleElements';
import {
  setCanvasDataState,
  setD3Scales,
  setAxis,
} from './utils/canvasScaffold';
import { keys } from 'd3-collection';

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
    live: null,
  };

  handleSelectChange = (e, { value }) => {
    this.setState({
      select: value,
    });
  };

  handleElementsHideChange = (e, { value, checked }) => {
    const { svgElements } = this.state;
    const el = svgElements[value];
    el.hide = !checked; // double negative to avoid creating hide property on all els
    const view = el.hide ? 'hide' : 'show';
    el.line.setAttribute('class', view);
    el.area.setAttribute('class', view);
    this.setState({
      svgElements,
    });
    this.updatePlotVoronoi();
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
      setAxis(this.state);

      this.plotLineGraph();
      this.plotArea();
      this.plotVoronoiInitial();
    }
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
      .attr('d', function fn(d) {
        svgElements[d.name] = {
          ...svgElements[d.name],
          area: this,
        };
        return area(d.forecast);
      })
      .attr('fill', 'none');
  };

  updatePlotVoronoi = () => {
    const { svgElements, weatherData } = this.state;
    let newData = weatherData.apiResults.results;
    keys(svgElements).map((a) => {
      const el = svgElements[a];
      if (el.hide) {
        newData = newData.filter((o) => o.name !== el.name); // if hidden only return els not with same name.
      }
    });
    this.plotVoronoi(newData);
  };

  plotVoronoiInitial = () => {
    const { canvas } = this.state;
    const focal = this.focus();
    const voronoiGroup = canvas.node.append('g').attr('class', 'voronoi');
    this.setState({
      voronoiGroup,
      focal,
    });
    this.plotVoronoi();
  };

  plotVoronoi = (update = null) => {
    const {
      scales: { voronoi, voroniPolygons },
      weatherData,
      voronoiGroup,
      focal,
    } = this.state;
    const data = update || weatherData.apiResults.results;
    const reactScope = this;
    const v = voronoiGroup
      .selectAll('path')
      .data(voronoi.polygons(voroniPolygons(data)));

    v.exit() //Exit old elements not present in new data
      .on('mouseover', null)
      .on('mouseout', null)
      .remove();

    // UPDATE old elements present in new data.
    v.attr('d', (d) => (d ? `M${d.join('L')}Z` : null))
      .attr('pointer-events', 'all')
      .attr('fill', 'none')
      .on('mouseover', (d) => reactScope.mouseOver(d, focal))
      .on('mouseout', (d) => reactScope.mouseOut(d, focal));

    v.enter() //new Elements
      .append('path')
      .attr('d', (d) => (d ? `M${d.join('L')}Z` : null))
      .attr('pointer-events', 'all')
      .attr('fill', 'none')
      .on('mouseover', (d) => reactScope.mouseOver(d, focal))
      .on('mouseout', (d) => reactScope.mouseOut(d, focal));
  };

  mouseOver = (d, f) => {
    const {
      scales: { x, y },
      svgElements,
    } = this.state;
    const el = svgElements[d.data.name];
    this.setState({
      svgElements: toggleElements(svgElements, el),
    });
    f.attr(
      'transform',
      `translate(${x(new Date(d.data.dateTime * 1000))},${y(d.data.temp)})`,
    );
    f.select('text')
      .text(`${d.data.name}`)
      .text(`${d.data.temp}C`);

    this.setState({
      live: {
        name: d.data.name,
        color: el.color,
        temp: d.data.temp,
        time: new Date(d.data.dateTime * 1000).toString(),
      },
    });
  };

  mouseOut = (d, f) => {
    const { svgElements } = this.state;
    this.setState({
      svgElements: resetElements(svgElements),
    });
    f.attr('transform', 'translate(-100,-100)');
    this.setState({
      live: null,
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
    const { select, svgElements, d3populated } = this.state;
    return (
      <Container>
        <div className="App">
          <div className="header">
            <h3 className="text-muted">D3 Weather Chart</h3>
          </div>
          <RadioButtons
            handleChange={this.handleSelectChange}
            parentState={select}
          />
          <HeaderToolTip d3populated={d3populated} element={this.state.live} />
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
          <ToolTip
            handleChange={this.handleElementsHideChange}
            elements={svgElements}
            d3populated={d3populated}
          />
        </div>
      </Container>
    );
  }
}

export default D3Weather;
