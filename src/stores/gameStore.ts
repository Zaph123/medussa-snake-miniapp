import SHA256 from 'sha.js/sha256'
import { create } from 'zustand';

export type Point = { x: number; y: number }
export type Move = { dir: string; t: number }
export type Dir = 'U' | 'D' | 'L' | 'R'

interface GameState {
  running: boolean
  score: number
  best: number | null
  gameOver: boolean
  showShare: boolean
  skin: 'nokia' | 'neon' | 'gold'
  snake: Point[]
  dir: Point
  nextDir: Point | null
  food: Point | null
  tickMs: number
  moves: Move[]
  sessionToken: string | null
  lastTickTs: number
  lastSubmit: number
  status: 'idle' | 'playing' | 'paused'

  startGame: () => void
  resetGame: (gridW: number, gridH: number) => void
  setDirection: (dir: Point, code: Dir) => void
  tick: (gridW: number, gridH: number) => void
  handleGameOver: () => void
  spawnFood: (gridW: number, gridH: number) => void
  generateMovesHash: () => string
  setSessionToken: (token: string) => void
  toggleShare: (val: boolean) => void
  togglePause: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  running: false,
  score: 0,
  best: null,
  gameOver: false,
  showShare: false,
  skin: 'nokia',
  snake: [],
  dir: { x: 1, y: 0 },
  nextDir: null,
  food: null,
  tickMs: 120,
  moves: [],
  sessionToken: null,
  lastTickTs: 0,
  lastSubmit: 0,
  status: 'idle',

  startGame: () => {
    // get().resetGame(20, 20) // default grid size
    set({ running: true, gameOver: false, showShare: false, status: 'playing' })
  },

  resetGame: (gridW, gridH) => {
    const cx = Math.floor(gridW / 2)
    const cy = Math.floor(gridH / 2)
    set({
      snake: [{ x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy }],
      dir: { x: 1, y: 0 },
      nextDir: null,
      tickMs: 120, // tick speed in ms
      score: 0,
      moves: [],
      lastTickTs: 0,
      status: 'idle',
    })
    get().spawnFood(gridW, gridH)
  },

  setDirection: (dir, code) => {
    const curDir = get().dir
    if (curDir.x + dir.x === 0 && curDir.y + dir.y === 0) return
    set({ nextDir: dir, moves: [...get().moves, { dir: code, t: Date.now() }] })
  },

  tick: (gridW, gridH) => {
    const snake = [...get().snake]
    const nextDir = get().nextDir
    if (nextDir) set({ dir: nextDir, nextDir: null })
    const dir = get().dir
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }

    // wrap edges
    if (head.x < 0) head.x = gridW - 1
    if (head.x >= gridW) head.x = 0
    if (head.y < 0) head.y = gridH - 1
    if (head.y >= gridH) head.y = 0

    // self-collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      get().handleGameOver()
      return
    }

    snake.unshift(head)

    const food = get().food
    if (food && head.x === food.x && head.y === food.y) {
      set({ score: get().score + 1, tickMs: Math.max(40, get().tickMs - 6) })
      get().spawnFood(gridW, gridH)
    } else {
      snake.pop()
    }

    set({ snake })
  },

  handleGameOver: () => {
    set({ running: false, gameOver: true, best: Math.max(get().best ?? 0, get().score), status: 'idle' })
    // Here you can call score submission API
  },

  spawnFood: (gridW, gridH) => {
    let x = Math.floor(Math.random() * gridW)
    let y = Math.floor(Math.random() * gridH)
    const snake = get().snake
    let tries = 0
    while (snake.some(s => s.x === x && s.y === y) && tries < 200) {
      x = Math.floor(Math.random() * gridW)
      y = Math.floor(Math.random() * gridH)
      tries++
    }
    set({ food: { x, y } })
  },

  generateMovesHash: () => {
    try {
      const payload = JSON.stringify({
        moves: get().moves.slice(0, 500),
        score: get().score,
        durationMs: 0
      })
      return new SHA256().update(payload).digest('hex')
    } catch {
      return ''
    }
  },

  setSessionToken: (token) => set({ sessionToken: token }),
  toggleShare: (val) => set({ showShare: val }),
  togglePause: () => set({ running: !get().running, status: get().running ? 'paused' : 'playing' }),
}))

export const useGame = () => {
  const running = useGameStore(state => state.running)
  const startGame = useGameStore(state => state.startGame)
  const togglePause = useGameStore(state => state.togglePause)
  const gameOver = useGameStore(state => state.gameOver)
  const tickMs = useGameStore(state => state.tickMs)
  const lastTickTs = useGameStore(state => state.lastTickTs)
  const tick = useGameStore(state => state.tick)
  const resetGame = useGameStore(state => state.resetGame)
  const setDirection = useGameStore(state => state.setDirection)
  const skin = useGameStore(state => state.skin)
  const snake = useGameStore(state => state.snake)
  const food = useGameStore(state => state.food)
  const score = useGameStore(state => state.score)
  const best = useGameStore(state => state.best)
  const showShare = useGameStore(state => state.showShare)
  const toggleShare = useGameStore(state => state.toggleShare)
  const status = useGameStore(state => state.status)

  return {
    running,
    startGame,
    togglePause,
    gameOver,
    tickMs,
    lastTickTs,
    tick,
    resetGame,
    setDirection,
    skin,
    snake,
    food,
    score,
    best,
    showShare,
    toggleShare,
    status
  }
}