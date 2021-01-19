import AbstractRenderer from './AbstractRenderer.js'
import Camera from './Camera.js'
import Game from './Game.js'
import GameObject from './GameObject.js'
import {Polygon, Sprite} from './Renderer.js'
import Vector2 from './Vector2.js'
import Vector3 from './Vector3.js'

export default class Canvas2DRenderer extends AbstractRenderer {
  protected readonly renderingContext: CanvasRenderingContext2D
  #pointOfOrigin: Readonly<Vector3> = new Vector3(0, 0, 0)
  readonly #clearEachFrame: boolean

  constructor(
    protected readonly canvas: HTMLCanvasElement,
    camera: Camera,
    clearEachFrame: boolean,
  ) {
    super(camera)

    canvas.width = camera.viewportWidth
    canvas.height = camera.viewportHeight
    const renderingContext = canvas.getContext('2d', {
      alpha: false,
    })
    if (!renderingContext) {
      throw new Error('The rendering context could not be created for the provided canvas')
    }
    this.renderingContext = renderingContext
    this.renderingContext.imageSmoothingEnabled = false

    this.#clearEachFrame = clearEachFrame
  }

  public render(game: Game, deltaTime: number): void {
    if (this.#clearEachFrame) {
      this.renderingContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    super.render(game, deltaTime)
  }

  public renderObject(object: GameObject, deltaTime: number): void {
    this.#pointOfOrigin = object.absolutePosition
    super.renderObject(object, deltaTime)
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

    const projectedVertices = polygon.vertices.map(this.#projectPoint)
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
    this.renderingContext.drawImage(sprite.data, -sprite.width / 2, -sprite.height)
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

  #drawPath = (points: readonly Readonly<Vector2>[]): void => { // TypeScript 4.0.5 does not support private methods yet
    this.renderingContext.beginPath()
    this.renderingContext.moveTo(points[0].x, points[0].y)
    for (const point of points.slice(1)) {
      this.renderingContext.lineTo(point.x, point.y)
    }
    this.renderingContext.closePath()
  }

  #projectPoint = (point: Readonly<Vector3>): Vector2 => { // TypeScript 4.0.5 does not support private methods yet
    return this.camera.project(this.#pointOfOrigin.add(point))
  }
}
