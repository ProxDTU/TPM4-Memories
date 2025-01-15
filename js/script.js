const apiKey = decrypt(env.key, 'proxneverdie');
const spreadsheetId = env.sheet_id;

console.log(apiKey, spreadsheetId)
const sheetName = "Quote";
let quotes = [];
let container = document.querySelector("ul.comments-right");

fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data.values);
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