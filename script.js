var player; 
var play_time; // Timestamp when video starts
var end_time; // Timestamp when video ends
var start_time = 0; // YT start video time (ms) (localStorage)
var stop_time = 0; // YT stop video time (ms) (localStorage)
var total_run_time = 0; // start_time - stop_time (localStorage)
var total_time_elapsed = 0; // Time for which video stremed(localStorage)
var time_update_interval = 0;
var useId = urlParam('yt_Id');

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        //width: 600,
        //height: 400,
        videoId: useId,
        playerVars: {
            color: 'white',
            autohide:1,
            controls:0
        },
        events: {
            onReady: initialize,
            onStateChange: onPlayerStateChange
        }
    });
}

function initialize(){
    // Update the controls on load
    updateTimerDisplay();

    // Clear any old interval
    clearInterval(time_update_interval);

    // Play video
    player.playVideo();

    // Start interval to update elapsed time display
    time_update_interval = setInterval(function () {
        updateTimerDisplay();
    }, 1000);

}

function onPlayerStateChange(event) {
    //console.log(event);

    switch (event.data) {

      case YT.PlayerState.UNSTARTED:
        var today = new Date();
        start_time = new Date().getTime();
        play_time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        console.log(
            JSON.stringify({
            event: "start"
            })
        );
        console.log("Setting localStorage start_time");
        localStorage.setItem("startTime",start_time);
        $('#start-time').text(play_time);
        // Total elapsed time from  updateTimerDisplay() Function
        console.log("Setting localStorage total_time_elapsed");
        //console.log('unstarted: ' + play_time);
        break;

      case YT.PlayerState.ENDED:
        var today = new Date();
        stop_time = new Date().getTime();
        var end_time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        console.log(
            JSON.stringify({
            event: "stop"
            })
        );
        console.log("Setting localStorage stop_time");
        localStorage.setItem("stopTime",stop_time);
        $('#stop-time').text(end_time);
        total_run_time = stop_time - start_time
        $('#total-run-time').text(msToTime(total_run_time));
        console.log("Setting localStorage totalRunTime");
        localStorage.setItem("totalRunTime", total_run_time);
        //console.log('ended time: ' + end_time);
        //console.log('total run time: ' + total_run_time);
        break;

      case YT.PlayerState.PLAYING:
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        //console.log('playing time: '+ time);
        break;

      case YT.PlayerState.PAUSED:
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        //console.log('paused: ' + time);
        break;

      case YT.PlayerState.BUFFERING:
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        //console.log('buffering: ' + time);
        break;

      case YT.PlayerState.CUED:
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        //console.log('video cued: ' + time);
        break;
    }
  }


// This function is called by initialize()
function updateTimerDisplay(){
    // Update current time text display.
    total_time_elapsed = player.getCurrentTime()
    localStorage.setItem("totalTimeElapsed", total_time_elapsed );
    $('#current-time').text(formatTime( player.getCurrentTime() ));
    $('#duration').text(formatTime( player.getDuration() ));
}

// Helper Functions
function formatTime(time){
    time = Math.round(time);
    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ":" + seconds;
}

// Convert ms to time format
function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

function urlParam(name, w){
  w = w || window;
  var rx = new RegExp('[\&|\?]'+name+'=([^\&\#]+)'),
      val = w.location.search.match(rx);
  return !val ? '':val[1];
};