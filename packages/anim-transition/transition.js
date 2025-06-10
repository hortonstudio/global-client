// Page Transition Module
const API_NAME = 'hsmain';
export async function init() {
  
  // Register the transition logic to run after library is ready
  window[API_NAME].afterReady(() => {
    // Only run if jQuery is available
    if (typeof $ !== 'undefined') {
      initTransitions();
    }
  });
  
  return { result: 'anim-transition initialized' };
}

function initTransitions() {
  let transitionTrigger = $(".transition-trigger");
  let introDurationMS = 800;
  let exitDurationMS = 400;
  let excludedClass = "no-transition";
    
  // On Page Load
  if (transitionTrigger.length > 0) {
    if (window.Webflow && window.Webflow.push) {
      Webflow.push(function () {
        transitionTrigger.click();
      });
    } else {
      // Non-Webflow initialization
      setTimeout(() => {
        transitionTrigger.click();
      }, 100);
    }
    $("body").addClass("no-scroll-transition");
    setTimeout(() => {$("body").removeClass("no-scroll-transition");}, introDurationMS);
  }
  
  // On Link Click
  $("a").on("click", function (e) {
    if ($(this).prop("hostname") == window.location.host && $(this).attr("href").indexOf("#") === -1 &&
        !$(this).hasClass(excludedClass) && $(this).attr("target") !== "_blank" && transitionTrigger.length > 0) {
      e.preventDefault();
      $("body").addClass("no-scroll-transition");
      let transitionURL = $(this).attr("href");
      transitionTrigger.click();
      setTimeout(function () {window.location = transitionURL;}, exitDurationMS);
    }
  });
  
  // On Back Button Tap
  window.onpageshow = function(event) {if (event.persisted) {window.location.reload()}};
  
  // Hide Transition on Window Width Resize
  setTimeout(() => {$(window).on("resize", function () {
  setTimeout(() => {$(".transition").css("display", "none");}, 50);});
  }, introDurationMS);
}