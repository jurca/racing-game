// Rendering:
// 1. Draw track segments - find the first visible track segment, render the
//    farthest track segment based on configured render distance and work the
//    way towards the first visible track segment.
//    Have the TrackSegment render the fog, it has the correct mesh coordinates
//    but let it know expected fog density on each update.
//    Then render self-illuminated sprites (e.g. street lights)
// 2. Draw other NPCs at the segment, have them overdraw themselves with fog,
//    then render self-illuminated sprites (e.g. car lights)

import Game from '../../engine/Game.js'
import Plane from '../../engine/Plane.js'
import Ray from '../../engine/Ray.js'
import Renderer from '../../engine/Renderer.js'
import Vector3 from '../../engine/Vector3.js'
import GameObject from './GameObject.js'
import TrackSegment from './TrackSegment.js'

export class Track extends GameObject {
  readonly #segments: readonly TrackSegment[]
  readonly #renderDistance: number
  readonly #bottomPlane: Plane
  #closesVisibleSegmentIndex = 0

  constructor(
    position: Vector3,
    segments: readonly TrackSegment[],
    renderDistance: number,
  ) {
    if (!Number.isSafeInteger(renderDistance) || renderDistance < 1) {
      throw new Error(`Invalid render distance, expected a positive integer, but got: ${renderDistance}`)
    }

    super(position)
    // Sort the segments by Z coordinate in descending order
    this.#segments = segments.slice().sort((segment1, segment2) => segment2.position.z - segment1.position.z)
    this.#renderDistance = renderDistance
    this.#bottomPlane = new Plane(
      new Vector3(0, Math.min(...segments.map(segment => segment.position.y)), 0),
      new Vector3(0, 1, 0),
    )
  }

  updateTick(game: Game, isLastTickInSequence: boolean): void {
    super.updateTick(game, isLastTickInSequence)

    if (!isLastTickInSequence) {
      return
    }

    const {camera} = game
    // That's a lot of math! Let's break it down:
    // 1. We need to find the closest visible segment. We know that the segments are sorted by Z coordinate in
    //    descending order, so we can use binary search to find the closest visible segment.
    // 2. We cast a ray from the camera position to the bottom edge of the viewport. We use the ray to find the closest
    //    point on the bottom plane (located at the lowest Y coordinate of all the segments). We use the Z coordinate
    //    of the closest point on the bottom plane as the approximate Z coordinate of the closest visible segment.
    // 3. We use the approximate Z coordinate of the closest visible segment to find the index of the closest visible
    //    segment.
    const viewportBottomEdgeRay = new Ray(camera.position, camera.viewportBottomDirection)
    const closestVisibleBottomPlanePoint = this.#bottomPlane.intersect(viewportBottomEdgeRay)
    const closestVisibleZCoordinate = closestVisibleBottomPlanePoint?.z ?? camera.position.z
    this.#closesVisibleSegmentIndex = this.#binarySearchSegmentIndexByZCoordinate(closestVisibleZCoordinate)

    // Update the segments that will be rendered.
    for (
      let i = Math.max(this.#closesVisibleSegmentIndex - this.#renderDistance + 1, 0);
      i <= this.#closesVisibleSegmentIndex;
      i++
    ) {
      this.#segments[i].updateTick(game, isLastTickInSequence)
    }
  }

  render(renderer: Renderer, deltaTime: number): void {
    super.render(renderer, deltaTime)

    // Render the visible segments.
    for (
      let i = Math.max(this.#closesVisibleSegmentIndex - this.#renderDistance + 1, 0);
      i <= this.#closesVisibleSegmentIndex;
      i++
    ) {
      const segment = this.#segments[i]
      renderer.renderSubObject(segment, deltaTime)
    }
  }

  /**
   * Returns the index for the segment with largest Z that is less than or equal to the provided Z coordinate.
   *
   * @param targetZ The Z coordinate to search for.
   */
  #binarySearchSegmentIndexByZCoordinate(targetZ: number): number {
    let startIndex = 0
    let endIndex = this.#segments.length - 1
    while (startIndex < endIndex) {
      const middleIndex = Math.floor((startIndex + endIndex) / 2)
      const segmentZ = this.#segments[middleIndex].position.z
      if (segmentZ <= targetZ && (this.#segments[middleIndex - 1]?.position.z ?? Infinity) > targetZ) {
        return middleIndex
      }

      if (segmentZ < targetZ) {
        endIndex = middleIndex
      } else {
        startIndex = middleIndex + 1
      }
    }
    return startIndex
  }
}
