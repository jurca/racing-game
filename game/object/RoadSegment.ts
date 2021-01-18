import Point3D from '../../engine/Point3D.js'
import {Color, Mesh, Polygon} from '../../engine/Renderer.js'
import MeshObject from './MeshObject.js'

interface RoadSegmentColorConfiguration {
  readonly road: Color
  readonly laneMarker: Color
  readonly rumble: Color
}

export default class RoadSegment extends MeshObject {
  public readonly leadingLeftCorner: Readonly<Point3D>
  public readonly leadingRightCorner: Readonly<Point3D>
  public readonly trailingLeftCorner: Readonly<Point3D>
  public readonly trailingRightCorner: Readonly<Point3D>
  protected readonly mesh: Mesh

  constructor(
    position: Point3D,
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

    const leadingLeftCorner = new Point3D(-leadingWidth / 2, 0, 0)
    const leadingRightCorner = new Point3D(leadingWidth / 2, 0, 0)
    const trailingLeftCorner = new Point3D(-trailingWidth / 2 + curvature, altitudeDelta, length)
    const trailingRightCorner = new Point3D(trailingWidth / 2 + curvature, altitudeDelta, length)

    const leadingLeftRumbleInnerCorner = leadingLeftCorner.add(new Point3D(rumbleWidth))
    const leadingRightRumbleInnerCorner = leadingRightCorner.add(new Point3D(-rumbleWidth))
    const trailingLeftRumbleInnerCorner = trailingLeftCorner.add(new Point3D(rumbleWidth))
    const trailingRightRumbleInnerCorner = trailingRightCorner.add(new Point3D(-rumbleWidth))
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
      const leadingCenter = leadingLeftRumbleInnerCorner.add(new Point3D(markerIndex * leadingMarkerSpacing))
      const trailingCenter = trailingLeftRumbleInnerCorner.add(new Point3D(markerIndex * trailingMarkerSpacing))
      const centerOffset = new Point3D(laneMarkerWidth / 2)
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
