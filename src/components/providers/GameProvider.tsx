// import { create } from 'zustand';
// import SHA256 from 'sha.js/sha256'
// import { createContext, useState } from 'react';

// export type Point = { x: number; y: number }
// export type Move = { dir: string; t: number }
// export type Dir = 'U' | 'D' | 'L' | 'R'

// interface GameState {
//   running: boolean
//   score: number
//   best: number | null
//   gameOver: boolean
//   showShare: boolean
//   skin: 'nokia' | 'neon' | 'gold'
//   snake: Point[]
//   dir: Point
//   nextDir: Point | null
//   food: Point | null
//   tickMs: number
//   moves: Move[]
//   sessionToken: string | null
//   lastTickTs: number
//   lastSubmit: number
//   status: 'idle' | 'playing' | 'paused'
  
//   startGame: () => void
//   resetGame: (gridW: number, gridH: number) => void
//   setDirection: (dir: Point, code: Dir) => void
//   tick: (gridW: number, gridH: number) => void
//   handleGameOver: () => void
//   spawnFood: (gridW: number, gridH: number) => void
//   generateMovesHash: () => string
//   setSessionToken: (token: string) => void
//   toggleShare: (val: boolean) => void
//   togglePause: () => void
// }
// type COORDS = {x: number, y:number}
// type MOVES = {dir: number, t:number}
// const GameContext = createContext<GameState | undefined>(undefined)

// export const GameProvider = () => {
//     const [score, setScore] = useState(0)
//     const [running, setRunning] = useState(false)
//     const [best, setBest] = useState(null)
//     const [gameOver, setGameOver] = useState(false)
//     const [showShare, setShowShare] = useState(false)
//     const [skin, setSkin] = useState('nokia')
//     const [snake, setSnake] = useState<COORDS[]>([])
//     const [dir, setDir] = useState<COORDS>({x: 1, y: 0})
//     const [nextDir, setNextDir] = useState(null)
//     const [food, setFood] = useState<COORDS | null>(null)
//     const [tickMs, setTickMs] = useState(120)
//     const [moves, setMoves] = useState<MOVES[]>([])
//     const [lastTickTs, setLastTickTs] = useState(0)
//     const [lastSubmit, setLastSubmit] = useState(0)
//     const [status, setStatus] = useState('idle')

//     // const set = (states={}) => {
//     //   Object.entries(states).forEach(([key, value]) => {
//     //     const getStateHandler = () => {
//     //       const name = 'set' + key.charAt(0).toUpperCase()
//     //       return name
//     //     }
//     //   });
//     // }

//     const startGame = () => {
//       // resetGame(20, 20) // default grid size
//       setRunning(true)
//       setGameOver(false)
//       setShowShare(false)
//       setStatus('playing')
//     },
  
//     const resetGame =  (gridW: number, gridH: number) => {
//       const cx = Math.floor(gridW / 2)
//       const cy = Math.floor(gridH / 2)
//       setSnake([{ x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy }])
//       setDir({ x: 1, y: 0 })
//       setNextDir(null)
//       setTickMs(120)
//       setScore(0)
//       setMoves([])
//       setLastTickTs(0)
//       setStatus('idle')

//       spawnFood(gridW, gridH)
//     },
  
//     const setDirection = (dir:COORDS, code:number) => {
//       const curDir = dir
//       if (curDir.x + dir.x === 0 && curDir.y + dir.y === 0) return
//       setNextDir(dir)
//       setMoves([...moves, { dir: code, t: Date.now() }])
//     },
  
//     const tick = (gridW: number, gridH: number) => {
//       const newSnake = [...snake]
//       if (nextDir) {setDir(nextDir)
//         setNextDir(null)}
//       const head = { x: newSnake[0].x + dir.x, y: newSnake[0].y + dir.y }
  
//       // wrap edges
//       if (head.x < 0) head.x = gridW - 1
//       if (head.x >= gridW) head.x = 0
//       if (head.y < 0) head.y = gridH - 1
//       if (head.y >= gridH) head.y = 0
  
//       // self-collision
//       if (snake.some(s => s.x === head.x && s.y === head.y)) {
//         handleGameOver()
//         return
//       }
  
//       snake.unshift(head)
  
//       const food = food
//       if (food && head.x === food.x && head.y === food.y) {
//         set({ score: score + 1, tickMs: Math.max(40, tickMs - 6) })
//         spawnFood(gridW, gridH)
//       } else {
//         snake.pop()
//       }
  
//       set({ snake })
//     },
  
//     handleGameOver: () => {
//       set({ running: false, gameOver: true, best: Math.max(best ?? 0, score), status: 'idle' })
//       // Here you can call score submission API
//     },
  
//     const spawnFood = (gridW: number, gridH: number) => {
//       let x = Math.floor(Math.random() * gridW)
//       let y = Math.floor(Math.random() * gridH)
//       let tries = 0
//       while (snake.some(s => s.x === x && s.y === y) && tries < 200) {
//         x = Math.floor(Math.random() * gridW)
//         y = Math.floor(Math.random() * gridH)
//         tries++
//       }
//       setFood({ x, y })
//     },
  
//     generateMovesHash: () => {
//       try {
//         const payload = JSON.stringify({
//           moves: moves.slice(0, 500),
//           score: score,
//           durationMs: 0
//         })
//         return new SHA256().update(payload).digest('hex')
//       } catch {
//         return ''
//       }
//     },
  
//     setSessionToken: (token) => set({ sessionToken: token }),
//     toggleShare: (val) => set({ showShare: val }),
//     togglePause: () => set({ running: !running, status: running ? 'paused' : 'playing' })

//     return (
//         <GameContext.Provider value={{}}>{children}</GameContext.Provider>
//     )
// }
// export const useGameStore = create<GameState>((set, get) => ({
  
// }))

// export const useGame = () => {
//   const running = useGameStore(state => state.running)
//   const startGame = useGameStore(state => state.startGame)
//   const togglePause = useGameStore(state => state.togglePause)
//   const gameOver = useGameStore(state => state.gameOver)
//   const tickMs = useGameStore(state => state.tickMs)
//   const lastTickTs = useGameStore(state => state.lastTickTs)
//   const tick = useGameStore(state => state.tick)
//   const resetGame = useGameStore(state => state.resetGame)
//   const setDirection = useGameStore(state => state.setDirection)
//   const skin = useGameStore(state => state.skin)
//   const snake = useGameStore(state => state.snake)
//   const food = useGameStore(state => state.food)
//   const score = useGameStore(state => state.score)
//   const best = useGameStore(state => state.best)
//   const showShare = useGameStore(state => state.showShare)
//   const toggleShare = useGameStore(state => state.toggleShare)
//   const status = useGameStore(state => state.status)

//   return {
//     running,
//     startGame,
//     togglePause,
//     gameOver,
//     tickMs,
//     lastTickTs,
//     tick,
//     resetGame,
//     setDirection,
//     skin,
//     snake,
//     food,
//     score,
//     best,
//     showShare,
//     toggleShare,
//     status
//   }
// }