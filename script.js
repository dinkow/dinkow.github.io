document.addEventListener('DOMContentLoaded', function () {
    loadPage('./web-pages/download-ram.html', 'Microsoft Internet Explorer', false, false, 'http://www.google.com?hl=en');
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

function loadSkill(event, href) {
    return fetch(href)
        .then(response => response.text())
        .then(html => {
            var skillDiv = document.getElementById('skill-div');
            skillDiv.innerHTML = html;

            var links = document.querySelectorAll('menu a');

            links.forEach(link => {
                link.parentElement.removeAttribute('aria-selected');
            });

            event.target.parentElement.setAttribute('aria-selected', 'true');
        })
        .catch(error => console.error('Error fetching HTML:', error));
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

    fetch('https://dinkow.github.io')
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

function spinPage() {
    var deg = 0.25;
    var contentWindow = document.getElementById('content-window');
    for ( let i = 0; i < 1439; i++ ) {
        setTimeout( function() {
            contentWindow.style.transform = `rotate(${deg += 0.25}deg)`
        }, 1 * i);
    }
}

function ramPopUp() {
    var parentElement = document.getElementById('ram-parent');
    var existingPositions = [];

    for (let i = 0; i < 2; i++) {
        var popup = document.createElement('div');
        popup.className = 'window popup';

        var titleBar = document.createElement('div');
        titleBar.className = 'title-bar';

        var titleBarText = document.createElement('div');
        titleBarText.className = 'title-bar-text';
        titleBarText.textContent = 'A Window With Stuff In It';

        var titleBarControls = document.createElement('div');
        titleBarControls.className = 'title-bar-controls';

        var minimizeButton = document.createElement('button');
        minimizeButton.setAttribute('aria-label', 'Minimize');

        var maximizeButton = document.createElement('button');
        maximizeButton.setAttribute('aria-label', 'Maximize');

        var closeButton = document.createElement('button');
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.addEventListener('click', function() {
            ramPopUp();
            this.parentElement.parentElement.parentElement.remove()
        });

        titleBar.appendChild(titleBarText);
        titleBar.appendChild(titleBarControls);
        titleBarControls.appendChild(minimizeButton);
        titleBarControls.appendChild(maximizeButton);
        titleBarControls.appendChild(closeButton);

        var windowBody = document.createElement('div');
        windowBody.className = 'window-body';

        var bodyContent = document.createElement('p');
        bodyContent.textContent = "There's so much room for activities!";

        windowBody.appendChild(bodyContent);

        popup.appendChild(titleBar);
        popup.appendChild(windowBody);

        // calculate and set position to avoid overlap
        var position = getRandomPosition(parentElement.offsetWidth - 306, parentElement.offsetHeight - 168);
        while (isOverlapping(position, existingPositions)) {
            position = getRandomPosition(parentElement.offsetWidth - 306, parentElement.offsetHeight - 168);
        }
        existingPositions.push(position);

        popup.style.transform = `translate(${position.x}px, ${position.y}px)`;
        parentElement.appendChild(popup);
    }

    function getRandomPosition(maxWidth, maxHeight) {
        return {
            x: Math.floor(Math.random() * maxWidth),
            y: Math.floor(Math.random() * maxHeight)
        };
    }

    function isOverlapping(newPosition, existingPositions) {
        for (let i = 0; i < existingPositions.length; i++) {
            let existingPosition = existingPositions[i];
            let dx = newPosition.x - existingPosition.x;
            let dy = newPosition.y - existingPosition.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 310) {
                return true;
            }
        }
        return false;
    }
}
