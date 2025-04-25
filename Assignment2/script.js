document.addEventListener("DOMContentLoaded", function () {
  // Initialize media player
  setupMediaPlayer(
    "custom-video-player-1",
    "play-pause-btn-1",
    "play-pause-img-1",
    "progress-bar-fill-1",
    "fullscreen-btn-1"
  );

  function setupMediaPlayer(
    videoId,
    playPauseBtnId,
    playPauseImgId,
    progressBarId,
    fullscreenBtnId
  ) {
    const video = document.getElementById(videoId);
    const playPauseBtn = document.getElementById(playPauseBtnId);
    const playPauseImg = document.getElementById(playPauseImgId);
    const progressBar = document.getElementById(progressBarId);
    const fullscreenBtn = document.getElementById(fullscreenBtnId);
    const mediaPlayer = playPauseBtn.closest(".media-player");

    // Remove default controls
    video.removeAttribute("controls");

    // Set up play/pause functionality
    playPauseBtn.addEventListener("click", () =>
      togglePlayPause(video, playPauseImg)
    );
    video.addEventListener("click", () => togglePlayPause(video, playPauseImg));

    // Set up fullscreen functionality
    fullscreenBtn.addEventListener("click", () =>
      toggleFullscreen(mediaPlayer)
    );

    // Update progress bar during playback
    video.addEventListener("timeupdate", () =>
      updateProgressBar(video, progressBar)
    );

    // Reset to play icon when video ends
    video.addEventListener("ended", () => {
      playPauseImg.src = "Assignment2/play.png"; // or any path to your play icon
    });
  }

  function togglePlayPause(video, playPauseImg) {
    if (video.paused || video.ended) {
      video.play();
      playPauseImg.src = "pause.png"; // switch to pause image
    } else {
      video.pause();
      playPauseImg.src = "play.png"; // switch back to play image
    }
  }

  function updateProgressBar(video, progressBar) {
    if (video.duration) {
      const value = (video.currentTime / video.duration) * 100;
      progressBar.style.width = value + "%";
    }
  }

  function toggleFullscreen(mediaPlayer) {
    if (!document.fullscreenElement) {
      mediaPlayer.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // Optional: Update fullscreen button label (not required for basic fullscreen)
  document.addEventListener("fullscreenchange", updateFullscreenButtons);

  function updateFullscreenButtons() {
    const isFullscreen = !!document.fullscreenElement;
    document.querySelectorAll(".control-btn").forEach((btn) => {
      if (btn.id.includes("fullscreen")) {
        btn.title = isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen";
      }
    });
  }
});
