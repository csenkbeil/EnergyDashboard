var config1 = liquidFillGaugeDefaultSettings();
/*
config1.circleColor = "#FF7777";
config1.textColor = "#FF4444";
config1.waveTextColor = "#FFAAAA";
config1.waveColor = "#FFDDDD";


config1.circleColor = "#E2C0A1";
config1.textColor = "#E5B142";
config1.waveTextColor = "#D5C3AD";
config1.waveColor = "#D7BE88";
*/
var gauge1 = loadLiquidFillGauge("fillgauge1", 29.7);
var formatDate = d3.time.format("%Y-%m-%d");

d3.csv("storage.csv", function(d) {
  return {
    Time: d.Time, // convert "Year" column to Date
    Storage: +d.Storage
  };
}, function(error, rows) {
	var chart1 = timeChart()
	      .x(function (d) { return formatDate.parse(d.Time); })
	      .y1(function (d) { return +d.Storage; })
	      .width($("#shortChart").width())
	      .height(459);

	  d3.select('#shortChart').selectAll('*').remove();
	  d3.select('#shortChart')
	    .datum(rows)
	    .call(chart1);

});
