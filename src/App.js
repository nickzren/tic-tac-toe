import React, { useState, useCallback } from 'react';
import { calculateWinner } from './gameUtils';
import Board from './Board';

function Status({ winner, xIsNext, currentSquares }) {
  return (
    <div className="status">
      {winner ? `Winner: ${winner}` :
        currentSquares.every(square => square != null) ? "Draw" :
          `Next player: ${xIsNext ? 'X' : 'O'}`}
    </div>
  );
}

function History({ history, isAscending, onMoveSelect, setIsAscending }) {
  return (
    <div className="game-history">
      <button onClick={() => setIsAscending(!isAscending)}>
        {isAscending ? "Sort Descending" : "Sort Ascending"}
      </button>
      <ol>
        {(isAscending ? history : history.slice().reverse()).map((step, move) => {
          const desc = move ? `Go to move #${move} ${step.moveLocation}` : 'Go to game start';
          return <li key={move}><button onClick={() => onMoveSelect(move)}>{desc}</button></li>;
        })}
      </ol>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), moveLocation: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const currentResult = calculateWinner(currentSquares);
  const winner = currentResult.winner;
  const winningSquares = currentResult.line;

  const handlePlay = useCallback((nextSquares, index) => {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    const moveLocation = `(${row}, ${col})`;

    const nextHistory = history.slice(0, currentMove + 1).concat([{ squares: nextSquares, moveLocation }]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }, [history, currentMove]);

  return (
    <div className="game">
      <div className="game-play-area">
        <div className="current-move">
          {currentMove === 0 ? "Game Start" : `You are at move #${currentMove}`}
        </div>
        <Status winner={winner} xIsNext={xIsNext} currentSquares={currentSquares} />
        <div className="game-board">
          <Board
            squares={currentSquares}
            onPlay={handlePlay}
            winningSquares={winningSquares}
          />
        </div>
      </div>
      <History
        history={history}
        isAscending={isAscending}
        onMoveSelect={setCurrentMove}
        setIsAscending={setIsAscending}
      />
    </div>
  );
}