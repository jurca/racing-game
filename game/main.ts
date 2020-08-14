import SPRITES_CONFIGURATION from '../conf/sprites.js'
import Canvas2DRenderer from '../engine/Canvas2DRenderer.js'
import Game from '../engine/Game.js'
import loadSprites from '../engine/spriteLoader.js'
import TickUpdater from '../engine/TickUpdater.js'
import RoadSegment from './object/RoadSegment.js'
import Pseudo3DCamera from './Pseudo3DCamera.js'

const VIEWPORT_WIDTH = 640
const VIEWPORT_HEIGHT = 480
const CAMERA_FIELD_OF_VIEW = 100 // degrees
const CAMERA_VERTICAL_OFFSET = 1_000 // vertical distance from the current road segment it is above

async function main() {
  const canvas = document.getElementById('game') as HTMLCanvasElement
  canvas.width = VIEWPORT_WIDTH
  canvas.height = VIEWPORT_HEIGHT
  const sprites = await loadSprites(SPRITES_CONFIGURATION)
  console.log(sprites)
  const camera = new Pseudo3DCamera(CAMERA_FIELD_OF_VIEW, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0, CAMERA_VERTICAL_OFFSET, 0)
  const game = new Game(
    new Canvas2DRenderer(canvas, camera),
    new TickUpdater(1_000 / 60),
  )
  const widthOffsets = [0, 450, 500]
  for (let i = 0; i < 1000; i++) {
    game.addGameObject(new RoadSegment(
      -500,
      0,
      i * 200,
      1000 + widthOffsets[i % widthOffsets.length],
      1000 + widthOffsets[(i + 1) % widthOffsets.length],
      200,
      0,
      0,
      i % 2 ? 3 : 1,
      50,
      200,
      {
        laneMarker: '#cccccc',
        road: i % 2 ? '#707070' : '#777777',
        rumble: i % 2 ? '#cccccc' : '#999999',
      },
    ))
    game.addGameObject(new RoadSegment(
      -500 + i * i,
      i * 10,
      i * 120,
      700,
      700,
      120,
      i + 8,
      10,
      i % 2 ? 2 : 1,
      50,
      110,
      {
        laneMarker: '#cccccc',
        road: i % 2 ? '#707070' : '#777777',
        rumble: i % 2 ? '#cccccc' : '#999999',
      },
    ))
  }
  game.run()
}

addEventListener('load', main)
