// Requires d3.js library

var formatDate2 = d3.time.format("%d/%m/%Y");

function timeChart() {
  var margin = {top: 20, right: 20, bottom: 30, left: 70},
      width = 760,
      height = 425,
      xValue = function(d) { return d[0]; },
      y1Value = function(d) { return d[1]; },
//      y2Value = function(d) { return d[2]; },
      xScale = d3.time.scale(),
      yScale = d3.scale.linear(),
      xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0).tickFormat(d3.time.format("%Y")).ticks(d3.time.years,1),
      yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(d3.format('g')).ticks(5),
      line1 = d3.svg.line().x(X).y(Y1),
//      line2 = d3.svg.line().x(X).y(Y2),
      formatValue = d3.format(",.2f0"),
      legend = null,
      color = d3.scale.category10();
      formatCurrency = function(d) { return "$" + formatValue(d); };

  function chart(selection) {
    selection.each(function(data) {

      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) {
        // return [xValue.call(data, d, i), y1Value.call(data, d, i), y2Value.call(data, d, i)];//
        return [xValue.call(data, d, i), y1Value.call(data, d, i)];

      });

      // Update the x-scale.
      xScale
          .domain(d3.extent(data, function(d) { return d[0]; }))
          .range([0, width - margin.left - margin.right]);

      // Update the y-scale.
      yScale
          .domain([0, d3.max(data, function (d) { return d[1]; }) ])
          //.domain([0, d3.max(data, function(d) { return d[1]; })])
          .range([height - margin.top - margin.bottom, 0]);

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");
      gEnter.append("path").attr("class", "line1");
//      gEnter.append("path").attr("class", "line2");
      gEnter.append("g").attr("class", "x axis");
      gEnter.append("g").attr("class", "y axis");

      // Update the outer dimensions.
      svg .attr("width", width)
          .attr("height", height);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



      // Update the line1 path.
     g.select(".line1")
         .attr("d", line1)
         .style("stroke", color('Hydro Dam Energy Level (GWh)'));

            // Legend
       legend = svg.selectAll(".legend")
           .data(color.domain())
           .enter().append("g")
           .attr("class", "legend")
           .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

       legend.append("rect")
           .attr("x", width - 18)
           .attr("y", 9)
           .attr("width", 15)
           .attr("height", 2)
           .style("fill", color);

       legend.append("text")
           .attr("x", width - 24)
           .attr("y", 9)
           .attr("dy", ".35em")
           .style("text-anchor", "end")
           .text(function (d) { return d; });


      // Update the x-axis.
      g.select(".x.axis")
          .attr("transform", "translate(0," + yScale.range()[0] + ")")
          .call(xAxis);

      g.select(".y.axis")
        .call(yAxis);



      // Bisect function to find xaxis array item
      var bisectX = d3.bisector(function(d) {return d[0];}).left;
      var lastI = -1;
      var lastY = -1;

      // Add interactive focus
      var focus = g.append('g')
        .attr('class', 'focus')
        .style('display', 'none');

        focus.append("svg:line")
              .attr('id','refline')
              .attr('x1',0)
              .attr('x2', 0)
              .attr('y1',0)
              .attr('y2', 20)
              .attr('stroke', '#000');

        focus.append("svg:line")
              .attr('id','refline1')
              .attr('x1',0)
              .attr('x2', 0)
              .attr('y1',0)
              .attr('y2', 0)
              .attr('stroke', '#000');

              focus.append("rect")
              .attr('class', 'focus-back')
              .attr('x', 7)
              .attr('y', -8)
              .attr('rx', 2)
              .attr('ry', 2)
              .attr('width', 220)
              .attr('height', '3.4em')
              .attr('fill', '#fff')
              .attr('stroke', '#000')
              .attr('fill-opacity', '0.80')
              .attr('stroke-opacity', '0.75')
              .attr('stroke-width', '0.0');

        focus.append("text")
          .attr('id', 'textLine1')
              .attr("x",12)
              .attr("dy", "1.35em");

        focus.append("text")
          .attr('id', 'textLine2')
              .attr("x",12)
              .attr("dy", "0.35em");

        focus.append("text")
          .attr('id', 'textLine3')
              .attr("x",12)
              .attr("dy", "2.35em");

        g.append("rect")
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove(d) {

          var x0 = xScale.invert(d3.mouse(this)[0]),
              i = bisectX(d, x0, 1) - 1;

              updateFocusPosition(i,d);


        }

        function updateFocusPosition(i, d) {
            // Setup boundaries to make sure the focus stays on the chart at the extreme right and bottom
            var newX = 0,
                rightEdge = 280;



            // will the focus be at the extreme right?
            if (xScale(d[i][0]) >= (width - rightEdge)) {
                newX = -234;

            }
            focus.selectAll('text').attr("x",12 + newX);
            focus.select('.focus-back').attr('x', 7 + newX);
            focus.select('#refline')
            .attr('y1', yScale(yScale.domain()[1] - 25) -yScale(d[i][1]))
            .attr('y2',  yScale(0) -yScale(d[i][1]) );


            focus.select('#refline1')
            .attr('y1',0)
            .attr('y2', 0)
            .attr('x1',xScale(xScale.domain()[0]) -xScale(d[i][0]))
            .attr('x2', xScale(xScale.domain()[1]) -xScale(d[i][0]));


            focus.select('#refline')
            .attr('y1', yScale(yScale.domain()[1] - 25) -yScale(d[i][1]) )
            .attr('y2',  yScale(0) -yScale(d[i][1]) );


            focus.attr("transform", "translate(" + xScale(d[i][0]) + "," + yScale(d[i][1]) + ")");
            focus.select("#textLine1").text('Dam Energy Storage: ' + d[i][1] + 'GWh' );
            focus.select("#textLine3").text('Date: ' + formatDate2(d[i][0]));






        }




d3.select(window).on("resize", resizeSVGChart);
function resizeSVGChart() {
    // update chart width based on parent
    width = parseInt($("#shortChart").width()); //- margin.left - margin.right;


    // Resize things
    xScale.range([0, width - margin.left - margin.right]);
    yScale.range([height - margin.top - margin.bottom, 0]);

    svg.style('width', width + 'px');


    // Update the axes with the new scale
    svg.select('.x.axis')
        .attr("transform", "translate(0," + yScale.range()[0] + ")")
        .call(xAxis);

    svg.select('.y.axis')
        .call(yAxis);

    // Recalculate lines
    svg.selectAll(".line1")
        .attr("d", line1);



    legend.remove();

    legend = svg.selectAll(".legend")
   .data(color.domain())
   .enter().append("g")
   .attr("class", "legend")
   .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("y", 9)
        .attr("width", 15)
        .attr("height", 2)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });
}






    });
   }

  // The x-accessor for the path generator; xScale ∘ xValue.
  function X(d) {
    return xScale(d[0]);
  }

  // The y-accessor for the path generator; yScale ∘ yValue.
  function Y1(d) {
    return yScale(d[1]);
  }

  // The y-accessor for the path generator; yScale ∘ yValue.
  function Y2(d) {
    return yScale(d[2]);
  }


  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };


  chart.yMax = function(_) {
    if (!arguments.length) return yMaxValue;
    yMaxValue = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y1 = function(_) {
    if (!arguments.length) return y1Value;
    y1Value = _;
    return chart;
  };

  chart.y2 = function(_) {
    if (!arguments.length) return y2Value;
    y2Value = _;
    return chart;
  };





  return chart;
}
