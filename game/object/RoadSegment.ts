import Canvas2DRenderer from '../../engine/Canvas2DRenderer.js'
import Point3D from '../../engine/Point3D.js'
import Pseudo3DCamera from '../Pseudo3DCamera.js'
import GameObject from './GameObject.js'

export interface IRoadSegmentColorConfiguration {
  readonly road: string
  readonly laneMarker: string
  readonly rumble: string
}

interface IRoadPolygon {
  readonly leading: readonly [Readonly<Point3D>, Readonly<Point3D>]
  readonly trailing: readonly [Readonly<Point3D>, Readonly<Point3D>]
  readonly color: string,
}

export default class RoadSegment extends GameObject {
  private readonly polygons: readonly IRoadPolygon[]

  constructor(
    x: number,
    y: number,
    z: number,
    public readonly leadingWidth: number,
    public readonly trailingWidth: number,
    public readonly length: number,
    public readonly curvature: number,
    public readonly altitudeDelta: number,
    public readonly laneCount: number,
    public readonly laneMarkerWidth: number,
    public readonly rumbleWidth: number,
    public readonly fogDensity: number,
    public readonly colorConfiguration: IRoadSegmentColorConfiguration,
  ) {
    super(x, y, z)

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
    if (fogDensity < 0 || fogDensity > 1) {
      throw new RangeError(`The fogDensity must be within range 0 to 1 inclusive, ${fogDensity} was provided`)
    }

    const polygons: IRoadPolygon[] = []

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
          color: colorConfiguration.rumble,
          leading: [leadingLeftCorner, leadingLeftRumbleInnerCorner],
          trailing: [trailingLeftRumbleInnerCorner, trailingLeftCorner],
        },
        {
          color: colorConfiguration.rumble,
          leading: [leadingRightRumbleInnerCorner, leadingRightCorner],
          trailing: [trailingRightCorner, trailingRightRumbleInnerCorner],
        },
      )
    }

    polygons.push({
      color: colorConfiguration.road,
      leading: [leadingLeftRumbleInnerCorner, leadingRightRumbleInnerCorner],
      trailing: [trailingRightRumbleInnerCorner, trailingLeftRumbleInnerCorner],
    })

    const leadingMarkerSpacing = (leadingRightRumbleInnerCorner.x - leadingLeftRumbleInnerCorner.x) / laneCount
    const trailingMarkerSpacing = (trailingRightRumbleInnerCorner.x - trailingLeftRumbleInnerCorner.x) / laneCount
    for (let markerIndex = 1; markerIndex < laneCount; markerIndex++) {
      const leadingCenter = leadingLeftRumbleInnerCorner.add(new Point3D(markerIndex * leadingMarkerSpacing))
      const trailingCenter = trailingLeftRumbleInnerCorner.add(new Point3D(markerIndex * trailingMarkerSpacing))
      const centerOffset = new Point3D(laneMarkerWidth / 2)
      polygons.push({
        color: colorConfiguration.laneMarker,
        leading: [leadingCenter.subtract(centerOffset), leadingCenter.add(centerOffset)],
        trailing: [trailingCenter.add(centerOffset), trailingCenter.subtract(centerOffset)],
      })
    }

    this.polygons = polygons
  }

  public render(renderer: Canvas2DRenderer<Pseudo3DCamera>, deltaTime: number): void {
    super.render(renderer, deltaTime)

    for (const polygon of this.polygons) {
      renderer.drawPolygon(
        polygon.color,
        renderer.camera.project(this.getAbsolutePosition(polygon.leading[0])),
        renderer.camera.project(this.getAbsolutePosition(polygon.leading[1])),
        renderer.camera.project(this.getAbsolutePosition(polygon.trailing[0])),
        renderer.camera.project(this.getAbsolutePosition(polygon.trailing[1])),
      )
    }
  }
}
