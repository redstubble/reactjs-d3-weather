import React, { Component } from 'react';
import weatherFetch from './api/weatherApi'
import {Button} from 'semantic-ui-react'
import logo from './logo.svg';
import './App.css';

class App extends Component {

  getWeather = async () => {
    const weatherData = await weatherFetch();
debugger;
  }

  render() {

      
      
      // if (weatherData.apiResults.results.length > 0)
      //     canvas.scaffold();
      //   canvas.populateGraph();
  
  
  //   $.getScript('scripts/tempApiData.js', function () {
  //     weatherApi.apiResults.results = apiData;
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
      debugger;
      this.getWeather();
    }}>
    Press For Weather
    </Button>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;




// var canvas = {
//   dataset: [5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25],
//   node: null,
//   x: null,
//   y: null,
//   margin: {
//     top: 25,
//     right: 10,
//     bottom: 25,
//     left: 50,
//   },
//   scaffold: function (results, graphDiv) {
//     return function () {
//       var graphDiv = '.graph-canvas';
//       var $graphDiv = $(graphDiv);
//       canvas.x = $graphDiv.width() - (canvas.margin.left + canvas.margin.right);
//       console.log(canvas.x);
//       canvas.y = $graphDiv.height() - (canvas.margin.top + canvas.margin.bottom);
//       console.log(canvas.y);

//       var svg = d3.select(graphDiv).append('svg').attr('height', $graphDiv.height()).attr('width', $graphDiv.width());
//       canvas.node = svg.append('g').attr('transform', 'translate(' + canvas.margin.left + ',' + canvas.margin.top + ')');

//       canvas.dataset = d3.nest()
//         .key(function (d) {
//           return d.name
//         })
//         .rollup(function (d) {
//           return d[0]
//         })
//         .entries(weatherApi.apiResults.results);
//     };

//   }(weatherApi.apiResults.results, '.graph-canvas'),

//   populateGraph: function () {
//     var timeParse = d3.timeParse('%Y-%m-%dT%H:%M');
//     var formatTime = d3.timeFormat('%Y-%m-%dT%H:%M');
//     var arr = canvas.dataset[0].value.forecast;

//     var range = [d3.extent(canvas.dataset[0].value.forecast, function (d) {
//       return new Date(d.dateTime * 1000);
//     })];

//     var x = d3.scaleTime()
//       .range([0, canvas.x])
//       .domain(range[0]);

//     var tempVariance = d3.nest()
//       .key(function (d) {
//         return d3.max(d.value.forecast, function (d) {
//           return d.temp
//         })
//       })
//       .map(canvas.dataset)
//       .keys();


//     var highestTemp = d3.max(tempVariance);
//     var lowestTemp = d3.min(tempVariance);

//     var y = d3.scaleLinear()
//       .range([canvas.y, 0])
//       .domain([lowestTemp - 50, highestTemp]);

//     var z = d3.scaleOrdinal(d3.schemeCategory10)
//             .domain(weatherApi.apiResults.results.map(function(d){
//                 return d.name;
//             }));

//     var line = d3.line()
//       // .interpolate('basis') 
//       .curve(d3.curveNatural)
//       //   .curve(d3.curveStepAfter)
//       .x(function (d) {
//         return x(new Date(d.dateTime * 1000));
//       })
//       .y(function (d) {
//         return y(d.temp);
//       });

//     var area = d3.area()
//       .curve(d3.curveStepAfter)
//       .x(function (d) {
//         return x(new Date(d.dateTime * 1000));
//       })
//       .y0(canvas.x)
//       .y1(function (d) {
//         return y(d.temp);
//       });

//     var lineGraph = canvas.node.append('g');

//     var location = canvas.node.append('g').selectAll('.location')
//       .data(weatherApi.apiResults.results)
//       .enter()
//       .append('g')
//       .attr('class', 'location');

//     location.append('path')
//       .attr('class', 'line')
//       .attr('d', function (d) {
//         return line(d.forecast);
//       })
//       .style('stroke', function (d) {
//         return z(d.name);
//       })
//       .attr('fill', 'none');

//     canvas.node.append('g')
//       .attr('class', 'axis axis--x')
//       .attr('transform', 'translate(0,' + canvas.y + ')')
//       .call(d3.axisBottom(x)
//         .tickFormat(function (d) {
//           var formatMillisecond = d3.timeFormat('.%L'),
//             formatSecond = d3.timeFormat(':%S'),
//             formatMinute = d3.timeFormat('%H:%M'),
//             formatHour = d3.timeFormat('%H:00'),
//             formatDay = d3.timeFormat('%a %d'),
//             formatWeek = d3.timeFormat('%b %d'),
//             formatMonth = d3.timeFormat('%B'),
//             formatYear = d3.timeFormat('%Y'),
//             multiFormat = function (date) {
//               return (d3.timeSecond(date) < date ? formatMillisecond :
//                 d3.timeMinute(date) < date ? formatSecond :
//                 d3.timeHour(date) < date ? formatMinute :
//                 d3.timeDay(date) < date ? formatHour :
//                 d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek) :
//                 d3.timeYear(date) < date ? formatMonth :
//                 formatYear)(date);
//             };
//           return multiFormat(d);
//         })
//       );

//     canvas.node.append('g')
//       .attr('class', 'axis y-axis')
//       .call(d3.axisLeft(y).ticks(Math.min(Math.round(Math.floor(canvas.y / 35) + 1), highestTemp), '.0f'))
//       .append('text')
//       .attr('transform', 'rotate(-90) translate(' + (-(canvas.y / 2)) + ', ' + (-canvas.margin.left * .80) + ')')
//       .attr('class', 'label')
//       .attr('text-anchor', 'middle')
//       .style('font-weight', 'normal')
//       .style('font-size', '12px')
//       .attr('y', 6)
//       .attr('dy', '.35em')
//       .attr('fill', '#666')
//       .text('Temp');
//     canvas.node.selectAll('.y-axis g text').attr('fill', '#666');
//     canvas.node.selectAll('.y-axis g line').attr('stroke', '#666');

//   },
// };




// $(function () {
//   if (typeof d3 !== 'undefined') init();
//   else {
//     setTimeout(function () {
//       self.defer()
//     }, 50);
//   }
// });

