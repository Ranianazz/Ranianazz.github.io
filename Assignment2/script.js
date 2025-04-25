document.addEventListener("DOMContentLoaded", function () {
  // Initialize both media players
  setupMediaPlayer(
    "custom-video-player-1",
    "play-pause-btn-1",
    "play-pause-img-1",
    "progress-bar-fill-1",
    "fullscreen-btn-1"
  );
  setupMediaPlayer(
    "custom-video-player-2",
    "play-pause-btn-2",
    "play-pause-img-2",
    "progress-bar-fill-2",
    "fullscreen-btn-2"
  );

  /**
   * Sets up all controls for a media player
   * @param {string} videoId - ID of video element
   * @param {string} playPauseBtnId - ID of play/pause button
   * @param {string} playPauseImgId - ID of play/pause image
   * @param {string} progressBarId - ID of progress bar
   * @param {string} fullscreenBtnId - ID of fullscreen button
   */
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
      toggleFullscreen(mediaPlayer, fullscreenBtn)
    );

    // Update progress bar during playback
    video.addEventListener("timeupdate", () =>
      updateProgressBar(video, progressBar)
    );

    // Update UI when video ends
    video.addEventListener("ended", () => {
      playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
    });
  }

  /**
   * Toggles play/pause state of video
   * @param {HTMLVideoElement} video - Video element
   * @param {HTMLImageElement} playPauseImg - Play/pause image element
   */
  function togglePlayPause(video, playPauseImg) {
    if (video.paused || video.ended) {
      video.play();
      playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
    } else {
      video.pause();
      playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
    }
  }

  /**
   * Updates progress bar to reflect current playback position
   * @param {HTMLVideoElement} video - Video element
   * @param {HTMLElement} progressBar - Progress bar element
   */
  function updateProgressBar(video, progressBar) {
    if (video.duration) {
      const value = (video.currentTime / video.duration) * 100;
      progressBar.style.width = value + "%";
    }
  }

  /**
   * Toggles fullscreen mode for media player
   * @param {HTMLElement} mediaPlayer - Media player container
   * @param {HTMLButtonElement} fullscreenBtn - Fullscreen button
   */
  function toggleFullscreen(mediaPlayer, fullscreenBtn) {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (mediaPlayer.requestFullscreen) {
        mediaPlayer.requestFullscreen().catch((err) => {
          console.error("Fullscreen error:", err);
        });
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Update fullscreen button appearance when mode changes
  document.addEventListener("fullscreenchange", updateFullscreenButtons);
  document.addEventListener("webkitfullscreenchange", updateFullscreenButtons);

  /**
   * Updates all fullscreen buttons based on current fullscreen state
   */
  function updateFullscreenButtons() {
    const isFullscreen = !!document.fullscreenElement;
    document.querySelectorAll(".control-btn").forEach((btn) => {
      if (btn.id.includes("fullscreen")) {
        btn.title = isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen";
      }
    });
  }
});
