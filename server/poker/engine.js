// server/poker/engine.js
const Deck = require('./deck');

class PokerTable {
  constructor(tableId, io) {
    this.tableId = tableId;
    this.io = io; // Referenz auf den globalen Socket-Server für Broadcasts
    
    this.players = []; // max 8 Spieler
    this.seats = new Array(8).fill(null);
    
    this.state = {
      phase: 'WAITING', // WAITING, PREFLOP, FLOP, TURN, RIVER, SHOWDOWN
      communityCards: [],
      pots: [{ amount: 0, contributors: [] }], // Side-Pots Array
      currentBet: 0,
      dealerIndex: 0,
      turnIndex: -1,
      minBet: 200, // z.B. 2.00 AC Big Blind (Integer)
    };
    
    this.turnTimer = null;
    this.deck = null;
  }

  // --- SPIELER-MANAGEMENT ---
  addPlayer(user, seatIndex, buyInAmount) {
    if (this.seats[seatIndex] !== null) throw new Error("Seat taken");
    
    const player = {
      id: user.id,
      username: user.username,
      stack: buyInAmount,     // Chips am Tisch (in Units)
      cards: [],              // Hole Cards (im Server RAM)
      bet: 0,                 // Aktueller Einsatz in dieser Setzrunde
      folded: false,
      allIn: false,
      isOnline: true
    };
    
    this.seats[seatIndex] = player;
    this.broadcastState();
  }

  removePlayer(userId) {
    const seatIndex = this.seats.findIndex(p => p && p.id === userId);
    if (seatIndex !== -1) {
      // TODO: Cash-Out in die Datenbank via Prisma hier triggern!
      this.seats[seatIndex] = null;
      this.broadcastState();
    }
  }

  // --- STATE-MACHINE & TIMER ---
  startHand() {
    const activePlayers = this.seats.filter(p => p && p.stack > 0);
    if (activePlayers.length < 2) return;

    this.deck = new Deck();
    this.state.phase = 'PREFLOP';
    this.state.communityCards = [];
    this.state.pots = [{ amount: 0, contributors: [] }];
    this.state.currentBet = 0;

    // Reset Player States
    activePlayers.forEach(p => {
      p.cards = this.deck.draw(2);
      p.folded = false;
      p.allIn = false;
      p.bet = 0;
    });

    // Dealer Button & Blinds Logik (stark vereinfacht für dieses Skript)
    this.state.dealerIndex = (this.state.dealerIndex + 1) % 8;
    // ... Blinds abziehen ...

    this.setNextTurn();
    this.broadcastState();
  }

  setNextTurn() {
    // 20-Sekunden Timer starten
    if (this.turnTimer) clearTimeout(this.turnTimer);
    
    // Finde den nächsten aktiven Spieler (nicht folded, nicht all-in)
    // Logik hier ausgelassen zur Übersichtlichkeit...
    
    this.turnTimer = setTimeout(() => {
      this.autoAction(); // Auto-Fold / Auto-Check nach 20s
    }, 20000);
  }

  autoAction() {
    const activePlayer = this.seats[this.state.turnIndex];
    if (!activePlayer) return;

    // Wenn er Checken kann, checkt er, sonst Fold.
    if (this.state.currentBet === activePlayer.bet) {
      this.handleAction(activePlayer.id, 'CHECK');
    } else {
      this.handleAction(activePlayer.id, 'FOLD');
    }
  }

  // --- ACTION HANDLING ---
  handleAction(userId, action, amount = 0) {
    const player = this.seats[this.state.turnIndex];
    if (!player || player.id !== userId) throw new Error("Not your turn");

    if (this.turnTimer) clearTimeout(this.turnTimer);

    switch (action) {
      case 'FOLD':
        player.folded = true;
        break;
      case 'CHECK':
        if (player.bet < this.state.currentBet) throw new Error("Cannot check");
        break;
      case 'CALL':
        const callAmount = Math.min(player.stack, this.state.currentBet - player.bet);
        player.stack -= callAmount;
        player.bet += callAmount;
        if (player.stack === 0) player.allIn = true;
        break;
      case 'RAISE':
        // Strikt Integer check
        if (!Number.isInteger(amount) || amount <= 0) throw new Error("Invalid raise amount");
        const totalBet = this.state.currentBet + amount;
        const raiseAmount = Math.min(player.stack, totalBet - player.bet);
        player.stack -= raiseAmount;
        player.bet += raiseAmount;
        this.state.currentBet = player.bet;
        if (player.stack === 0) player.allIn = true;
        break;
    }

    this.advancePhaseIfNeeded();
  }

  advancePhaseIfNeeded() {
    // Prüft, ob Setzrunde beendet ist. Wenn ja -> Pots berechnen, nächste Phase.
    // ... Side-Pot Logik ...
    
    // Nach Setzrunde:
    if (this.state.phase === 'PREFLOP') {
      this.state.phase = 'FLOP';
      this.state.communityCards.push(...this.deck.draw(3));
    } else if (this.state.phase === 'FLOP') {
      this.state.phase = 'TURN';
      this.state.communityCards.push(...this.deck.draw(1));
    } else if (this.state.phase === 'TURN') {
      this.state.phase = 'RIVER';
      this.state.communityCards.push(...this.deck.draw(1));
    } else if (this.state.phase === 'RIVER') {
      this.state.phase = 'SHOWDOWN';
      this.handleShowdown();
    }

    this.setNextTurn();
    this.broadcastState();
  }

  handleShowdown() {
    // Hier wird das Evaluator-Modul aufgerufen.
    // Gewinner ermitteln und Pots (Main + Side) verteilen.
  }

  // --- SECURITY: CHEAT-SCHUTZ ---
  // Scrubbt geheime Daten (Hole Cards), bevor der Status gesendet wird.
  getSanitizedState(targetUserId) {
    const sanitizedSeats = this.seats.map(p => {
      if (!p) return null;
      return {
        ...p,
        // Karten nur zeigen, wenn es die eigenen sind, ODER beim Showdown
        cards: (p.id === targetUserId || this.state.phase === 'SHOWDOWN') ? p.cards : ['??', '??']
      };
    });

    return {
      tableId: this.tableId,
      state: this.state,
      seats: sanitizedSeats
    };
  }

  broadcastState() {
    // Jeder Spieler bekommt einen personalisierten Broadcast, damit Hole Cards geheim bleiben
    this.seats.forEach(p => {
      if (p && p.isOnline) {
        this.io.to(`user_${p.id}`).emit('poker_state', this.getSanitizedState(p.id));
      }
    });
    // Zuschauer (optional) bekommen auch einen gecleanten Status
    this.io.to(`table_${this.tableId}_watchers`).emit('poker_state', this.getSanitizedState(null));
  }
}

module.exports = PokerTable;
