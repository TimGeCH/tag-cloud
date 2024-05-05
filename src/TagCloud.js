import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const TagCloud = ({ onWordClick, data }) => {
  const svgRef = useRef();
  const [dimension, setDimension] = useState('主题');

  useEffect(() => {
    if (!data) return;

    const dimensionData = data.map((item) => item[dimension]);
    const words = dimensionData.reduce((acc, subject) => {
      if (subject) {
        acc[subject] = (acc[subject] || 0) + 1;
      }
      return acc;
    }, {});

    const wordCloudData = Object.entries(words).map(([text, value]) => ({
      text,
      value,
    })).sort((a, b) => b.value - a.value); 

    const layout = cloud()
      .size([1200, 400])
      .words(wordCloudData)
      .padding(10)
      .rotate(() => 0) 
      .fontSize((d) => Math.max(12, 5 + 15 * Math.log(d.value + 1)))

      
      .spiral("archimedean") 
      .on('end', draw);

    layout.start();

    function draw(words) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const group = svg.append('g').attr('transform', 'translate(600, 200)');

      group
        .selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-size', (d) => `${d.size}px`)
        .style('fill', (d, i) => d3.schemeCategory10[i % 10])
        .attr('text-anchor', 'middle')
        .attr('transform', (d) => `translate(${[d.x, d.y]})`)
        .text((d) => d.text)
        .on('click', (event, d) => onWordClick(d.text, dimension));
    }
  }, [data, dimension]);

  return (
    <div>
      <select value={dimension} onChange={(e) => setDimension(e.target.value)}>
        <option value="主题">Subject</option>
        <option value="发件人: (姓名)">Sender's Name</option>
        <option value="发件人: (地址)">Sender's Address</option>
        <option value="收件人: (姓名)">Recipient's Name</option>
        <option value="收件人: (地址)">Recipient's Address</option>
        <option value="重要性">Importance</option>
      </select>
      <svg ref={svgRef} width="100%" height={400} />
    </div>
  );
};

export default TagCloud;
