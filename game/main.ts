import SPRITES_CONFIGURATION from '../conf/sprites.js'
import Canvas2DRenderer from '../engine/Canvas2DRenderer.js'
import Game from '../engine/Game.js'
import loadSprites from '../engine/spriteLoader.js'
import TickUpdater from '../engine/TickUpdater.js'
import ProfilingRenderer from '../profiler/ProfilingRenderer.js'
import makeDefaultScene, {clearEachFrame, defaultCamera} from './scene/_test-Track.js'

addEventListener('load', async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement
  const sprites = await loadSprites(SPRITES_CONFIGURATION)
  console.log(sprites)
  const renderer = new ProfilingRenderer(new Canvas2DRenderer(canvas, defaultCamera, clearEachFrame))
  const game = new Game(
    renderer,
    new TickUpdater(1_000 / 60),
  )

  game.addGameObject(makeDefaultScene(sprites))

  game.run()
  console.log(game)
  setTimeout(() => {
    game.stop()
    console.log(renderer.renderDurationStats)
  }, 15_000)
})
