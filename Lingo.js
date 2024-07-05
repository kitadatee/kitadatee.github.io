var input = document.getElementById('guess'); // the input box
var button = document.getElementById('button'); // the button
var sound = document.getElementById("background_music");
var correctSound = document.getElementById('correct');
var wrongSound = document.getElementById('wrong');
var inputStore = document.getElementById('wordInput');
var img = document.getElementById('faceExpression');

var unmute = "fa-solid fa-volume-high",
    mute = "fa-solid fa-volume-xmark";
var valueRow = 1;//Current word index
var isPlaying = 0;//Music status
var isSFXPlaying = 1;
var guessTime = 0;//Attemp times
var wordStore = [];
var firstPosWord = 20;
var guessCorrect = false;
var gameReady = false;
var waiting = false;
var guess;

var rowIndicate = 'row';
var keyWord = [];

var colorCode = ['rgb(41, 128, 185)', 
                 '#EC7063', 
                 'rgb(230, 126, 34)', 
                 'rgb(52, 73, 94 )',
                 '#5B2C6F',
                 '#A569BD',
                 'rgb(244, 208, 63)',
                 'rgb(41, 128, 185)', 
                 'rgb(142, 68, 173)', 
                 'rgb(40, 180, 99)', 
                 'rgb(230, 126, 34)', 
                 'rgb(231, 76, 60)', 
                 'rgb(52, 73, 94 )',
                 '#5B2C6F',
                 '#A569BD',
                 'rgb(244, 208, 63)']

document.getElementById('closeMark').addEventListener('mouseover', function(){
  document.getElementById('closeMark').className = "fa-solid fa-circle-xmark";
})

document.getElementById('closeMark').addEventListener('mouseleave', function(){
  document.getElementById('closeMark').className = "fa-regular fa-circle-xmark";
})

document.getElementById('closeMarkShh').addEventListener('mouseover', function(){
  document.getElementById('closeMarkShh').className = "fa-solid fa-circle-xmark";
})

document.getElementById('closeMarkShh').addEventListener('mouseleave', function(){
  document.getElementById('closeMarkShh').className = "fa-regular fa-circle-xmark";
})

correctSound.addEventListener('ended', function(){
  if (waiting){
    sound.play();
    waiting = false;
  }
})

wrongSound.addEventListener('ended', function(){
  if (waiting){
    sound.play();
    waiting = false;
  }
  document.getElementById('shh').style.visibility = "hidden";
})

function preprocessWord(word){
  var firstChaIdx = -1,
      newWord;
  for (var i = 0; i < word.length; i++){
    if (word[i] != " "){
      firstChaIdx = i;
      break;
    }
  }
  if (firstChaIdx == -1)      return "";
  else                
    newWord = word.substr(firstChaIdx, word.length - firstChaIdx);

  for (var i = newWord.length - 1; i > -1; i--){
    if (newWord[i] != " "){
      firstChaIdx = i;
      break;
    }
  }
  return newWord.substr(0, firstChaIdx + 1);
}


function setup() {
  document.getElementById('wordInput').addEventListener('keypress', function(char){
    if (char.key == 'Enter'){
      inputStore.value = preprocessWord(inputStore.value);
      if (inputStore.value.length <= 1)                      return;
      if (keyWord.indexOf(inputStore.value.toUpperCase()) != -1 && inputStore.value != ""){
        document.getElementById('message').innerHTML = "Already used word";
        document.getElementById('message').style.visibility = "visible";
      } else {
        document.getElementById('message').style.visibility = "hidden";
        document.getElementById('message').innerHTML = "";
        keyWord.push(inputStore.value.toUpperCase());
        document.getElementById('countWords').innerHTML = keyWord.length;
        var word = document.createElement('div');
        word.innerHTML = keyWord[keyWord.length - 1];
        word.style.color = "aliceblue";
        word.style.fontFamily = "Lilita One, sans-serif";
        word.style.marginTop = (firstPosWord + 8) + "%";
        firstPosWord += 5;
        word.style.position = "absolute";
        document.getElementById('wordList').appendChild(word);
      }
      inputStore.value = "";
    }
  })

  document.getElementById('submitWord').addEventListener('click', function(){
    if (keyWord.length <= 0 || gameReady)    return;
    gameReady = true;
    document.getElementById('inputWord').style.visibility = "hidden";
    document.getElementById('gamePlay').style.visibility = "visible";
    document.getElementById('volumn').className = unmute;
    document.getElementById('volumn').style.visibility = "visible";
    document.getElementById('volumnSFX').className = unmute;
    document.getElementById('volumnSFX').style.visibility = "visible";
    img.style.visibility = "visible";
    loadWord("", keyWord[0].toUpperCase());
    turnOn_Off();
    gameStart();
  })
}

