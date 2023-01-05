var possibleWords = [
  "GRAND CANYON", 
  "ROCKY MOUNTAIN", 
  "ZION"
];

var guessedLetters = [];
var guessingWord = [];
var usedGuessingwWords = [];
var wordToMatch;
var numGuess;
var wins = 0;
var pause = false; // This var and setTimout function to not listen for keypress while game resets
var loseSound = new Audio("./assets/sounds/ahahah.mp3");
var winSound = new Audio("./assets/sounds/clever.wav");
var championSound = new Audio("./assets/sounds/crazysob.mp3");

// Iniciar juego
function iniciarJuego() {

  // Obtener una nueva palabra
  wordToMatch = possibleWords[Math.floor(Math.random() * possibleWords.length)].toUpperCase();
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
      guessingWord.push(" ")
    } 
    else {
      guessingWord.push("_");
    }
  }
  updateDisplay();
};

//Reset the game
function resetGame() {
  if (usedGuessingwWords.length === possibleWords.length) {
    championSound.play() // Toggle line comment on for almost the entire possibleWords array to hear this end of game sound clip
    usedGuessingwWords = []
    wins = 0
    setTimeout(resetGame, 6000); // Note for future change - shorten possibleWords, make jumbotron display congratulatory message upon guessing all possibilites
  }
  else {
    pause = false;
    // Restores blinking "...get started" message
    document.getElementById('bienvenida').className = 'blink';
    
    // Get a new word
    wordToMatch = possibleWords[Math.floor(Math.random() * possibleWords.length)].toUpperCase();
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
    guessedLetters = [];
    guessingWord = [];

    // Reset the guessed word
    for (var i=0; i < wordToMatch.length; i++){
      // Coloque un espacio en lugar de un guión bajo entre las opciones de varias palabras en la matriz de possibleWords
      if (wordToMatch[i] === " ") {
        guessingWord.push(" ")
      } 
      else {
        guessingWord.push("_");
      }
    }
    updateDisplay();
  }
};

// Actualizar la pantalla
function updateDisplay () {
  document.getElementById("totalWins").innerText = wins;
  document.getElementById("palabraActual").innerText = guessingWord.join("");
  document.getElementById("remainingGuesses").innerText = numGuess;
  document.getElementById("guessedLetters").innerText =  guessedLetters.join(" ");
};

// Espera a que se presione la tecla
document.onkeydown = function(event) {
  // Asegúrese de que la tecla presionada sea un carácter alfabético
  if (isLetter(event.key) && pause === false) {
  checkForLetter(event.key.toUpperCase());
  }
  // Desactivar el mensaje parpadeante "...comenzar" al presionar una tecla
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
      guessingWord[i] = letter
      foundLetter = true
      // Si la palabra adivinada coincide con la palabra aleatoria
      if (guessingWord.join("") === wordToMatch) {
        // Incrementa el número de victorias y agregue la palabra a usedGuessingWords
        wins++
        // Agregar palabra al array usedGuessingWords para que no se repita
        usedGuessingwWords.push(wordToMatch)
        console.log(usedGuessingwWords)
        pause = true;
        winSound.play();
        updateDisplay();
        setTimeout(resetGame, 4000);
      }
    }
  }
  if (foundLetter === false) {
    // Compruebe si la suposición incorrecta ya está en la lista
    if (guessedLetters.includes(letter) === false) {
      // Agregar letra incorrecta a la lista de letras adivinadas
      guessedLetters.push(letter)
      // Disminuir el número de suposiciones restantes
      numGuess--
    }
    if (numGuess === 0) {
      // Agregar palabra al array usedGuessingWords para que no se repita
      usedGuessingwWords.push(wordToMatch);
      console.log(usedGuessingwWords)
      // Mostrar palabra antes de reiniciar el juego
      guessingWord = wordToMatch.split();
      pause = true;
      loseSound.play();
      setTimeout(resetGame, 4000);
    }
  }
  updateDisplay();
};

iniciarJuego();
