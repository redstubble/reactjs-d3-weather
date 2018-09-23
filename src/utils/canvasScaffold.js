import * as d3Selection from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Collection from 'd3-collection';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Array from 'd3-array';

export const setCanvasDataState = ({ top, right, bottom, left }, el) => {
  const canvasContainer = document.getElementById('graph-canvas-weather');
  const width = canvasContainer.clientWidth - (left + right);
  const height = canvasContainer.clientHeight - (top + bottom);
  const svg = d3Selection
    .select(el)
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

export const setD3Scales = ({ canvas, weatherData }) => {
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
