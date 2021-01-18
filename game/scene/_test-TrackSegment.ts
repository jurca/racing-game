import Game from '../../engine/Game.js'
import Point3D from '../../engine/Point3D.js'
import {Color, Sprite} from '../../engine/Renderer.js'
import Pseudo3DCamera from '../Pseudo3DCamera.js'
import TrackSegment from '../object/TrackSegment.js'
import RoadSegment from '../object/RoadSegment.js'
import SpriteObject from '../object/SpriteObject.js'
import Scene from './Scene.js'

const VIEWPORT_WIDTH = 1_060
const VIEWPORT_HEIGHT = 600

const BASE_CAMERA_HEIGHT = 600

const ROAD_SEGMENT_LENGTH = 200
const ROAD_WIDTH = 1_000
const LANE_MARKER_WIDTH = 80
const RUMBLE_WIDTH = 100
const MAX_SIDE_REPEATED_POLYGONS = 6
const MAX_BETWEEN_ROADS_REPEATED_POLYGONS = 3

interface RoadConfiguration {
  readonly left: Color | readonly [Sprite, ...Sprite[]]
  readonly right: Color | readonly [Sprite, ...Sprite[]]
  readonly roadGap: Color | Sprite
  readonly lanes: number
  readonly colors: {
    readonly road: Color
    readonly laneMarker: Color
    readonly rumble: Color
  },
}

const ROAD_CONFIGURATIONS: readonly RoadConfiguration[] = [
  {
    left: new Color(12, 194, 6),
    right: new Color(8, 31, 167),
    roadGap: new Color(64, 48, 10),
    lanes: 1,
    colors: {
      road: new Color(80, 80, 80),
      laneMarker: new Color(240, 240, 240),
      rumble: new Color(160, 160, 160),
    },
  },
  {
    left: new Color(12, 174, 6),
    right: new Color(8, 31, 187),
    roadGap: new Color(94, 72, 18),
    lanes: 1,
    colors: {
      road: new Color(100, 100, 100),
      laneMarker: new Color(240, 240, 240),
      rumble: new Color(140, 140, 140),
    },
  },
  {
    left: new Color(12, 184, 6),
    right: new Color(8, 31, 177),
    roadGap: new Color(64, 48, 10),
    lanes: 3,
    colors: {
      road: new Color(95, 95, 95),
      laneMarker: new Color(210, 210, 210),
      rumble: new Color(150, 150, 150),
    },
  },
  {
    left: new Color(12, 164, 6),
    right: new Color(8, 31, 197),
    roadGap: new Color(94, 72, 18),
    lanes: 3,
    colors: {
      road: new Color(110, 110, 110),
      laneMarker: new Color(190, 190, 190),
      rumble: new Color(130, 130, 130),
    },
  },
]

class TrackSegmentTestScene extends Scene {
  #tickIndex = 0

  public updateTick(game: Game, isLastTickInSequence: boolean): void {
    super.updateTick(game, isLastTickInSequence)
    this.#tickIndex++
    game.camera.position.z += 10
    game.camera.position.x = Math.sin(this.#tickIndex / 160) * 1_600
    game.camera.position.y = Math.sin(this.#tickIndex / 80) * (BASE_CAMERA_HEIGHT / 2) + BASE_CAMERA_HEIGHT
  }
}

// TODO: test sprites as textures of left/right side

interface SceneData {
  readonly billboards: readonly Sprite[]
  readonly roadGap?: Sprite
  readonly leftSide?: readonly [Sprite, ...Sprite[]]
  readonly rightSide?: readonly [Sprite, ...Sprite[]]
}

export default function makeScene(data: SceneData): Scene {
  const scene = new TrackSegmentTestScene()

  // Create the segments in reverse order to have the segments rendered from the farthest to the closest
  for (let segmentIndex = 256; segmentIndex >= 0; segmentIndex--) {
    const roadSegmentConfiguration = ROAD_CONFIGURATIONS[segmentIndex % ROAD_CONFIGURATIONS.length]
    scene.addSubObject(new TrackSegment(
      new Point3D(0, 0, segmentIndex * ROAD_SEGMENT_LENGTH),
      data.leftSide || roadSegmentConfiguration.left,
      [
        new RoadSegment(
          new Point3D(-ROAD_WIDTH * 1.5, 0, 0),
          ROAD_WIDTH,
          ROAD_WIDTH,
          ROAD_SEGMENT_LENGTH,
          0,
          0,
          roadSegmentConfiguration.lanes,
          LANE_MARKER_WIDTH,
          RUMBLE_WIDTH,
          roadSegmentConfiguration.colors,
        ),
        data.roadGap || roadSegmentConfiguration.roadGap,
        new RoadSegment(
          new Point3D(0, 120, 0),
          ROAD_WIDTH,
          ROAD_WIDTH,
          ROAD_SEGMENT_LENGTH,
          0,
          0,
          roadSegmentConfiguration.lanes,
          LANE_MARKER_WIDTH,
          RUMBLE_WIDTH,
          roadSegmentConfiguration.colors,
        ),
        data.roadGap || roadSegmentConfiguration.roadGap,
        new RoadSegment(
          new Point3D(ROAD_WIDTH * 1.5, 0, 0),
          ROAD_WIDTH,
          ROAD_WIDTH,
          ROAD_SEGMENT_LENGTH,
          0,
          0,
          roadSegmentConfiguration.lanes,
          LANE_MARKER_WIDTH,
          RUMBLE_WIDTH,
          roadSegmentConfiguration.colors,
        ),
      ],
      data.rightSide || roadSegmentConfiguration.right,
      data.billboards.length && Math.random() < 0.1
        ? [
            new SpriteObject(
              new Point3D(-ROAD_WIDTH * 2 - 680, 0, 0),
              data.billboards[Math.floor(Math.random() * data.billboards.length)],
              3,
            ),
          ]
        : [],
      MAX_SIDE_REPEATED_POLYGONS,
      MAX_BETWEEN_ROADS_REPEATED_POLYGONS,
      MAX_SIDE_REPEATED_POLYGONS,
    ))
  }

  return scene
}

export const defaultCamera = new Pseudo3DCamera(
  new Point3D(0, BASE_CAMERA_HEIGHT, 0),
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  60,
)
