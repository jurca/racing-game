import SPRITES_CONFIGURATION from '../conf/sprites.js'
import Canvas2DRenderer from '../engine/Canvas2DRenderer.js'
import Game from '../engine/Game.js'
import Point3D from '../engine/Point3D.js'
import loadSprites from '../engine/spriteLoader.js'
import TickUpdater from '../engine/TickUpdater.js'
import Pseudo3DCamera from './Pseudo3DCamera.js'
import makeScene from './scene/_test-RoadSegment-Sprite-TexturedPolygon.js'

const VIEWPORT_WIDTH = 640
const VIEWPORT_HEIGHT = 480
const CAMERA_VERTICAL_FIELD_OF_VIEW = 100 // degrees
const CAMERA_VERTICAL_OFFSET = 1_000 // vertical distance from the current road segment it is above

addEventListener('load', async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement
  canvas.width = VIEWPORT_WIDTH
  canvas.height = VIEWPORT_HEIGHT
  const sprites = await loadSprites(SPRITES_CONFIGURATION)
  console.log(sprites)
  const camera = new Pseudo3DCamera(
    new Point3D(0, CAMERA_VERTICAL_OFFSET, 0),
    VIEWPORT_WIDTH,
    VIEWPORT_HEIGHT,
    CAMERA_VERTICAL_FIELD_OF_VIEW,
  )
  const game = new Game(
    new Canvas2DRenderer(canvas, camera),
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
