import {Color, Mesh, Polygon} from '../../engine/Renderer.js'
import Vector3 from '../../engine/Vector3.js'
import MeshObject from './MeshObject.js'

interface RoadSegmentColorConfiguration {
  readonly road: Color
  readonly laneMarker: Color
  readonly rumble: Color
}

export default class RoadSegment extends MeshObject {
  public readonly leadingLeftCorner: Readonly<Vector3>
  public readonly leadingRightCorner: Readonly<Vector3>
  public readonly trailingLeftCorner: Readonly<Vector3>
  public readonly trailingRightCorner: Readonly<Vector3>
  protected readonly mesh: Mesh

  constructor(
    position: Vector3,
    public readonly leadingWidth: number,
    public readonly trailingWidth: number,
    public readonly length: number,
    public readonly curvature: number,
    public readonly altitudeDelta: number,
    public readonly laneCount: number,
    public readonly laneMarkerWidth: number,
    public readonly rumbleWidth: number,
    public readonly colorConfiguration: RoadSegmentColorConfiguration,
  ) {
    super(position)

    if (leadingWidth < 0) {
      throw new RangeError(`The leadingWidth must be a non-negative number, ${leadingWidth} was provided`)
    }
    if (trailingWidth < 0) {
      throw new RangeError(`The trailingWidth must be a non-negative number, ${trailingWidth} was provided`)
    }
    if (length <= 0) {
      throw new RangeError(`The length must be a positive number, ${length} was provided`)
    }
    if (laneCount <= 0 || !Number.isSafeInteger(laneCount)) {
      throw new RangeError(`The laneCount must be a positive safe integer, ${laneCount} was provided`)
    }
    if (laneMarkerWidth <= 0) {
      throw new RangeError(`The laneMarkerWidth must be a positive number, ${laneMarkerWidth} was provided`)
    }
    if (rumbleWidth < 0) {
      throw new RangeError(`The rumbleWidth must be a non-negative number, ${rumbleWidth} was provided`)
    }

    const polygons: Polygon[] = []

    const leadingLeftCorner = new Vector3(-leadingWidth / 2, 0, 0)
    const leadingRightCorner = new Vector3(leadingWidth / 2, 0, 0)
    const trailingLeftCorner = new Vector3(-trailingWidth / 2 + curvature, altitudeDelta, length)
    const trailingRightCorner = new Vector3(trailingWidth / 2 + curvature, altitudeDelta, length)

    const leadingLeftRumbleInnerCorner = leadingLeftCorner.add(new Vector3(rumbleWidth))
    const leadingRightRumbleInnerCorner = leadingRightCorner.add(new Vector3(-rumbleWidth))
    const trailingLeftRumbleInnerCorner = trailingLeftCorner.add(new Vector3(rumbleWidth))
    const trailingRightRumbleInnerCorner = trailingRightCorner.add(new Vector3(-rumbleWidth))
    if (rumbleWidth) {
      polygons.push(
        {
          surface: colorConfiguration.rumble,
          vertices: [
            leadingLeftCorner,
            leadingLeftRumbleInnerCorner,
            trailingLeftRumbleInnerCorner,
            trailingLeftCorner,
          ],
        },
        {
          surface: colorConfiguration.rumble,
          vertices: [
            leadingRightRumbleInnerCorner,
            leadingRightCorner,
            trailingRightCorner,
            trailingRightRumbleInnerCorner,
          ],
        },
      )
    }

    polygons.push({
      surface: colorConfiguration.road,
      vertices: [
        leadingLeftRumbleInnerCorner,
        leadingRightRumbleInnerCorner,
        trailingRightRumbleInnerCorner,
        trailingLeftRumbleInnerCorner,
      ],
    })

    const leadingMarkerSpacing = (leadingRightRumbleInnerCorner.x - leadingLeftRumbleInnerCorner.x) / laneCount
    const trailingMarkerSpacing = (trailingRightRumbleInnerCorner.x - trailingLeftRumbleInnerCorner.x) / laneCount
    for (let markerIndex = 1; markerIndex < laneCount; markerIndex++) {
      const leadingCenter = leadingLeftRumbleInnerCorner.add(new Vector3(markerIndex * leadingMarkerSpacing))
      const trailingCenter = trailingLeftRumbleInnerCorner.add(new Vector3(markerIndex * trailingMarkerSpacing))
      const centerOffset = new Vector3(laneMarkerWidth / 2)
      polygons.push({
        surface: colorConfiguration.laneMarker,
        vertices: [
          leadingCenter.subtract(centerOffset),
          leadingCenter.add(centerOffset),
          trailingCenter.add(centerOffset),
          trailingCenter.subtract(centerOffset),
        ],
      })
    }

    this.mesh = polygons
    this.leadingLeftCorner = leadingLeftCorner
    this.leadingRightCorner = leadingRightCorner
    this.trailingLeftCorner = trailingLeftCorner
    this.trailingRightCorner = trailingRightCorner
  }
}
