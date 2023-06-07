import SPRITES_CONFIGURATION from '../conf/sprites.js'
import Canvas2DRenderer from '../engine/Canvas2DRenderer.js'
import Game from '../engine/Game.js'
import {Color} from '../engine/Renderer.js'
import loadSprites from '../engine/spriteLoader.js'
import TickUpdater from '../engine/TickUpdater.js'
import ProfilingRenderer from '../profiler/ProfilingRenderer.js'
import makeScene, {defaultCamera} from './scene/_test-TrackSegment.js'

addEventListener('load', async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement
  const sprites = await loadSprites(SPRITES_CONFIGURATION)
  console.log(sprites)
  const renderer = new ProfilingRenderer(new Canvas2DRenderer(canvas, defaultCamera, false))
  const game = new Game(
    renderer,
    new TickUpdater(1_000 / 60),
  )

  game.addGameObject(makeScene({
    billboards: [
      sprites.billboard1,
      sprites.billboard2,
      sprites.billboard3,
      sprites.billboard4,
      sprites.billboard5,
      sprites.billboard6,
      sprites.billboard7,
      sprites.billboard8,
      sprites.billboard9,
    ],
    roadGap: sprites.dirt,
    leftSide: {
      texture: [sprites.grass, sprites.grassEdge],
      impostorColor: new Color(58, 180, 26, 255),
    },
    rightSide: {
      texture: [sprites.oceanEdge, sprites.ocean],
      impostorColor: new Color(26, 149, 180, 255),
    },
  }))

  game.run()
  console.log(game)
  setTimeout(() => {
    game.stop()
    console.log(renderer.renderDurationStats)
  }, 15_000)
})
