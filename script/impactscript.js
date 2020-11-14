function init(){
    music = new Audio('sounds/SevereSound.mp3');
    music.addEventListener('ended', function(){
        this.currentTime = 0;
        this.play();
    }, false);
    music.play();

    changePage();

    var dataset = {};

    d3.csv("data/Severe.csv").then(function(data){
        dataset = data;
        barChart(dataset);
    });
}
  
function barChart(dataset){
    var w = 600;
    var h = 600;
    var padding = 10;
    var marginBottom = 30;

    var xScale = d3.scaleBand()
                    .domain(d3.range(dataset.length))
                    .rangeRound([padding, w-padding])
                    .paddingInner(0.1);

    var yScale = d3.scaleLinear()
                    .domain([0,d3.max(dataset, function(d){
                        return d.CountSeverity;
                    })])
                    .rangeRound([0,110]);

    var svg = d3.select(".chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    var svgPicto = d3.select(".pictogram")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);

    var xAxis = d3.axisBottom()
                    .tickFormat(function(d, i){
                        return dataset[i].SeverityCategory;
                    })
                    .scale(xScale);
                
    svgPicto.append("defs")
            .append("g")
            .attr("id", "icon")
            //Path taken from http://svgicons.sparkk.fr/
            .append("path")
                .attr("d", "M10.943,13.822c0-0.234-0.19-0.425-0.425-0.425c-0.117,0-0.224,0.048-0.3,0.125L7.67,16.07c-0.077,0.077-0.125,0.184-0.125,0.301c0,0.234,0.19,0.424,0.425,0.424h1.523L7.67,18.619c-0.077,0.077-0.125,0.183-0.125,0.3c0,0.235,0.19,0.425,0.425,0.425c0.117,0,0.223-0.047,0.3-0.124l2.548-2.549c0.077-0.076,0.125-0.183,0.125-0.3c0-0.235-0.19-0.425-0.425-0.425h-0.001H8.996l1.823-1.823C10.896,14.046,10.943,13.939,10.943,13.822 M16.883,5.014c0.002-0.037,0.006-0.073,0.006-0.11c0-1.407-1.141-2.548-2.548-2.548c-0.642,0-1.228,0.24-1.676,0.631c-0.906-1.4-2.477-2.33-4.27-2.33c-2.559,0-4.669,1.886-5.035,4.342C1.864,5.354,0.75,6.696,0.75,8.301c0,1.877,1.521,3.398,3.397,3.398H16.04c1.876,0,3.397-1.521,3.397-3.398C19.438,6.717,18.351,5.389,16.883,5.014 M16.04,10.849H4.147c-1.405,0-2.548-1.143-2.548-2.548c0-1.184,0.804-2.201,1.957-2.476c0.337-0.08,0.593-0.358,0.644-0.701c0.306-2.063,2.11-3.618,4.194-3.618c1.44,0,2.345,0.301,3.132,1.518c0.135,0.207,0.776,0.77,1.021,0.804c0.039,0.006,0.117,0.008,0.117,0.008c0.205,0,0.403-0.073,0.56-0.21c0.311-0.271,0.707-0.421,1.116-0.421c0.937,0,1.699,0.762,1.698,1.708l-0.005,0.062c-0.018,0.402,0.249,0.762,0.639,0.861c1.128,0.289,1.915,1.303,1.915,2.465C18.588,9.706,17.445,10.849,16.04,10.849");

    svgPicto.append("g")
            .attr("id", "pictoGrid")
            .selectAll("use")
            .data(d3.range(5 * 5))
            .enter()
            .append("use")
                .attr("xlink:href", "#icon")
                .attr("id", function(d){
                    return (d+1)*136;
                })
                .attr("fill", "darkslategray")
                .attr("x", function(d){
                    var colNum = d % 5;
                    return padding + (colNum * 50);
                })
                .attr("y", function(d){
                    var rowNum = Math.floor(d / 5);
                    return padding + (rowNum * 50);
                });
    
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
            return h - yScale(d['CountSeverity']) - marginBottom;
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d){
            return yScale(d['CountSeverity']);
        })
        .attr("transform", "translate(-9, -25)")
        .on("mouseover", function(d){
            var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth()/2;
            var yPosition = parseFloat(d3.select(this).attr("y")) + 10;
            var value = d['CountSeverity'];
            var hoveredBar = d['SeverityCategory']
    
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", xPosition - 13)
                .attr("y", yPosition - 7)
                .attr("text-anchor", "middle")
                .attr("font-family", "Noto sans")
                .attr("font-weight", "bold")
                .attr("fill", "white")
                .text(d['CountSeverity']);
    
            d3.select(this)
              .attr("opacity", 1);

            d3.selectAll("use").attr("fill", function(d){
                if ( ((d+1) * 70) < value ){
                    return "maroon";
                }else{
                    return "darkslategray";
                }
            });

            changeDesc(hoveredBar);
        })
    
        //If the bar is not hovered, remove the label and reset the color of the bar
        .on("mouseout", function(d){
            d3.select("#tooltip").remove();
            d3.select(this).attr("opacity", 0.5);
            d3.selectAll("use").attr("fill", "darkslategray");
        });

    svg.append("g")
        .attr("class", "axis")
        .style("font-family", "Noto Sans")
        .style("font-weight", "bold")
        .style("font-size", "1em")
        .attr("transform", "translate(-10, " + (h - marginBottom - 25) + ")")
        .call(xAxis);

    svg.append("text")
        .style("text-anchor", "middle")
        .style("font-family", "Noto Sans")
        .style("font-weight", "bold")
        .style("font-size", "1em")
        .attr("fill", "white")
        .attr("transform", "translate(" + w/2 + ", 589)")
        .text("Severity Level");
}

