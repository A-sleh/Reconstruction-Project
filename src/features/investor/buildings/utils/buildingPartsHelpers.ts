import type { BuildingPartType } from "@/features/investor/buildings/api/types";

import type { BuildingPartInput } from "../../../project-reports/api/types";

/** Nested building-part tree shape used by the report builder form. */
export interface ReportBuildingPart {
  id: string;
  name: string;
  area: number;
  buildingPartType: BuildingPartType;
  subParts: ReportBuildingPart[];
}

export { BuildingPartType };

/** Which part types each type may contain as direct children. */
export const CHILD_TYPES_MAP: Record<BuildingPartType, BuildingPartType[]> = {
  Floor: ["Room", "Office", "Hall"],
  Roof: ["Room", "Hall"],
  Room: ["Bathroom", "Kitchen"],
  Office: ["Bathroom"],
  Hall: [],
  Bathroom: [],
  Kitchen: [],
};

export function isContainer(type: BuildingPartType): boolean {
  return (CHILD_TYPES_MAP[type] ?? []).length > 0;
}

export function countParts(tree: ReportBuildingPart[]): number {
  return tree.reduce((sum, p) => sum + 1 + countParts(p.subParts), 0);
}

export function totalArea(tree: ReportBuildingPart[]): number {
  return tree.reduce((sum, p) => sum + p.area + totalArea(p.subParts), 0);
}

export function sumAreas(parts: ReportBuildingPart[]): number {
  return parts.reduce((sum, p) => sum + p.area, 0);
}

/**
 * Flatten a nested tree into backend `BuildingPartInput[]` using a stable
 * parent index (the array position of each node in a depth-first walk).
 */
export function flattenBuildingParts(
  tree: ReportBuildingPart[],
): BuildingPartInput[] {
  const flat: BuildingPartInput[] = [];

  // (node, parentIndex) where parentIndex is the index of the parent inside `flat`
  const walk = (nodes: ReportBuildingPart[], parentIndex?: number) => {
    for (const node of nodes) {
      const input: BuildingPartInput = {
        area: node.area,
        buildingPartType: node.buildingPartType,
      };
      if (parentIndex !== undefined) {
        input.parentBuildingPartId = parentIndex;
      }
      const currentIndex = flat.length;
      flat.push(input);
      walk(node.subParts, currentIndex);
    }
  };

  walk(tree);
  return flat;
}

function genId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createPart(
  name: string,
  area: number,
  buildingPartType: BuildingPartType,
): ReportBuildingPart {
  return { id: genId(), name, area, buildingPartType, subParts: [] };
}

/** Update the editable fields (name, area, type) of a node matched by id, preserving children. */
export function updatePart(
  tree: ReportBuildingPart[],
  id: string,
  patch: { name: string; area: number; buildingPartType: BuildingPartType },
): ReportBuildingPart[] {
  return tree.map((p) => {
    if (p.id === id) {
      return {
        ...p,
        name: patch.name,
        area: patch.area,
        buildingPartType: patch.buildingPartType,
      };
    }
    return { ...p, subParts: updatePart(p.subParts, id, patch) };
  });
}

/** Remove a node (and all descendants) by id from an immutable tree. */
export function removePartById(
  tree: ReportBuildingPart[],
  id: string,
): ReportBuildingPart[] {
  return tree
    .filter((p) => p.id !== id)
    .map((p) => ({ ...p, subParts: removePartById(p.subParts, id) }));
}

/** Find a node by id anywhere in the tree. */
export function findPart(
  tree: ReportBuildingPart[],
  id: string,
): ReportBuildingPart | undefined {
  for (const p of tree) {
    if (p.id === id) return p;
    const found = findPart(p.subParts, id);
    if (found) return found;
  }
  return undefined;
}

/** Find the parent node of a given id anywhere in the tree; undefined if not nested. */
export function findParentPart(
  tree: ReportBuildingPart[],
  id: string,
): ReportBuildingPart | undefined {
  for (const p of tree) {
    if (p.subParts.some((c) => c.id === id)) return p;
    const found = findParentPart(p.subParts, id);
    if (found) return found;
  }
  return undefined;
}

/** Store a child into the node with `parentId`; if `parentId` is null push to root. */
export function addChild(
  tree: ReportBuildingPart[],
  child: ReportBuildingPart,
  parentId: string | null,
): ReportBuildingPart[] {
  if (parentId === null) return [...tree, child];
  return tree.map((p) => {
    if (p.id === parentId) {
      return { ...p, subParts: [...p.subParts, child] };
    }
    return { ...p, subParts: addChild(p.subParts, child, parentId) };
  });
}

/** Move a subtree under a new parent (validates against the tree's hierarchy rules). */
export function movePart(
  tree: ReportBuildingPart[],
  draggedId: string,
  targetId: string,
): ReportBuildingPart[] {
  if (draggedId === targetId) return tree;

  const dragged = findPart(tree, draggedId);
  const target = findPart(tree, targetId);
  if (!dragged || !target) return tree;
  if (!isContainer(target.buildingPartType)) return tree;
  if (
    !CHILD_TYPES_MAP[target.buildingPartType].includes(dragged.buildingPartType)
  ) {
    return tree;
  }

  // Prevent dropping a container into its own descendant.
  if (findPart(dragged.subParts, targetId)) return tree;

  const without = removePartById(tree, draggedId);
  if (!findPart(without, targetId)) return without;
  return addChild(without, dragged, targetId);
}
