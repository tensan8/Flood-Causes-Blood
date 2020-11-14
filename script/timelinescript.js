function init(){
    music = new Audio('sounds/TimelineSound.mp3');
    music.addEventListener('ended', function(){
        this.currentTime = 0;
        this.play();
    }, false);
    music.play();

    changePage();

    var dataset = {};

    d3.csv("data/DateRecap.csv").then(function(rows){
        rows = Array.from(rows);
        rows.forEach(function(d){
            dataset[d.Year] = [d.Jan, d.Feb, d.Mar, d.Apr, d.May, d.Jun, d.Jul, d.Aug, d.Sep, d.Oct, d.Nov, d.Dec];
        });
        console.log(dataset);
        barChart(dataset['2003']);
        document.getElementById("year").innerHTML = '2003';
    });
}
  
function barChart(dataset){
    var w = 700;
    var h = 600;
    var padding = 5;

    var xScale = d3.scaleBand()
                  .domain(d3.range(dataset.length))
                  .rangeRound([padding, w-padding])
                  .paddingInner(0.05);

    var yScale = d3.scaleLinear()
                    .domain([0,d3.max(dataset)])
                    .rangeRound([padding,h-padding]);

    var svg = d3.select(".chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des'];

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
        .on("mouseover", function(d){
            var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth()/2;
            var yPosition = parseFloat(d3.select(this).attr("y")) + 10;
    
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", xPosition)
                .attr("y", yPosition)
                .attr("text-anchor", "middle")
                .attr("font-family", "Noto sans")
                .attr("font-weight", "bold")
                .attr("fill", "white")
                .text(d);
    
            d3.select(this)
              .attr("opacity", 1);
        })
    
        //If the bar is not hovered, remove the label and reset the color of the bar
        .on("mouseout", function(d){
            d3.select("#tooltip").remove();
            d3.select(this).attr("opacity", 0.5);
        });

    svg.append("g")
        .attr("class", "axis")
        .style("font-family", "Noto Sans")
        .style("font-weight", "bold")
        .style("font-size", "1em")
        .attr("transform", "translate(-1.1, 575)")
        .call(xAxis);
}

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

window.onload = init;

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
*/
