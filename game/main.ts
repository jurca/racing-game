import SPRITES_CONFIGURATION from '../conf/sprites.js'
import Canvas2DRenderer from '../engine/Canvas2DRenderer.js'
import Game from '../engine/Game.js'
import Point3D from '../engine/Point3D.js'
import Renderer, {Color} from '../engine/Renderer.js'
import loadSprites from '../engine/spriteLoader.js'
import TickUpdater from '../engine/TickUpdater.js'
import GameObject from './object/GameObject.js'
import RoadSegment from './object/RoadSegment.js'
import SpriteObject from './object/SpriteObject.js'
import Pseudo3DCamera from './Pseudo3DCamera.js'

const VIEWPORT_WIDTH = 640
const VIEWPORT_HEIGHT = 480
const CAMERA_FIELD_OF_VIEW = 100 // degrees
const CAMERA_VERTICAL_OFFSET = 1_000 // vertical distance from the current road segment it is above

const COLORS = {
  LANE_MARKER: new Color(204, 204, 204),
  ROAD_DARK: new Color(112, 112, 112),
  ROAD_LIGHT: new Color(119, 119, 119),
  RUMBLE_DARK: new Color(153, 153, 153),
  RUMBLE_LIGHT: new Color(204, 204, 204),
}

addEventListener('load', async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement
  canvas.width = VIEWPORT_WIDTH
  canvas.height = VIEWPORT_HEIGHT
  const sprites = await loadSprites(SPRITES_CONFIGURATION)
  console.log(sprites)
  const camera = new Pseudo3DCamera(
    CAMERA_FIELD_OF_VIEW,
    VIEWPORT_WIDTH,
    VIEWPORT_HEIGHT,
    new Point3D(0, CAMERA_VERTICAL_OFFSET, 0),
  )
  const game = new Game(
    new Canvas2DRenderer(canvas, camera),
    new TickUpdater(1_000 / 60),
  )

  const widthOffsets = [0, 450, 500]
  for (let i = 0; i < 1000; i++) {
    game.addGameObject(new RoadSegment(
      new Point3D(-500, 0, i * 200),
      1000 + widthOffsets[i % widthOffsets.length],
      1000 + widthOffsets[(i + 1) % widthOffsets.length],
      200,
      0,
      0,
      i % 2 ? 3 : 1,
      50,
      200,
      {
        laneMarker: COLORS.LANE_MARKER,
        road: i % 2 ? COLORS.ROAD_DARK : COLORS.ROAD_LIGHT,
        rumble: i % 2 ? COLORS.RUMBLE_LIGHT : COLORS.RUMBLE_DARK,
      },
    ))
    game.addGameObject(new RoadSegment(
      new Point3D(-500 + i * i, i * 10, i * 120),
      700,
      700,
      120,
      i + 8,
      10,
      i % 2 ? 2 : 1,
      50,
      110,
      {
        laneMarker: COLORS.LANE_MARKER,
        road: i % 2 ? COLORS.ROAD_DARK : COLORS.ROAD_LIGHT,
        rumble: i % 2 ? COLORS.RUMBLE_LIGHT : COLORS.RUMBLE_DARK,
      },
    ))
  }

  game.addGameObject(new SpriteObject(new Point3D(-750, 240, 870), sprites.billboard2))

  const spriteTest = Object.assign(new GameObject(new Point3D(0, 1_200, 1_000)), {
    tickCounter: 0,
    render(renderer: Renderer): void {
      renderer.drawSprite(
        new Point3D(0, 0, 0),
        sprites.billboard6,
        0.5 + (this.tickCounter % 32) / 32,
        0.5 + (this.tickCounter % 48) / 48,
        0 + (this.tickCounter > 256 ? (-0.5 + (this.tickCounter % 24) / 24) : 0),
        0 + (this.tickCounter > 256 ? (-0.5 + (this.tickCounter % 32) / 32) : 0),
      )
    },
    updateTick(): void {
      this.tickCounter++
    },
  })
  game.addGameObject(spriteTest)

  const spriteTexturedPolygonTest = Object.assign(new GameObject(new Point3D(200, 0, 900)), {
    tickCounter: 0,
    render(renderer: Renderer): void {
      const point1 = new Point3D(0, 0, 0)
      const point2 = new Point3D(512, 512, 0)
      renderer.drawPolygon({
        surface: new Color(128, 0, 0),
        vertices: [
          point1,
          new Point3D(point2.x + 24 * 16, point1.y, 0),
          new Point3D(point2.x + 24 * 16, point2.y + 32 * 16, 0),
          new Point3D(point1.x, point2.y + 32 * 16, 0),
        ],
      })
      renderer.drawPolygon({
        surface: sprites.billboard1,
        vertices: [
          new Point3D(point1.x, point1.y, 0),
          new Point3D(point2.x, point1.y + this.tickCounter % 32 * 16, 0),
          new Point3D(point2.x + this.tickCounter % 24 * 16, point2.y + this.tickCounter % 32 * 16, 0),
          new Point3D(point1.x + this.tickCounter % 24 * 16, point2.y, 0),
        ],
      })
    },
    updateTick(): void {
      this.tickCounter++
    },
  })
  game.addGameObject(spriteTexturedPolygonTest)

  game.run()
  console.log(game)
  setTimeout(() => game.stop(), 10_000)
})
