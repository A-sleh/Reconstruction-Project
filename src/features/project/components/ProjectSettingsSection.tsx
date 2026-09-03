import { useState } from "react";

import { AlertTriangle, Settings, Trash2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ConfirmDelete from "@/components/model/ConfirmDelete";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { paths } from "@/config/paths";

import { useDeleteProject, useUpdateProjectSetting } from "../api/actions";
import type { ProjectListItem } from "../api/types";
import { ProjectFormFields } from "./ProjectFormFields";

const ProjectSettingsSection = ({ project }: { project: ProjectListItem }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
  const { mutate: updateProjectSetting, isPending: isUpdatingSetting } =
    useUpdateProjectSetting();

  const [openApplication, setOpenApplication] = useState(
    project?.openApplicationForMembership || false,
  );

  const handleToggleMembership = (checked: boolean) => {
    setOpenApplication(checked);
    updateProjectSetting({
      projectId: project.id,
      openApplicationForMembership: checked,
    });
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-primary" />
            {t("project.details.settings.editTitle")}
          </CardTitle>
          <CardDescription>
            {t("project.details.settings.editHint")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectFormFields
            initial={{
              id: project.id,
              name: project.name,
              date: project.date,
              endDate: project.endDate,
              status: project.status,
            }}
          />
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            {t("project.details.settings.membershipTitle")}
          </CardTitle>
          <CardDescription>
            {t("project.details.settings.membershipHint")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {t("project.details.settings.membershipLabel")}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t("project.details.settings.membershipDescription")}
              </p>
            </div>
            <Switch
              checked={openApplication}
              onCheckedChange={handleToggleMembership}
              disabled={isUpdatingSetting}
              aria-label={t("project.details.settings.membershipLabel")}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="border-destructive/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {t("project.details.settings.dangerTitle")}
          </CardTitle>
          <CardDescription>
            {t("project.details.settings.dangerDescription")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {t("project.details.settings.dangerHint")}
            </p>
            <ConfirmDelete
              openKey={`delete-project-${project.id}`}
              keys={{
                title: "project.deleteConfirm.title",
                descriptionPrefix: "project.deleteConfirm.descriptionPrefix",
                confirm: "project.deleteConfirm.confirm",
                cancel: "project.deleteConfirm.cancel",
              }}
              item={project.name}
              isLoading={isDeleting}
              onConfirm={() =>
                deleteProject(
                  { id: project.id },
                  {
                    onSuccess: () => navigate(paths.app.projects.getHref()),
                  },
                )
              }
              openButton={
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4" />
                  {t("project.details.settings.dangerConfirm")}
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSettingsSection;
