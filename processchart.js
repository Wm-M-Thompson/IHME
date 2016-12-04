

var margin = {top: 20, right: 50, bottom: 100, left: 75},
    width = 740 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear().domain([300, 1100]).range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");

var svg = d3.select("#chart-svg").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("class", "graph")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var _location = "USA";
var _year = "1990";
var _metric = "obese";

function resetchart()
{
    d3.select("svg").remove();
    svg = d3.select("#chart-svg").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("class", "graph")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function loadCountry(inputcountry)
{
    resetchart();
	_location = inputcountry;
	load();
}

function loadYear(inputyear)
{
    resetchart();
	_year = inputyear;
	load();
}

function loadMetric(inputmetrice)
{
    resetchart();
    d3.select("svg").remove();
    svg = d3.select("#chart-svg").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("class", "graph")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	_metric = inputmetrice;
	load();
}

var headers = [ "Male", "Female"];

var barsM;
var barsF;

var dataMale;
var dataFemale;

function load() {

    d3.csv("IHME_GBD_2013_OBESITY_PREVALENCE_1990_2013_Y2014M10D08.CSV", type, function (error, data)

    {
		var dataMale = data.filter(function (d) {
                 return (d.location == _location) &&
                        (d.year == _year) &&
                        (d.metric == _metric) &&
                        (d.sex_id == 1)
                     });

		var dataFemale = data.filter(function (d) {
				  return (d.location == _location) &&
					   (d.year == _year) &&
					   (d.metric == _metric) &&
					   (d.sex_id == 2)
					  });


        x.domain(data.map(function (d) { return d.age_group; }));
        y.domain([0, d3.max(data, function (d) { return d.mean * 100; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
                    .selectAll("text")
			            .style("text-anchor", "end")
			            .attr("dx", "-.16em")
			            .attr("dy", ".15em")
			            .attr("transform", function(d) {
			                return "rotate(-65)"
                });

        svg.append("g")
            .attr("class", "y axis axisLeft")
            .attr("transform", "translate(0,0)")
            .call(yAxisLeft)
          .append("text")
            .attr("y", 6)
            .attr("dy", "-2em")
            .style("text-anchor", "end")
            .text("Mean");

//        barsM.exit().remove();
//        barsF.exit().remove();

        // this is the "Enter" part of the join, update, enter steps
        barsM = svg.selectAll(".bar").data(dataMale).enter();
        barsF = svg.selectAll(".bar").data(dataFemale).enter();



        barsM.append("rect")
            .attr("class", "bar1")
            .attr("x", function (d) { return x(d.age_group); })
            .attr("width", x.rangeBand() / 2)
            .attr("y", function (d) { return y(d.mean * 100); })
            .attr("height", function (d, i, j) { return height - y(d.mean *100); });

        barsF.append("rect")
            .attr("class", "bar2")
            .attr("x", function (d) { return x(d.age_group) + x.rangeBand() / 2; })
            .attr("width", x.rangeBand() / 2)
            .attr("y", function (d) { return y(d.mean * 100); })
            .attr("height", function (d, i, j) { return height - y(d.mean * 100); });

        svg.selectAll(".bar").data(dataMale).exit().remove();
        svg.selectAll(".bar").data(dataFemale).exit().remove();

        var color = d3.scale.ordinal()
            .domain([0, 1])
            .range(["#ff0000", "#0000ff"]);

        var legend = svg.selectAll(".legend")
            .data(headers.slice().reverse())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) { return "translate(-20," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function (d) { return d; });


        var tooltip = svg.append("g")
            .attr("class", "tooltip");

        tooltip.append("rect")
            .attr("width", 30)
            .attr("height", 20)
            .attr("fill", "red")
            .style("opacity", 0.5);

        tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold");
    });

    function type(d) {
        d.mean = +d.mean;
        return d;
    }
}
