import React, { Component } from 'react';
import { scaleLinear, scaleTime, scaleOrdinal } from 'd3-scale';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { timeFormat } from 'd3-time-format';
import { timeDay } from 'd3-time';
import './Scatterplot.scss';

const SVG_WIDTH = 960;
const SVG_HEIGHT = 500;
const MARGIN = {top: 130, left: 100, bottom: 130, right: 100};
const WIDTH = SVG_WIDTH - MARGIN.left - MARGIN.right;
const HEIGHT = SVG_HEIGHT - MARGIN.top - MARGIN.bottom;
const COLORS = ['#da4e4e', '#e9904b', '#83bb56'];

class Scatterplot extends Component {
  componentDidMount() {
    this.createScatterplot();
  }

  componentDidUpdate(prevProps) {
    select("#scatterplot").remove();
    this.createScatterplot();
  }

  createScatterplot() {
    const svg = this.svg;

    select(svg)
      .attr('id', 'scatterplotWrapper')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr("preserveAspectRatio", "xMinYMid")
      .attr("viewBox", `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`);
    
    select(svg).append('g')
      .attr('id', 'scatterplot')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

    const xScale = scaleTime()
      .domain([this.props.from, this.props.to])
      .range([50, WIDTH - 50])
      .nice(timeDay, 1);
    const yScale = scaleLinear()
      .domain([0, 5])
      .range([HEIGHT, 0]);
    const scaleColor = scaleOrdinal(COLORS).domain(['fail', 'error', 'pass']);

    this.renderAxis(xScale, yScale);
    this.renderDots(xScale, yScale, scaleColor);  
    this.renderLegend(scaleColor);
  }

  renderAxis = (xScale, yScale) => {
    const scatterplot = select('#scatterplot');
    const unickDates = this.props.data.filter((el, i) => {
      const data = this.props.data.map(el => el.start_time.toDateString());
      return data.indexOf(el.start_time.toDateString()) === i;
    });
    const customTicks = unickDates.length > 8 ? unickDates.length / 8 : 1;
    const xAxis = axisBottom(xScale).ticks(timeDay.every(customTicks)).tickFormat(timeFormat("%b %d")).tickSize(8);
    scatterplot
      .append("g")
      .attr("class", "xAxisG")
      .attr("transform", `translate(0, ${HEIGHT + 8})`)
      .call(xAxis);
      
    const yAxis = axisLeft(yScale).tickFormat(d => d = `${d} min`).tickSize(-WIDTH);
    scatterplot
      .append("g")
      .attr("class", "yAxisG")
      .call(yAxis);

    scatterplot.selectAll('.xAxisG text')
      .attr('y', 15);
    scatterplot.selectAll('.yAxisG text')
      .attr('x', -15);
  }

  renderDots = (xScale, yScale, scaleColor) => {
    select('#scatterplot').selectAll('circle')
      .data(this.props.data)
      .enter()
      .append('circle')
      .attr("class", "dot")
      .attr('cx', d => xScale(d.start_time))
      .attr('cy', d => yScale(d.duration))
      .attr('r', 8)
      .attr('stroke', 'white')
      .attr('stroke-width', 0)
      .attr('stroke-alignment', 'outer')
      .attr("fill", (d) => scaleColor(d.status))
      .on('click', this.clickHandler);
  }

  renderLegend = (scaleColor) => {
    const legend = select('#scatterplotWrapper')
      .selectAll('.legend')
      .data(scaleColor.domain())
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${WIDTH + MARGIN.right - i * 75}, 40)`)
   
    legend
      .append("circle")
      .attr('r', 7)
      .attr("cx", 0)
      .attr("cy", 11)
      .style("fill", scaleColor);
  
    legend.append("text")
      .attr("x", 14)
      .attr("y", 4)
      .attr("dy", "12px")
      .text(d => d);
  }

  clickHandler() {
    select(this).classed("selected", !select(this).classed("selected"));
  }
  
  render() {
    return (
      <div className='Scatterplot'>
        <svg 
          ref={svg => this.svg = svg}>
          <defs>
            <filter id="dropshadow" y="-20%" x="-20%" width="200%" height="200%">
              <feDropShadow dx="1" dy="1" stdDeviation="1"/>
            </filter>
          </defs>
        </svg>
      </div>
    );
  }
}

export default Scatterplot;