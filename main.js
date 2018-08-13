"use strict";
let caretInterval;
let spacesAmount; // Number of available spaces
let gameText; // Main text for the game
let noSpaceText;
let spaceIndices; // Indices of spaces in gameText

// Caret
/**
 * 
 * @param {object} win - window object
 * @param {number} charCount - number of chars to skip
 */
function moveCaret(win, charCount) {
  let selection;
  if (win.getSelection) {
      selection = win.getSelection();
      if (selection.rangeCount > 0) {
          let textNode = selection.focusNode; 
          let newOffset = selection.focusOffset + charCount;
          selection.collapse(textNode, Math.min(textNode.length, newOffset));
      }
  }
}

/**
 * 
 * @param {object} win - window object
 */
function resetCaret(win) {
  let selection;
  if (win.getSelection) {
      selection = win.getSelection();
      let textNode = selection.focusNode;
      selection.collapse(textNode, 0);
  }
}

/**
 * 
 * @param {object} win - window object 
 * @returns {number} Current position of the caret
 */
function caterPosition(win) {
  let selection;
  if (win.getSelection) {
      selection = win.getSelection();
      return selection.focusOffset;
  }
}
// End Caret

// DOM Elements
let startBtn = document.getElementById("start");
let resetBtn = document.getElementById("reset");
let noSpaceTextDiv = document.getElementById("editable");
let messageDiv = document.getElementById("message");
let sampleDiv = document.getElementById("sample");

// Starting the game
startBtn.onclick = (e) => {
  noSpaceTextDiv.focus();
  resetCaret(window);
  caretInterval = setInterval(() => {
    moveCaret(window, 1);
    console.log(caterPosition(window));
  }, 500);
}

// Reloading the game
resetBtn.onclick = (e) => {
  clearInterval(caretInterval);
  noSpaceTextDiv.focus();
  // location.reload();
}

// Handle input for editable div
noSpaceTextDiv.onkeypress = (e) => {
  e = e || window.event;
  let charCode = e.which || e.keyCode;
  // Check if Space was pressed
  if (charCode == 32) {
      // console.log(noSpaceTextDiv.innerText.split(''));
      return true;
    } else {
      mistake();
      changeScore(-2);
    }
  // Only Space modify element
  return false;
}
// End DOM Elements

// Disable arrows keys
document.onkeydown = function(ev)
{
   var key;
   ev = ev || event;
   key = ev.keyCode;
   if(key == 37 || key == 38 || key == 39 || key == 40) {
     ev.cancelBubble = true;
     ev.returnValue = false;
  }
}

/**
 * 
 * @param {number} n - Amount of score change
 */
function changeScore(n) {
  spacesAmount += n;
  messageDiv.innerHTML = `You have ${spacesAmount} spaces!!!`;
}

/**
 * 
 * @param {string} str - String to parse
 * @returns {Array<number>} Indices for every space in a string
 */
function getSpaceIndices(str) {
  let indices = [];
  for( let i = 0; i < str.length; i++) {
    if (str[i] === ' ') indices.push(i - indices.length);
  }
  return indices;
}

// Change background-color if player made a mistake
function mistake() {
  let body = document.getElementsByTagName('body')[0];
  body.classList.add('mistake');
  setTimeout(() => {
    body.classList.remove('mistake');
  }, 100);
}

// Executed when text was loaded
function load(text) {
  gameText = text;
  spacesAmount = gameText.match(/([\s]+)/g).length + 2; // Spaces in game text + 2 (for reserve)
  noSpaceText = gameText.replace(/ /gi, '');
  spaceIndices = getSpaceIndices(gameText);
  sampleDiv.innerHTML = gameText;
  noSpaceTextDiv.innerHTML = noSpaceText;
  messageDiv.innerHTML = `You have ${spacesAmount} spaces!!!`;
}

//   fetching game text from file
fetch('/text.txt')
  .then(response => response.text())
  .then(load)
  .catch( error => fetch('Running-out-of-space/text.txt') // handle github url
                    .then(response => response.text())
                    .then(load)
);
