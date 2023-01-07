function modoOscuro() {
  
  document.getElementsByClassName('container')[0].classList.toggle('modo-oscuro');
  document.getElementsByClassName('dark-mode-btn')[0].classList.toggle('modo-oscuro1');
  document.querySelector('h1').classList.toggle('modo-oscuro');
  document.getElementsByClassName('hamburger')[0].classList.toggle('modo-oscuro');
  document.getElementsByClassName('active')[0].classList.toggle('modo-oscuro');
  document.getElementById('palabraActual').classList.toggle('modo-oscuro');
  for(let i = 0; i < 3; i++) {
    document.getElementsByClassName('varColor')[i].classList.toggle('modo-oscuro');
  }
}

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
let palabrasAdivinadasUsadas = [];
let palabraParaEmparejar;
let numeroDeAciertos;
let victorias = 0;
let pausa = false; // This var and setTimout function to not listen for keypress while game resets
let loseSound = new Audio("./assets/sounds/ahahah.mp3");
let winSound = new Audio("./assets/sounds/clever.wav");
let championSound = new Audio("./assets/sounds/crazysob.mp3");

// Iniciar juego
function iniciarJuego() {
  // Obtener una nueva palabra
  palabraParaEmparejar = palabrasPosibles[Math.floor(Math.random() * palabrasPosibles.length)].toUpperCase();
  // Set number of guesses (higher or lower) based on word length
  if (palabraParaEmparejar.length <= 4) {
    numeroDeAciertos = 4
  } else if (palabraParaEmparejar.length > 4 && palabraParaEmparejar.length <= 7) {
    numeroDeAciertos = Math.floor(palabraParaEmparejar.length * .67)
  } else if (palabraParaEmparejar.length > 7 && palabraParaEmparejar.length <= 10) {
    numeroDeAciertos = Math.floor(palabraParaEmparejar.length * .5)
  } else if (palabraParaEmparejar.length > 10 && palabraParaEmparejar.length <= 14) {
    numeroDeAciertos = Math.floor(palabraParaEmparejar.length * .52)
  } else if (palabraParaEmparejar.length > 14) {
    numeroDeAciertos = 7;
  }

  // Get underscores for guessingWord from wordToMatch
  for (let i = 0; i < palabraParaEmparejar.length; i++){
    // Put a space instead of an underscore between multi-word options in possibleWords array
    if (palabraParaEmparejar[i] === " ") {
      palabraAdivinada.push(" ")
    } 
    else {
      palabraAdivinada.push("_");
    }
  }

  actualizarPantalla();
};

// Reiniciar el juego
function reiniciarJuego() {
  if (palabrasAdivinadasUsadas.length === palabrasPosibles.length) {
    championSound.play() // Toggle line comment on for almost the entire possibleWords array to hear this end of game sound clip
    palabrasAdivinadasUsadas = []
    victorias = 0
    setTimeout(reiniciarJuego, 6000); // Nota para futuros cambios - shorten possibleWords, make jumbotron display congratulatory message upon guessing all possibilites
  }
  else {
    pausa = false;
    // Restores blinking "...get started" message
    document.getElementById('bienvenida').className = 'blink';
    
    // Obtener una nueva palabra
    palabraParaEmparejar = palabrasPosibles[Math.floor(Math.random() * palabrasPosibles.length)].toUpperCase();
    console.log(palabraParaEmparejar)
    // If new word has already been used randomly select another
    if (palabrasAdivinadasUsadas.includes(palabraParaEmparejar) === true) {
      reiniciarJuego();
    }
    
    // Set number of guesses (higher or lower) based on word length
    if (palabraParaEmparejar.length <= 4) {
      numeroDeAciertos = 4
    } else if (palabraParaEmparejar.length > 4 && palabraParaEmparejar.length <= 7) {
      numeroDeAciertos = Math.floor(palabraParaEmparejar.length * .67)
    } else if (palabraParaEmparejar.length > 7 && palabraParaEmparejar.length <= 10) {
      numeroDeAciertos = Math.floor(palabraParaEmparejar.length * .5)
    } else if (palabraParaEmparejar.length > 10 && palabraParaEmparejar.length <= 14) {
      numeroDeAciertos = Math.floor(palabraParaEmparejar.length * .52)
    } else if (palabraParaEmparejar.length > 14) {
      numeroDeAciertos = 7;
    }

    // Reset word arrays
    letrasAdivinadas = [];
    palabraAdivinada = [];

    // Reset the guessed word
    for (let i = 0; i < palabraParaEmparejar.length; i++){
      // Put a space instead of an underscore between multi-word options in possibleWords array
      if (palabraParaEmparejar[i] === " ") {
        palabraAdivinada.push(" ")
      } 
      else {
        palabraAdivinada.push("_");
      }
    }
    actualizarPantalla();
  }
};

// Actualiza la pantalla
function actualizarPantalla () {
  document.getElementById("victoriasTotales").innerText = victorias;
  document.getElementById("palabraActual").innerText = palabraAdivinada.join("");
  document.getElementById("remainingGuesses").innerText = numeroDeAciertos;
  document.getElementById("letrasAdivinadas").innerText =  letrasAdivinadas.join(" ");
};

// Wait for key press
document.onkeydown = function(event) {
  // Make sure key pressed is an alpha character
  if (esLetra(event.key) && pausa === false) {
  checkForLetter(event.key.toUpperCase());
  }
  // Turn off blinking "...get started" message on keypress
  document.getElementById('bienvenida').className = 'noBlink';
};

// Compruebe si la tecla presionada está entre A-Z o a-z
let esLetra = function(ch){
  return typeof ch === "string" && ch.length === 1
  && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
};

// Comprobar si la letra está en word
function checkForLetter(letter) {
  let letraEncontrada = false;

  // Buscar string por letra
  for (let i = 0; i < palabraParaEmparejar.length; i++) {
    if (letter === palabraParaEmparejar[i]) {
      palabraAdivinada[i] = letter
      letraEncontrada = true
      // Si la palabra adivinada coincide con la palabra aleatoria
      if (palabraAdivinada.join("") === palabraParaEmparejar) {
        // Incrementa el número de victorias y agregue la palabra a usedGuessingWords
        victorias++
        // Agregar palabra al array usedGuessingWords para que no se repita
        palabrasAdivinadasUsadas.push(palabraParaEmparejar)
        console.log(palabrasAdivinadasUsadas)
        pausa = true;
        winSound.play();
        actualizarPantalla();
        setTimeout(reiniciarJuego, 4000);
      }
    }
  }
  if (letraEncontrada === false) {
    // Compruebe si la suposición incorrecta ya está en la lista
    if (letrasAdivinadas.includes(letter) === false) {
      // Agregar letra incorrecta a la lista de letras adivinadas
      letrasAdivinadas.push(letter)
      // Disminuir el número de suposiciones restantes
      numeroDeAciertos--
    }
    if (numeroDeAciertos === 0) {
      // Agregar palabra al array usedGuessingWords para que no se repita
      palabrasAdivinadasUsadas.push(palabraParaEmparejar);
      console.log(palabrasAdivinadasUsadas)
      // Mostrar palabra antes de reiniciar el juego
      palabraAdivinada = palabraParaEmparejar.split();
      pausa = true;
      loseSound.play();
      setTimeout(reiniciarJuego, 4000);
    }
  }

  actualizarPantalla();
};

iniciarJuego();
