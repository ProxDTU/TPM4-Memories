const targetText = " Thanks\nEveryone!";
const text_container = document.getElementById("animatedText");
const charactersPerBatch = 4;

const characterSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

function getRandomChar(targetChar) {
    let charSet;
    if (targetChar >= 'A' && targetChar <= 'Z') {
        charSet = characterSets.uppercase;
    } else if (targetChar >= 'a' && targetChar <= 'z') {
        charSet = characterSets.lowercase;
    } else if (targetChar >= '0' && targetChar <= '9') {
        charSet = characterSets.numbers;
    } else if (targetChar === ' ' || targetChar === '\n') {
        return targetChar;
    } else {
        charSet = characterSets.symbols;
    }

    let randomChar;
    do {
        randomChar = charSet[Math.floor(Math.random() * charSet.length)];
    } while (randomChar === targetChar);

    return randomChar;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createRandomFillEffect(text, interval = 50, batchDelay = 400) {
    const lines = text.split('\n');
    const spans = [];
    let globalIndex = 0;

    lines.forEach(line => {
        const lineDiv = document.createElement('div');
        lineDiv.classList.add('line');
        text_container.appendChild(lineDiv);

        line.split('').forEach(char => {
            const span = document.createElement("span");
            char === ' ' 
                ? span.classList.add("char-space") 
                : characterSets.uppercase.includes(char) 
                ? span.classList.add("char-upper") 
                : span.classList.add("char");
            span.textContent = char === " " ? " " : getRandomChar(char);
            lineDiv.appendChild(span);
            spans.push({
                span,
                char,
                iterations: Math.floor(Math.random() * 3) + 3
            });
            globalIndex++;
        });
    });

    const revealOrder = spans.map((_, index) => index);
    shuffleArray(revealOrder);

    const batches = [];
    for (let i = 0; i < revealOrder.length; i += charactersPerBatch) {
        batches.push(revealOrder.slice(i, i + charactersPerBatch));
    }

    const intervalId = setInterval(() => {
        spans.forEach(data => {
            if (!data.span.classList.contains("visible") && data.char !== " ") {
                if (data.iterations > 0) {
                    data.span.textContent = getRandomChar(data.char);
                    data.iterations--;
                }
            }
        });
    }, interval);

    batches.forEach((batch, batchIndex) => {
        setTimeout(() => {
            batch.forEach(index => {
                const { span, char } = spans[index];
                if (char !== " ") {
                    span.textContent = char;
                }
                span.classList.add("visible");
            });

            if (batchIndex === batches.length - 1) {
                clearInterval(intervalId);
            }
        }, batchIndex * batchDelay);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          createRandomFillEffect(targetText, 80, 400);
        } else {
          animationStarted = false;
          if (text_container) {
            text_container.innerHTML = '';
          }
        }
      });
    }, {
      threshold: 1.0,
    });

    // Ensure container exists before observing
    if (text_container) {
      observer.observe(text_container);
    }
  });