// Set up chart
var svgWidth = 900  ;
var svgHeight = 500;

var margin = {top: 20, right: 40, bottom: 80, left:10};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart
var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append and SVG group
var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Retrieve data from the CSV file
d3.csv("data.csv", function(error, povertydata) {

    for (var i = 0; i < povertydata.length; i++){
        // console.log(data.abbr);
        console.log(povertydata[i].abbr)
    }
    if (error) throw error;

    povertydata.forEach(function(d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;        
    });

    // Create scale functions
    var yLinearScale = d3.scaleLinear()
        .range([height, 0]);

    var xLinearScale = d3.scaleLinear()
        .range([0, width]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);

    var leftAxis = d3.axisLeft(yLinearScale);

    function findMinAndMax(dataColumnX) {
        xMin = d3.min(povertydata, function(d) {
            return +d[dataColumnX] * 0.8;
        });

        xMax =  d3.max(povertydata, function(d) {
            return +d[dataColumnX] * 1.1;
        });

        yMax = d3.max(povertydata, function(d) {
            return +d.healthcare * 1.1;
        });
    }
    // Default x-axis
    var currentAxisLabelX = "poverty";

    // Call findMinAndMax() with 'poverty' as default
    findMinAndMax(currentAxisLabelX);

    // Set the domain of an axis to extend from the min to the max value of the data column
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([0, yMax]);

    // Create tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .html(function(d) {
            var state = d.abbr;
            var poverty = +d.poverty;
            var healthcare = +d.healthcare;
            return (d.state + "<br> In Poverty: " + poverty + "%<br> Lack Healthcare: " + healthcare + "%");
        });

    chart.call(toolTip);





    // Append an SVG group for the x-axis, then display the x-axis
    chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    // The class name assigned here will be used for transition effects
    .attr("class", "x-axis")
    .call(bottomAxis);

    // Append a group for y-axis, then display it
    chart
        .append("g")
        .call(leftAxis);

    // Append y-axis label
    chart    
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text")
    .attr("data-axis-name", "healthcare")
    .text("Lacks Healthcare(%)");

    // Append x-axis labels
    chart
    .append("text")
    .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")")
    .attr("data-axis-name", "poverty")
    .text("In Poverty (%)");

    var circles = chart.selectAll(".state")
        .data(povertydata)
        .enter()

    circles
        .append("circle")
        .attr("class", "state")  
        .attr("cx", function(d, index) {
            return xLinearScale(+d[currentAxisLabelX]);
        })
        .attr("cy", function(d, index) {
            return yLinearScale(d.healthcare);
        })
        .attr("r", "15")
        .style("fill","lightblue") 
        .style("opacity", .9)
        .style("stroke-width", ".2");
    
    circles
        .append("text")
        .attr("x", function(d, index) {
            return xLinearScale(+d[currentAxisLabelX]- 0.08);
        })
        .attr("y", function(d, index) {
            return yLinearScale(d.healthcare - 0.2);
        })
        .text(function(d){
            return d.abbr;
        })
        .attr("class", "circleText")
        // add listeners on text too since it is on top of circle
        .on("mouseover", function(d) {
          toolTip.show(d);
        })
        // onmouseout event
        .on("mouseout", function(d, index) {
          toolTip.hide(d);
        });         
          
});
