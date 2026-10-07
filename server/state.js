// server/state.js
// Map speichert userId -> socketId
const activePlayers = new Map();

function addPlayer(userId, socketId) {
  activePlayers.set(userId, socketId);
}

function removePlayer(userId) {
  activePlayers.delete(userId);
}

function getSocketId(userId) {
  return activePlayers.get(userId);
}

function isOnline(userId) {
  return activePlayers.has(userId);
}

module.exports = { 
  activePlayers, 
  addPlayer, 
  removePlayer, 
  getSocketId, 
  isOnline 
};
