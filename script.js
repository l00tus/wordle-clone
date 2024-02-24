const letters = document.querySelectorAll(".letter");
let currentLetter = 0;
let currentRow = 0;

document.addEventListener("keydown", function(event) {
    if (isLetter(event.key)) {
        if(currentLetter < (currentRow + 1) * 5) {
            letters[currentLetter++].textContent = event.key.toUpperCase();
        }
    } else if(event.key === "Backspace") {
        if(currentLetter !== currentRow * 5) {
            letters[--currentLetter].textContent = "";
        }
    } else if(event.key === "Enter") {
        if(currentLetter === ((currentRow * 5) + 5)) {
            checkIfValid();
            currentRow++;
            currentLetter = currentRow * 5;
        }
    }

});

const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const VALID_URL = "https://words.dev-apis.com/validate-word";

async function getWord() {
    const response = await fetch(WORD_URL);
    const data = await response.json();
    return data.word;
}

async function validateWord(word) {
    const response = await fetch(VALID_URL, {
        method: "POST",
        body: JSON.stringify({"word": word}),
    });
    const data = await response.json();
    return data.validWord;
}

function checkIfValid() {
    let word = "";
    for(let i = currentRow * 5; i < currentLetter; i++) {
        word += letters[i].textContent;
    }

    validateWord(word).then(function(data) {
        if(data) {
            checkIfCorrect(word);
            
            alert("Valid word!");
        } else {
            currentRow--;
            for(let i = currentRow * 5; i < currentLetter; i++) {
                letters[i].textContent = "";
            }
            currentLetter = currentRow * 5;

            alert("Invalid word!");
        }
    });
}

function checkIfCorrect(word) {
    getWord().then(function(data) {
        if(word.toLowerCase() === data) {
            alert("Correct!");
        } else if(currentLetter === 30) {
            alert("Incorrect!" + " The word was " + data.toUpperCase() + ".");
        } else {
            alert("Incorrect!");
        }
    });
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}