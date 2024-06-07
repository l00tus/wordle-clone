const letters = document.querySelectorAll(".letter");
const resultBox = document.querySelector(".result");
const informationBox = document.querySelector(".info");
const invalidMessage = document.createElement("p");
invalidMessage.textContent = "Invalid word! 🚫";
const resultMessage = document.createElement("p");
let currentLetter = 0;
let currentRow = 0;
let loading = false;
setSpinner(loading);

document.addEventListener("keydown", function (event) {
  if (isLetter(event.key)) {
    if (currentLetter < (currentRow + 1) * 5) {
      letters[currentLetter++].textContent = event.key.toUpperCase();
      letters[currentLetter - 1].classList.add("highlight");
    }
  } else if (event.key === "Backspace") {
    if (currentLetter !== currentRow * 5) {
      letters[--currentLetter].textContent = "";
      letters[currentLetter].classList.remove("highlight");
    }
  } else if (event.key === "Enter") {
    if (currentLetter === currentRow * 5 + 5) {
      checkIfValid();
      currentRow++;
      currentLetter = currentRow * 5;
    }
  }
});

const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const VALID_URL = "https://words.dev-apis.com/validate-word";

async function getWord() {
  loading = true;
  setSpinner(loading);

  const response = await fetch(WORD_URL);
  const data = await response.json();

  loading = false;
  setSpinner(loading);
  
  return data.word;
}

async function validateWord(word) {
  loading = true;
  setSpinner(loading);

  const response = await fetch(VALID_URL, {
    method: "POST",
    body: JSON.stringify({ word: word }),
  });
  const data = await response.json();

  loading = false;
  setSpinner(loading);

  return data.validWord;
}

function checkIfValid() {
  let word = "";
  for (let i = currentRow * 5; i < currentLetter; i++) {
    word += letters[i].textContent;
  }

  validateWord(word).then(function (data) {
    if (data) {
      checkIfCorrect(word);
    } else {
      currentRow--;

      informationBox.appendChild(invalidMessage);

      for(let i = currentRow * 5; i < currentLetter; i++) {
        letters[i].classList.add("invalid");
      }

      setTimeout(function() {
        for (let i = currentRow * 5; i < currentLetter; i++) {
          letters[i].textContent = "";
          letters[i].classList.remove("invalid");
        }
        informationBox.removeChild(invalidMessage);
        currentLetter = currentRow * 5;
      }, 750);
    }
  });
}

function checkIfCorrect(word) {
  getWord().then(function (data) {
    if (word.toLowerCase() === data) {
      for (let i = (currentRow - 1) * 5; i < currentRow * 5; i++) {
        paintGreen(i);
      }
      resultMessage.textContent = "Congratulations! You guessed the word!🎉";
      resultBox.appendChild(resultMessage);
    } else {
      const letterMap = new Map();
      for (let i = 0; i < data.length; i++) {
        if (letterMap.has(data[i])) {
          letterMap.set(data[i], letterMap.get(data[i]) + 1);
        } else {
          letterMap.set(data[i], 1);
        }
      }

      for (let i = 0; i < word.length; i++) {
        if (word[i].toLowerCase() === data[i]) {
          paintGreen(currentRow * 5 - (word.length - i));
          letterMap.set(
            word[i].toLowerCase(),
            letterMap.get(word[i].toLowerCase()) - 1
          );
        } else if (!isLetterInWord(word[i].toLowerCase(), data)) {
          paintGray(currentRow * 5 - (word.length - i));
        } else {
          if (letterMap.get(word[i].toLowerCase()) > 0) {
            paintYellow(currentRow * 5 - (word.length - i));
            letterMap.set(
              word[i].toLowerCase(),
              letterMap.get(word[i].toLowerCase()) - 1
            );
          } else {
            paintGray(currentRow * 5 - (word.length - i));
          }
        }
      }
      if (currentLetter === 30) {
        resultMessage.textContent = "Too bad! The word was " + data.toUpperCase() + ". 😔";
        resultBox.appendChild(resultMessage);
      }
    }
  });
}

function paintGreen(letter) {
  letters[letter].classList.add("correct");
}

function paintGray(letter) {
  letters[letter].classList.add("incorrect");
}

function paintYellow(letter) {
  letters[letter].classList.add("partially-correct");
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function isLetterInWord(letter, word) {
  return word.includes(letter);
}

function setSpinner(loading) {
  const spinner = document.querySelector(".loading-spinner");
  if (loading) {
    spinner.style.display = "block";
  } else {
    spinner.style.display = "none";
  }
}