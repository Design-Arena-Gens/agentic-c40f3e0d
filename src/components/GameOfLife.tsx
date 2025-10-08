"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './GameOfLife.module.css';

const NUM_ROWS = 50;
const NUM_COLS = 50;

const createEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    rows.push(Array.from(Array(NUM_COLS), () => 0));
  }
  return rows;
};

const GameOfLife: React.FC = () => {
  const [grid, setGrid] = useState(() => createEmptyGrid());
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = () => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return g.map((row, i) =>
        row.map((cell, j) => {
          let neighbors = 0;
          for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
              if (x === 0 && y === 0) continue;
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < NUM_ROWS && newJ >= 0 && newJ < NUM_COLS) {
                neighbors += g[newI][newJ];
              }
            }
          }

          if (neighbors < 2 || neighbors > 3) {
            return 0;
          }
          if (neighbors === 3) {
            return 1;
          }
          return g[i][j];
        })
      );
    });

    setTimeout(runSimulation, 100);
  };

  useEffect(() => {
    if (running) {
      runningRef.current = true;
      runSimulation();
    }
  }, [running]);

  const toggleCell = (i: number, j: number) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (rowIndex === i && colIndex === j) {
          return cell ? 0 : 1;
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  const randomizeGrid = () => {
    const rows = [];
    for (let i = 0; i < NUM_ROWS; i++) {
      rows.push(Array.from(Array(NUM_COLS), () => (Math.random() > 0.7 ? 1 : 0)));
    }
    setGrid(rows);
  };

  return (
    <div>
      <div className={styles.controls}>
        <button onClick={() => setRunning(!running)}>
          {running ? 'Stop' : 'Start'}
        </button>
        <button onClick={randomizeGrid}>Random</button>
        <button onClick={() => setGrid(createEmptyGrid())}>Reset</button>
      </div>
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${NUM_COLS}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => toggleCell(i, j)}
              className={`${styles.cell} ${grid[i][j] ? styles.alive : ''}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameOfLife;
