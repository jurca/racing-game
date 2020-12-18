export function lastItem<E>(items: readonly [E, ...E[]]): E {
  return items[items.length - 1]
}

export function lerp(start: number, end: number, progress: number): number {
  return start * (1 - progress) + end * progress
}

