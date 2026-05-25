let p1Name = "O'Sullivan",
    p2Name = "Selby";

let p1Score = 0,
    p2Score = 0;

let p1Frames = 0,
    p2Frames = 0;

let currentBreak = 0;
let activePlayer = 1;
let matchFormat = "Best of 9";

let historyStack = [];

/* SAVE STATE */

function saveState() {
    if (historyStack.length > 40) {
        historyStack.shift();
    }

    historyStack.push(JSON.stringify({
        p1Score,
        p2Score,
        p1Frames,
        p2Frames,
        currentBreak,
        activePlayer
    }));
}

/* UNDO */

function undo() {
    if (historyStack.length === 0) return;

    let prev = JSON.parse(historyStack.pop());

    p1Score = prev.p1Score;
    p2Score = prev.p2Score;
    p1Frames = prev.p1Frames;
    p2Frames = prev.p2Frames;
    currentBreak = prev.currentBreak;
    activePlayer = prev.activePlayer;

    updateDisplay();
}

/* UPDATE DISPLAY */

function updateDisplay() {

    document.getElementById('display-p1-name').innerText = p1Name;
    document.getElementById('display-p2-name').innerText = p2Name;

    document.getElementById('display-p1-score').innerText = p1Score;
    document.getElementById('display-p2-score').innerText = p2Score;

    document.getElementById('display-match-frames').innerText =
        `${p1Frames} - ${p2Frames}`;

    document.getElementById('display-match-title').innerText =
        matchFormat;

    if (activePlayer === 1) {

        document.getElementById('slot-p1')
            .classList.add('active');

        document.getElementById('slot-p2')
            .classList.remove('active');

    } else {

        document.getElementById('slot-p1')
            .classList.remove('active');

        document.getElementById('slot-p2')
            .classList.add('active');
    }

    let banner = document.getElementById('break-banner');

    if (currentBreak > 0) {

        let striker =
            activePlayer === 1 ? p1Name : p2Name;

        banner.innerText =
            `${striker.toUpperCase()} • BREAK: ${currentBreak}`;

        banner.classList.add('show');

    } else {

        banner.classList.remove('show');
    }
}

/* SCORE BALL */

function scoreBall(points) {

    saveState();

    if (activePlayer === 1) {
        p1Score += points;
    } else {
        p2Score += points;
    }

    currentBreak += points;

    updateDisplay();
}

/* FOUL */

function foul(points) {

    saveState();

    if (activePlayer === 1) {
        p2Score += points;
    } else {
        p1Score += points;
    }

    currentBreak = 0;

    updateDisplay();
}

/* DEDUCT POINTS */

function deductPoints(playerNum, points) {

    saveState();

    if (playerNum === 1) {

        p1Score = Math.max(0, p1Score - points);

    } else {

        p2Score = Math.max(0, p2Score - points);
    }

    updateDisplay();
}

/* SWITCH PLAYER */

function toggleStriker() {

    saveState();

    activePlayer =
        activePlayer === 1 ? 2 : 1;

    currentBreak = 0;

    updateDisplay();
}

/* END BREAK */

function endBreak() {

    saveState();

    currentBreak = 0;

    updateDisplay();
}

/* UPDATE PLAYER NAMES */

function updateNames() {

    p1Name =
        document.getElementById('p1-input').value || "Player 1";

    p2Name =
        document.getElementById('p2-input').value || "Player 2";

    updateDisplay();
}

/* UPDATE MATCH FORMAT */

function updateFormat() {

    let selectElem =
        document.getElementById('match-format-select');

    let customInput =
        document.getElementById('custom-format-input');

    if (selectElem.value === "Custom") {

        customInput.style.display = "inline-block";

        matchFormat = customInput.value || "Match";

        customInput.oninput = function () {

            matchFormat =
                this.value || "Match";

            updateDisplay();
        };

    } else {

        customInput.style.display = "none";

        matchFormat = selectElem.value;
    }

    updateDisplay();
}

/* END FRAME */

function endFrame() {

    saveState();

    if (p1Score > p2Score) {

        p1Frames++;

    } else if (p2Score > p1Score) {

        p2Frames++;
    }

    p1Score = 0;
    p2Score = 0;
    currentBreak = 0;

    updateDisplay();
}

/* RESET MATCH */

function resetMatch() {

    if (confirm("Reset everything?")) {

        saveState();

        p1Score = 0;
        p2Score = 0;

        p1Frames = 0;
        p2Frames = 0;

        currentBreak = 0;
        activePlayer = 1;

        updateDisplay();

        historyStack = [];
    }
}

/* CHANGE THEME */

function changeTheme() {

    let val =
        document.getElementById('theme-select').value;

    let classes =
        Array.from(document.body.classList);

    classes.forEach(c => {

        if (c.startsWith('theme-')) {

            document.body.classList.remove(c);
        }
    });

    if (val !== "default") {

        document.body.classList.add("theme-" + val);
    }
}

/* UI MODE */

function changeUiMode() {

    let mode =
        document.getElementById('ui-mode-select').value;

    if (mode === 'normal') {

        document.body.classList.remove('ctrl-night');
        document.body.classList.add('ctrl-normal');

    } else {

        document.body.classList.remove('ctrl-normal');
        document.body.classList.add('ctrl-night');
    }
}

/* APPLY FONTS */

function applyFonts() {

    let enFont =
        document.getElementById('en-font-select').value;

    let khFont =
        document.getElementById('kh-font-select').value;

    let combinedFontStack =
        `${khFont}, ${enFont}, sans-serif`;

    document.getElementById('scoreboard-container')
        .style.fontFamily = combinedFontStack;
}

/* OBS MODE */

function toggleControllerView() {

    document.body.classList.toggle('obs-mode');
}

/* HOTKEYS */

window.addEventListener('keydown', function (e) {

    if (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'SELECT'
    ) {
        return;
    }

    switch (e.key) {

        case '1':
            scoreBall(1);
            e.preventDefault();
            break;

        case '2':
            scoreBall(2);
            e.preventDefault();
            break;

        case '3':
            scoreBall(3);
            e.preventDefault();
            break;

        case '4':
            scoreBall(4);
            e.preventDefault();
            break;

        case '5':
            scoreBall(5);
            e.preventDefault();
            break;

        case '6':
            scoreBall(6);
            e.preventDefault();
            break;

        case '7':
            scoreBall(7);
            e.preventDefault();
            break;

        case ' ':
            toggleStriker();
            e.preventDefault();
            break;

        case 'Enter':
            endBreak();
            e.preventDefault();
            break;

        case 'z':
        case 'Z':

            if (e.ctrlKey) {

                undo();
                e.preventDefault();
            }

            break;
    }
});

/* STARTUP */

updateNames();
updateFormat();
applyFonts();
updateDisplay();