import React, { useState, useEffect } from 'react';
import './Board.css';

export default function Board({ gameRoom, socket, currentUser }) {
    const [board, setBoard] = useState(gameRoom.board);
    const [isXNext, setIsXNext] = useState(gameRoom.currentPlayer === 1);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        // console.log('Board state updated:', board);
        if (socket) {
            socket.on("moveMade", ({ board, currentPlayer }) => {
                setBoard(board);
                setIsXNext(currentPlayer === 1);
                checkWinner(board);
            });

            socket.on("resetGame", () => {
                resetBoard();
            });

            return () => {
                socket.off("moveMade");
                socket.off("resetGame");
            };
        }
    }, [socket]);

    const handleClick = (row, col) => {
        if (board[row][col] || winner) return;
        const symbol = isXNext ? 1 : -1;
        const newBoard = board.map((r, i) => r.map((cell, j) => (i === row && j === col ? symbol : cell)));
        console.log('New board state:', newBoard);
        setBoard(newBoard);
        setIsXNext(!isXNext);
        checkWinner(newBoard);
        socket.emit("makeMove", { roomId: gameRoom.roomId, move: { row, col, symbol } });
    };

    const checkWinner = (board) => {
        const lines = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]],
        ];
        for (let line of lines) {
            const [[aRow, aCol], [bRow, bCol], [cRow, cCol]] = line;
            if (board[aRow][aCol] && board[aRow][aCol] === board[bRow][bCol] && board[aRow][aCol] === board[cRow][cCol]) {
                setWinner(board[aRow][aCol] === 1 ? 'X' : 'O');
                return;
            }
        }
        return null;
    };

    const resetBoard = () => {
        setBoard([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]);
        setWinner(null);
        setIsXNext(true);
    };

    const handleReset = () => {
        resetBoard();
        socket.emit("resetGame", { roomId: gameRoom.roomId });
    };

    const renderCell = (row, col) => {
        // console.log('Rendering cell:', row, col, 'with value:', board[row][col]);
        return (
            <div className="cell" onClick={() => handleClick(row, col)}>
                {board[row][col] === 1 ? 'X' : board[row][col] === -1 ? 'O' : null}
            </div>
        );
    };

    return (
        <div className="board">
            <div className="row">
                {renderCell(0, 0)}
                {renderCell(0, 1)}
                {renderCell(0, 2)}
            </div>
            <div className="row">
                {renderCell(1, 0)}
                {renderCell(1, 1)}
                {renderCell(1, 2)}
            </div>
            <div className="row">
                {renderCell(2, 0)}
                {renderCell(2, 1)}
                {renderCell(2, 2)}
            </div>
            {winner && <div className="winner">Winner: {winner}</div>}
            <button onClick={handleReset}>Reset</button>
        </div>
    );
}