function changeDesc(hoveredBar){
    if(hoveredBar == 1){
        document.getElementById("hoveredSev").innerHTML = "Severity Level 1";
        document.getElementById("sevImage").src = "images/Sev1.jpg";
        document.getElementById("sevImage").alt = "Floods in India";
        document.getElementById("sevDetail").innerHTML = "Floods with the severity level of 1 have occured for around <strong>3391</strong> times counted from 1985 until 2020. It happens around 4 times more frequent than floods with the severity level of 1.5 and 2. The detail about the severity is listed below.<br><br>Large flood events:<br><ul><li>Significant damage to structures or agriculture.</li> <li>Fatalities.</li> <li>1-2 decades-long reported interval since the last similar event.</li>";
    }
    else if(hoveredBar == 1.5){
        document.getElementById("hoveredSev").innerHTML = "Severity Level 1.5";
        document.getElementById("sevImage").src = "images/Sev1.5.jpg";
        document.getElementById("sevImage").alt = "The Damaging Effects of Flood Waters Following A Hurricane";
        document.getElementById("sevDetail").innerHTML = "Severity level of 1.5 floods have occured for around 772 times counted from 1985 until 2020. Its frequency is around 1/4 the total number of floods with the severity level of 1 but the frequency itself is almost similar with the severity level 2 floods. The detail about the severity is listed below.<br><br>Very large events:<br><ul><li>Greater than 2 decades but less than 100 year estimated recurrence interval</li> <li>Local recurrence interval of at 1-2 decades.</li> <li>Affecting a large geographic region (> 5000 sq. km).</li>";
    }
    else if(hoveredBar == 2){
        document.getElementById("hoveredSev").innerHTML = "Severity Level 2";
        document.getElementById("sevImage").src = "images/Sev2.jpg";
        document.getElementById("sevImage").alt = "Malawi Floods, January 2015.";
        document.getElementById("sevDetail").innerHTML = "Level 2 floods have occured for around 785 times counted from 1985 until 2020. Its number of occurance is around 1/4 the total number of floods with the severity level of 1 and it happened a little bit more frequent than floods with the severity level of 1.5. The detail about the severity is listed below.<br><br>Extreme events:<br><ul><li>Estimated recurrence interval is greater than 100 years.</li>";
    }
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
http://bl.ocks.org/alansmithy/d832fc03f6e6a91e99f4
*/
