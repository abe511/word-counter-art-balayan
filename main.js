
// add listeners. 'pageshow' handles back/forward browser cache (bfcache)
window.addEventListener("pageshow", () => {
    // initial autoscan toggle check and run if toggle is ON
    const isAutoMode = toggleAutoMode();
    // run initial text scan if toggle is OFF 
    if(!isAutoMode) scanText();

    addListeners();
});

// remove listeners on 'pagehide'
window.addEventListener("pagehide", () => {
    removeListeners();
})


const PRIMARY_THEME_COLOR = "white";

// set up text scan and bg color workers
const counterWorker = new Worker("./counterWorker.js", {type: "module"});
const colorWorker = new Worker("./colorWorker.js", {type: "module"});

// get elements
const textForm = document.querySelector("#text-form");
const textArea = document.querySelector("#text-input");
const letterCountDisplay = document.querySelector("#letter-count-display");
const wordCountDisplay = document.querySelector("#word-count-display");
const sentenceCountDisplay = document.querySelector("#sentence-count-display");
const autoToggle = document.querySelector("#auto-toggle");
const bgButton = document.querySelector("#change-bg-btn");

// handle text scan
const scanText = (event = null) => {
    if(event && event.type == "submit") {
        event.preventDefault();
    }

    const userText = textArea.value;
    
    // send data to worker
    counterWorker.postMessage({text: userText});

    // get the results
    counterWorker.onmessage = ((event) => {
        const { letterCount, wordCount, sentenceCount } = event.data;

        letterCountDisplay.innerText = letterCount;
        wordCountDisplay.innerText = wordCount;
        sentenceCountDisplay.innerText = sentenceCount;
    });
};

// handle background color change
const changeBgColor = () => {
    const base = parseInt((Math.random() * 360).toFixed());
    
    colorWorker.postMessage({base, theme: PRIMARY_THEME_COLOR});
    colorWorker.onmessage = ((event) => {
        const { bgColor } = event.data;
        document.body.style.background = bgColor;
    });
};


const debounce = (func, delay = 300) => {
    let timeoutId = null;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};


// toggle autoscan mode
const toggleAutoMode = () => {
    // rescan when toggle is ON and start listening for user input
    if(autoToggle.checked) {
        scanText();
        textArea.addEventListener("input", debounce(scanText));
        // textArea.addEventListener("input", scanText);
        return true;
    }
    // stop listening for user input
    textArea.removeEventListener("input", scanText);
    return false;
};

// load event listeners
const addListeners = () => {
    textForm.addEventListener("submit", scanText);
    bgButton.addEventListener("click", changeBgColor);
    autoToggle.addEventListener("change", toggleAutoMode);
};

// unload event listeners
const removeListeners = () => {
    textForm.removeEventListener("submit", scanText);
    bgButton.removeEventListener("click", changeBgColor);
    autoToggle.removeEventListener("change", toggleAutoMode);
};
