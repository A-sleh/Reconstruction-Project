import type { WorkShop } from "../api/types";

export const MOCK_WORK_SHOPS: WorkShop[] = [
  {
    id: 1,
    title: "Al-Razi Tower Structural Works",
    description:
      "Reinforced concrete skeleton works for floors 4-9, including formwork, rebar fixing and concrete pouring crews.",
    workerNumber: 24,
    leaderPhoneNumber: "+963 944 215 780",
    payedPrice: 48000000,
    requirePrice: 72000000,
    createdAt: new Date("2026-02-14"),
    status: "in-progress",
  },
  {
    id: 2,
    title: "Al-Mazzeh District Reconstruction",
    description:
      "Full reconstruction of 18 residential units damaged in conflict: masonry, plastering, electrical and plumbing rough-ins.",
    workerNumber: 41,
    leaderPhoneNumber: "+963 933 607 442",
    payedPrice: 91500000,
    requirePrice: 120000000,
    createdAt: new Date("2026-01-08"),
    status: "open",
  },
  {
    id: 3,
    title: "Highway 7 Bridge Repair Crew",
    description:
      "Bridge deck rehabilitation, expansion joint replacement and guardrail installation along the southern highway segment.",
    workerNumber: 17,
    leaderPhoneNumber: "+963 955 130 296",
    payedPrice: 30000000,
    requirePrice: 30000000,
    createdAt: new Date("2025-11-27"),
    status: "closed",
  },
  {
    id: 4,
    title: "Old City Souq Restoration",
    description:
      "Heritage-sensitive restoration of stone facades, arcade vaults and traditional timber shopfronts in the historic souq.",
    workerNumber: 32,
    leaderPhoneNumber: "+963 991 874 053",
    payedPrice: 22500000,
    requirePrice: 90000000,
    createdAt: new Date("2026-04-02"),
    status: "open",
  },
  {
    id: 5,
    title: "Water Network Rehabilitation - Barzeh",
    description:
      "Trenching, main pipe replacement and manhole reconstruction across six neighborhoods; night-shift excavation crews.",
    workerNumber: 19,
    leaderPhoneNumber: "+963 937 462 118",
    payedPrice: 54000000,
    requirePrice: 60000000,
    createdAt: new Date("2026-03-21"),
    status: "in-progress",
  },
  {
    id: 6,
    title: "School Rebuild Program - Douma Phase 2",
    description:
      "Rebuild of four public schools: structural repairs, classroom partitions, playground surfacing and accessibility ramps.",
    workerNumber: 28,
    leaderPhoneNumber: "+963 958 336 901",
    payedPrice: 12750000,
    requirePrice: 85000000,
    createdAt: new Date("2026-05-30"),
    status: "open",
  },
];
