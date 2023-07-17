import Color from '../../engine/Color.js'
import Game from '../../engine/Game.js'
import {Mesh, Polygon, Sprite} from '../../engine/Renderer.js'
import {clamp, lastItem} from '../../engine/util.js'
import Vector2 from '../../engine/Vector2.js'
import Vector3 from '../../engine/Vector3.js'
import MeshObject from './MeshObject.js'
import RoadSegment from './RoadSegment.js'
import SpriteObject from './SpriteObject.js'

const EMPTY_MESH: Mesh = []

const MAX_SPRITE_TILING_MULTIPLIER = 32

const MIN_TEXTURED_POLYGON_HEIGHT = 1 + Number.EPSILON

export interface TrackSegmentTexturedSide {
  readonly texture: readonly [Sprite, ...Sprite[]]
  readonly impostorColor: Color
}

class SideSurfaceTiles {
  readonly x1: Sprite
  readonly x2!: Sprite
  readonly x4!: Sprite
  readonly x8!: Sprite
  readonly x16!: Sprite
  readonly x32!: Sprite

  constructor(tile: Sprite) {
    this.x1 = tile
    for (let scale = 2; scale <= MAX_SPRITE_TILING_MULTIPLIER; scale *= 2) {
      const scalingCanvas = document.createElement('canvas')
      scalingCanvas.width = tile.width * scale
      scalingCanvas.height = tile.height
      const canvasContext =
        scalingCanvas.getContext('2d') ||
        (() => { throw new Error('Cannot create 2D canvas context') })()
      const halfScaleTile = this[`x${scale / 2}` as keyof SideSurfaceTiles]
      canvasContext.drawImage(halfScaleTile.data, 0, 0)
      canvasContext.drawImage(halfScaleTile.data, halfScaleTile.width, 0)
      this[`x${scale}` as keyof SideSurfaceTiles] = new Sprite(scalingCanvas)
    }
  }
}

class SideSurface {
  constructor (
    readonly baseColor: Color,
    readonly texture: null | {
      readonly sprites: readonly [Sprite, ...Sprite[]],
      readonly tiles: SideSurfaceTiles,
    },
  ) {}
}

const sideSurfaceTileCache = new WeakMap<Sprite, SideSurfaceTiles>()

export default class TrackSegment extends MeshObject {
  readonly #staticMesh: Mesh
  #dynamicMesh: Mesh = [] // additional left- and right-side polygons to fill the screen side-to-side
  readonly #leftLeadingStaticMeshCorner: Readonly<Vector3>
  readonly #rightLeadingStaticMeshCorner: Readonly<Vector3>
  readonly #leftTrailingStaticMeshCorner: Readonly<Vector3>
  readonly #rightTrailingStaticMeshCorner: Readonly<Vector3>
  readonly #leftSideSurface: SideSurface
  readonly #rightSideSurface: SideSurface
  readonly #maxLeftSideRepeatedPolygons: number
  readonly #maxRightSideRepeatedPolygons: number
  #isBackToCamera = false

