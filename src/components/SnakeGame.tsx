import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useInterval } from '../hooks/useInterval';
import { Trophy, RefreshCw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving up
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on the snake
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameBoardRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(INITIAL_DIRECTION);

  // Initialize food on mount
  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
    
    // Load high score from local storage
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    if (gameBoardRef.current) {
      gameBoardRef.current.focus();
    }
  }, [gameOver]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for arrow keys and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (gameOver) {
      if (e.key === 'Enter' || e.key === ' ') {
        resetGame();
      }
      return;
    }

    if (e.key === ' ' || e.key === 'Escape') {
      setIsPaused(prev => !prev);
      return;
    }

    if (isPaused) return;

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [gameOver, isPaused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Keep direction ref updated to prevent rapid double key presses causing self-collision
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const gameLoop = useCallback(() => {
    if (gameOver || isPaused) return;

    const head = snake[0];
    const newHead = {
      x: head.x + direction.x,
      y: head.y + direction.y,
    };

    // Check wall collision
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE
    ) {
      handleGameOver();
      return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      handleGameOver();
      return;
    }

    const newSnake = [newHead, ...snake];

    // Check food collision
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(s => {
        const newScore = s + 10;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('snakeHighScore', newScore.toString());
        }
        return newScore;
      });
      setFood(generateFood(newSnake));
      setSpeed(s => Math.max(50, s - 2));
    } else {
      newSnake.pop(); // Remove tail if no food eaten
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, isPaused, highScore]);

  useInterval(gameLoop, gameOver || isPaused ? null : speed);

  const handleGameOver = () => {
    setGameOver(true);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood(INITIAL_SNAKE));
    if (gameBoardRef.current) {
      gameBoardRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto font-pixel">
      {/* Score Header */}
      <div className="flex items-center justify-between w-full mb-6 px-4 py-3 bg-black border-4 border-cyan-400 shadow-[4px_4px_0px_#FF00FF]">
        <div className="flex flex-col">
          <span className="text-fuchsia-500 text-xl uppercase tracking-widest font-bold">DATA_HARVESTED</span>
          <span className="text-4xl font-bold text-cyan-400 drop-shadow-[2px_2px_0px_#FF00FF]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-fuchsia-500 text-xl uppercase tracking-widest font-bold">
            <Trophy size={16} className="text-cyan-400" /> MAX_YIELD
          </div>
          <span className="text-4xl font-bold text-cyan-400 drop-shadow-[2px_2px_0px_#FF00FF]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        ref={gameBoardRef}
        className="relative bg-black border-4 border-fuchsia-500 overflow-hidden shadow-[8px_8px_0px_#00FFFF] outline-none"
        tabIndex={0}
        style={{
          width: '100%',
          maxWidth: '500px',
          aspectRatio: '1/1',
        }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#FF00FF 1px, transparent 1px), linear-gradient(90deg, #FF00FF 1px, transparent 1px)',
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute transition-all duration-75 ${
                isHead 
                  ? 'bg-cyan-400 z-10 border-2 border-fuchsia-500' 
                  : 'bg-cyan-600 border border-cyan-400'
              }`}
              style={{
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
              }}
            />
          );
        })}

        {/* Food */}
        <div
          className="absolute bg-fuchsia-500 border-2 border-cyan-400 animate-pulse"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
          }}
        />

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-red-600 screen-tear">
            <h2 className="text-5xl font-bold text-red-500 mb-2 drop-shadow-[4px_4px_0px_#00FFFF] tracking-widest uppercase glitch-text" data-text="SYSTEM_HALTED">
              SYSTEM_HALTED
            </h2>
            <p className="text-cyan-400 mb-6 text-2xl">FINAL_YIELD: {score}</p>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-black border-4 border-fuchsia-500 text-cyan-400 hover:bg-fuchsia-500 hover:text-black transition-colors shadow-[4px_4px_0px_#00FFFF] font-bold uppercase tracking-wider text-xl"
            >
              <RefreshCw size={24} /> REBOOT_SEQUENCE
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <h2 className="text-5xl font-bold text-fuchsia-500 drop-shadow-[4px_4px_0px_#00FFFF] tracking-widest uppercase animate-pulse">
              CONNECTION_PAUSED
            </h2>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-cyan-400 text-xl flex gap-6 uppercase tracking-widest">
        <span>[W/A/S/D] : OVERRIDE_DIR</span>
        <span>[SPACE] : HALT_PROCESS</span>
      </div>
    </div>
  );
}
