var lifes;

//Colección de películas y pistas.
var filmsObject = {
    titanic : {
        hints: ["Barco","Iceberg","Amor","Collar","Leonardo Dicaprio","Basada en hechos reales","Primera letra: T","Rose","Kate Winslet","Estreno: 1997"],
    },
    pinocho : {
        hints : ["Cuento infantil","Mentiras","Nariz","Muñeco de madera","Geppetto","Disney","Grillo","Ballena","Dibujos animados","Hada azul"]
    },
    mulan : {
        hints : ["China","Disney", "Dragón", "Estreno: 1998", "Película infantil", "Ejército de los Hunos"],
        
    },
    spiderman : {
        hints : ["Araña","Superhéroe","Marvel","Disfraz","Tío Ben","Tom Holland","Multiverso","Estreno: 2002","Comics","Stan Lee"]
        
    }
};

//Guardamos el valor de la pelicula random en una variable para que siempre sea la misma
var film,cron;
var time = 180;


//Comienza el juego
startGame();    
function restartStateObj(){
    var stateObj={
        lifes: 10,
        time: 180,
        film: film,
        letters: []
             //indexOf para saber la pos de la letra
        ,
        
    };
}
function startGame(){
    //Reestablecemos los valores del localStorage
    
    //Cargamos la película a adivinar
    film = chooseFilm();
   
    this.lifes = 10; 
    //Evento que muestra la pista cuando hacemos click
    document.getElementById("hintButton").addEventListener("click", function(){
        chooseHint(film);
    });
    document.getElementById("playAgainButton").addEventListener("click", function(){
        restartGame();
    });

    document.getElementById("pauseButton").addEventListener("click", function(){
        console.log("pausa!");
        if(document.getElementById("pauseButton").innerHTML==="Pause"){
            document.getElementById("pauseButton").innerHTML="Play";
            saveData();
        }else{
            document.getElementById("pauseButton").innerHTML="Pause";
            loadData();
        }        
        
        
    });
   
    numberOfTiles(film);
    displayKeyboard();
    stopTimer();
    setTimer();
    //canvas();
    printLifes(lifes);
    
}
function loadData(){
    var letters_container = document.getElementsByClassName("letter");
    var array_letters=stateObj.letters;
    for(var i = 0; i<letters_container.length; i++){
        var letter = array_letters.pop();
        if(letters_container[i]===letter){
            letters_container[i].classList.remove("unrevealed");
            letters_container[i].classList.add("revealed");
        }else{
            continue;
        }
    }
}

function saveData(){
    //Vidas
    stateObj.lifes = lifes;
    clearInterval(cron);
    //Tiempo
    stateObj.time=document.getElementById("seconds").innerHTML;
    //Pelicula
    stateObj.film = film;
    //Letras

}
function restartGame(){
    this.time=180;
    var letters_container = document.getElementById("letters");
        while(letters_container.firstChild){
            letters_container.removeChild(letters_container.firstChild);
        }
    restartStateObj();
    this.lifes=10;
    printLifes(lifes);
    console.log(letters_container);
    keyboardOn();
    film = chooseFilm();    
    numberOfTiles(film);
    stopTimer();
    setTimer();
    //canvas();
    var div = document.getElementById("showHint");
    div.innerHTML = "";
   
}

//Aqui imprimimos tantos elementos como letras
function numberOfTiles(film){
    tiles = document.getElementById("letters");
    for (let i = 0; i < film.length; i++) {
        tiles.innerHTML += ("<div class='letter unrevealed' id= 'div-"+i+"' >"+ film[i]+"</div>");
    }
}

function setTimer() {
     cron = setInterval(function(){
        time --;
        document.getElementById("seconds").innerHTML=time;
        if (time == 0){   
            document.getElementById("seconds").innerHTML="";
            clearInterval(cron);
            gameOver();
        }
    },1000);
}
function stopTimer(){
    clearInterval(cron);
}
function gameOver(){
    console.log("Perdiste wei");
    var result = document.getElementById("resultGame");
    result.innerHTML ="YOU LOSE!!<br/> Try Again";
    result.classList.add("gameOver");
    result.style.zIndex =1;
    var keybLetters = document.getElementsByClassName("key");
    for (let i = 0; i < keybLetters.length; i++) {
            keybLetters[i].disabled = true;
        };
    var hintButton = document.getElementById("hintButton");
    hintButton.disabled = true;
}
function printLifes(lifes){
    var div_lifes = document.getElementById("div_lifes");
    div_lifes.innerHTML = "Lifes: " + lifes;
}

