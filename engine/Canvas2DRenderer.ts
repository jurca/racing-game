import Camera from './Camera.js'
import Point2D from './Point2D.js'
import Renderer from './Renderer.js'

export default class Canvas2DRenderer<C extends Camera> extends Renderer<C> {
  protected readonly renderingContext: CanvasRenderingContext2D

  constructor(
    protected canvas: HTMLCanvasElement,
    camera: C,
  ) {
    super(camera)

    const renderingContext = canvas.getContext('2d', {
      alpha: false,
    })
    if (!renderingContext) {
      throw new Error('The rendering context could not be created for the provided canvas')
    }
    this.renderingContext = renderingContext
  }

  public drawPolygon(
    color: string,
    ...points: readonly [Readonly<Point2D>, Readonly<Point2D>, Readonly<Point2D>, ...ReadonlyArray<Point2D>]
  ): void {
    this.renderingContext.fillStyle = color
    this.renderingContext.beginPath()
    this.renderingContext.moveTo(points[0].x, points[0].y)
    for (const point of points.slice(1)) {
      this.renderingContext.lineTo(point.x, point.y)
    }
    this.renderingContext.closePath()
    this.renderingContext.fill()
  }

  public drawRect(color: string, p1: Point2D, p2: Point2D): void {
    this.renderingContext.fillStyle = color
    this.renderingContext.fillRect(p1.x, p1.y, p2.x - p1.x, p2.y - p2.y)
  }

  public drawFog(color: string, density: number, p1: Point2D, p2: Point2D): void {
    if (density) {
      this.renderingContext.globalAlpha = density
      this.drawRect(color, p1, p2)
      this.renderingContext.globalAlpha = 1
    }
  }

  public drawSprite(
    sprite: HTMLImageElement | HTMLCanvasElement,
    x: number,
    y: number,
    scaleX: number = 1,
    scaleY: number = scaleX,
  ): void {
    const spriteWidth = sprite instanceof HTMLImageElement ? sprite.naturalWidth : sprite.width
    const spriteHeight = sprite instanceof HTMLImageElement ? sprite.naturalHeight : sprite.height
    this.renderingContext.drawImage(sprite, x, y, spriteWidth * scaleX, spriteHeight * scaleY)
  }
}