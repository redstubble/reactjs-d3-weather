import * as d3Selection from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Collection from 'd3-collection';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Array from 'd3-array';
import * as d3TimeFormat from 'd3-time-format';
import * as d3Time from 'd3-time';
import * as d3Voronoi from 'd3-voronoi';
import * as d3Axis from 'd3-axis';

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

  const voroniPolygons = (data) => {
    return d3Array.merge(
      data.map((d) =>
        d.forecast.map((e) => ({
          ...e,
          name: d.name,
          line: d.line,
        })),
      ),
    );
  };
  return {
    x,
    y,
    z,
    voronoi,
    voroniPolygons,
    highestTemp,
  };
};

export const setAxis = ({ scales: { x, y, highestTemp }, canvas }) => {
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
          Math.min(Math.round(Math.floor(canvas.height / 35) + 1), highestTemp),
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
