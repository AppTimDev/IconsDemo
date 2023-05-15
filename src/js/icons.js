ready(function () {
    var icons = document.getElementsByClassName("vicon_container");
    for (let i = 0; i < icons.length; i++) {
        const icon = icons[i];
        icon.addEventListener("mouseenter", (e)=>{
            var add = e.target.getElementsByClassName("vicon_add")[0];
            add.style="display:unset;"
        }, false);
        icon.addEventListener("mouseleave", (e)=>{
            var add = e.target.getElementsByClassName("vicon_add")[0];
            add.style="display:none;"             
        }, false);
    }    
});