function loadWord(oldword, word) {
  guessTime = 0;
  input.value = "";
  wordStore = [];

  for (var i = 0; i < word.length; i++){
    if (wordStore.indexOf(word[i].toUpperCase()) == -1) {
      wordStore.push(word[i].toUpperCase());
    }
  }
  for (var i = 0; i < 5; i++) {
    var r = rowIndicate + (i + 1);
    for (var letterLen = 0; letterLen < oldword.length; letterLen++) {
      document.getElementById(r).removeChild(document.getElementById(r).firstChild);
    }
    for (var letterLen = 0; letterLen < word.length; letterLen++) {
      var divN = document.createElement('div');
      divN.className = "square default";
      document.getElementById(r).appendChild(divN);
      document.getElementById(r).firstElementChild.innerHTML = word[0];
      document.getElementById(r).firstElementChild.style.color = colorCode[0];
    }
  }
  img.style.backgroundImage = "url('1.png')";
}

function nextWord() {
  displayMsg("Guess the word");
  guessCorrect = false;
  document.getElementById('guess').readOnly = false;
  document.getElementById('screenMessage').style.visibility = "hidden";
  document.getElementById('shh').style.visibility = "hidden";
  loadWord(keyWord[valueRow - 1].toUpperCase(), keyWord[++valueRow - 1].toUpperCase());
  document.getElementById('next').style.visibility = 'hidden';
}

// change css class
var changeClass = function(cng, old, newClass){
  cng.className = cng.className.replace(old, newClass);
}

function turnOn_Off() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    sound.currentTime = 0;
    sound.play();
    document.getElementById("volumn").className = unmute;
  } else {
    document.getElementById("volumn").className = mute;
    sound.pause();
  }
}

function turnOn_OffSFX() {
  isSFXPlaying = !isSFXPlaying;
  if (isSFXPlaying) {
    document.getElementById("volumnSFX").className = unmute;
  } else {
    document.getElementById("volumnSFX").className = mute;
  }
}

function displayMsg(msg){
  document.getElementById('msgBox').innerHTML = msg;
}

function displaySmallMsg(smallmsg){
  document.getElementById('smallMsg').innerHTML = smallmsg;
}

// endgame
var end = function(msg, smallmsg){
  document.getElementById('msgBox').innerHTML = msg;
  document.getElementById('smallMsg').innerHTML = smallmsg;
  changeClass(button, "invisible", "visible");
  document.getElementById('guess').readOnly = true;
}

var playagain = function(){
  guessTime = 0;
  guessCorrect = false;
  wordStore = [];
  isPlaying = 0;
  isSFXPlaying = 1;
  document.getElementById('shh').style.visibility = "hidden";
  document.getElementById('msgBox').innerHTML="Guess the Word!"; // main message
  document.getElementById('smallMsg').innerHTML = "Green = correct letter, Yellow = wrong place"; // small message
  document.getElementById('guess').readOnly = false;
  changeClass(button, "visible", "invisible");
  
  loadWord(keyWord[valueRow - 1].toUpperCase(), "");

  while (keyWord.length > 0){
    document.getElementById('wordList').removeChild(document.getElementById('wordList').children.item(1));
    keyWord.pop();
  }
  gameReady = false;
  document.getElementById('countWords').innerHTML = 0;
  document.getElementById('gamePlay').style.visibility = "hidden";
  document.getElementById('volumn').style.visibility = "hidden";
  document.getElementById('volumnSFX').style.visibility = "hidden";
  document.getElementById('volumnSFX').style.visibility = "hidden";
  document.getElementById('screenMessage').style.visibility = "hidden";
  document.getElementById('inputWord').style.visibility = "visible";
  img.style.visibility = "hidden";
  sound.pause();
  sound.currentTime = 0;
  correctSound.pause();
  correctSound.currentTime = 0;
  wrongSound.pause();
  wrongSound.currentTime = 0;
  valueRow = 1;
  setup();
};

