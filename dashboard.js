var gauge1 = loadLiquidFillGauge("fillgauge1", 15.5);

var dateFormat = d3.time.format("%d/%m/%Y");

var data1 = {
					labels: [],
          datasets: [
              {
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: []
              }
          ]
				};


d3.csv("storage.csv", function(d) {
  return {
    Time: new Date(d.Time), // convert "Year" column to Date
    Storage: +d.Storage
  };
}, function(error, rows) {
  console.log(rows);


 rows.forEach(function (element, index, array){
   //data2[0].data.push({x: element.Time, y: element.Storage});
   if (index >= rows.length - 12) {
     data1.labels.push(dateFormat(element.Time));
     data1.datasets[0].data.push(element.Storage);

   }
 }.bind(this));

  var ctx1 = document.getElementById("shortChart").getContext("2d");
			var shortChart = new Chart(ctx1).Line(data1, {
				bezierCurve: true,
				showTooltips: true,
				scaleShowHorizontalLines: true,
				scaleShowLabels: true,
				scaleType: "date",
				scaleLabel: "<%=value%> GWh",
        pointDot: true,
				scaleOverride : true,
        scaleSteps : 8,
        scaleStepWidth : 500,
        scaleStartValue : 0
			});
/*
  var ctx2 = document.getElementById("longChart").getContext("2d");
			var longChart = new Chart(ctx2).Scatter(data2, {
				bezierCurve: true,
				showTooltips: true,
				scaleShowHorizontalLines: true,
				scaleShowLabels: true,
				scaleType: "date",
				scaleLabel: "<%=value%> GWh",
        pointDot: true
			});

*/
});
