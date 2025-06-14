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


displayQuote(currentIndex);


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

  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {

  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;


  if (Math.abs(touchEndX - touchStartX) > Math.abs(touchEndY - touchStartY)) {

    handleSwipe();
  }
}

function handleSwipe() {
  if (touchEndX < touchStartX) {

    currentIndex = (currentIndex + 1) % quotes.length;
    displayQuote(currentIndex);
  }

  if (touchEndX > touchStartX) {

    currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    displayQuote(currentIndex);
  }
}


carousel.addEventListener('touchstart', handleTouchStart);
carousel.addEventListener('touchend', handleTouchEnd);


document.querySelectorAll('.flip-hover').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;


    const tiltX = (mouseY - centerY) / centerY * 15;
    const tiltY = (centerX - mouseX) / centerX * 15;


    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
  });


  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
});



document.addEventListener('DOMContentLoaded', () => {
  const loadingPage = document.getElementById('loading-page');
  const mainContent = document.getElementById('main-content');
  const progressBar = document.querySelector('.progress');
  const progressText = document.querySelector('.progress-text');


  const images = mainContent.querySelectorAll('img');
  let imagesLoaded = 0;


  const updateProgress = () => {
    const progress = (imagesLoaded / images.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
  };


  const checkImagesLoaded = () => {
    imagesLoaded++;
    updateProgress();

    if (imagesLoaded === images.length) {

      loadingPage.style.display = 'none';
      mainContent.style.display = 'block';


      setTimeout(() => {
        mainContent.classList.add('loaded');
      }, 50);
    }
  };


  images.forEach(img => {
    if (img.complete) {

      checkImagesLoaded();
    } else {

      img.addEventListener('load', checkImagesLoaded);
    }
  });


  if (images.length === 0) {
    loadingPage.style.display = 'none';
    mainContent.style.display = 'block';
    mainContent.classList.add('loaded');
  }
});

function flipCard(element, birthday) {
  const isFlipped = element.classList.contains('flipped');

  if (isFlipped) {
    element.classList.remove('flipped');
  } else {
    element.classList.add('flipped');

    const today = new Date();
    const birthdayDate = new Date(birthday);

    if (today.getDate() == birthdayDate.getDate() && today.getMonth() == birthdayDate.getMonth()) {
      createBirthdayEffect(element);
      createBirthdayCelebration(element);
    }
  }
}

function createBirthdayEffect(element) {
  const oldEffect = element.querySelector('.birthday-effect');
  if (oldEffect) oldEffect.remove();

  const effect = document.createElement('div');
  effect.className = 'birthday-effect';

  const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animation = `confetti-fall ${2 + Math.random() * 3}s linear forwards`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confetti.style.width = `${5 + Math.random() * 10}px`;
    confetti.style.height = `${5 + Math.random() * 10}px`;
    effect.appendChild(confetti);
  }

  element.querySelector('.card-back').appendChild(effect);

  setTimeout(() => {
    effect.remove();
  }, 3000);
}

function createBirthdayCelebration(element) {

  const oldEffect = element.querySelector('.birthday-celebration');
  if (oldEffect) oldEffect.remove();


  const celebration = document.createElement('div');
  celebration.className = 'birthday-celebration';
  celebration.style.position = 'absolute';
  celebration.style.width = '100%';
  celebration.style.height = '100%';
  celebration.style.top = '0';
  celebration.style.left = '0';
  celebration.style.pointerEvents = 'none';
  celebration.style.overflow = 'hidden';
  celebration.style.zIndex = '10';


  const birthdayText = document.createElement('div');
  birthdayText.className = 'happy-birthday-text';
  birthdayText.textContent = 'Happy Birthday!';
  celebration.appendChild(birthdayText);


  createBubbles(celebration, 15);


  createConfetti(celebration, 50);


  createExplosions(celebration, 5);


  element.querySelector('.card-back').appendChild(celebration);


  setTimeout(() => {
    celebration.remove();
  }, 3000);
}

function createBubbles(container, count) {
  const colors = ['rgba(255,255,255,0.6)', 'rgba(255,215,0,0.6)', 'rgba(255,105,180,0.6)', 'rgba(173,216,230,0.6)'];

  for (let i = 0; i < count; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';


    const size = 10 + Math.random() * 30;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;


    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.bottom = '0';


    bubble.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];


    bubble.style.animationDuration = `${2 + Math.random() * 2}s`;
    bubble.style.animationDelay = `${Math.random() * 0.5}s`;

    container.appendChild(bubble);
  }
}

function createConfetti(container, count) {
  const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = `${Math.random() * 100}%`;
    confetti.style.animation = `confetti-fall ${2 + Math.random() * 3}s linear forwards`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confetti.style.width = `${5 + Math.random() * 10}px`;
    confetti.style.height = `${5 + Math.random() * 10}px`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    container.appendChild(confetti);
  }
}

function createExplosions(container, count) {
  for (let i = 0; i < count; i++) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';


    explosion.style.left = `${10 + Math.random() * 80}%`;
    explosion.style.top = `${10 + Math.random() * 80}%`;


    const size = 5 + Math.random() * 15;
    explosion.style.width = `${size}px`;
    explosion.style.height = `${size}px`;


    explosion.style.animationDelay = `${Math.random() * 1.5}s`;

    container.appendChild(explosion);
  }
}