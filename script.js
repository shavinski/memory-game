"use strict";

const FOUND_MATCH_WAIT_MSECS = 1000;
const picturesArr = [ `img/brian.png`, 'img/britt.png', 'img/elie.png', 'img/kadeem.png', 'img/sarah.png', 'img/brian.png', 'img/britt.png', 'img/elie.png', 'img/kadeem.png', 'img/sarah.png'];

const startButton = document.querySelector('#start-button');
const startHeading = document.querySelector('div > h1');
const gameHeader = document.querySelector('.game-header');
const gameBoard = document.querySelector('.game')
const score = document.querySelector('.score')
const gameOverDisplay = document.querySelector('.game-over');
const menuButton = document.querySelector('#home-screen')


const pictures = shuffle(picturesArr);

function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        [items[i], items[j]] = [items[j], items[i]];
        };
    return items;
}

function createCards(pictures) {
    const gameBoard = document.querySelector(".game");
    
    for (let picture of picturesArr) {
      const card = document.createElement('div');
      // REMOVES img/ and .png on word so we can add a class
      let className = picture.split('').slice(4).slice(0, picture.length - 8).join('');

      card.id = (`${className}`)
      card.classList.add('front')
      gameBoard.append(card);
  
      (card.addEventListener('click', handleCardClick));
    };
  };

  let flippedCard = false;
  let firstCard;
  let secondCard;
  let inProcessOfGuess = false;
  let points = 0;
  let setsFound = 0;
  let totalSets = picturesArr.length / 2;

  function flipCard(card) {
    card.target.classList.toggle('front')
    card.target.classList.toggle('back')
    card.target.style.backgroundImage = `url(img/${card.target.id}.PNG)`

  }
  
  function unFlipCard(card) {
    card.target.classList.toggle('front')
    card.target.classList.toggle('back')
    card.target.style.removeProperty('background-image')
  }
  
  
  function handleCardClick(evt) {
    
    if(inProcessOfGuess) {
      return;
    };
    
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
      addPoint()
    };
    
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
            console.log('why ARE YOU NOT WORKING');
            gameOver();
          } else {
            console.log('no win yet');
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
    };
  };
  
};



// when a click event happens on a card that has been selected it will add to the score visible on page
function addPoint() {
  points += 1;
  score.textContent = points;
}

// when a set of cards is found it adds one to setsfound
function foundSet() {
  setsFound += 1;
}

// when click on start button it will automatically load all cards and display the game board
function startGame() {
  createCards(pictures);
  startButton.style.display = 'none'
  startHeading.style.display = 'none'
  gameHeader.style.display = 'flex'
  score.textContent = points;
};

// once start button is clicked it will load the game
startButton.addEventListener('click', startGame)

// once sets found is equal to amount of sets the game will end and button will be given to return to menu
function gameOver() {
  gameBoard.style.display = 'none';
  gameOverDisplay.style.display = 'flex'
};

// refreshes and gives a new page
menuButton.addEventListener('click', function() {
  history.go(0);
});