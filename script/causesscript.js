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


  var zoom = d3.zoom()
                .extent([[0, 0], [w, h]])
                .scaleExtent([1, 10])
                .translateExtent([[0, 0], [w, h]])
                .on('zoom', zoomed);

  var svg = d3.select(".chart")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .call(zoom);

  x = d3.scaleLinear()
        .domain([d3.min(dataset, function(d){
          return d.CountMainCause;
        }),
        d3.max(dataset, function(d){
          return d.CountMainCause;
        })]).nice()
        .range([padding, w - padding]);

  y = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .rangeRound([h - padding, padding])
        .padding(0.2);

  var xAxis = d3.axisTop(x)
                .ticks(20)
                .scale(x);

  var yAxis = d3.axisLeft()
                .tickFormat(function(d, i){
                  return dataset[i].MainCauseCategory;
                })
                .scale(y);

  var axisG = svg.append("g")
                  .attr("class", "axis")
                  .style("font-family", "Noto Sans")
                  .style("font-weight", "bold")
                  .attr("transform", 'translate(120,20)')
                  .call(xAxis);

  svg.append("g")
      .style("font-size", "0.6em")
      .style("font-family", "Noto Sans")
      .style("font-weight", "bold")
      .attr("transform", 'translate(140,0)')
      .call(yAxis);

  var rect  = svg.append("g")
                    .attr("fill", "maroon")
                  .selectAll("rect")
                  .data(dataset)
                  .join("rect")
                    .attr("x", x(0))
                    .attr("y", function(d, i){
                      return y(i);
                    })
                    .attr("width", function(d){
                      return x(d.CountMainCause);
                    })
                    .attr("height", y.bandwidth())
                    .attr("transform", 'translate(122,0)');

  function zoomed(){
    var newScale = d3.event.transform.rescaleX(x);
    rect.attr("width", function(d){
      var barW = newScale(d.CountMainCause);

      if(barW < 0){
        return 0;
      }else{
        return barW;
      }
    });
    /*text.attr("x", function(d){
      return newScale(d.CountMainCause);
    });*/
    xAxis.scale(newScale);
    axisG.call(xAxis);
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
*/
