function init(){
  //Play the music
  music = new Audio('sounds/MainSound.mp3');
  music.addEventListener('ended', function(){
      this.currentTime = 0;
      this.play();
  }, false);
  music.play();
  
  //Get the header photo
  var headerPhoto = document.getElementById('HeaderPic');

  //Parallax effect
  window.addEventListener('scroll', function(){
    headerPhoto.style.opacity = 1 - window.pageYOffset/600;
    })

    $(window).scroll(function(){
      if ($(this).scrollTop() > 800){
        $('#firstMenu').fadeIn(3000);

        if($(this).scrollTop() > 1300){
          $('#secondMenu').fadeIn(3000);

          if($(this).scrollTop() > 1900){
            $('#thirdMenu').fadeIn(3000);
          }else{
            $('#thirdMenu').fadeOut(500);
          }

        }else{
          $('#secondMenu').fadeOut(500);
        }

      }else{
        $('#firstMenu').fadeOut(500);
      }
    });

    //Call the fade animation that will appear whenever we move between pages
    changePage();
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
*/
