function init(){
    //Play the music
    music = new Audio('sounds/TimelineSound.mp3');
    music.addEventListener('ended', function(){
        this.currentTime = 0;
        this.play();
    }, false);
    music.play();

    //Call the fade animation that will appear whenever we move between pages
    changePage();

    //Set the year into 1985
    document.getElementById("year").value = 1985;

    //Load the dataset for the bar chart
    var dataset = {};

    d3.csv("data/DateRecap.csv").then(function(rows){
        rows = Array.from(rows);
        rows.forEach(function(d){
            dataset[d.Year] = [d.Jan, d.Feb, d.Mar, d.Apr, d.May, d.Jun, d.Jul, d.Aug, d.Sep, d.Oct, d.Nov, d.Dec];
        });
        barChart(dataset[document.getElementById("year").value], dataset);
    });

    //Load the dataset for the line chart
    d3.csv("data/MonthTotal.csv").then(function(data){
        lineDataset = data;
        lineChart(lineDataset);
    })
}

//Plot the bar chart
function barChart(dataset, rawData){
    //Initialize the sizes
    var w = 700;
    var h = 500;
    var padding = 15;

    //Initialize the data that will be used for each axis
    var xScale = d3.scaleBand()
                  .domain(d3.range(dataset.length))
                  .rangeRound([padding, w-padding])
                  .paddingInner(0.05);

    var yScale = d3.scaleLinear()
                    .domain([1,40])
                    .rangeRound([padding,h-padding]);

    //Draw the SVG
    var svg = d3.select(".chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    //Change the year attribute
    scrollYear(svg, rawData);

    //Lock the scroll when the cursor is hovering the year
    lockScroll();

    //Hard-coded the month that will be used as the X-Axis
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des'];

    //Initialize the X-Axis
    var xAxis = d3.axisBottom()
                    .tickFormat(function(d, i){
                        return month[i];
                    })
                    .scale(xScale); 

    //Initial chart
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("fill", "maroon")
        .attr("opacity", 0.5)
        .attr("x", function(d, i){
            return xScale(i);
        })
        .attr("y", function(d){
            return h - yScale(d);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d){
            return yScale(d);
        })
        .attr("transform", "translate(0, -25)")
        //Hovering a bar
        .on("mouseover", function(d){
            var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth()/2;
            var yPosition = parseFloat(d3.select(this).attr("y")) + 10;
            
            //Show the real value of the bar
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", xPosition)
                .attr("y", yPosition - 20)
                .attr("text-anchor", "middle")
                .attr("font-family", "Noto sans")
                .attr("font-weight", "bold")
                .attr("fill", "white")
                .text(function(){
                    if(d != 0){
                        return d;
                    }
                });
    
            d3.select(this).attr("opacity", 1); //Highlight the bar
        })
    
        //If the bar is not hovered, remove the label and reset the color of the bar
        .on("mouseout", function(d){
            d3.select("#tooltip").remove();
            d3.select(this).attr("opacity", 0.5);
        });

    //Draw the X-Axis
    svg.append("g")
        .attr("class", "axis")
        .style("font-family", "Noto Sans")
        .style("font-weight", "bold")
        .style("font-size", "1em")
        .attr("transform", "translate(-1.1, 475)")
        .call(xAxis);

    //Change the year value accordingly
    function scrollYear(svg, dataset){
        $(function(){
            $("#year").bind("mousewheel", function(event, delta){ //Take the year component
                if(delta == 1){ //Scroll Up
                    if(parseInt(this.value) < 2020){ //Should be more than 2020
                        this.value = parseInt(this.value) + 1; //Increase the year

                        //Update the bar chart
                        svg.selectAll("rect")
                            .data(dataset[document.getElementById("year").value])
                            .attr("y", function(d){
                                return h - yScale(d);
                            })
                            .attr("height", function(d){
                                return yScale(d);
                            });
                    }
                }else{ //-1 or Scroll Down
                    if(parseInt(this.value) > 1985){ //Should be less than 1985
                        this.value = parseInt(this.value) - 1; //Decrease the year

                        //Update the bar chart
                        svg.selectAll("rect")
                            .data(dataset[document.getElementById("year").value])
                            .attr("y", function(d){
                                return h - yScale(d);
                            })
                            .attr("height", function(d){
                                return yScale(d);
                            });
                    }
                }
            })
        });
    }
}

//Plot the line chart
function lineChart(dataset){
    //Initialize the sizes
    var w = 650;
    var h = 500;
    var padding = 25;

    //Initialize the data that will be used for each axis
    var xScale = d3.scaleBand()
                    .domain(dataset.map(function(d){
                        return d.Month;
                    }))
                    .range([padding, w-padding])
  
    var yScale = d3.scaleLinear()
                    .domain([0, 700])
                    .range([h - padding, 0]);
  
    //Initialize the line
    line = d3.line()
              .x(function(d) { return xScale(d.Month); })
              .y(function(d) { return yScale(d.Total); });

    //Draw the SVG
    var svg = d3.select(".linechart")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    //Hard-coded the month that will be used as the X-Axis
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des'];

    //Initiliaze the axis
    var xAxis = d3.axisBottom()
                    .tickFormat(function(d, i){
                        return month[i];
                    })
                    .scale(xScale);
  
    var yAxis = d3.axisLeft()
                .ticks(10)
                .scale(yScale);
        
    //Draw the line
    svg.append("path")
        .datum(dataset, function(d){
            return d.Total;
        })
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "darkred")
        .style("stroke-width", "0.3em")
        .attr("transform", "translate(" + (padding)+ ",0)");

    var circleCount = 0; //It will be used to assign unique id for each node

    //Draw the nodes
    svg.selectAll("line-circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("id", function(d, i){
            circleCount += 1;
            return "Cir" + circleCount;
        })
        .attr("r", 7)
        .attr("cx", function(d){
            return xScale(d.Month);
        })
        .attr("cy", function(d){
            return yScale(d.Total);
        })
        .attr("fill", "darkred")
        .attr("transform", "translate(25,0)")
        .attr("stroke", "darkred")
        .style("stroke-width", "0.15em")
        //Hovering the node
        .on("mouseover", function(d){
            //Change the color of the node
            d3.select(this)
                .transition()
                .duration(1000)
                .style("fill", "black");

            //Show the real value of the node
            svg.selectAll("#tooltip")
                .data([d])
                .enter()
                .append("text")
                .attr("id", "tooltip")
                .text(function(d, i){
                    return d.Month + ": " + d.Total;
                })
                .attr("x", function(d){
                    return xScale(d.Month) + 24;
                })
                .attr("y", function(d){
                    return yScale(d.Total) - 11;
                })
                .attr("fill", "blanchedalmond")
                .style("font-family", "Noto Sans")
                .style("font-size", "0.8em");
        })
        .on("mouseout", function(d){ //Reset the color of the node and remove the tooltip
            d3.select(this)
                .transition()
                .duration(1000)
                .style("fill", "darkred");

            svg.selectAll("#tooltip")
                .remove();
        });
  
    //Insert the X-axis and set its position
    svg.append("g")
        .attr("transform", "translate(0," + (h-padding+5) +")")
        .call(xAxis)
        .style("font-family", "Noto Sans")
        .style("font-weight", "bold")
        .style("font-size", "0.7em");
  
    //Insert the Y-Axis and set its position
    svg.append("g")
        .attr("transform", "translate("+ (padding)  +"," + (padding - 20) + ")")
        .call(yAxis)
        .style("font-family", "Noto Sans")
        .style("font-weight", "bold")
        .style("font-size", "0.6em");
}

