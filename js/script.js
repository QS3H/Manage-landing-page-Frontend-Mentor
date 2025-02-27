// Mobile menu toggle
const btn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
const overlay = document.getElementById("menu-overlay");

btn.addEventListener("click", () => {
  btn.classList.toggle("open");
  menu.classList.toggle("hidden");
  overlay.classList.toggle("active");
  document.body.classList.toggle("no-scroll");
});

// Testimonials slider functionality
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".testimonial-slider");
  const slides = document.querySelector(".testimonial-slides");
  const dots = document.querySelectorAll(".slider-dot");
  let currentIndex = 0;
  let startX;
  let isDragging = false;
  let touchStartTime;
  let touchDistance;

  // Skip if slider doesn't exist on the page
  if (!slider || !slides || !dots.length) return;

  // Prevent horizontal overflow on mobile
  document.documentElement.style.overflowX = "hidden";
  document.body.style.overflowX = "hidden";

  // Ensure slider container doesn't cause overflow
  slider.style.maxWidth = "100%";
  slider.style.overflowX = "hidden";

  // Initialize the first dot as active
  dots[0].classList.add("bg-brightRed");
  dots[0].classList.remove("bg-gray-300");

  // Function to update the slider position
  function updateSliderPosition(index) {
    if (!slides) return;
    slides.style.transform = `translateX(-${index * 100}%)`;

    // Update active dot
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add("bg-brightRed");
        dot.classList.remove("bg-gray-300");
      } else {
        dot.classList.remove("bg-brightRed");
        dot.classList.add("bg-gray-300");
      }
    });

    currentIndex = index;
  }

  // Add click event listeners to dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      updateSliderPosition(index);
    });
  });

  // Touch events for swipe functionality
  slider.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      touchStartTime = new Date().getTime();
      isDragging = true;
      slides.style.transition = "none";
      // Prevent default to avoid potential scrolling issues
      e.preventDefault();
    },
    { passive: false }
  );

  slider.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      touchDistance = startX - currentX;
      const slideWidth = slider.offsetWidth; // Calculate width on each move for accuracy
      const offset = -currentIndex * 100 - (touchDistance / slideWidth) * 100;

      // Limit the transform to prevent excessive movement
      if (
        (currentIndex === 0 && touchDistance < 0) ||
        (currentIndex === dots.length - 1 && touchDistance > 0)
      ) {
        // Reduce the movement when at the edges (resistance effect)
        slides.style.transform = `translateX(${offset * 0.3}%)`;
      } else {
        slides.style.transform = `translateX(${offset}%)`;
      }

      // Prevent default to avoid horizontal scrolling
      e.preventDefault();
    },
    { passive: false }
  );

  slider.addEventListener("touchend", () => {
    isDragging = false;
    slides.style.transition = "transform 300ms ease";

    // Determine if swipe was significant enough to change slide
    const touchEndTime = new Date().getTime();
    const touchDuration = touchEndTime - touchStartTime;

    // If swipe was fast or distance was significant
    if (
      Math.abs(touchDistance) > 50 ||
      (Math.abs(touchDistance) > 20 && touchDuration < 300)
    ) {
      if (touchDistance > 0 && currentIndex < dots.length - 1) {
        // Swipe left - go to next slide
        updateSliderPosition(currentIndex + 1);
      } else if (touchDistance < 0 && currentIndex > 0) {
        // Swipe right - go to previous slide
        updateSliderPosition(currentIndex - 1);
      } else {
        // Return to current slide if at the end
        updateSliderPosition(currentIndex);
      }
    } else {
      // Return to current slide if swipe wasn't significant
      updateSliderPosition(currentIndex);
    }
  });

  // Auto-advance slides every 5 seconds
  let slideInterval = setInterval(() => {
    const nextIndex = (currentIndex + 1) % dots.length;
    updateSliderPosition(nextIndex);
  }, 5000);

  // Pause auto-advance when user interacts with slider
  slider.addEventListener(
    "touchstart",
    () => {
      clearInterval(slideInterval);
    },
    { passive: false }
  );

  // Resume auto-advance after user interaction
  slider.addEventListener("touchend", () => {
    slideInterval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % dots.length;
      updateSliderPosition(nextIndex);
    }, 5000);
  });

  // Handle window resize to ensure proper slider behavior
  window.addEventListener("resize", () => {
    // Reset position to current slide without animation
    slides.style.transition = "none";
    updateSliderPosition(currentIndex);
    // Re-enable transition after a short delay
    setTimeout(() => {
      slides.style.transition = "transform 300ms ease";
    }, 50);
  });
});
