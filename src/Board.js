import React, { useCallback } from 'react';
import { calculateWinner } from './gameUtils';

function Square({ value, onSquareClick, highlight }) {
    const className = `square${highlight ? ' highlight' : ''}`;
    return (
        <button className={className} onClick={onSquareClick}>
            {value}
        </button>
    );
}

export default function Board({ squares, onPlay, winningSquares }) {
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

    const handleSquareClick = useCallback((i) => {
        if (calculateWinner(squares).winner || squares[i]) return;
        const nextSquares = squares.slice();
        nextSquares[i] = squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
        onPlay(nextSquares, i);
    }, [squares, calculateWinner]);

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