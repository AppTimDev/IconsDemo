function toggle(el) {
    if (el.style.display == 'none') {
        el.style.display = 'unset';
    } else {
        el.style.display = 'none';
    }
}
ready(function () {
    const icons = document.getElementsByClassName("vicon_container");
    for (let i = 0; i < icons.length; i++) {
        const icon = icons[i];
        icon.addEventListener("mouseenter", (e) => {
            const add = e.target.getElementsByClassName("vicon_add")[0];
            add.style = "display:unset;"
        }, false);
        icon.addEventListener("mouseleave", (e) => {
            const add = e.target.getElementsByClassName("vicon_add")[0];
            add.style = "display:none;"
        }, false);
    }

    const menuBtns = document.getElementsByClassName("menu-btn");
    for (let i = 0; i < menuBtns.length; i++) {
        const menuBtn = menuBtns[i];
        menuBtn.addEventListener("click", (e) => {
            const menuIcon = document.getElementById('menu-btn-icon-menu')
            const cancelIcon = document.getElementById('menu-btn-icon-cancel')
            toggle(menuIcon)
            toggle(cancelIcon)            
            const dropdownMenu = document.getElementsByClassName("dropdown-munu");
            for (let i = 0; i < dropdownMenu.length; i++) {
                const menu = dropdownMenu[i];
                toggle(menu)
            }

        }, false);
    }
    document.addEventListener("click", (e) => {
        //set true from outside to inside
        //document click -> menu click for clicking elements with classname 'menu-btn-event'
        const bMenu = e.target.classList.contains('menu-btn-event')
        if(!bMenu){
            const dropdownMenu = document.getElementsByClassName("dropdown-munu");
            const menuIcon = document.getElementById('menu-btn-icon-menu')
            const cancelIcon = document.getElementById('menu-btn-icon-cancel')
            for (let i = 0; i < dropdownMenu.length; i++) {
                const menu = dropdownMenu[i];
                menu.style.display = 'none';
            }
            menuIcon.style.display = 'unset';
            cancelIcon.style.display = 'none';
        }
    }, true);
});