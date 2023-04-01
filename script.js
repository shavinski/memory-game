"use strict";

const FOUND_MATCH_WAIT_MSECS = 1000;
const picturesArr = [ `img/brian.png`, 'img/britt.png', 'img/elie.png', 'img/kadeem.png', 'img/sarah.png', 'img/brittiany.png', 'img/colt.png', 'img/edmond.png', 'img/joel.png', 'img/kate.png', 'img/spencer.png', 'img/vanesa.png', 'img/whitney.png', 'img/lucy.png', 'img/brian.png', 'img/britt.png', 'img/elie.png', 'img/kadeem.png', 'img/sarah.png', 'img/brittiany.png', 'img/colt.png', 'img/edmond.png', 'img/joel.png', 'img/kate.png', 'img/spencer.png', 'img/vanesa.png', 'img/whitney.png', 'img/lucy.png'];

const startButton = document.querySelector('#start-button');
const startHeading = document.querySelector('div > h1');
const gameHeader = document.querySelector('.game-header');
const gameBoard = document.querySelector('.game');
const score = document.querySelector('.score');
const bestScore = document.querySelector('.best-score');
const gameOverDisplay = document.querySelector('.game-over');
const menuButton = document.querySelector('#home-screen');

let inProcessOfGuess = false;
let flippedCard = false;
let firstCard;
let secondCard;
let points = 0;
let setsFound = 0;
let highScore;
let totalSets = picturesArr.length / 2;

function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        [items[i], items[j]] = [items[j], items[i]];
        };
    return items;
}

function createCards(pictures) {
    
    for (let picture of picturesArr) {
      const card = document.createElement('div');
      // REMOVES img/ and .png on word so we can add a class
      let className = picture.split('').slice(4).slice(0, picture.length - 8).join('');

      card.id = (`${className}`)
      card.classList.add('front')
      gameBoard.append(card);
  
      (card.addEventListener('click', handleCardClick));

    }; 
  }
 
  // once a card is clicked it is flipped to back
  function flipCard(card) {
    card.target.classList.toggle('front')
    card.target.classList.toggle('back')
    card.target.style.backgroundImage = `url(img/${card.target.id}.PNG)`

  }
  
  // if no match then card unflips back to front
  function unFlipCard(card) {
    card.target.classList.toggle('front')
    card.target.classList.toggle('back')
    card.target.style.removeProperty('background-image')
  }
  
  // handles all of our clicking events
  function handleCardClick(evt) {
    
    if(inProcessOfGuess) {
      return;
    }
    
    flipCard(evt);
    
    if (!flippedCard) {
      firstCard = evt;
      flippedCard = true;
      addPoint();
    } else {
      secondCard = evt;
      // doesn't allow the same square to be clicked an counted as two
      if (secondCard.target === firstCard.target) {
        secondCard = undefined;
        return;
      }
      flippedCard = false;
      inProcessOfGuess = true;
      addPoint();
    }
    
    // added this if statement in order to avoid error in console of accessing second.target.id too early
    // would get error of second.target.id is undefined everytime I click first square 
    if (secondCard !== undefined) {
      if (firstCard.target.id === secondCard.target.id) {
        setTimeout(() => {
          firstCard.target.removeEventListener('click', handleCardClick);
          secondCard.target.removeEventListener('click', handleCardClick);
          firstCard = undefined;
          secondCard = undefined;
          inProcessOfGuess = false;
          foundSet();
          if (totalSets === setsFound) {
            gameOver();
          }
        }, FOUND_MATCH_WAIT_MSECS);
      } else {
        setTimeout(() => {
          unFlipCard(firstCard);
          unFlipCard(secondCard);
          firstCard = undefined;
          secondCard = undefined;
          inProcessOfGuess = false;
        }, 1000);
      }
    }
}

// when click on start button it will automatically load all cards and display the game board
function startGame() {
  const pictures = shuffle(picturesArr);
  createCards(pictures);
  startButton.style.display = 'none';
  startHeading.style.display = 'none';
  gameHeader.style.display = 'flex';
  gameBoard.style.display = 'grid';  // CHANGE BACK TO FLEX MAYBE
  score.textContent = points;
}

// once start button is clicked it will load the game
startButton.addEventListener('click', startGame)


// when a click event happens on a card that has been selected it will add to the score visible on page
function addPoint() {
  points += 1;
  score.textContent = points;
}

// when a set of cards is found it adds one to setsfound
function foundSet() {
  setsFound += 1;
}

// stores best score from playing
function storeBestScore() {
  // checks to see if current score is less than stores highscore and replaces 
  if(points < highScore || highScore === undefined) {
    highScore = points;
    bestScore.textContent = highScore;
  } 
  
}

// once sets found is equal to amount of sets the game will end and button will be given to return to menu, should clear existing cards from gameBoard
function gameOver() {
  storeBestScore();
  deleteAllCurrentCards();
  gameBoard.style.display = 'none';
  gameOverDisplay.style.display = 'flex';
  points = 0;
  setsFound = 0;
}

// clears ending screen when you win and goes back to main menu 
function clearScreenAndGoToMenu() {
  startButton.style.display = 'block';
  startHeading.style.display = 'block';
  gameHeader.style.display = 'none';
  gameOverDisplay.style.display = 'none';
}

// refreshes and gives a new page
menuButton.addEventListener('click', clearScreenAndGoToMenu);


// deletes previous gameBoard filled with cards 
function deleteAllCurrentCards() {
  const allActiveCards = gameBoard.querySelectorAll('div');

  for (let card of allActiveCards) {
    card.remove();
  };
}