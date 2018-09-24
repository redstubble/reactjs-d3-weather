import { keys } from 'ramda';
import * as d3Selection from 'd3-selection';

export const toggleElements = (elObj, el) => {
  const newElObj = {};
  keys(elObj).forEach((n) => {
    newElObj[n] = {
      ...elObj[n],
      live: n === el.name,
    };
  });
  applyHoverStyles(newElObj);
  return newElObj;
};

export const resetElements = (elObj) => {
  const newElObj = {};
  keys(elObj).forEach((n) => {
    newElObj[n] = {
      ...elObj[n],
      live: false,
    };
  });
  applyHoverStyles(newElObj);
  return newElObj;
};

export const applyHoverStyles = (elObj) => {
  keys(elObj).forEach((n) => {
    if (elObj[n]['live']) {
      d3Selection
        .select(elObj[n].line)
        .classed('city--hover', true)
        .style('stroke-width', 3);
      d3Selection
        .select(elObj[n].area)
        .attr('fill', elObj[n].color)
        .attr('opacity', 0.5);
    } else {
      d3Selection
        .select(elObj[n].line)
        .classed('city--hover', false)
        .style('stroke-width', 1);
      d3Selection
        .select(elObj[n].area)
        .attr('fill', 'none')
        .attr('opacity', 0.5);
    }
  });
};

export const highlight = (bool) => {
  const opacity = bool ? '1' : '0.5';
  return {
    opacity: opacity,
  };
};

// this.focus().attr(
//   'transform',
//   `translate(${x(d.data.dateTime)},${y(d.data.temp)})`,
// );
// this.focus()
//   .select('text')
//   .text(d.data.name);
