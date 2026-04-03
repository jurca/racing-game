import Color from '../../engine/Color.js'
import {Sprite} from '../../engine/Renderer.js'
import Vector3 from '../../engine/Vector3.js'
import Pseudo3DCamera from '../Pseudo3DCamera.js'
import FollowCamera from '../object/FollowCamera.js'
import Player from '../object/Player.js'
import TrackSegment, {TrackSegmentTexturedSide} from '../object/TrackSegment.js'
import RoadSegment from '../object/RoadSegment.js'
import SpriteObject from '../object/SpriteObject.js'
import SkyBox from '../object/SkyBox.js'
import {Track} from '../object/Track.js'
import Scene from './Scene.js'

const VIEWPORT_WIDTH = 1_060
const VIEWPORT_HEIGHT = 600

const BASE_CAMERA_HEIGHT = 600

const RENDER_DISTANCE = 48

const ROAD_SEGMENT_LENGTH = 256
const ROAD_WIDTH = 1_000
const LANE_MARKER_WIDTH = 80
const RUMBLE_WIDTH = 100
const MAX_SIDE_REPEATED_POLYGONS = 6
const MAX_BETWEEN_ROADS_REPEATED_POLYGONS = 3

interface RoadConfiguration {
  readonly left: Color | TrackSegmentTexturedSide
  readonly right: Color | TrackSegmentTexturedSide
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

export default function makeDefaultScene(
  sprites: {readonly [spriteId: string]: Sprite},
): {scene: Scene, camera: Pseudo3DCamera} {
  const scene = new Scene()

  scene.addSubObject(new SkyBox(sprites.background, 0.1))

  const billboards = [
    sprites.billboard1,
    sprites.billboard2,
    sprites.billboard3,
    sprites.billboard4,
    sprites.billboard5,
    sprites.billboard6,
    sprites.billboard7,
    sprites.billboard8,
    sprites.billboard9,
  ]

  const segments = [] as TrackSegment[]
  for (let segmentIndex = 256; segmentIndex >= 0; segmentIndex--) {
    const roadConfig = ROAD_CONFIGURATIONS[segmentIndex % ROAD_CONFIGURATIONS.length]
    segments.push(new TrackSegment(
      new Vector3(0, 0, segmentIndex * ROAD_SEGMENT_LENGTH),
      {
        texture: [sprites.grass, sprites.grassEdge],
        impostorColor: new Color(58, 180, 26, 255),
      },
      [
        new RoadSegment(
          new Vector3(-ROAD_WIDTH * 1.5, 0, 0),
          ROAD_WIDTH,
          ROAD_WIDTH,
          ROAD_SEGMENT_LENGTH,
          0,
          0,
          roadConfig.lanes,
          LANE_MARKER_WIDTH,
          RUMBLE_WIDTH,
          roadConfig.colors,
        ),
        sprites.dirt,
        new RoadSegment(
          new Vector3(0, 120, 0),
          ROAD_WIDTH,
          ROAD_WIDTH,
          ROAD_SEGMENT_LENGTH,
          0,
          0,
          roadConfig.lanes,
          LANE_MARKER_WIDTH,
          RUMBLE_WIDTH,
          roadConfig.colors,
        ),
        sprites.dirt,
        new RoadSegment(
          new Vector3(ROAD_WIDTH * 1.5, 0, 0),
          ROAD_WIDTH,
          ROAD_WIDTH,
          ROAD_SEGMENT_LENGTH,
          0,
          0,
          roadConfig.lanes,
          LANE_MARKER_WIDTH,
          RUMBLE_WIDTH,
          roadConfig.colors,
        ),
      ],
      {
        texture: [sprites.oceanEdge, sprites.ocean],
        impostorColor: new Color(26, 149, 180, 255),
      },
      billboards.length && Math.random() < 0.1
        ? [
            new SpriteObject(
              new Vector3(-ROAD_WIDTH * 2 - 680, 0, 0),
              billboards[Math.floor(Math.random() * billboards.length)],
              3,
            ),
          ]
        : [],
      MAX_SIDE_REPEATED_POLYGONS,
      MAX_BETWEEN_ROADS_REPEATED_POLYGONS,
      MAX_SIDE_REPEATED_POLYGONS,
    ))
  }

  scene.addSubObject(new Track(new Vector3(0, 0, 0), segments, RENDER_DISTANCE))

  const player = new Player(
    new Vector3(0, 0, 0),
    sprites.playerStraight,
    2.3,
    2.3,
    2,
    3,
    96,
  )
  scene.addSubObject(player)

  const camera = new Pseudo3DCamera(
    new Vector3(0, BASE_CAMERA_HEIGHT, -1_100),
    VIEWPORT_WIDTH,
    VIEWPORT_HEIGHT,
    60 / 180 * Math.PI,
  )
  scene.addSubObject(new FollowCamera(camera, player, new Vector3(0, BASE_CAMERA_HEIGHT, -1_100), 0.1))

  return {scene, camera}
}

export const clearEachFrame = false
