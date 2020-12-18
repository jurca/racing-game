import SPRITES_CONFIGURATION from '../conf/sprites.js'
import Canvas2DRenderer from '../engine/Canvas2DRenderer.js'
import Game from '../engine/Game.js'
import loadSprites from '../engine/spriteLoader.js'
import TickUpdater from '../engine/TickUpdater.js'
import makeScene, {defaultCamera} from './scene/_test-RoadSegment-Sprite-TexturedPolygon.js'

addEventListener('load', async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement
  const sprites = await loadSprites(SPRITES_CONFIGURATION)
  console.log(sprites)
  const game = new Game(
    new Canvas2DRenderer(canvas, defaultCamera),
    new TickUpdater(1_000 / 60),
  )

  game.addGameObject(makeScene({
    lowerLeftBillboard: sprites.billboard2,
    polygonTexture: sprites.billboard1,
    spriteScaleSkewTest: sprites.billboard6,
  }))

  game.run()
  console.log(game)
  setTimeout(() => game.stop(), 10_000)
})