function chooseFilm(){
    var filmLength = Object.keys(filmsObject).length;
    var filmSelected = Object.keys(filmsObject)[Math.floor(Math.random() * filmLength)];
    console.log(filmSelected)
    return filmSelected;
}

function chooseHint(film){
    var hintList = filmsObject[film].hints;
    var hint = hintList.pop();
    showHint(hint);
    lifes = loseLife(lifes);
}

function showHint(hint){
    var div = document.getElementById("showHint");
    div.innerHTML = /*"HINT: " +*/ (hint);
}

function displayKeyboard() {
    var keybLetters = document.getElementsByClassName("key");
    for (let i = 0; i < keybLetters.length; i++) {
        keybLetters[i].addEventListener("click",function(){
            keybLetters[i].disabled=true;
            compareLetter(keybLetters[i].innerHTML);
        });
    };
}
function keyboardOn() {
    var keybLetters = document.getElementsByClassName("key");
        for (let i = 0; i < keybLetters.length; i++) {
          
    
  keybLetters[i].disabled=false;        
        };
    var hintButton = document.getElementById("hintButton");
    hintButton.disabled = false;
}

var countAciertos = 0;
function compareLetter(letter){
    var letters_container = document.getElementsByClassName("letter");
        if(film.includes(letter.toLowerCase())){
            for (let j = 0; j < letters_container.length; j++) {
               if(letters_container[j].innerHTML == letter.toLowerCase()){
                    letters_container[j].classList.remove("unrevealed");
                    letters_container[j].classList.add("revealed");
                    //Guardar en el objeto letter las letras que coincidan.
                    stateObj.letters.push(letters_container[j].innerHTML);
                    console.log("GUARDANDO.. "+ letters_container[j].innerHTML);
                    console.log("SE HA GUARDADO.. "+ stateObj.letters);
                    //Guardamos simplemente las letras y con indexof cogemos la posicion de la letras guardadas e imprimimos estas
                    countAciertos += 1;
               }
               if (countAciertos == film.length) {
                   victory();
               }
            }
         }else{
        lifes = loseLife(lifes);
        console.log(lifes);
        }    
}

function loseLife(lifes){
    lifes -= 1;
    printLifes(lifes);
    if (lifes === 0){
        console.log("Entra anda");
        gameOver();
    }
    return lifes;    
}

function victory(){
    var result = document.getElementById("resultGame");
    result.innerHTML="YOU WIN!!";
    result.classList.add("winner");
    clearInterval(cron);
    this.countAciertos=0;
}

//Dibujando el muñeco
/*
    var animate = function () {
        var drawMe = lifes ;
        drawArray[drawMe]();
      }
    
     // Hangman
  var canvas = function(){

    myStickman = document.getElementById("stickman");
    context = myStickman.getContext('2d');
    context.beginPath();
    context.strokeStyle = "#fff";
    context.lineWidth = 2;
  };
  
    head = function(){
      myStickman = document.getElementById("stickman");
      context = myStickman.getContext('2d');
      context.beginPath();
      context.arc(60, 25, 10, 0, Math.PI*2, true);
      context.stroke();
    }
    
  draw = function($pathFromx, $pathFromy, $pathTox, $pathToy) {
    
    context.moveTo($pathFromx, $pathFromy);
    context.lineTo($pathTox, $pathToy);
    context.stroke(); 
}

   frame1 = function() {
     draw (0, 150, 150, 150);
   };
   
   frame2 = function() {
     draw (10, 0, 10, 600);
   };
  
   frame3 = function() {
     draw (0, 5, 70, 5);
   };
  
   frame4 = function() {
     draw (60, 5, 60, 15);
   };
  
   torso = function() {
     draw (60, 36, 60, 70);
   };
  
   rightArm = function() {
     draw (60, 46, 100, 50);
   };
  
   leftArm = function() {
     draw (60, 46, 20, 50);
   };
  
   rightLeg = function() {
     draw (60, 70, 100, 100);
   };
  
   leftLeg = function() {
     draw (60, 70, 20, 100);
   };
  
  drawArray = [rightLeg, leftLeg, rightArm, leftArm,  torso,  head, frame4, frame3, frame2, frame1];*/
