/**
 * Partitions players into view groups by proximity. Players closer than
 * `joinDistance` share a group; players already grouped stay together until
 * they exceed `splitDistance` (hysteresis prevents flicker at the threshold).
 * Groups are returned with sorted ids, ordered by their smallest id.
 */
export function groupPlayers(
  ids: number[],
  pos: (id: number) => [number, number],
  prev: number[][],
  joinDistance: number,
  splitDistance: number,
): number[][] {
  const parent = new Map<number, number>(ids.map((id) => [id, id]));
  const find = (id: number): number => {
    let root = id;
    while (parent.get(root) !== root) root = parent.get(root)!;
    parent.set(id, root);
    return root;
  };
  const wasGrouped = (a: number, b: number) =>
    prev.some((group) => group.includes(a) && group.includes(b));

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const [ax, ay] = pos(ids[i]);
      const [bx, by] = pos(ids[j]);
      const distance = Math.hypot(ax - bx, ay - by);
      if (
        distance < joinDistance ||
        (distance < splitDistance && wasGrouped(ids[i], ids[j]))
      ) {
        parent.set(find(ids[i]), find(ids[j]));
      }
    }
  }

  const groups = new Map<number, number[]>();
  ids.forEach((id) => {
    const root = find(id);
    groups.set(root, [...(groups.get(root) ?? []), id]);
  });
  return Array.from(groups.values())
    .map((group) => group.sort((a, b) => a - b))
    .sort((a, b) => a[0] - b[0]);
}
