import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  const className = `square${highlight ? ' highlight' : ''}`;
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ squares, onPlay, winningSquares }) {
  const renderSquare = (i) => {
    const isWinningSquare = winningSquares.includes(i);
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleSquareClick(i)}
        highlight={isWinningSquare}
      />
    );
  };

  const handleSquareClick = (i) => {
    if (calculateWinner(squares).winner || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
    onPlay(nextSquares, i);
  };

  const createBoard = () => {
    let board = [];
    for (let row = 0; row < 3; row++) {
      let boardRow = [];
      for (let col = 0; col < 3; col++) {
        boardRow.push(renderSquare(row * 3 + col));
      }
      board.push(<div key={row} className="board-row">{boardRow}</div>);
    }
    return board;
  }

  return (
    <>
      {createBoard()}
    </>
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

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (currentSquares.every(square => square != null)) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const handlePlay = (nextSquares, index) => {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    const moveLocation = `(${row}, ${col})`;

    const nextHistory = history.slice(0, currentMove + 1).concat([{ squares: nextSquares, moveLocation }]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const moves = history.map((step, move) => {
    const desc = move ?
      `Go to move #${move} ${step.moveLocation}` :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => setCurrentMove(move)}>{desc}</button>
      </li>
    );
  }).sort((a, b) => isAscending ? a.key - b.key : b.key - a.key);

  return (
    <div className="game">
      <div className="game-left">
        <div className="current-move">
          {currentMove === 0 ? "Game Start" : `You are at move #${currentMove}`}
        </div>
        <div className="status">{status}</div>
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            winningSquares={winningSquares}
          />
        </div>
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? "Sort Descending" : "Sort Ascending"}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}
