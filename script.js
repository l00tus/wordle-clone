const letters = document.querySelectorAll(".letter");
let currentLetter = 0;
let currentRow = 0;

document.addEventListener("keydown", function(event) {
    console.log(event.key);
    if (isLetter(event.key)) {
        if(currentLetter < (currentRow + 1) * 5) {
            letters[currentLetter++].textContent = event.key.toUpperCase();
        }
    } else if(event.key === "Backspace") {
        if(currentLetter !== currentRow * 5) {
            letters[--currentLetter].textContent = "";
        }
    } else if(event.key === "Enter") {
        currentRow++;
        currentLetter = currentRow * 5;
    }

});

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}