$(document).ready(function() {
    // executes when HTML-Document is loaded and DOM is ready
//    console.log("document is ready");
     
   
     $( ".card" ).hover(
     function() {
       $(this).addClass('shadow-lg').css('cursor', 'pointer'); 
     }, function() {
       $(this).removeClass('shadow-lg');
     }
   );

   
     
   // document ready  
   });


   window.addEventListener("resize", function(){
    if(window.innerWidth <= 900 ){
        var destopCarousel = document.querySelector("#carousel-item1");
        destopCarousel.style.height = "200px"

        var destopCarousel = document.querySelector("#carousel-item2");
        destopCarousel.style.height = "200px"

        var destopCarousel = document.querySelector("#carousel-item3");
        destopCarousel.style.height = "200px"

        var image = document.querySelector("#Image");
        image.width = 240;
        image.height = 160;

    //     var mobilecarousel = document.querySelector("#mobilecarousel");
    // mobilecarousel.style.display = "block"

    }
    else{
      var destopCarousel = document.querySelector("#carousel-item1");
      destopCarousel.style.height = "650px"

      var destopCarousel = document.querySelector("#carousel-item2");
      destopCarousel.style.height = "650px"

      var destopCarousel = document.querySelector("#carousel-item3");
      destopCarousel.style.height = "650px"

        var image = document.querySelector("#Image");
        image.width = 500;
        image.height = 500;

    //     var mobilecarousel = document.querySelector("#mobilecarousel");
    // mobilecarousel.style.display = "none"
    }

})
   
   
