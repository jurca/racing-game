import Camera from './Camera.js'
import Game from './Game.js'
import GameObject from './GameObject.js'
import Point3D from './Point3D.js'

export class Color {
  constructor(
    public readonly red: number,
    public readonly green: number,
    public readonly blue: number,
    public readonly alpha: number = 255,
  ) {
    if (!Number.isInteger(red) || red < 0 || red > 255) {
      throw new TypeError(`The red channel must an integer in range [0, 255], ${red} was provided`)
    }
    if (!Number.isInteger(green) || green < 0 || green > 255) {
      throw new TypeError(`The green channel must an integer in range [0, 255], ${green} was provided`)
    }
    if (!Number.isInteger(blue) || blue < 0 || blue > 255) {
      throw new TypeError(`The blue channel must an integer in range [0, 255], ${blue} was provided`)
    }
    if (!Number.isInteger(alpha) || alpha < 0 || alpha > 255) {
      throw new TypeError(`The alpha channel must an integer in range [0, 255], ${alpha} was provided`)
    }
  }

  public get asCssString(): string {
    return `rgba(${[this.red, this.green, this.blue, this.alpha / 255].join(', ')})`
  }
}

export class Sprite {
  public readonly width: number
  public readonly height: number

  constructor(
    public readonly data: HTMLCanvasElement | HTMLImageElement,
  ) {
    this.width = 'naturalWidth' in data ? data.naturalWidth : data.width
    this.height = 'naturalHeight' in data ? data.naturalHeight : data.height
  }
}

export type Surface = Color | Sprite

export interface Polygon {
  readonly surface: Surface
  readonly vertices: readonly [Readonly<Point3D>, Readonly<Point3D>, Readonly<Point3D>, ...readonly Readonly<Point3D>[]]
}

export type Mesh = readonly Polygon[]

export default interface Renderer {
  readonly camera: Camera

  render(game: Game, deltaTime: number): void

  renderObject(object: GameObject, deltaTime: number): void

  drawPolygon(polygon: Polygon): void

  drawMesh(mesh: Mesh): void

  drawSprite(
    position: Readonly<Point3D>,
    sprite: Sprite,
    scaleX?: number,
    scaleY?: number,
    skewX?: number,
    skewY?: number,
  ): void

  drawDistanceScaledSprite(position: Readonly<Point3D>, sprite: Sprite, skewX?: number, skewY?: number): void
}
