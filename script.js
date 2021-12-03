const time = document.getElementById('time').innerHTML;
const startPauseButton = document.getElementById('start-pause-button');
const splitButton = document.getElementById('split-button');
const resetButton = document.getElementById('reset-button');

// Main timer initial time
let timeInMilliseconds = 0;

// Split timer initial time
let splitTimeInMilliseconds = 0;

/* After how much time should the timer variable update. 
Set to 10 ms, which is the absolute minimum the time interval
function in javascript allows*/ 
const updateFrequency = 10;

/* reference to the corresponding time interval function if the timer is running else false*/
let timerInterval = false;
let splitTimerInterval = false;

// counter for total logged split and pause logs
let totalLogs = 0;

let lastLogEventTime = 0;

// UI Update functions
const updateTimeOnScreen = (time) => {
    document.getElementById('time').innerHTML = time;
};

const updateSplitTimeOnScreen = (time) => {
    document.getElementById('split-time').innerHTML = time;
};

const updateStartPauseButtonText = (text) => {
    document.getElementById('start-pause-button').innerText = text;
    document.getElementById('start-pause-button').style.backgroundColor = '#eb5f7e';
}

const addLogEntry = (logType, currentTime) => {
    totalLogs += 1;
    const eventDifference = millisecondsToHHMMSS(currentTime - lastLogEventTime);
    document.getElementById('log-list').innerHTML += buildLogItemElement(totalLogs, eventDifference, logType);
    lastLogEventTime = currentTime;
    splitTimeInMilliseconds = 0;
};

const clearLogEntries = () => {
    document.getElementById('log-list').innerHTML = '';
    document.getElementById('split-time').innerHTML = 'SPLIT TIME';
}

// Event Handlers
// Chooses which function to run based on the state of the main timer.
// Same button is used for start and pause functionality.
const onStartOrPauseTimerClick = () => {
    if(timerInterval) {
        pauseTimer(timerInterval);
    } else{
        startTimer();
    }
};


const onSplitTimerClick = () => {
    splitTimeInMilliseconds = 0;
    addLogEntry('Split', timeInMilliseconds);
};

const onResetTimerClick = () => {
    startPauseButton.disabled = false;
    resetButton.disabled = true;
    splitButton.disabled = true;
    timeInMilliseconds = 0;
    splitTimeInMilliseconds = 0;
    lastLogEventTime = 0;
    totalLogs = 0;
    updateTimeOnScreen('00:00:00.00');
    updateSplitTimeOnScreen('00:00:00.00');
    clearLogEntries();
    updateStartPauseButtonText('Start');
};

const pauseTimer = () => {
    resetButton.disabled = false;
    splitButton.disabled = true;
    clearAllTimeIntervals();
    splitTimeInMilliseconds = 0;
    updateStartPauseButtonText('Start');
    addLogEntry('Pause', timeInMilliseconds);
};

const startTimer = () => {
    updateStartPauseButtonText('Pause');
    resetButton.disabled = true;
    splitButton.disabled = false;
    splitTimerInterval = setInterval(()=>{
        splitTimeInMilliseconds += updateFrequency;
        updateSplitTimeOnScreen(millisecondsToHHMMSS(splitTimeInMilliseconds));
    }, updateFrequency);
    timerInterval = setInterval(()=>{
        timeInMilliseconds += updateFrequency;
        updateTimeOnScreen(millisecondsToHHMMSS(timeInMilliseconds));
    }, updateFrequency);
};

const millisecondsToHHMMSS = ( timeInMilliseconds ) => {
    // 1- Convert to seconds:
    let seconds = timeInMilliseconds / 1000;
    // 2- Extract hours:
    let hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
    if(hours.toString().length <= 1){
        hours = hours.toString().padStart(2, '0');
    }
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    let minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
    if(minutes.toString().length <= 1){
        minutes = minutes.toString().padStart(2, '0');
    }
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    if(seconds.toString().length <= 4){
        seconds = seconds.toFixed(2).toString().padStart(5, '0');
    }
    return( hours+":"+minutes+":"+seconds);
}

const buildLogItemElement = (totalLogs, timeString, eventType) => {
    return (
        `<div class="log-item">
            <div>
                <p>#${totalLogs}</p>
                <p class="log-${eventType.toLowerCase()}">${timeString}</p>
            </div>
            <p>${eventType}</p>
        </div>`
    )
}

const clearAllTimeIntervals = () => {
    clearInterval(timerInterval);
    clearInterval(splitTimerInterval);
    timerInterval = false;
    splitTimerInterval = false;
}