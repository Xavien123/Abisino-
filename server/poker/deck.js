// server/poker/deck.js
const crypto = require('crypto');

const SUITS = ['s', 'h', 'd', 'c']; // Spades, Hearts, Diamonds, Clubs
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

class Deck {
  constructor() {
    this.cards = [];
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        this.cards.push(`${rank}${suit}`);
      }
    }
    this.shuffle();
  }

  // Fisher-Yates Shuffle mit echten Krypto-Zufallszahlen
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      // crypto.randomInt ist inklusiv für min, exklusiv für max
      const j = crypto.randomInt(0, i + 1);
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(count = 1) {
    if (this.cards.length < count) throw new Error("Deck is empty");
    return this.cards.splice(-count, count);
  }
}

module.exports = Deck;
