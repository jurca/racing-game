import SPRITES_CONFIGURATION from '../conf/sprites.js'
import Canvas2DRenderer from '../engine/Canvas2DRenderer.js'
import DynamicResolutionRenderer from '../engine/DynamicResolutionRenderer.js'
import Game from '../engine/Game.js'
import loadSprites from '../engine/spriteLoader.js'
import TickUpdater from '../engine/TickUpdater.js'
import ProfilingRenderer from '../profiler/ProfilingRenderer.js'
import makeDefaultScene, {clearEachFrame} from './scene/_test-Player.js'

const SCALE_STEPS = [1.0, 0.75, 0.5, 0.25]
const TARGET_FRAME_MS = 1_000 / 60              // ~16.67ms — one frame at 60fps
const SCALE_DOWN_THRESHOLD = 1.2               // scale down if EMA exceeds ~20ms (dropped frame)
const SCALE_UP_THRESHOLD = 1.05               // scale up if EMA stays below ~17.5ms for holdFrames
const SCALE_UP_HOLD_FRAMES = 120              // ~2 seconds at 60fps
const EMA_ALPHA = 0.1                          // exponential moving average alpha

addEventListener('load', async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement
  const sprites = await loadSprites(SPRITES_CONFIGURATION)
  console.log(sprites)
  const {scene, camera} = makeDefaultScene(sprites)
  const canvas2DRenderer = new Canvas2DRenderer(canvas, camera, clearEachFrame, SCALE_STEPS[0])
  const renderer = new ProfilingRenderer(new DynamicResolutionRenderer(
    canvas2DRenderer,
    SCALE_STEPS,
    TARGET_FRAME_MS,
    SCALE_DOWN_THRESHOLD,
    SCALE_UP_THRESHOLD,
    SCALE_UP_HOLD_FRAMES,
    EMA_ALPHA,
  ))
  canvas.style.width = `${camera.viewportWidth}px`
  canvas.style.height = `${camera.viewportHeight}px`
  const game = new Game(
    renderer,
    new TickUpdater(1_000 / 60),
  )

  game.addGameObject(scene)

  game.run()
  console.log(game)
  setTimeout(() => {
    game.stop()
    console.log(renderer.frameDurationStats)
  }, 15_000)
})