  constructor(
    position: Vector3,
    leftSide: Color | TrackSegmentTexturedSide,
    roadArea: ReadonlyArray<RoadSegment | Color | Sprite>,
    rightSide: Color | TrackSegmentTexturedSide,
    sprites: readonly SpriteObject[],
    maxLeftSideRepeatedPolygons: number,
    maxBetweenRoadRepeatedPolygons: number,
    maxRightSideRepeatedPolygons: number,
  ) {
    super(position)

    if (
      !roadArea.length ||
      roadArea.some((roadAreaItem, index) => !(index % 2
        ? roadAreaItem instanceof Sprite || roadAreaItem instanceof Color
        : roadAreaItem instanceof RoadSegment
      ))
    ) {
      throw new Error(
        'The road area must be a non-empty array with odd length where every odd item is a RoadSegment instance and ' +
        'every event item is a Sprite instance',
      )
    }

    const roadSegments = roadArea.filter(
      (roadAreaItem): roadAreaItem is RoadSegment => roadAreaItem instanceof RoadSegment,
    ).sort(
      (segment1, segment2) => segment1.position.x - segment2.position.x,
    ) as [RoadSegment, ...RoadSegment[]]
    if (
      roadArea.some((roadAreaItem, index) => !(index % 2) && roadAreaItem !== roadSegments[index / 2])
    ) {
      throw new Error(
        'The road segments must be sorted from the left-most (lowest x coordinate) the the right-most (highest x ' +
        'coordinate)',
      )
    }

    const mostLeftLeadingRoadCorner = roadSegments[0].leadingLeftCorner.add(roadSegments[0].position)
    const mostRightLeadingRoadCorner = lastItem(roadSegments).leadingRightCorner.add(lastItem(roadSegments).position)
    const mostLeftTrailingRoadCorner = roadSegments[0].trailingLeftCorner.add(roadSegments[0].position)
    const mostRightTrailingRoadCorner = lastItem(roadSegments).trailingRightCorner.add(lastItem(roadSegments).position)
    const polygons: Polygon[] = []

    // Place the fixed polygons between road segments and screen edges
    this.#leftLeadingStaticMeshCorner = mostLeftLeadingRoadCorner
    this.#leftTrailingStaticMeshCorner = mostLeftTrailingRoadCorner
    if (!(leftSide instanceof Color) && leftSide.texture.length > 1) {
      const sprites = leftSide.texture.slice(1).reverse()[Symbol.iterator]()
      for (
        let {value: sprite, done} = sprites.next(),
          rightLeadingCorner = mostLeftLeadingRoadCorner,
          rightTrailingCorner = mostLeftTrailingRoadCorner,
          leftLeadingCorner = rightLeadingCorner.subtract(new Vector3(sprite?.width ?? 0, 0, 0)),
          leftTrailingCorner = rightTrailingCorner.subtract(new Vector3(sprite?.width ?? 0, 0, 0));
        !done;
        {value: sprite, done} = sprites.next(),
        rightLeadingCorner = leftLeadingCorner,
        rightTrailingCorner = leftTrailingCorner,
        leftLeadingCorner = rightLeadingCorner.subtract(new Vector3(sprite?.width ?? 0, 0, 0)),
        leftTrailingCorner = rightTrailingCorner.subtract(new Vector3(sprite?.width ?? 0, 0, 0))
      ) {
        polygons.push({
          surface: sprite,
          vertices: [leftLeadingCorner, rightLeadingCorner, rightTrailingCorner, leftTrailingCorner],
        })
        this.#leftLeadingStaticMeshCorner = leftLeadingCorner
        this.#leftTrailingStaticMeshCorner = leftTrailingCorner
      }
    }
    this.#rightLeadingStaticMeshCorner = mostRightLeadingRoadCorner
    this.#rightTrailingStaticMeshCorner = mostRightTrailingRoadCorner
    if (!(rightSide instanceof Color) && rightSide.texture.length > 1) {
      const sprites = rightSide.texture.slice(0, -1)[Symbol.iterator]()
      for (
        let {value: sprite, done} = sprites.next(),
          leftLeadingCorner = mostRightLeadingRoadCorner,
          leftTrailingCorner = mostRightTrailingRoadCorner,
          rightLeadingCorner = leftLeadingCorner.add(new Vector3(sprite?.width ?? 0, 0, 0)),
          rightTrailingCorner = leftTrailingCorner.add(new Vector3(sprite?.width ?? 0, 0, 0));
        !done;
        {value: sprite, done} = sprites.next(),
        leftLeadingCorner = rightLeadingCorner,
        leftTrailingCorner = rightTrailingCorner,
        rightLeadingCorner = leftLeadingCorner.add(new Vector3(sprite?.width ?? 0, 0, 0)),
        rightTrailingCorner = leftTrailingCorner.add(new Vector3(sprite?.width ?? 0, 0, 0))
      ) {
        polygons.push({
          surface: sprite,
          vertices: [leftLeadingCorner, rightLeadingCorner, rightTrailingCorner, leftTrailingCorner],
        })
        this.#rightLeadingStaticMeshCorner = rightLeadingCorner
        this.#rightTrailingStaticMeshCorner = rightTrailingCorner
      }
    }

    // Fill the area between road segments
    for (let offRoadSegmentIndex = 1; offRoadSegmentIndex < roadArea.length; offRoadSegmentIndex += 2) {
      const offRoadSegment = roadArea[offRoadSegmentIndex] as Color | Sprite
      const leftSideRoadSegment = roadArea[offRoadSegmentIndex - 1] as RoadSegment
      const rightSideRoadSegment = roadArea[offRoadSegmentIndex + 1] as RoadSegment
      const leftLeadingCorner = leftSideRoadSegment.leadingRightCorner.add(leftSideRoadSegment.position)
      const leftTrailingCorner = leftSideRoadSegment.trailingRightCorner.add(leftSideRoadSegment.position)
      const rightLeadingCorner = rightSideRoadSegment.leadingLeftCorner.add(rightSideRoadSegment.position)
      const rightTrailingCorner = rightSideRoadSegment.trailingLeftCorner.add(rightSideRoadSegment.position)
      if (offRoadSegment instanceof Sprite) {
        const relativeLeadingSpriteWidth = offRoadSegment.width / (rightLeadingCorner.x - leftLeadingCorner.x)
        const relativeTrailingSpriteWidth = offRoadSegment.width / (rightTrailingCorner.x - leftTrailingCorner.x)
        const relativeLeadingPolygonWidth = Math.max(
          relativeLeadingSpriteWidth,
          1 / maxBetweenRoadRepeatedPolygons,
        )
        const relativeTrailingPolygonWidth = Math.max(
          relativeTrailingSpriteWidth,
          1 / maxBetweenRoadRepeatedPolygons,
        )

        // Calculate centers of leading and trailing edges of polygons to create
        const polygonRelativeLeadingPositions = [0.5] as [number, ...number[]]
        const polygonRelativeTrailingPositions = [0.5] as [number, ...number[]]
        while (
          Math.max(polygonRelativeLeadingPositions[0], polygonRelativeTrailingPositions[0]) -
          Math.min(relativeLeadingPolygonWidth, relativeTrailingPolygonWidth) / 2 >
          0
        ) {
          polygonRelativeLeadingPositions.unshift(polygonRelativeLeadingPositions[0] - relativeLeadingPolygonWidth)
          polygonRelativeLeadingPositions.push(lastItem(polygonRelativeLeadingPositions) + relativeLeadingPolygonWidth)
          polygonRelativeTrailingPositions.unshift(polygonRelativeTrailingPositions[0] - relativeTrailingPolygonWidth)
          polygonRelativeTrailingPositions.push(
            lastItem(polygonRelativeTrailingPositions) + relativeTrailingPolygonWidth,
          )
        }

        for (let polygonIndex = 0; polygonIndex < polygonRelativeLeadingPositions.length; polygonIndex++) {
          const leadingCenter = polygonRelativeLeadingPositions[polygonIndex]
          const trailingCenter = polygonRelativeTrailingPositions[polygonIndex]
          const leadingLeftCornerRelativePosition = clamp(leadingCenter - relativeLeadingPolygonWidth / 2, 0, 1)
          const leadingRightCornerRelativePosition = clamp(leadingCenter + relativeLeadingPolygonWidth / 2, 0, 1)
          const trailingLeftCornerRelativePosition = clamp(trailingCenter - relativeTrailingPolygonWidth / 2, 0, 1)
          const trailingRightCornerRelativePosition = clamp(trailingCenter + relativeTrailingPolygonWidth / 2, 0, 1)
          polygons.push({
            surface: offRoadSegment,
            vertices: [
              leftLeadingCorner.lerpTo(rightLeadingCorner, leadingLeftCornerRelativePosition),
              leftLeadingCorner.lerpTo(rightLeadingCorner, leadingRightCornerRelativePosition),
              leftTrailingCorner.lerpTo(rightTrailingCorner, trailingRightCornerRelativePosition),
              leftTrailingCorner.lerpTo(rightTrailingCorner, trailingLeftCornerRelativePosition),
            ],
          })
        }
      } else {
        polygons.push({
          surface: offRoadSegment,
          vertices: [leftLeadingCorner, rightLeadingCorner, rightTrailingCorner, leftTrailingCorner],
        })
      }
    }
    this.#staticMesh = polygons

    const leftSideTexture = leftSide instanceof Color
      ? null
      : {
          sprites: leftSide.texture,
          tiles: sideSurfaceTileCache.get(leftSide.texture[0]) ||
          (() => {
            const tiles = new SideSurfaceTiles(leftSide.texture[0])
            sideSurfaceTileCache.set(leftSide.texture[0], tiles)
            return tiles
          })(),
        }
    const rightSideTexture = rightSide instanceof Color
      ? null
      : {
          sprites: rightSide.texture,
          tiles: sideSurfaceTileCache.get(rightSide.texture[rightSide.texture.length - 1]) ||
          (() => {
            const tiles = new SideSurfaceTiles(rightSide.texture[rightSide.texture.length - 1])
            sideSurfaceTileCache.set(rightSide.texture[rightSide.texture.length - 1], tiles)
            return tiles
          })(),
        }
    this.#leftSideSurface = new SideSurface(
      leftSide instanceof Color ? leftSide : leftSide.impostorColor,
      leftSideTexture,
    )
    this.#rightSideSurface = new SideSurface(
      rightSide instanceof Color ? rightSide : rightSide.impostorColor,
      rightSideTexture,
    )
    this.#maxLeftSideRepeatedPolygons = maxLeftSideRepeatedPolygons
    this.#maxRightSideRepeatedPolygons = maxRightSideRepeatedPolygons

    for (const roadSegment of roadSegments) {
      this.addSubObject(roadSegment)
    }
    for (const sprite of sprites) {
      this.addSubObject(sprite)
    }
  }

  protected get mesh(): Mesh {
    return this.#isBackToCamera ? EMPTY_MESH : this.#staticMesh.concat(this.#dynamicMesh)
  }

  public updateTick(game: Game, isLastTickInSequence: boolean): void {
    if (!isLastTickInSequence) {
      return
    }

    const polygons: Polygon[] = []
    const {camera} = game
    const leftLeadingFixedMeshCorner = this.getAbsolutePosition(this.#leftLeadingStaticMeshCorner)
    const leftTrailingFixedMeshCorner = this.getAbsolutePosition(this.#leftTrailingStaticMeshCorner)
    const leftLeadingFixedMeshOnScreenCorner = camera.project(leftLeadingFixedMeshCorner)
    const leftTrailingFixedMeshOnScreenCorner = camera.project(leftTrailingFixedMeshCorner)
    this.#isBackToCamera = leftTrailingFixedMeshOnScreenCorner.y >= leftLeadingFixedMeshOnScreenCorner.y
    if (this.#isBackToCamera) {
      return
    }

    const useImpostor =
        leftLeadingFixedMeshOnScreenCorner.y - leftTrailingFixedMeshOnScreenCorner.y < MIN_TEXTURED_POLYGON_HEIGHT

    if (leftLeadingFixedMeshOnScreenCorner.x > 0 || leftTrailingFixedMeshOnScreenCorner.x > 0) {
      const absoluteLeftLeadingScreenCorner = camera.castRay(
        new Vector2(0, leftLeadingFixedMeshOnScreenCorner.y),
        leftLeadingFixedMeshCorner.z,
      )
      absoluteLeftLeadingScreenCorner.x = Math.min(absoluteLeftLeadingScreenCorner.x, leftLeadingFixedMeshCorner.x)
      const absoluteLeftTrailingScreenCorner = camera.castRay(
        new Vector2(0, leftTrailingFixedMeshOnScreenCorner.y),
        leftTrailingFixedMeshCorner.z,
      )
      absoluteLeftTrailingScreenCorner.x = Math.min(absoluteLeftTrailingScreenCorner.x, leftTrailingFixedMeshCorner.x)
      const leftLeadingScreenCorner = absoluteLeftLeadingScreenCorner.subtract(this.absolutePosition)
      const leftTrailingScreenCorner = absoluteLeftTrailingScreenCorner.subtract(this.absolutePosition)
      const leftSideSurface = !this.#leftSideSurface.texture
        ? this.#leftSideSurface.baseColor
        : (useImpostor ? this.#leftSideSurface.baseColor : this.#leftSideSurface.texture.tiles)
      if (leftSideSurface instanceof SideSurfaceTiles) {
        const areaToFillWidth = Math.max(
          Math.abs(this.#leftLeadingStaticMeshCorner.x - leftLeadingScreenCorner.x),
          Math.abs(this.#leftTrailingStaticMeshCorner.x - leftTrailingScreenCorner.x),
        )
        const tileWidth = Math.max(
          Math.ceil(areaToFillWidth / this.#maxLeftSideRepeatedPolygons),
          leftSideSurface[`x${MAX_SPRITE_TILING_MULTIPLIER}`].width,
        )
        const tileCount = Math.floor(areaToFillWidth / tileWidth)
        for (
          let tileIndex = 0,
            rightLeadingCorner = this.#leftLeadingStaticMeshCorner,
            rightTrailingCorner = this.#leftTrailingStaticMeshCorner;
          tileIndex <= tileCount;
        ) {
          let tilesPerPolygon = 1
          while (tilesPerPolygon < tileCount - tileIndex && tilesPerPolygon < MAX_SPRITE_TILING_MULTIPLIER) {
            tilesPerPolygon *= 2
          }
          const surface = leftSideSurface[`x${tilesPerPolygon}` as keyof SideSurfaceTiles]
          const leftLeadingCorner = rightLeadingCorner.subtract(new Vector3(tileWidth * tilesPerPolygon, 0, 0))
          const leftTrailingCorner = rightTrailingCorner.subtract(new Vector3(tileWidth * tilesPerPolygon, 0, 0))
          polygons.push({
            surface,
            vertices: [leftLeadingCorner, rightLeadingCorner, rightTrailingCorner, leftTrailingCorner],
          })
          rightLeadingCorner = leftLeadingCorner
          rightTrailingCorner = leftTrailingCorner
          tileIndex += tilesPerPolygon
        }
      } else {
        polygons.push({
          surface: leftSideSurface,
          vertices: [
            leftLeadingScreenCorner,
            this.#leftLeadingStaticMeshCorner,
            this.#leftTrailingStaticMeshCorner,
            leftTrailingScreenCorner,
          ],
        })
      }
    }

    const rightLeadingFixedMeshCorner = this.getAbsolutePosition(this.#rightLeadingStaticMeshCorner)
    const rightTrailingFixedMeshCorner = this.getAbsolutePosition(this.#rightTrailingStaticMeshCorner)
    const rightLeadingFixedMeshOnScreenCorner = camera.project(rightLeadingFixedMeshCorner)
    const rightTrailingFixedMeshOnScreenCorner = camera.project(rightTrailingFixedMeshCorner)
    if (
      rightLeadingFixedMeshOnScreenCorner.x < camera.viewportWidth ||
      rightTrailingFixedMeshOnScreenCorner.x < camera.viewportWidth
    ) {
      const absoluteRightLeadingScreenCorder = camera.castRay(
        new Vector2(camera.viewportWidth, rightLeadingFixedMeshOnScreenCorner.y),
        rightLeadingFixedMeshCorner.z,
      )
      absoluteRightLeadingScreenCorder.x = Math.max(absoluteRightLeadingScreenCorder.x, rightLeadingFixedMeshCorner.x)
      const absoluteRightTrailingScreenCorner = camera.castRay(
        new Vector2(camera.viewportWidth, rightTrailingFixedMeshOnScreenCorner.y),
        rightTrailingFixedMeshCorner.z,
      )
      absoluteRightTrailingScreenCorner.x = Math.max(
        absoluteRightTrailingScreenCorner.x,
        rightTrailingFixedMeshCorner.x,
      )
      const rightLeadingScreenCorner = absoluteRightLeadingScreenCorder.subtract(this.absolutePosition)
      const rightTrailingScreenCorner = absoluteRightTrailingScreenCorner.subtract(this.absolutePosition)
      const rightSideSurface = !this.#rightSideSurface.texture
        ? this.#rightSideSurface.baseColor
        : (useImpostor ? this.#rightSideSurface.baseColor : this.#rightSideSurface.texture.tiles)
      if (rightSideSurface instanceof SideSurfaceTiles) {
        const areaToFillWidth = Math.max(
          Math.abs(this.#rightLeadingStaticMeshCorner.x - rightLeadingScreenCorner.x),
          Math.abs(this.#rightTrailingStaticMeshCorner.x - rightTrailingScreenCorner.x),
        )
        const tileWidth = Math.max(
          Math.ceil(areaToFillWidth / this.#maxRightSideRepeatedPolygons),
          rightSideSurface[`x${MAX_SPRITE_TILING_MULTIPLIER}`].width,
        )
        const tileCount = Math.floor(areaToFillWidth / tileWidth)
        for (
          let tileIndex = 0,
            leftLeadingCorner = this.#rightLeadingStaticMeshCorner,
            leftTrailingCorner = this.#rightTrailingStaticMeshCorner;
          tileIndex <= tileCount;
        ) {
          let tilesPerPolygon = 1
          while (tilesPerPolygon < tileCount - tileIndex && tilesPerPolygon < MAX_SPRITE_TILING_MULTIPLIER) {
            tilesPerPolygon *= 2
          }
          const surface = rightSideSurface[`x${tilesPerPolygon}` as keyof SideSurfaceTiles]
          const rightLeadingCorner = leftLeadingCorner.add(new Vector3(tileWidth * tilesPerPolygon, 0, 0))
          const rightTrailingCorner = leftTrailingCorner.add(new Vector3(tileWidth * tilesPerPolygon, 0, 0))
          polygons.push({
            surface,
            vertices: [leftLeadingCorner, rightLeadingCorner, rightTrailingCorner, leftTrailingCorner],
          })
          leftLeadingCorner = rightLeadingCorner
          leftTrailingCorner = rightTrailingCorner
          tileIndex += tilesPerPolygon
        }
      } else {
        polygons.push({
          surface: rightSideSurface,
          vertices: [
            this.#rightLeadingStaticMeshCorner,
            rightLeadingScreenCorner,
            rightTrailingScreenCorner,
            this.#rightTrailingStaticMeshCorner,
          ],
        })
      }
    }

    this.#dynamicMesh = polygons
  }
}
