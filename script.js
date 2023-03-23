const cards = document.querySelectorAll('.card');
console.log(cards);

console.log('hello');

for (let card of cards) {
    card.addEventListener('click', function(e) {
        if (e.target.id === 'elie-front') {
            console.log(card);
            card.id = 'elie-back';
        } else if (e.target.id === 'elie-back') {
            console.log(card);
            card.id = 'elie-front';
        }
    });
};

