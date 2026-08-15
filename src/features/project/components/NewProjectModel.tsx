import Selector from "@/components/inputs/Selector";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import type { BuildingListItem } from "@/features/investor/buildings/api/types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateProject, useUpdateProject } from "../api/actions";
import {
  PROJECT_STATUSES,
  ProjectStatus,
  UpdateProjectPayload,
} from "../api/types";
import { BuildingAsyncSelector } from "./BuildingAsyncSelector";

interface NewProjectModelProps {
  openButton: React.ReactNode;
  buildingId?: number;
  initial?: UpdateProjectPayload | null;
}

const toDateInputValue = (date: string | null | undefined) =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

export function NewProjectModel({
  openButton,
  buildingId,
  initial,
}: NewProjectModelProps) {
  const { t } = useTranslation();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();

  const isUpdate = Boolean(initial);

  const [name, setName] = useState("");
  const [selectedBuilding, setSelectedBuilding] =
    useState<BuildingListItem | null>(null);
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Initializing");

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDate(toDateInputValue(initial.date));
      setEndDate(toDateInputValue(initial.endDate));
      setStatus(initial.status);
    } else {
      setName("");
      setSelectedBuilding(null);
      setDate("");
      setEndDate("");
      setStatus("Initializing");
    }
  }, [initial]);

  const resolvedBuildingId = buildingId ?? selectedBuilding?.buildingId;

  const isFormValid =
    name.trim() !== "" &&
    (isUpdate || resolvedBuildingId != null) &&
    date !== "" &&
    endDate !== "";

  const handleSubmit = (closeModal: () => void) => {
    if (!isFormValid) return;

    if (initial) {
      updateProject(
        {
          id: initial.id,
          name: name.trim(),
          date,
          endDate,
          status,
        },
        {
          onSuccess: () => closeModal(),
        },
      );
      return;
    }

    if (resolvedBuildingId == null) return;
    createProject(
      {
        name: name.trim(),
        buildingId: resolvedBuildingId,
        date,
        endDate,
        status,
      },
      {
        onSuccess: () => {
          setName("");
          setSelectedBuilding(null);
          setDate("");
          setEndDate("");
          setStatus("Initializing");
          closeModal();
        },
      },
    );
  };

  return (
    <PopuupLayout
      openKey={isUpdate ? "edit-project-modal" : "new-project-modal"}
      title={t(
        isUpdate ? "project.updateProject.title" : "project.newProject.title",
      )}
      openButton={openButton}
    >
      {(closeModal) => (
        <div className="space-y-4 my-4">
          <div>
            <Label htmlFor="project-name">
              {t("project.newProject.name.label")}
            </Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("project.newProject.name.placeholder")}
              className="mt-1"
              autoFocus
            />
          </div>

          {!isUpdate && buildingId == null ? (
            <BuildingAsyncSelector
              label={t("project.newProject.buildingId.label")}
              value={selectedBuilding}
              onSelect={setSelectedBuilding}
              placeholder={t("project.newProject.buildingId.placeholder")}
            />
          ) : !isUpdate && buildingId != null ? (
            <div className="text-sm text-muted-foreground">#{buildingId}</div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project-date">
                {t("project.newProject.date.label")}
              </Label>
              <Input
                id="project-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="project-end-date">
                {t("project.newProject.endDate.label")}
              </Label>
              <Input
                id="project-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Selector
              label={t("project.newProject.status.label")}
              value={status}
              setValue={(v) => setStatus(v as ProjectStatus)}
            >
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t(`project.status.${s}`)}
                </option>
              ))}
            </Selector>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="default"
              disabled={!isFormValid}
              isLoading={isCreating || isUpdating}
              onClick={() => handleSubmit(closeModal)}
            >
              {t(
                isUpdate
                  ? "project.updateProject.confirm"
                  : "project.newProject.confirm",
              )}
            </Button>
          </div>
        </div>
      )}
    </PopuupLayout>
  );
}
