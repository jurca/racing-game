import Camera from './Camera.js'
import Color from './Color.js'
import Game from './Game.js'
import GameObject from './GameObject.js'
import Vector3 from './Vector3.js'

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
  readonly vertices: readonly [Readonly<Vector3>, Readonly<Vector3>, Readonly<Vector3>, ...readonly Readonly<Vector3>[]]
}

export type Mesh = readonly Polygon[]

export default interface Renderer {
  readonly camera: Camera

  render(game: Game, deltaTime: number): void

  renderObject(object: GameObject, deltaTime: number): void

  renderSubObject(object: GameObject, deltaTime: number): void

  drawPolygon(polygon: Polygon): void

  drawMesh(mesh: Mesh): void

  drawSprite(
    position: Readonly<Vector3>,
    sprite: Sprite,
    scaleX?: number,
    scaleY?: number,
    skewX?: number,
    skewY?: number,
  ): void

  drawDistanceScaledSprite(
    position: Readonly<Vector3>,
    sprite: Sprite,
    scaleX?: number,
    scaleY?: number,
    skewX?: number,
    skewY?: number,
  ): void

  drawSprite2D(
    sprite: Sprite,
    screenX: number,
    screenY: number,
    width: number,
    height: number,
  ): void
}
