$(".teaser-accordion h3").click(function () {
  $(this).parent().find(".content").slideToggle();
});

//ganze Box verlinken
function linkWholeBox(cssClass) {
  var container = $(cssClass);

  if (container.find("a").length > 0) {
    container.css("cursor", "pointer");

    container.click(function () {
      location.href = $(this).find("a").attr("href");
    });

    container.mouseover(function () {
      $(this).attr("title", $(this).find("a").attr("title"));
    });
  }
}

$(function () {
  linkWholeBox(".teaser-box-background");
  linkWholeBox(".news-teaser");
  linkWholeBox(".value-chain-service");
  linkWholeBox(".closer .Article");
  linkWholeBox(".news-teaser-big");
  linkWholeBox(".news-teaser-article");
});

// check if element is in view
function checkVisibility(el) {
  const { top, bottom } = el.getBoundingClientRect();
  const { innerHeight } = window;

  // only check the y axis, x axis is not relevant
  const visible = top < innerHeight && bottom > 0;

  if (visible) {
    el.classList.add("svg-visible");
  } else {
    el.classList.remove("svg-visible");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // get animated svgs
  const svgElements = document.querySelectorAll("svg[class*='svg-'");

  // check initial state
  svgElements.forEach((item) => {
    checkVisibility(item);
  });

  // the slider causes the initial position of all svgs below it to be wrong
  // when the slider initializes the bosy height changes
  // check the visiblity again when that happens
  const resizeObserver = new ResizeObserver((entries) => {
    svgElements.forEach((item) => {
      checkVisibility(item);
    });
  });

  // observe body height
  resizeObserver.observe(document.body);

  // add scroll event
  document.addEventListener("scroll", () => {
    svgElements.forEach((item) => {
      checkVisibility(item);
    });
  });

  // add resize event
  window.addEventListener("resize", () => {
    svgElements.forEach((item) => {
      checkVisibility(item);
    });
  });
});
