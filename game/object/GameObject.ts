import CanvasRenderer from '../../engine/CanvasRenderer'
import Game from '../../engine/Game.js'
import TickUpdatedGameObject from '../../engine/TickUpdatedGameObject.js'
import Pseudo3DCamera from '../Pseudo3DCamera.js'

interface IImplementation {
  onRun?(): void
  update?(game: Game<Pseudo3DCamera, CanvasRenderer<Pseudo3DCamera>>): void
  onStop?(): void
  render?(renderer: CanvasRenderer<Pseudo3DCamera>, deltaTime: number): void
}

export default class GameObject extends TickUpdatedGameObject<Pseudo3DCamera, CanvasRenderer<Pseudo3DCamera>> {
  constructor(
    x: number = 0, y: number = 0, z: number = 0,
    private readonly implementation: IImplementation = {},
  ) {
    super(x, y, z)
  }

  public onRun(): void {
    if (this.implementation.onRun) {
      this.implementation.onRun()
    }
    super.onRun()
  }

  public updateTick(game: Game<Pseudo3DCamera, CanvasRenderer<Pseudo3DCamera>>): void {
    if (this.implementation.update) {
      this.implementation.update(game)
    }
    super.updateTick(game)
  }

  public onStop(): void {
    super.onStop()
    if (this.implementation.onStop) {
      this.implementation.onStop()
    }
  }

  public render(renderer: CanvasRenderer<Pseudo3DCamera>, deltaTime: number) {
    if (this.implementation.render) {
      this.implementation.render(renderer, deltaTime)
    }
    super.render(renderer, deltaTime)
  }
}
