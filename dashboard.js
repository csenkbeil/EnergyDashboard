var gauge1 = loadLiquidFillGauge("fillgauge1", 14.8);

var formatDate = d3.time.format("%Y-%m-%d");





d3.csv("storage.csv", function(d) {
  return {
    Time: d.Time, // convert "Year" column to Date
    Storage: +d.Storage
  };
}, function(error, rows) {
  console.log(rows);

	var chart1 = timeChart()
	      .x(function (d) { return formatDate.parse(d.Time); })
	      .y1(function (d) { return +d.Storage; })
	      .width($("#shortChart").width())
	      .height(419);

	  d3.select('#shortChart').selectAll('*').remove();
	  d3.select('#shortChart')
	    .datum(rows)
	    .call(chart1);

});
