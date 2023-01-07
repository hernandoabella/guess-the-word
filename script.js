const palabrasPosibles = [
  "TIEMPO", 
  "CAFE", 
  "COMER",
  "DESAYUNO",
  "CENA",
  "ESPACIO"
];

let letrasAdivinadas = [];
let palabraAdivinada = [];
let usedGuessingwWords = [];
var wordToMatch;
var numGuess;
let victorias = 0;
var pausa = false; // This var and setTimout function to not listen for keypress while game resets
var loseSound = new Audio("./assets/sounds/ahahah.mp3");
var winSound = new Audio("./assets/sounds/clever.wav");
var championSound = new Audio("./assets/sounds/crazysob.mp3");

// Iniciar juego
function iniciarJuego() {

  // Obtener una nueva palabra
  wordToMatch = palabrasPosibles[Math.floor(Math.random() * palabrasPosibles.length)].toUpperCase();
  // Set number of guesses (higher or lower) based on word length
  if (wordToMatch.length <= 4) {
    numGuess = 4
  } else if (wordToMatch.length >4 && wordToMatch.length <= 7) {
    numGuess = Math.floor(wordToMatch.length * .67)
  } else if (wordToMatch.length >7 && wordToMatch.length <= 10) {
    numGuess = Math.floor(wordToMatch.length * .5)
  } else if (wordToMatch.length >10 && wordToMatch.length <= 14) {
    numGuess = Math.floor(wordToMatch.length * .52)
  } else if (wordToMatch.length >14) {
    numGuess = 7;
  }

  // Get underscores for guessingWord from wordToMatch
  for (var i=0; i < wordToMatch.length; i++){
    // Put a space instead of an underscore between multi-word options in possibleWords array
    if (wordToMatch[i] === " ") {
      palabraAdivinada.push(" ")
    } 
    else {
      palabraAdivinada.push("_");
    }
  }
  updateDisplay();
};

//Reset the game
function resetGame() {
  if (usedGuessingwWords.length === palabrasPosibles.length) {
    championSound.play() // Toggle line comment on for almost the entire possibleWords array to hear this end of game sound clip
    usedGuessingwWords = []
    victorias = 0
    setTimeout(resetGame, 6000); // Note for future change - shorten possibleWords, make jumbotron display congratulatory message upon guessing all possibilites
  }
  else {
    pausa = false;
    // Restores blinking "...get started" message
    document.getElementById('bienvenida').className = 'blink';
    
    // Get a new word
    wordToMatch = palabrasPosibles[Math.floor(Math.random() * palabrasPosibles.length)].toUpperCase();
    console.log(wordToMatch)
    // If new word has already been used randomly select another
    if (usedGuessingwWords.includes(wordToMatch) === true) {
      resetGame();
    }
    
    // Set number of guesses (higher or lower) based on word length
    if (wordToMatch.length <= 4) {
      numGuess = 4
    } else if (wordToMatch.length >4 && wordToMatch.length <= 7) {
      numGuess = Math.floor(wordToMatch.length * .67)
    } else if (wordToMatch.length >7 && wordToMatch.length <= 10) {
      numGuess = Math.floor(wordToMatch.length * .5)
    } else if (wordToMatch.length >10 && wordToMatch.length <= 14) {
      numGuess = Math.floor(wordToMatch.length * .52)
    } else if (wordToMatch.length >14) {
      numGuess = 7;
    }

    // Reset word arrays
    letrasAdivinadas = [];
    palabraAdivinada = [];

    // Reset the guessed word
    for (var i=0; i < wordToMatch.length; i++){
      // Put a space instead of an underscore between multi-word options in possibleWords array
      if (wordToMatch[i] === " ") {
        palabraAdivinada.push(" ")
      } 
      else {
        palabraAdivinada.push("_");
      }
    }
    updateDisplay();
  }
};

// Actualiza la pantalla
function updateDisplay () {
  document.getElementById("victoriasTotales").innerText = victorias;
  document.getElementById("palabraActual").innerText = palabraAdivinada.join("");
  document.getElementById("remainingGuesses").innerText = numGuess;
  document.getElementById("letrasAdivinadas").innerText =  letrasAdivinadas.join(" ");
};

// Wait for key press
document.onkeydown = function(event) {
  // Make sure key pressed is an alpha character
  if (isLetter(event.key) && pausa === false) {
  checkForLetter(event.key.toUpperCase());
  }
  // Turn off blinking "...get started" message on keypress
  document.getElementById('bienvenida').className = 'noBlink';
};

// Compruebe si la tecla presionada está entre A-Z o a-z
var isLetter = function(ch){
  return typeof ch === "string" && ch.length === 1
  && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
};

// Comprobar si la letra está en word
function checkForLetter(letter) {
  var foundLetter = false;

  // Buscar string por letra
  for (var i=0; i < wordToMatch.length; i++) {
    if (letter === wordToMatch[i]) {
      palabraAdivinada[i] = letter
      foundLetter = true
      // Si la palabra adivinada coincide con la palabra aleatoria
      if (palabraAdivinada.join("") === wordToMatch) {
        // Incrementa el número de victorias y agregue la palabra a usedGuessingWords
        victorias++
        // Agregar palabra al array usedGuessingWords para que no se repita
        usedGuessingwWords.push(wordToMatch)
        console.log(usedGuessingwWords)
        pausa = true;
        winSound.play();
        updateDisplay();
        setTimeout(resetGame, 4000);
      }
    }
  }
  if (foundLetter === false) {
    // Compruebe si la suposición incorrecta ya está en la lista
    if (letrasAdivinadas.includes(letter) === false) {
      // Agregar letra incorrecta a la lista de letras adivinadas
      letrasAdivinadas.push(letter)
      // Disminuir el número de suposiciones restantes
      numGuess--
    }
    if (numGuess === 0) {
      // Agregar palabra al array usedGuessingWords para que no se repita
      usedGuessingwWords.push(wordToMatch);
      console.log(usedGuessingwWords)
      // Mostrar palabra antes de reiniciar el juego
      palabraAdivinada = wordToMatch.split();
      pausa = true;
      loseSound.play();
      setTimeout(resetGame, 4000);
    }
  }
  updateDisplay();
};

iniciarJuego();
