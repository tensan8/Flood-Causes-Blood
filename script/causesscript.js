function init(){
  music = new Audio('sounds/CausesSound.mp3');
  music.addEventListener('ended', function(){
      this.currentTime = 0;
      this.play();
  }, false);
  music.play();

  changePage();

  var dataset;

  d3.csv("data/FloodData.csv").then(function(data){
    dataset = data;
    barChart(dataset);
  })
}

function barChart(dataset){
  var w = 700;
  var h = 500;
  var padding = 20;

  var svg = d3.select(".chart")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

  var limit20 = d3.scaleLinear()
                  .domain([0, 23]).nice()
                  .range([padding, w - padding]);

  var limit50 = d3.scaleLinear()
                  .domain([0, 60]).nice()
                  .range([padding, w - padding]);

  var limit200 = d3.scaleLinear()
                    .domain([0, 230]).nice()
                    .range([padding, w - padding]);

  var limit600 = d3.scaleLinear()
                    .domain([0, 720])
                    .range([padding, w - padding]);

  var limit3000 = d3.scaleLinear()
                    .domain([0, 3000]).nice()
                    .range([padding, w - padding - 115]);

  var currentLimit = limit20;

  var y = d3.scaleBand()
            .domain(d3.range(dataset.length))
            .rangeRound([h - padding, padding])
            .padding(0.2);

  var xAxis = d3.axisTop()
                .ticks(10)
                .scale(currentLimit);

  var yAxis = d3.axisLeft()
                .tickFormat(function(d, i){
                  return dataset[i].MainCauseCategory;
                })
                .scale(y);

  svg.append("g")
      .attr("class", "axis")
      .style("font-family", "Noto Sans")
      .style("font-weight", "bold")
      .attr("transform", 'translate(120,20)')
      .transition()
      .duration(1000)
      .call(xAxis);

  svg.append("g")
      .style("font-size", "0.6em")
      .style("font-family", "Noto Sans")
      .style("font-weight", "bold")
      .attr("transform", 'translate(140,0)')
      .call(yAxis);

  var tooltip = d3.select("section")
                  .append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

  lockScroll();

  svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("fill", "maroon")
      .attr("class", "bar")
      .attr("x", currentLimit(0))
      .attr("y", function(d, i){
        return y(i);
      })
      .attr("width", function(d){
        return currentLimit(d.CountMainCause)-22;
      })
      .attr("height", y.bandwidth())
      .attr("transform", 'translate(122,0)')
      .on("mouseover", function(d){
        tooltip.style("opacity", 1);
      })
      .on("mousemove", function(d){
        tooltip.style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY - 30 + "px")
                .style("display", "inline-block")
                .html(d['CountMainCause'] + " cases");
      })
      .on("mouseout", function(d){
        tooltip.style("display", "none");
      });
  
  function changeGraph(id, newLimit, prevLimit){
    var speed = 1000;
    return new Waypoint({
      element: document.getElementById(id),
      handler: function(direction){
        if(direction == 'down'){
          currentLimit = newLimit;
          svg.selectAll("rect")
              .transition()
              .duration(speed)
              .attr("width", function(d){
                return currentLimit(d.CountMainCause)-22;
              });

          xAxis = d3.axisTop()
                    .ticks(10)
                    .scale(currentLimit);

          svg.select(".axis")
              .transition()
              .duration(speed)
              .delay(speed)
              .call(xAxis);

        }else{
          currentLimit = prevLimit;
          svg.selectAll("rect")
              .transition()
              .duration(speed)
              .attr("x", currentLimit(0))
              .attr("width", function(d){
                return currentLimit(d.CountMainCause)-22;
              });

          xAxis = d3.axisTop()
                    .ticks(10)
                    .scale(currentLimit);

          svg.select(".axis")
              .transition()
              .duration(speed)
              .delay(speed)
              .call(xAxis);
        }
      }
    })
  };

  new changeGraph('limit20', limit20, limit20);
  new changeGraph('limit50', limit50, limit20);
  new changeGraph('limit200', limit200, limit50);
  new changeGraph('limit600', limit600, limit200);
  new changeGraph('limit3000', limit3000, limit600);
}

function lockScroll(){
  $("svg").hover(function(){
      var X = window.scrollX;
      var Y = window.scrollY;
      window.onscroll = function(){
          window.scrollTo(X, Y);
      };
  }, function(){
      window.onscroll = function(){};
  });
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
https://bl.ocks.org/alandunning/7008d0332cc28a826b37b3cf6e7bd998
https://bl.ocks.org/baronwatts/2a50ae537d7c46670aa5eb30254ef751
*/
