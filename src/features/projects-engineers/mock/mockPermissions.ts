import type { ProjectEngineersPermissions } from "../api/types";
import { MOCK_ENGINEERS } from "./mockEngineers";

export const MOCK_PROJECT_ENGINEERS_PERMISSIONS: ProjectEngineersPermissions[] =
  [
    {
      id: 1,
      projectId: 1,
      engineer: MOCK_ENGINEERS[0],
      permissions: {
        canViewLogs: true,
        canViewRequests: true,
        canAddEngineer: false,
        canRemoveEngineer: false,
        canApproveRequest: true,
        canRejectRequest: true,
      },
    },
    {
      id: 2,
      projectId: 1,
      engineer: MOCK_ENGINEERS[1],
      permissions: {
        canViewLogs: true,
        canViewRequests: false,
        canAddEngineer: true,
        canRemoveEngineer: false,
        canApproveRequest: false,
        canRejectRequest: false,
      },
    },
    {
      id: 3,
      projectId: 1,
      engineer: MOCK_ENGINEERS[2],
      permissions: {
        canViewLogs: true,
        canViewRequests: true,
        canAddEngineer: true,
        canRemoveEngineer: true,
        canApproveRequest: true,
        canRejectRequest: true,
      },
    },
    {
      id: 4,
      projectId: 1,
      engineer: MOCK_ENGINEERS[3],
      permissions: {
        canViewLogs: false,
        canViewRequests: false,
        canAddEngineer: false,
        canRemoveEngineer: false,
        canApproveRequest: false,
        canRejectRequest: false,
      },
    },
    {
      id: 5,
      projectId: 1,
      engineer: MOCK_ENGINEERS[4],
      permissions: {
        canViewLogs: true,
        canViewRequests: true,
        canAddEngineer: false,
        canRemoveEngineer: false,
        canApproveRequest: true,
        canRejectRequest: false,
      },
    },
  ];
