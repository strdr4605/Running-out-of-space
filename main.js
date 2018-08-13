"use strict";
let caretInterval;
let spacesAmount;
let gameText;
let noSpaceText;
let spaceIndices;

// Caret
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

function resetCaret(win) {
  let selection;
  if (win.getSelection) {
      selection = win.getSelection();
      let textNode = selection.focusNode;
      selection.collapse(textNode, 0);
  }
}

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

startBtn.onclick = (e) => {
  noSpaceTextDiv.focus();
  resetCaret(window);
  caretInterval = setInterval(() => {
    moveCaret(window, 1);
    console.log(caterPosition(window));
  }, 500);
}

resetBtn.onclick = (e) => {
  clearInterval(caretInterval);
  noSpaceTextDiv.focus();
  // location.reload();
}

noSpaceTextDiv.onkeypress = (e) => {
  e = e || window.event;
  let charCode = e.which || e.keyCode;
  // Check if Space was pressed
  if (charCode == 32) {
      console.log(noSpaceTextDiv.innerText.split(''));
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

function changeScore(n) {
  spacesAmount += n;
  messageDiv.innerHTML = `You have ${spacesAmount} spaces!!!`;
}

function getSpaceIndices(str) {
  let indices = [];
  for( let i = 0; i < str.length; i++) {
    if (str[i] === ' ') indices.push(i - indices.length);
  }
  return indices;
}

function mistake() {
  let body = document.getElementsByTagName('body')[0];
  body.classList.add('mistake');
  setTimeout(() => {
    body.classList.remove('mistake');
  }, 100);
}

function load(text) {
  gameText = text;
  spacesAmount = gameText.match(/([\s]+)/g).length + 2;
  noSpaceText = gameText.replace(/ /gi, '');
  spaceIndices = getSpaceIndices(gameText);
  sampleDiv.innerHTML = gameText;
  noSpaceTextDiv.innerHTML = noSpaceText;
  messageDiv.innerHTML = `You have ${spacesAmount} spaces!!!`;
}

fetch('/text.txt')
  .then(response => response.text())
  .then(load);


if(spacesAmount < 3) {
  messageDiv.classList.add('danger');
  messageDiv.classList.remove('primary');
} else {
  messageDiv.classList.add('primary');
  messageDiv.classList.remove('danger');
}