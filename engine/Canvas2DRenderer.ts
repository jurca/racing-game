import AbstractRenderer from './AbstractRenderer.js'
import Camera from './Camera.js'
import Game from './Game.js'
import GameObject from './GameObject.js'
import {Polygon, Sprite} from './Renderer.js'
import {lastItem} from './util.js'
import Vector2 from './Vector2.js'
import Vector3 from './Vector3.js'

export default class Canvas2DRenderer extends AbstractRenderer {
  protected readonly renderingContext: CanvasRenderingContext2D
  readonly #displayContext: CanvasRenderingContext2D
  readonly #offscreenCanvas: HTMLCanvasElement
  #pointOfOrigin: Readonly<Vector3> = new Vector3(0, 0, 0)
  #pointOfOriginStack: Readonly<Vector3>[] = []
  readonly #clearEachFrame: boolean
  #resolutionScale: number

  constructor(
    protected readonly canvas: HTMLCanvasElement,
    camera: Camera,
    clearEachFrame: boolean,
    resolutionScale: number = 1.0,
  ) {
    super(camera)

    this.#resolutionScale = resolutionScale

    canvas.width = camera.viewportWidth
    canvas.height = camera.viewportHeight
    const displayContext = canvas.getContext('2d', {alpha: false})
    if (!displayContext) {
      throw new Error('The display rendering context could not be created for the provided canvas')
    }
    this.#displayContext = displayContext
    this.#displayContext.imageSmoothingEnabled = false

    this.#offscreenCanvas = document.createElement('canvas')
    this.#offscreenCanvas.width = Math.round(camera.viewportWidth * resolutionScale)
    this.#offscreenCanvas.height = Math.round(camera.viewportHeight * resolutionScale)
    const offscreenContext = this.#offscreenCanvas.getContext('2d', {alpha: false})
    if (!offscreenContext) {
      throw new Error('The offscreen rendering context could not be created')
    }
    this.renderingContext = offscreenContext
    this.renderingContext.imageSmoothingEnabled = false

    this.#clearEachFrame = clearEachFrame
  }

  public get resolutionScale(): number {
    return this.#resolutionScale
  }

  public set resolutionScale(scale: number) {
    this.#resolutionScale = scale
    this.#offscreenCanvas.width = Math.round(this.camera.viewportWidth * scale)
    this.#offscreenCanvas.height = Math.round(this.camera.viewportHeight * scale)
    this.renderingContext.imageSmoothingEnabled = false
  }

  public render(game: Game, deltaTime: number): void {
    this.renderingContext.setTransform(1, 0, 0, 1, 0, 0)
    if (this.#clearEachFrame) {
      this.renderingContext.clearRect(0, 0, this.#offscreenCanvas.width, this.#offscreenCanvas.height)
    }
    this.renderingContext.setTransform(this.#resolutionScale, 0, 0, this.#resolutionScale, 0, 0)
    super.render(game, deltaTime)
    this.#displayContext.drawImage(this.#offscreenCanvas, 0, 0, this.canvas.width, this.canvas.height)
  }

  public renderObject(object: GameObject, deltaTime: number): void {
    this.#pointOfOrigin = object.absolutePosition
    super.renderObject(object, deltaTime)
  }

  public renderSubObject(object: GameObject, deltaTime: number): void {
    const parentPointOfOrigin = this.#pointOfOrigin
    this.#pointOfOriginStack.push(parentPointOfOrigin.add(object.position))
    this.#pointOfOrigin = lastItem(this.#pointOfOriginStack as [Vector3, ...Vector3[]])
    super.renderSubObject(object, deltaTime)
    this.#pointOfOriginStack.pop()
    this.#pointOfOrigin = parentPointOfOrigin
  }

  public drawPolygon(polygon: Polygon): void {
    if (!polygon.vertices.every(vertex => this.camera.isInVisibleDepth(this.#pointOfOrigin.add(vertex)))) {
      return
    }

    let color: null | string = null
    let texture: null | Sprite = null
    if (polygon.surface instanceof Sprite) {
      texture = polygon.surface
    } else {
      color = polygon.surface.asCssString
    }

    const projectedVertices = polygon.vertices.map(this.#projectPoint, this)
    this.#drawPath(projectedVertices)

    if (color) {
      this.renderingContext.fillStyle = color
      this.renderingContext.fill()
    }
    if (texture) {
      this.renderingContext.save()
      this.renderingContext.clip()
      const horizontalCoordinates = projectedVertices.map(point => point.x)
      const verticalCoordinates = projectedVertices.map(point => point.y)
      const areaX0 = Math.min(...horizontalCoordinates)
      const areaX1 = Math.max(...horizontalCoordinates)
      const areaY0 = Math.min(...verticalCoordinates)
      const areaY1 = Math.max(...verticalCoordinates)
      this.renderingContext.drawImage(texture.data, areaX0, areaY0, areaX1 - areaX0, areaY1 - areaY0)
      this.renderingContext.restore()
    }
  }

  public drawSprite(
    position: Readonly<Vector3>,
    sprite: Sprite,
    scaleX: number = 1,
    scaleY: number = scaleX,
    skewX: number = 0,
    skewY: number = 0,
  ): void {
    if (!this.camera.isInVisibleDepth(this.#pointOfOrigin.add(position))) {
      return
    }

    const positionOnScreen = this.#projectPoint(position)
    this.renderingContext.save()
    this.renderingContext.transform(scaleX, skewY, skewX, scaleY, positionOnScreen.x, positionOnScreen.y)
    this.drawSprite2D(sprite, -sprite.width / 2, -sprite.height, sprite.width, sprite.height)
    this.renderingContext.restore()
  }

  public drawDistanceScaledSprite(
    position: Readonly<Vector3>,
    sprite: Sprite,
    scaleX: number = 1,
    scaleY: number = scaleX,
    skewX: number = 0,
    skewY: number = 0,
  ): void {
    if (!this.camera.isInVisibleDepth(this.#pointOfOrigin.add(position))) {
      return
    }

    const spriteTopCenter = position.add(new Vector3(0, sprite.height))
    const bottomCenterOnScreen = this.#projectPoint(position)
    const topCenterOnScreen = this.#projectPoint(spriteTopCenter)
    const scale = Math.abs(topCenterOnScreen.y - bottomCenterOnScreen.y) / sprite.height
    this.drawSprite(position, sprite, scale * scaleX, scale * scaleY, skewX, skewY)
  }

  public drawSprite2D(
    sprite: Sprite,
    screenX: number,
    screenY: number,
    width: number,
    height: number,
  ): void {
    this.renderingContext.drawImage(sprite.data, screenX, screenY, width, height)
  }

  #drawPath(points: readonly Readonly<Vector2>[]): void {
    this.renderingContext.beginPath()
    this.renderingContext.moveTo(points[0].x, points[0].y)
    for (const point of points.slice(1)) {
      this.renderingContext.lineTo(point.x, point.y)
    }
    this.renderingContext.closePath()
  }

  #projectPoint(point: Readonly<Vector3>): Vector2 {
    return this.camera.project(this.#pointOfOrigin.add(point))
  }
}
