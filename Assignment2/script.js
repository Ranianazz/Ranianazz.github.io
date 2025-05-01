// We create an object array containing the videos
const videoList = [
  { name: "Zenscape", link: "zenscape.mp4" },
  { name: "Stardust", link: "stardust.mp4" },
];

let loop = false;

const playPauseButton = document.querySelector("#play-pause-btn");
// Event listener to toggle between playing and pausing video on clicking the button
playPauseButton.addEventListener("click", togglePlay);
const playPauseImg = document.querySelector("#play-pause-img");

const muteUnmuteButton = document.querySelector("#mute-unmute-btn");
// Event listener to mute or unmute audio on clicking the button
muteUnmuteButton.addEventListener("click", toggleAudio);
const muteUnmuteImg = document.querySelector("#mute-unmute-img");

const increaseVolumeButton = document.querySelector("#increase-volume-btn");
// Event listener to increase volume on clicking the button
increaseVolumeButton.addEventListener("click", increaseVolume);

const decreaseVolumeButton = document.querySelector("#decrease-volume-btn");
// Event listener to decrease volume on clicking the button
decreaseVolumeButton.addEventListener("click", decreaseVolume);

const loopButton = document.querySelector("#loop-btn");
// Event listener to loop or replay the video on clicking the button
loopButton.addEventListener("click", loopVideo);

const step1Button = document.querySelector("#step-1-btn");
// Event listener to navigate to step 1 timestamp in video on clicking the button
step1Button.addEventListener("click", gotoStep1);

const myVideo = document.querySelector("#my-video");
const videoName = document.querySelector("#video-name");
const videoTime = document.querySelector("#video-time");
const progressBar = document.querySelector("#progress-bar-fill");

// Event listener to check time update on video to update the progress bar
myVideo.addEventListener("timeupdate", updateProgressBar);

// Event listener to check current volume
myVideo.addEventListener("volumechange", updateVolume);

// Event listener to check if the video is ended to replay it
myVideo.addEventListener("ended", replay);

const firstVideoButton = document.querySelector("#first-video-btn");
// Event listener to play the first video
firstVideoButton.addEventListener("click", function playIt() {
  myVideo.pause();
  playVideo(0); // Play first video
});

const secondVideoButton = document.querySelector("#second-video-btn");
// Event listener to play the second video
secondVideoButton.addEventListener("click", function playIt() {
  myVideo.pause();
  playVideo(1); // Play second video
});

// Toggle play/pause functionality
function togglePlay() {
  if (myVideo.paused || myVideo.ended) {
    myVideo.play();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
  } else {
    myVideo.pause();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
}

// Toggle mute/unmute functionality
function toggleAudio() {
  if (myVideo.muted) {
    myVideo.muted = false;
    muteUnmuteButton.style.backgroundColor = "#d5cea3";
  } else {
    myVideo.muted = true;
    muteUnmuteButton.style.backgroundColor = "#7b775e";
  }
}

// Play video based on selected index (0 for Zenscape, 1 for Stardust)
function playVideo(no) {
  myVideo.pause();
  myVideo.src = videoList[no].link;
  videoName.textContent = videoList[no].name;
  myVideo.load();
  myVideo.play();
}

// Replay video if loop is enabled
function replay() {
  if (loop) {
    myVideo.currentTime = 0;
    myVideo.play();
  }
}

// Toggle loop functionality
function loopVideo() {
  loop = !loop;
  loopButton.style.backgroundColor = loop ? "#7b775e" : "#d5cea3";
}

// Increase video volume
function increaseVolume() {
  if (myVideo.volume < 0.9) {
    myVideo.volume += 0.1;
  }
}

// Decrease video volume
function decreaseVolume() {
  if (myVideo.volume > 0.11) {
    myVideo.volume -= 0.1;
  }
}

// Skip to a specific timestamp (step 1)
function gotoStep1() {
  myVideo.currentTime = 16.41;
}

// Update progress bar based on video time
function updateProgressBar() {
  videoTime.textContent = myVideo.currentTime.toFixed(2);
  const value = (myVideo.currentTime / myVideo.duration) * 100;
  progressBar.style.width = value + "%";
}

// Update volume display
function updateVolume() {
  const volume = myVideo.volume;
  console.log("Volume changed:", volume);
}

// Toggle fullscreen functionality
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    myVideo.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// Event listener for fullscreen double-click
myVideo.addEventListener("dblclick", toggleFullscreen);

// Event listener for fullscreen change event
document.addEventListener("fullscreenchange", function () {
  if (document.fullscreenElement === myVideo) {
    console.log("Entered fullscreen");
  } else {
    console.log("Exited fullscreen");
  }
});

// Navigation for previous and next video
const prevButton = document.querySelector("#previous-btn");
prevButton.addEventListener("click", prevTrack);

const nextButton = document.querySelector("#next-btn");
nextButton.addEventListener("click", nextTrack);

let currentIndex = 0;

// Play previous track
function prevTrack() {
  currentIndex = (currentIndex - 1 + videoList.length) % videoList.length;
  playVideoAtIndex(currentIndex);
}

// Play next track
function nextTrack() {
  currentIndex = (currentIndex + 1) % videoList.length;
  playVideoAtIndex(currentIndex);
}

// Function to play video at a specific index
function playVideoAtIndex(index) {
  myVideo.pause();
  myVideo.src = videoList[index].link;
  myVideo.load();
  myVideo.play();
}

// Like functionality
let likeCount = 0;

const likeButton = document.querySelector("#like-btn");
likeButton.addEventListener("click", addLikes);

const likes = document.querySelector("#likes");
likes.textContent = likeCount;

function addLikes() {
  likeCount++;
  likes.textContent = likeCount;
}
