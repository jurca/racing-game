export interface IRenderer {
  render(deltaTime: number): void
}

export abstract class CanvasRenderer implements IRenderer {
  protected readonly renderingContext: CanvasRenderingContext2D

  constructor(
    protected canvas: HTMLCanvasElement,
  ) {
    const renderingContext = canvas.getContext('2d', {
      alpha: false,
    })
    if (!renderingContext) {
      throw new Error('The rendering context could not be created for the provided canvas')
    }
    this.renderingContext = renderingContext
  }

  public render(): void {
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

  public drawSprite(sprite: HTMLImageElement | HTMLCanvasElement): void {}
}
