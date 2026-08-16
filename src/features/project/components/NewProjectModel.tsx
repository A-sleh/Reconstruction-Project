import PopuupLayout from "@/components/layouts/Popup-layout";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { UpdateProjectPayload } from "../api/types";
import { ProjectFormFields } from "./ProjectFormFields";

interface NewProjectModelProps {
  openButton: ReactNode;
  buildingId?: number;
  initial?: UpdateProjectPayload | null;
}

export function NewProjectModel({
  openButton,
  buildingId,
  initial,
}: NewProjectModelProps) {
  const { t } = useTranslation();
  const isUpdate = Boolean(initial);

  return (
    <PopuupLayout
      openKey={isUpdate ? "edit-project-modal" : "new-project-modal"}
      title={t(
        isUpdate ? "project.updateProject.title" : "project.newProject.title",
      )}
      openButton={openButton}
    >
      {(closeModal) => (
        <ProjectFormFields
          initial={initial}
          buildingId={buildingId}
          onSuccess={closeModal}
        />
      )}
    </PopuupLayout>
  );
}
