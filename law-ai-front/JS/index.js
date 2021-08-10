console.log("load.js");

$(window).scroll(function(e){
    if ($(window).scrollTop()>0){
        $("#nav-container").removeClass("container-border");
        $(".navbar").addClass("bg-dark");
    }
    else {
        $(".navbar").removeClass("bg-dark");
        $("#nav-container").addClass("container-border");
        
    }
});
