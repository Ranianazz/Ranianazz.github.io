// Create an object array containing the videos. This makes it easy to manage video data and allows for scalability if more videos are added in the future.
const videoList = [
  { name: "Zenscape", link: "zenscape.mp4" }, // Represents the first video with its name and file link
  { name: "Stardust", link: "stardust.mp4" }, // Represents the second video with its name and file link
];

let loop = false; // Variable to control the loop state of the video. Starts as false, meaning the video will not loop by default.

// Query elements for buttons and event listeners
const playPauseButton = document.querySelector("#play-pause-btn");
// Event listener to toggle between playing and pausing the video when the button is clicked
playPauseButton.addEventListener("click", togglePlay);
const playPauseImg = document.querySelector("#play-pause-img");

const muteUnmuteButton = document.querySelector("#mute-unmute-btn");
// Event listener to mute or unmute the video when the button is clicked
muteUnmuteButton.addEventListener("click", toggleAudio);
const muteUnmuteImg = document.querySelector("#mute-unmute-img");

const increaseVolumeButton = document.querySelector("#increase-volume-btn");
// Event listener to increase the volume of the video when the button is clicked
increaseVolumeButton.addEventListener("click", increaseVolume);

const decreaseVolumeButton = document.querySelector("#decrease-volume-btn");
// Event listener to decrease the volume of the video when the button is clicked
decreaseVolumeButton.addEventListener("click", decreaseVolume);

const loopButton = document.querySelector("#loop-btn");
// Event listener to toggle loop functionality when the loop button is clicked
loopButton.addEventListener("click", loopVideo);

const step1Button = document.querySelector("#step-1-btn");
// Event listener to jump to a specific timestamp in the video (step 1) when clicked
step1Button.addEventListener("click", gotoStep1);

const myVideo = document.querySelector("#my-video"); // Reference to the video element
const videoName = document.querySelector("#video-name"); // Reference to the element showing the current video name
const videoTime = document.querySelector("#video-time"); // Reference to the element showing the current playtime of the video
const progressBar = document.querySelector("#progress-bar-fill"); // Reference to the progress bar element

// Event listener to update the progress bar as the video plays
myVideo.addEventListener("timeupdate", updateProgressBar);

// Event listener to update volume display when the volume changes
myVideo.addEventListener("volumechange", updateVolume);

// Event listener to check if the video has ended and replay it if the loop is enabled
myVideo.addEventListener("ended", replay);

// Event listener for the first video thumbnail button to play the Zenscape video
const firstVideoButton = document.querySelector("#first-video-btn");
firstVideoButton.addEventListener("click", function playIt() {
  myVideo.pause(); // Pause any currently playing video
  playVideo(0); // Play the first video from the list
});

// Event listener for the second video thumbnail button to play the Stardust video
const secondVideoButton = document.querySelector("#second-video-btn");
secondVideoButton.addEventListener("click", function playIt() {
  myVideo.pause(); // Pause any currently playing video
  playVideo(1); // Play the second video from the list
});

// Function to toggle play/pause state of the video and change button image accordingly
function togglePlay() {
  if (myVideo.paused || myVideo.ended) {
    myVideo.play(); // If the video is paused or ended, start playing
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png"; // Change icon to 'pause'
  } else {
    myVideo.pause(); // If the video is playing, pause it
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png"; // Change icon to 'play'
  }
}

// Function to toggle mute/unmute functionality for the video
function toggleAudio() {
  if (myVideo.muted) {
    myVideo.muted = false; // Unmute the video
    muteUnmuteButton.style.backgroundColor = "#d5cea3"; // Change button background to signify audio is on
  } else {
    myVideo.muted = true; // Mute the video
    muteUnmuteButton.style.backgroundColor = "#7b775e"; // Change button background to signify audio is muted
  }
}

// Function to play a specific video based on its index (0 for Zenscape, 1 for Stardust)
function playVideo(no) {
  myVideo.pause(); // Pause any currently playing video
  myVideo.src = videoList[no].link; // Set the video source based on the index
  videoName.textContent = videoList[no].name; // Update the video title to the selected video name
  myVideo.load(); // Reload the video with the new source
  myVideo.play(); // Start playing the selected video
}

