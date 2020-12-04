export function lastItem<E>(items: readonly [E, ...E[]]): E {
  return items[items.length - 1]
}
