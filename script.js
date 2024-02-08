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

    return loadNewHTML(html)
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

function playMusic() {
    var audio = document.getElementById('audio');
    var audioControls = document.getElementById('audio-controls');
    var catGif = document.getElementById('cat-gif');
    var volumeControl = document.getElementById('volume-control');
    var scrubber = document.getElementById('scrubber');
    var scrubberTime = document.getElementById('scrubber-time');

    audio.volume = volumeControl.value / 100;

    // play and pause
    if (audio.paused) {
        audio.play();
        audioControls.src = "../assets/images/pause-button.png";
        catGif.src = "../assets/images/cat-piano.gif";
    } else {
        audio.pause();
        audioControls.src = "../assets/images/play-button.png";
        catGif.src = "../assets/images/cat-piano-paused.png";
    }

    audio.addEventListener('ended', function () {
        audioControls.src = "../assets/images/play-button.png";
        catGif.src = "../assets/images/cat-piano-paused.png";
    });

    // volume control
    volumeControl.addEventListener('input', function () {
        audio.volume = volumeControl.value / 100;
    });

    // scrubber
    audio.addEventListener('timeupdate', function () {
        var progress = (audio.currentTime / audio.duration) * 100;
        scrubber.value = progress;

        // update timer
        var currentTime = formatTime(audio.currentTime);
        var duration = formatTime(audio.duration);
        scrubberTime.textContent = currentTime + " / " + duration;
    });

    scrubber.addEventListener('input', function () {
        var seekTime = (scrubber.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    })
}

function formatTime(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
}

function loadCode(href, iconFile, file) {
    return fetch(href)
        .then(response => response.text())
        .then(html => {
            var codeBody = document.querySelector('#code');
            codeBody.innerHTML = html;

            var codeIcon = document.querySelectorAll('#current-file-icon');
            codeIcon.forEach(icon => {
                icon.src = '../assets/images/skills-and-expertise/' + iconFile;
            });

            var codeFile = document.querySelectorAll('#current-file');
            codeFile.forEach(text => {
                text.innerText = file;
            });            
        })
        .catch(error => console.error('Error fetching HTML:', error));
}

function pingWebsite() {
    const startTime = new Date().getTime();

    fetch('http://localhost:8080')
        .then(response => {
            const endTime = new Date().getTime();
            const pingTime = endTime - startTime;
            document.getElementById('ping-time').innerText = pingTime;
        })
        .catch(error => {
            console.error('Error pinging Website: ', error);
        });
}

function calculate() {
    var num1 = parseFloat(document.getElementById('num1').value);
    var num2 = parseFloat(document.getElementById('num2').value);
    
    document.getElementById('result').innerHTML = '= ' + addTwoNumbers(num1, num2);
}

function addTwoNumbers(a, b) {
    let num1 = a.toString().split('').map(Number);
    let num2 = b.toString().split('').map(Number);
    
    const add = (x, y) => {
        let carry = 0;
        let result = [];
        while (x.length || y.length) {
            let sum = (x.pop() || 0) + (y.pop() || 0) + carry;
            carry = sum >= 10 ? 1 : 0;
            result.unshift(sum % 10);
        }
        if (carry) result.unshift(carry);
        return result;
    };

    let sum = add(num1, num2).join('');
    return parseInt(sum);
}

function toggleDisplay(elementId) {
    var element = document.getElementById(elementId);

    if (element.style.display === 'none') {
        element.style.display = element.dataset.prevDisplay || '';
    } else {
        element.dataset.prevDisplay = element.style.display;
        element.style.display = 'none';
    }
}

function skillsAndExpertise() {
    const regexExample = document.getElementById('regex-input');

    regexExample.addEventListener('input', function() {
        if (/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(this.value)) {
            this.style.border = '1px solid green'
        } else {
            this.style.border = '1px solid red'
        }
    })
}