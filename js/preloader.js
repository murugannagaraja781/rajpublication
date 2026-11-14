/**
 * RAJ PUBLICATION — PAGE PRELOADER CONTROLLER
 * Handles smooth circular branded loader transition on initial page load
 */
(function() {
  const startTime = Date.now();
  const MIN_DISPLAY_MS = 650; // Guaranteed smooth presentation time
  let isDismissed = false;

  function dismissPreloader() {
    if (isDismissed) return;
    const preloader = document.getElementById('site-preloader');
    if (!preloader) return;

    isDismissed = true;
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    setTimeout(() => {
      preloader.classList.add('preloader-fade-out');
      document.body.classList.remove('preloader-active');
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 550);
    }, remaining);
  }

  // Dismiss on window load
  if (document.readyState === 'complete') {
    dismissPreloader();
  } else {
    window.addEventListener('load', dismissPreloader);
  }

  // Safety fallback: dismiss after max 2500ms
  setTimeout(dismissPreloader, 2500);

  // Expose manual dismiss hook
  window.dismissSitePreloader = dismissPreloader;
})();
