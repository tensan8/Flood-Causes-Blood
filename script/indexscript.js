function init(){
  new Audio('sounds/MainSound.mp3').play();

  var headerPhoto = document.getElementById('HeaderPic');

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
}

window.onload = init;

window.onbeforeunload = function(){
  window.scrollTo(0, 0);
}

/*References
https://www.youtube.com/watch?v=WxWtAmZMSPE
https://stackoverflow.com/questions/18347749/how-to-increase-opacity-of-an-image-when-scrolling
https://stackoverflow.com/questions/13610638/loop-audio-with-javascript#:~:text=The%20audio%20element%20has%20a,to%20auto%2Dloop%20its%20playback.
*/
