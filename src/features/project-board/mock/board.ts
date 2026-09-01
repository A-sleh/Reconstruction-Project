import type { BoardData, BoardMember } from "../api/types";

export const MOCK_BOARD_MEMBERS: BoardMember[] = [
  { id: "m1", name: "Lina Haddad" },
  { id: "m2", name: "Omar Kabbani" },
  { id: "m3", name: "Sara Mansour" },
  { id: "m4", name: "Youssef Nasser" },
  { id: "m5", name: "Rania Fahmy" },
];

export const MOCK_BOARD: BoardData = {
  columns: [
    {
      id: "todo",
      title: "To Do",
      color: "bg-slate-400",
      cards: [
        {
          id: "card-1",
          title: "Obtain building permit for floor 3",
          description:
            "Submit updated structural drawings to the municipality and follow up on approval.",
          priority: "high",
          tags: ["Permit", "Legal"],
          assignee: { id: "m2", name: "Omar Kabbani" },
          dueDate: "2026-09-05",
        },
        {
          id: "card-2",
          title: "Order steel reinforcement for beams",
          description: "Confirm quantity with structural engineer and place order.",
          priority: "medium",
          tags: ["Materials"],
          assignee: { id: "m3", name: "Sara Mansour" },
          dueDate: "2026-09-07",
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-primary",
      cards: [
        {
          id: "card-3",
          title: "Foundation works - Building B",
          description: "Concrete pour for foundation, grade C30.",
          priority: "urgent",
          tags: ["Foundation", "Site"],
          assignee: { id: "m1", name: "Lina Haddad" },
          dueDate: "2026-09-03",
        },
        {
          id: "card-4",
          title: "Steel framing - first floor",
          description: "Erection of steel frames and securing columns.",
          priority: "high",
          tags: ["Structure"],
          assignee: { id: "m4", name: "Youssef Nasser" },
          dueDate: "2026-09-06",
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      color: "bg-amber-500",
      cards: [
        {
          id: "card-5",
          title: "Review weekly safety inspection report",
          description: "Approve the safety checklist before publishing to the investor.",
          priority: "medium",
          tags: ["Report", "Safety"],
          assignee: { id: "m5", name: "Rania Fahmy" },
          dueDate: "2026-09-02",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      color: "bg-emerald-500",
      cards: [
        {
          id: "card-6",
          title: "Site cleanup after demolition",
          description: "Removal of debris and site preparation complete.",
          priority: "low",
          tags: ["Site"],
          assignee: { id: "m1", name: "Lina Haddad" },
          dueDate: "2026-08-28",
        },
        {
          id: "card-7",
          title: "Survey the land boundaries",
          description: "Verified parcel boundaries with the surveyor.",
          priority: "medium",
          tags: ["Permit"],
          assignee: { id: "m2", name: "Omar Kabbani" },
          dueDate: "2026-08-25",
        },
      ],
    },
  ],
};
