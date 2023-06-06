function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// scroll to top
// when user clicks on the scroll-to-top button, scroll to the top of the document
function ScrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
function scroll() {
    // when user scrolls down 20px from the top of the document
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}
ready(function(){
    let scrollToTopBtn = document.getElementById("scrollToTopBtn");
    scrollToTopBtn.addEventListener('click', ScrollToTop);
    document.addEventListener('scroll', scroll);
})