import Renderer, {Color, Sprite} from '../../engine/Renderer.js'
import Vector3 from '../../engine/Vector3.js'
import GameObject from '../object/GameObject.js'
import RoadSegment from '../object/RoadSegment.js'
import SpriteObject from '../object/SpriteObject.js'
import Pseudo3DCamera from '../Pseudo3DCamera.js'
import Scene from './Scene.js'

interface SceneSprites {
  readonly lowerLeftBillboard: Sprite
  readonly spriteScaleSkewTest: Sprite
  readonly polygonTexture: Sprite
}
const VIEWPORT_WIDTH = 640
const VIEWPORT_HEIGHT = 480
const CAMERA_VERTICAL_FIELD_OF_VIEW = 100 // degrees
const CAMERA_VERTICAL_OFFSET = 1_000 // vertical distance from the current road segment it is above

const COLORS = {
  LANE_MARKER: new Color(204, 204, 204),
  ROAD_DARK: new Color(112, 112, 112),
  ROAD_LIGHT: new Color(119, 119, 119),
  RUMBLE_DARK: new Color(153, 153, 153),
  RUMBLE_LIGHT: new Color(204, 204, 204),
}

const WIDTH_OFFSETS = [0, 450, 500]

const roadScene = new Scene()

for (let i = 0; i < 1000; i++) {
  roadScene.addSubObject(new RoadSegment(
    new Vector3(-500, 0, i * 200),
    1000 + WIDTH_OFFSETS[i % WIDTH_OFFSETS.length],
    1000 + WIDTH_OFFSETS[(i + 1) % WIDTH_OFFSETS.length],
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
  roadScene.addSubObject(new RoadSegment(
    new Vector3(-500 + i * i, i * 10, i * 120),
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

export default function makeScene(sprites: SceneSprites): Scene {
  const scene = new Scene()

  scene.addSubObject(roadScene)

  scene.addSubObject(new SpriteObject(new Vector3(-750, 240, 870), sprites.lowerLeftBillboard))

  scene.addSubObject(Object.assign(new GameObject(new Vector3(0, 1_200, 1_000)), {
    tickCounter: 0,
    render(renderer: Renderer): void {
      renderer.drawSprite(
        new Vector3(0, 0, 0),
        sprites.spriteScaleSkewTest,
        0.5 + (this.tickCounter % 32) / 32,
        0.5 + (this.tickCounter % 48) / 48,
        0 + (this.tickCounter > 256 ? (-0.5 + (this.tickCounter % 24) / 24) : 0),
        0 + (this.tickCounter > 256 ? (-0.5 + (this.tickCounter % 32) / 32) : 0),
      )
    },
    updateTick(): void {
      this.tickCounter++
    },
  }))

  scene.addSubObject(Object.assign(new GameObject(new Vector3(200, 0, 900)), {
    tickCounter: 0,
    render(renderer: Renderer): void {
      const point1 = new Vector3(0, 0, 0)
      const point2 = new Vector3(512, 512, 0)
      renderer.drawPolygon({
        surface: new Color(128, 0, 0),
        vertices: [
          point1,
          new Vector3(point2.x + 24 * 16, point1.y, 0),
          new Vector3(point2.x + 24 * 16, point2.y + 32 * 16, 0),
          new Vector3(point1.x, point2.y + 32 * 16, 0),
        ],
      })
      renderer.drawPolygon({
        surface: sprites.polygonTexture,
        vertices: [
          new Vector3(point1.x, point1.y, 0),
          new Vector3(point2.x, point1.y + this.tickCounter % 32 * 16, 0),
          new Vector3(point2.x + this.tickCounter % 24 * 16, point2.y + this.tickCounter % 32 * 16, 0),
          new Vector3(point1.x + this.tickCounter % 24 * 16, point2.y, 0),
        ],
      })
    },
    updateTick(): void {
      this.tickCounter++
    },
  }))

  return scene
}

export const defaultCamera = new Pseudo3DCamera(
  new Vector3(0, CAMERA_VERTICAL_OFFSET, 0),
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  CAMERA_VERTICAL_FIELD_OF_VIEW,
)
