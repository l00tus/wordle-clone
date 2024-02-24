const letters = document.querySelectorAll(".letter");
let currentLetter = 0;

document.addEventListener("keydown", function(event) {
    console.log(event.key);
    if (isLetter(event.key)) {
        letters[currentLetter++].textContent = event.key.toUpperCase();
    } else if(event.key === "Backspace") {
        if(currentLetter !== 0) {
            letters[--currentLetter].textContent = "";
        }
    }

});

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}