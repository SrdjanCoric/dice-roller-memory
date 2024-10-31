const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let currentGame = null;
let gameHistory = [];
let currentSession = {
  totalGames: 0,
  playerWins: 0,
  computerWins: 0,
  ties: 0,
};

app.post("/api/games/start", (req, res) => {
  currentGame = {
    id: Date.now().toString(),
    status: "started",
    timestamp: new Date(),
    playerScore: 0,
    computerScore: 0,
  };
  res.json({ gameId: currentGame.id });
});

app.post("/api/games/reset", (req, res) => {
  if (!currentGame) {
    return res.status(404).json({ error: "No active game found" });
  }

  currentSession = {
    totalGames: 0,
    playerWins: 0,
    computerWins: 0,
    ties: 0,
  };

  currentGame = {
    id: Date.now().toString(),
    status: "started",
    timestamp: new Date(),
    playerScore: 0,
    computerScore: 0,
  };

  res.json({
    success: true,
    gameId: currentGame.id,
    stats: currentSession,
    message: "Game reset successfully",
  });
});

app.post("/api/games/roll", (req, res) => {
  if (!currentGame) {
    return res.status(404).json({ error: "No active game found" });
  }

  const playerDice = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];
  const computerDice = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];

  const playerTotal = playerDice.reduce((a, b) => a + b);
  const computerTotal = computerDice.reduce((a, b) => a + b);

  let winner;
  if (playerTotal > computerTotal) {
    winner = "player";
    currentSession.playerWins++;
  } else if (computerTotal > playerTotal) {
    winner = "computer";
    currentSession.computerWins++;
  } else {
    winner = "tie";
    currentSession.ties++;
  }

  currentSession.totalGames++;

  currentGame.playerScore = playerTotal;
  currentGame.computerScore = computerTotal;
  currentGame.status = "completed";
  currentGame.winner = winner;

  gameHistory.push({
    ...currentGame,
    playerDice,
    computerDice,
    timestamp: new Date(),
  });

  res.json({
    playerDice,
    computerDice,
    winner,
    playerTotal,
    computerTotal,
  });
});

app.get("/api/games/history", (req, res) => {
  res.json(gameHistory.slice(-10).reverse());
});

app.get("/api/games/stats", (req, res) => {
  res.json({
    ...currentSession,
    playerWinRate: currentSession.totalGames
      ? ((currentSession.playerWins / currentSession.totalGames) * 100).toFixed(
          1
        )
      : 0,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
