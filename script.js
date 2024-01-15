document.addEventListener('DOMContentLoaded', function () {
    loadPage('./web-pages/search-results.html', 'Microsoft Internet Explorer', false, false, 'http://www.google.com?hl=en');
});

function loadNewHTML(href) {
    return fetch(href)
        .then(response => response.text())
        .then(html => {
            // Update the content window with the new HTML
            var contentWindow = document.querySelector('#content-window');
            contentWindow.innerHTML = html;
        })
        .catch(error => console.error('Error fetching HTML:', error));
}

function loadPage(html, barText, backButton, forwardButton, webAddressText) {
    // store current web page
    if (backButton || forwardButton) { // checks if navigation will be needed. if not, there is no reason to store current web page.
        var currentHTML = document.getElementById('current-html').innerText;
        var currentToolBarText = document.getElementById('title-bar-text').innerText;
        var currentWebAddressText = document.getElementById('web-address').innerText;
    };

    loadNewHTML(html)
        .then(() => {
            // update title bar
            var toolbarText = document.getElementById('title-bar-text');
            toolbarText.textContent = barText;

            // update back button
            if (backButton) {
                document.getElementById('back-button').onclick = function() {
                    loadPage(currentHTML, currentToolBarText, false, true, currentWebAddressText);
                };
            } else {
                document.getElementById('back-button').onclick = function() {
                    // no functionality
                };
            }
            
            // update forward button
            if (forwardButton) {
                document.getElementById('forward-button').onclick = function() {
                    loadPage(currentHTML, currentToolBarText, true, false, currentWebAddressText);
                };
            } else {
                document.getElementById('forward-button').onclick = function() {
                    // no functionality
                };
            }

            // update address bar url
            var webAddress = document.getElementById('web-address');
            webAddress.textContent = webAddressText;
        })
}
