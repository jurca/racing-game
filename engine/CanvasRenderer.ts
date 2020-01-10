import Camera from './Camera.js'
import Game from './Game.js'
import {IRenderer} from './Renderer.js'

export default class CanvasRenderer implements IRenderer {
  protected readonly renderingContext: CanvasRenderingContext2D

  constructor(
    protected canvas: HTMLCanvasElement,
    public readonly camera: Camera = new Camera(0, 0, 0),
  ) {
    const renderingContext = canvas.getContext('2d', {
      alpha: false,
    })
    if (!renderingContext) {
      throw new Error('The rendering context could not be created for the provided canvas')
    }
    this.renderingContext = renderingContext
  }

  public render(game: Game<CanvasRenderer>, deltaTime: number): void {
    for (const gameObject of game.gameObjects) {
      gameObject.render(this, deltaTime)
    }
  }

  public drawPolygon(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
    color: string,
  ): void {
    this.renderingContext.fillStyle = color
    this.renderingContext.beginPath()
    this.renderingContext.moveTo(x1, y1)
    this.renderingContext.lineTo(x2, y2)
    this.renderingContext.lineTo(x3, y3)
    this.renderingContext.lineTo(x4, y4)
    this.renderingContext.closePath()
    this.renderingContext.fill()
  }

  public drawFog(x: number, y: number, width: number, height: number, color: string, density: number): void {
    if (density) {
      this.renderingContext.globalAlpha = density
      this.renderingContext.fillStyle = color
      this.renderingContext.fillRect(x, y, width, height)
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