// Function to replay the video if loop is enabled
function replay() {
  if (loop) {
    myVideo.currentTime = 0; // Reset the video to the beginning
    myVideo.play(); // Play the video from the start
  }
}

// Function to toggle the loop functionality
function loopVideo() {
  loop = !loop; // Toggle the loop state
  loopButton.style.backgroundColor = loop ? "#7b775e" : "#d5cea3"; // Change loop button background color to indicate the state
}

// Function to increase the volume by 0.1 units, up to a maximum of 0.9
function increaseVolume() {
  if (myVideo.volume < 0.9) {
    myVideo.volume += 0.1; // Increase the volume by 0.1
  }
}

// Function to decrease the volume by 0.1 units, with a minimum volume of 0.1
function decreaseVolume() {
  if (myVideo.volume > 0.11) {
    myVideo.volume -= 0.1; // Decrease the volume by 0.1
  }
}

// Function to jump to a specific timestamp in the video (Step 1)
function gotoStep1() {
  myVideo.currentTime = 16.41; // Set the video current time to the step 1 timestamp
}

// Function to update the progress bar based on the video playtime
function updateProgressBar() {
  videoTime.textContent = myVideo.currentTime.toFixed(2); // Update the current playtime display
  const value = (myVideo.currentTime / myVideo.duration) * 100; // Calculate progress as a percentage
  progressBar.style.width = value + "%"; // Update the progress bar width
}

// Function to log the current volume when it changes (useful for debugging)
function updateVolume() {
  const volume = myVideo.volume; // Get the current volume
  console.log("Volume changed:", volume); // Log the current volume for debugging
}

// Function to toggle fullscreen mode when the video is double-clicked
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    myVideo.requestFullscreen(); // Request fullscreen if not already in fullscreen
  } else {
    document.exitFullscreen(); // Exit fullscreen if currently in fullscreen
  }
}

// Event listener for double-click to toggle fullscreen
myVideo.addEventListener("dblclick", toggleFullscreen);

// Event listener for fullscreen change to log when entering or exiting fullscreen
document.addEventListener("fullscreenchange", function () {
  if (document.fullscreenElement === myVideo) {
    console.log("Entered fullscreen"); // Log when entering fullscreen mode
  } else {
    console.log("Exited fullscreen"); // Log when exiting fullscreen mode
  }
});

// Navigation for previous and next video
const prevButton = document.querySelector("#previous-btn");
// Event listener to play the previous video in the list when clicked
prevButton.addEventListener("click", prevTrack);

const nextButton = document.querySelector("#next-btn");
// Event listener to play the next video in the list when clicked
nextButton.addEventListener("click", nextTrack);

let currentIndex = 0; // Keeps track of the currently playing video index

// Function to play the previous video in the list
function prevTrack() {
  currentIndex = (currentIndex - 1 + videoList.length) % videoList.length; // Move to the previous video, wrapping around if needed
  playVideoAtIndex(currentIndex); // Play the previous video
}

// Function to play the next video in the list
function nextTrack() {
  currentIndex = (currentIndex + 1) % videoList.length; // Move to the next video, wrapping around if needed
  playVideoAtIndex(currentIndex); // Play the next video
}

// Function to play a video at a specific index
function playVideoAtIndex(index) {
  myVideo.pause(); // Pause any currently playing video
  myVideo.src = videoList[index].link; // Set the video source to the selected video index
  myVideo.load(); // Reload the video with the new source
  myVideo.play(); // Start playing the selected video
}

// Like functionality
let likeCount = 0; // Initialize like count

const likeButton = document.querySelector("#like-btn");
// Event listener to increment the like count when the like button is clicked
likeButton.addEventListener("click", addLikes);

const likes = document.querySelector("#likes");
likes.textContent = likeCount; // Display the initial like count

// Function to increment the like count and update the displayed value
function addLikes() {
  likeCount++; // Increment like count by 1
  likes.textContent = likeCount; // Update the displayed like count
}
