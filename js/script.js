const apiKey = decrypt(env.key, 'proxneverdie');
const spreadsheetId = env.sheet_id;

const sheetName = "Quote";
let quotes = [];
let container = document.querySelector("ul.comments-right");

fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`
)
  .then((response) => response.json())
  .then((data) => {
    quotes = data?.values;
    displayQuote(1);
  })
  .catch((error) => console.error("Error:", error));

let currentIndex = 1;

const carousel = document.getElementById("quote-carousel");

// Function to create carousel items dynamically
function createCarouselItem(quote) {
  const item = document.createElement("div");
  item.classList.add("carousel-item");
  item.innerHTML = `
          <div class="carousel-item-wrapper">
          <h3>~ ${quote[1]} ~</h3>
          <h5>⦁ ${quote[0]}</h5>
          <hr/>
          <p class="quote-content">${quote[2]}</p>
          </div>
      `;
  return item;
}

// Function to display a particular quote based on index
function displayQuote(index) {
  if (quotes[index] == null || index == 0) {
    return;
  }

  carousel.classList.add("fade-out");

  setTimeout(() => {
    carousel.innerHTML = "";
    carousel.appendChild(createCarouselItem(quotes[index]));

    carousel.classList.remove("fade-out");
    carousel.classList.add("fade-in");

    setTimeout(() => {
      carousel.classList.remove("fade-in");
    }, 500);
  }, 500);
}

// Display initial quote
displayQuote(currentIndex);

// Event listeners for navigation buttons
document.getElementById("next-btn").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % quotes.length;
  displayQuote(currentIndex);
});

document.getElementById("prev-btn").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
  displayQuote(currentIndex);
});

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".fade_in");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(
      (entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate__fadeInUp");
        } else {
          entry.target.classList.remove("animate__fadeInUp");
        }
      },
      {
        threshold: 1.0,
      }
    );
  });

  elements.forEach((element) => {
    observer.observe(element);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".animation-item");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(
      (entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animation-item-on");
        } else {
          entry.target.classList.remove("animation-item-on");
        }
      },
      {
        threshold: 1,
      }
    );
  });

  elements.forEach((element) => {
    observer.observe(element);
  });
});


const quoteElements = document.querySelectorAll('.quote-content');

window.addEventListener('wheel', function (event) {
  quoteElements.forEach(function (element) {
    if (element.contains(event.target)) {
      event.preventDefault();
      console.log('scroll');
      element.scrollBy(event.deltaX, event.deltaY);
    }
  });
}, { passive: false });

let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

function handleTouchStart(e) {
  // Lưu lại tọa độ điểm bắt đầu của vuốt
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
  // Lưu lại tọa độ điểm kết thúc của vuốt
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;

  // Kiểm tra sự di chuyển trên trục ngang và trục dọc
  if (Math.abs(touchEndX - touchStartX) > Math.abs(touchEndY - touchStartY)) {
    // Vuốt ngang (chỉ thay đổi quote khi vuốt ngang)
    handleSwipe();
  }
}

function handleSwipe() {
  if (touchEndX < touchStartX) {
    // Vuốt sang trái (next quote)
    currentIndex = (currentIndex + 1) % quotes.length;
    displayQuote(currentIndex);
  }

  if (touchEndX > touchStartX) {
    // Vuốt sang phải (prev quote)
    currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    displayQuote(currentIndex);
  }
}

// Thêm sự kiện touch vào carousel
carousel.addEventListener('touchstart', handleTouchStart);
carousel.addEventListener('touchend', handleTouchEnd);


document.querySelectorAll('.flip-hover').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // X position within the card
    const mouseY = e.clientY - rect.top; // Y position within the card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate the tilt amount based on mouse position
    const tiltX = (mouseY - centerY) / centerY * 15; // Tilt up/down
    const tiltY = (centerX - mouseX) / centerX * 15; // Tilt left/right

    // Apply the tilt effect
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
  });

  // Reset the tilt effect when the mouse leaves the card
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
});



document.addEventListener('DOMContentLoaded', () => {
  const loadingPage = document.getElementById('loading-page');
  const mainContent = document.getElementById('main-content');
  const progressBar = document.querySelector('.progress');
  const progressText = document.querySelector('.progress-text');

  // Get all images in the main content
  const images = mainContent.querySelectorAll('img');
  let imagesLoaded = 0;

  // Update progress bar and percentage
  const updateProgress = () => {
    const progress = (imagesLoaded / images.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
  };

  // Check if all images are loaded
  const checkImagesLoaded = () => {
    imagesLoaded++;
    updateProgress();

    if (imagesLoaded === images.length) {
      // All images are loaded, hide loading page and show main content
      loadingPage.style.display = 'none';
      mainContent.style.display = 'block';

      // Add a small delay to ensure the display transition works
      setTimeout(() => {
        mainContent.classList.add('loaded');
      }, 50);
    }
  };

  // Add load event listeners to all images
  images.forEach(img => {
    if (img.complete) {
      // If the image is already loaded, count it
      checkImagesLoaded();
    } else {
      // Wait for the image to load
      img.addEventListener('load', checkImagesLoaded);
    }
  });

  // If there are no images, immediately show the main content
  if (images.length === 0) {
    loadingPage.style.display = 'none';
    mainContent.style.display = 'block';
    mainContent.classList.add('loaded');
  }
});