document.getElementById('closeMessage').addEventListener('click', function(){
  document.getElementById('screenMessage').style.visibility = "hidden";
})

document.getElementById('closeShh').addEventListener('click', function(){
  document.getElementById('shh').style.visibility = "hidden";
})

function gameStart() {
  input.addEventListener('keypress', function(char) {
    if (char.key === 'Enter') {
      if (input.value.length > 0 && input.value[input.value.length - 1] == " ")
        input.value = input.value.substr(0, input.value.length - 1);
      if ((keyWord[valueRow - 1].toUpperCase() == input.value.toUpperCase())){
        document.getElementById('shh').style.visibility = "hidden";
        document.getElementById('guess').readOnly = true;
        displayMsg("Hooray! That's correct!");
        for (var idx = 0; idx < keyWord[valueRow - 1].length; idx++) {
          changeClass(document.getElementById(rowIndicate + (guessTime + 1)).children.item(idx), "default", "correct");
          document.getElementById(rowIndicate + (guessTime + 1)).children.item(idx).innerHTML = input.value[idx].toUpperCase();
          document.getElementById(rowIndicate + (guessTime + 1)).children.item(idx).style.color = "aliceblue";
        }
        guessCorrect = true;
        img.style.backgroundImage = "url('0.png')";
        // document.getElementById('screenMessage').style.visibility = "visible";
        if (isSFXPlaying) {
          if (isPlaying) {
            waiting = true;
            sound.pause();
          }
          wrongSound.pause();
          wrongSound.currentTime = 0;
          correctSound.currentTime = 0;
          correctSound.play();
        }

        if (valueRow >= keyWord.length){
          end("Wow! That's correct. Congratulation!!!", "Do you want to play again?");
        } else {
          document.getElementById('next').style.visibility = 'visible';
        }
        input.value = "";
      } else if (keyWord[valueRow - 1].length != input.value.length && !guessCorrect){
        displayMsg("Let's try a little bit more"); 
      } else if (!guessCorrect) {
        displayMsg("Let's try a little bit more.");
        
        document.getElementById('shh').style.visibility = "visible";

        for (var idx = 0; idx < keyWord[valueRow - 1].length; idx++) {
          if (input.value[idx].toUpperCase() == keyWord[valueRow - 1][idx].toUpperCase()){
            changeClass(document.getElementById(rowIndicate + (guessTime + 1)).children.item(idx), "default", "correct");
            document.getElementById(rowIndicate + (guessTime + 1)).children.item(idx).innerHTML = input.value[idx].toUpperCase();
            document.getElementById(rowIndicate + (guessTime + 1)).children.item(idx).style.color ="aliceblue";
          } else if (wordStore.indexOf(input.value[idx].toUpperCase()) != -1) {
            changeClass(document.getElementById(rowIndicate + (guessTime + 1)).children.item(idx), "default", "wrongplace");
            document.getElementById(rowIndicate + (guessTime + 1)).children.item(idx).innerHTML = input.value[idx].toUpperCase();
            document.getElementById(rowIndicate + (guessTime + 1)).children.item(idx).style.color ="aliceblue";
        } else {
          document.getElementById(rowIndicate + (guessTime + 1)).children.item(idx).innerHTML = input.value[idx].toUpperCase();
          document.getElementById(rowIndicate + (guessTime + 1)).children.item(idx).style.color = colorCode[idx];
        }
        }
        guessTime++; 
        if (isSFXPlaying) {
          if (isPlaying) {
            waiting = true;
            sound.pause();
          }
          wrongSound.currentTime = 0;
          wrongSound.play();
        }
        img.style.backgroundImage = "url('" + (guessTime + 1) + ".png')";
      }
      if (guessTime >= 5){
        end("You're unlucky :( Good luck next time.", "Do you want to play again?");
      }
      input.value = "";
    }
  })
  gameStart();
}

setup();
