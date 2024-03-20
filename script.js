document.addEventListener('DOMContentLoaded', function () {
    loadPage('./web-pages/search-results.html', 'Microsoft Internet Explorer', false, false, 'http://www.google.com?hl=en');

    if (navigator.userAgent.indexOf("Gecko/") != -1) {
        alert("For the optimal viewing experience on your browser use [CTRL] + [SCROLL WHEEL] to find your proffered level of zoom!");
    }

    document.addEventListener("click", function(event) {
        var toolButtons = document.querySelectorAll('.toolButton');

        toolButtons.forEach(function(button) {
            var dropdown = button.nextElementSibling;

            if (button === event.target || button.contains(event.target)) {
                dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
            } else if (!dropdown.contains(event.target)) {
                dropdown.style.display = "none";
            }
        })
    })
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

function checkWidth(entries) {
    entries.forEach(entry => {
        if (entry.target.id === 'resizableDiv' && entry.contentRect) {
            var width = entry.contentRect.width;
            var left = document.getElementById('left');
            var mid = document.getElementById('mid');
            var right = document.getElementById('right');

            if (width > 621) {
                left.style.width = '15%';
                mid.style.width = '55%';
                right.style.width = '20%';
            } else if (width < 620 && width > 431) {
                left.style.width = '15%';
                mid.style.width = '75%';
                right.style.width = 'calc(100% - 20px)';
            } else if (width < 430) {
                left.style.width = 'calc(100% - 20px)';
                mid.style.width = 'calc(100% - 20px)';
                right.style.width = 'calc(100% - 20px)';
            }
        }
    });
}

function responsiveDesign() {
    var parentHeight = document.getElementById('content-window').getBoundingClientRect().height;
    var childHeight = document.getElementById('responsive');
    var resizableDiv = document.getElementById('resizableDiv');

    var newHeight = parentHeight - 80;

    childHeight.style.height = newHeight + 'px';

    var observer = new ResizeObserver(checkWidth);

    observer.observe(resizableDiv);
}

function authExample() {
    const authForm = document.getElementById('authForm');
    const authError = document.getElementById('authError');

    authForm.addEventListener("submit", function(event) {
        event.preventDefault();

        authError.style.display = "inline-block";
    });
}

function skillsAndExpertise() {
    const regexForm = document.getElementById('regex');
    const regexName = document.getElementById('name-regex-input');
    const regexAddress = document.getElementById('address-regex-input');
    const regexPhone = document.getElementById('phone-regex-input');
    const regexEmail = document.getElementById('email-regex-input');

    regexForm.addEventListener("submit", function(event) {
        event.preventDefault();
    });

    regexName.addEventListener('input', function() {
        if (/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(this.value)) {
            this.style.border = '1px solid green'
        } else {
            this.style.border = '1px solid red'
        }
    });

    regexAddress.addEventListener('input', function() {
        if (/^\d+\s[A-Za-z]+\s[A-Za-z]+$/.test(this.value)) {
            this.style.border = '1px solid green'
        } else {
            this.style.border = '1px solid red'
        }
    });

    regexPhone.addEventListener('input', function() {
        if (/^\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/.test(this.value)) {
            this.style.border = '1px solid green'
        } else {
            this.style.border = '1px solid red'
        }
    });

    regexEmail.addEventListener('input', function() {
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.value)) {
            this.style.border = '1px solid green'
        } else {
            this.style.border = '1px solid red'
        }
    });
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
        var randomAd = Math.floor(Math.random() * 5);

        var popup = document.createElement('div');
        popup.className = 'window popup';

        popup.style.visibility = "hidden";
        parentElement.appendChild(popup);

        var titleBar = document.createElement('div');
        titleBar.className = 'title-bar';

        var titleBarText = document.createElement('div');
        titleBarText.className = 'title-bar-text';

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

        var bodyContent = document.createElement('img');
        switch(randomAd) {
            case 0:
                titleBarText.textContent = 'FREE TEETH';
                bodyContent.src = "../assets/images/free-ram/free-teeth.gif";
                break;
            case 1:
                titleBarText.textContent = 'SNAKE OIL - bogo';
                bodyContent.src = "../assets/images/free-ram/snake-oil.gif";
                break;
            case 2:
                titleBarText.textContent = 'FIREWORKS';
                bodyContent.src = "../assets/images/free-ram/fireworks.gif";
                break;
            case 3:
                titleBarText.textContent = 'SUN light';
                popup.style = "width: 130px"
                bodyContent.src = "../assets/images/free-ram/sunlight.png";
                break;
            default:
                titleBarText.textContent = 'LAWYERS IN YOUR AREA';
                bodyContent.src = "../assets/images/free-ram/lawyer.gif";
        }

        windowBody.appendChild(bodyContent);
        popup.appendChild(titleBar);
        popup.appendChild(windowBody);

        waitForImagesToLoad(popup).then(([popup, popupWidth, popupHeight]) => {
            // calculate and set position to avoid overlap
            var position = getRandomPosition(parentElement.offsetWidth - popupWidth, parentElement.offsetHeight - popupHeight);
            while (isOverlapping(position, existingPositions, popupWidth, popupHeight)) {
                position = getRandomPosition(parentElement.offsetWidth - popupWidth, parentElement.offsetHeight - popupHeight);
            }
            existingPositions.push(position);

            popup.style.transform = `translate(${position.x}px, ${position.y}px)`;
            popup.style.visibility = "visible";
        });
    }

    function waitForImagesToLoad(element) {
        return new Promise(resolve => {
            const images = element.getElementsByTagName('img');
            if (images.length === 0) {
                resolve([element, element.offsetWidth, element.offsetHeight]);
            } else {
                let loadedImages = 0;
                for (let i = 0; i < images.length; i++) {
                    images[i].onload = () => {
                        loadedImages++;
                        if (loadedImages === images.length) {
                            resolve([element, element.offsetWidth, element.offsetHeight]);
                        }
                    };
                }
            }
        });
    }

    function getRandomPosition(maxWidth, maxHeight) {
        return {
            x: Math.floor(Math.random() * maxWidth),
            y: Math.floor(Math.random() * maxHeight)
        };
    }

    function isOverlapping(newPosition, existingPositions, popupWidth, popupHeight) {
        for (let i = 0; i < existingPositions.length; i++) {
            let existingPosition = existingPositions[i];
            let dx = newPosition.x - existingPosition.x;
            let dy = newPosition.y - existingPosition.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < popupWidth || distance < popupHeight) {
                return true;
            }
        }
        return false;
    }
}
