import React, { useCallback, useMemo } from 'react';
import { calculateWinner } from './gameUtils';
import Square from './Square';

export default function Board({ squares, onPlay, winningSquares }) {
    const handleSquareClick = useCallback((i) => {
        if (calculateWinner(squares).winner || squares[i]) return;
        const nextSquares = squares.slice();
        nextSquares[i] = squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
        onPlay(nextSquares, i);
    }, [squares, onPlay]);

    const board = useMemo(() => {
        return Array(3).fill(null).map((_, row) => (
            <div key={row} className="board-row">
                {Array(3).fill(null).map((_, col) => {
                    const index = row * 3 + col;
                    return (
                        <Square
                            key={index}
                            value={squares[index]}
                            onSquareClick={() => handleSquareClick(index)}
                            highlight={winningSquares.includes(index)}
                        />
                    );
                })}
            </div>
        ));
    }, [squares, winningSquares, handleSquareClick]);

    return <>{board}</>;
}