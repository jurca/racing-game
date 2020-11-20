import Camera from './Camera.js'
import Game from './Game.js'
import GameObject from './GameObject.js'
import Point3D from './Point3D.js'

export interface Color {
  readonly red: number
  readonly green: number
  readonly blue: number
  readonly alpha: number
}

export class Sprite {
  constructor(
    public readonly data: HTMLCanvasElement | HTMLImageElement,
    public readonly width: number,
    public readonly height: number,
  ) {
  }
}

export type Surface = Color | Sprite

export interface Polygon {
  readonly surface: Surface
  readonly points: readonly [Readonly<Point3D>, Readonly<Point3D>, Readonly<Point3D>, ...readonly Readonly<Point3D>[]]
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
    scaleX: number,
    scaleY: number,
    skewX: number,
    skewY: number,
  ): void
}