//It will prevent the user from scrolling through the page whenever the year element is hovered
function lockScroll(){
    $("#year").hover(function(){
        //Take the current X and Y position of the page and tell the window to keep on that position
        var X = window.scrollX;
        var Y = window.scrollY;
        window.onscroll = function(){
            window.scrollTo(X, Y);
        };
    }, function(){
        window.onscroll = function(){}; //Can scroll the window if the cursor is not hovering the svg element
    });
}

//It will play the fade animation that will appear when we move between pages
function changePage(){
    $(document).ready(function(){
        //Fade in the page
        $("body").hide();
        $("body").fadeIn(2000);

        //Fade out the whole body when the 'a' tag object is clicked
        $('a').click(function(event){
            event.preventDefault();
            linklocation = this.href;
            $('body').fadeOut(1000, function(){
                document.location.href = linklocation;
            });
        });
    });
}

//Call the init function when the window is loading
window.onload = init;

//Make sure that we always start from the top of the page
window.onbeforeunload = function(){
    window.scrollTo(0, 0);
}

/*References
https://www.youtube.com/watch?v=WxWtAmZMSPE
https://stackoverflow.com/questions/18347749/how-to-increase-opacity-of-an-image-when-scrolling
https://stackoverflow.com/questions/13610638/loop-audio-with-javascript#:~:text=The%20audio%20element%20has%20a,to%20auto%2Dloop%20its%20playback.
https://stackoverflow.com/questions/24425287/using-jquery-fadeout-for-page-transition
https://stackoverflow.com/questions/23458981/jquery-redirect-fadeout-fadein
https://stackoverflow.com/questions/46744910/x-and-y-axis-are-getting-cut-from-edge-in-d3js
https://blockbuilder.org/emepyc/7218bc9ea76951d6a78b0c7942e07a00
https://css-tricks.com/mousewheel-inputs/
http://jsfiddle.net/9Htjw/
https://www.d3-graph-gallery.com/graph/line_select.html
https://bl.ocks.org/alandunning/43e1f92358005270d5c86e32b13bf44f
http://bl.ocks.org/romsson/f205420d21ced66810058d4cdf25c6dd
*/
