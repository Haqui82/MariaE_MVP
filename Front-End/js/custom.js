// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();

// owl carousel 

$('.owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    autoplay: true,
    autoplayHoverPause: true,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 3
        },
        1000: {
            items: 6
        }
    }
})

// UserVerification: centralized user-checking function used by multiple pages
// Returns the current user (string) or null and logs the same message used across pages.
function UserVerification() {
    // Prevent duplicate logs when called multiple times during page lifecycle
    if (window.__userVerificationRan) return window.currentUser || null;
    window.__userVerificationRan = true;

    var user = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || null;
    console.log('Actual User Is:', user || 'None');
    // Expose for quick access if needed elsewhere
    window.currentUser = user;
    return user;
}

// If some page requested the function to run early (marker set at top of <body>), run it now
if (window.__runUserVerificationOnLoad) {
    UserVerification();
    delete window.__runUserVerificationOnLoad;
}

// Also ensure it runs when custom.js loads (covers Live Server startup cases)
UserVerification();