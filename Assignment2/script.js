// Wait for the entire DOM to load before running script
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the media player with specific element IDs
  setupMediaPlayer(
    "custom-video-player-1", // ID of the video element
    "play-pause-btn-1", // ID of the play/pause button
    "play-pause-img-1", // ID of the image inside the play/pause button
    "progress-bar-fill-1", // ID of the progress bar fill element
    "fullscreen-btn-1" // ID of the fullscreen button
  );

  /**
   * Sets up a custom media player with given element IDs
   */
  function setupMediaPlayer(
    videoId,
    playPauseBtnId,
    playPauseImgId,
    progressBarId,
    fullscreenBtnId
  ) {
    // Get DOM elements by ID
    const video = document.getElementById(videoId);
    const playPauseBtn = document.getElementById(playPauseBtnId);
    const playPauseImg = document.getElementById(playPauseImgId);
    const progressBar = document.getElementById(progressBarId);
    const fullscreenBtn = document.getElementById(fullscreenBtnId);
    const mediaPlayer = playPauseBtn.closest(".media-player");

    // Hide native video controls to replace them with custom controls
    video.removeAttribute("controls");

    // Play or pause video when play/pause button is clicked
    playPauseBtn.addEventListener("click", () =>
      togglePlayPause(video, playPauseImg)
    );

    // Also allow clicking directly on video to play/pause
    video.addEventListener("click", () => togglePlayPause(video, playPauseImg));

    // Enter or exit fullscreen when fullscreen button is clicked
    fullscreenBtn.addEventListener("click", () =>
      toggleFullscreen(mediaPlayer)
    );

    // Continuously update progress bar as video plays
    video.addEventListener("timeupdate", () =>
      updateProgressBar(video, progressBar)
    );

    // Reset to play icon when video finishes
    video.addEventListener("ended", () => {
      playPauseImg.src = "Assignment2/play.png"; // Set to play icon on end
    });
  }

  /**
   * Toggles video play/pause state and updates button icon
   */
  function togglePlayPause(video, playPauseImg) {
    if (video.paused || video.ended) {
      video.play(); // Start playback
      playPauseImg.src = "pause.png"; // Change icon to pause
    } else {
      video.pause(); // Pause playback
      playPauseImg.src = "play.png"; // Change icon to play
    }
  }

  /**
   * Updates the progress bar width as video plays
   */
  function updateProgressBar(video, progressBar) {
    if (video.duration) {
      const value = (video.currentTime / video.duration) * 100;
      progressBar.style.width = value + "%"; // Fill bar based on % complete
    }
  }

  /**
   * Toggles fullscreen mode on or off for the media player
   */
  function toggleFullscreen(mediaPlayer) {
    if (!document.fullscreenElement) {
      // Request fullscreen if not already in it
      mediaPlayer.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      // Exit fullscreen if already in it
      document.exitFullscreen();
    }
  }

  /**
   * Optionally updates the fullscreen button tooltip when mode changes
   */
  document.addEventListener("fullscreenchange", updateFullscreenButtons);

  function updateFullscreenButtons() {
    const isFullscreen = !!document.fullscreenElement;
    document.querySelectorAll(".control-btn").forEach((btn) => {
      if (btn.id.includes("fullscreen")) {
        // Change title text based on fullscreen state
        btn.title = isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen";
      }
    });
  }
});
