import ConfirmDelete from "@/components/model/ConfirmDelete";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { paths } from "@/config/paths";
import { AlertTriangle, Settings, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDeleteProject } from "../api/actions";
import type { ProjectListItem } from "../api/types";
import { ProjectFormFields } from "./ProjectFormFields";

const ProjectSettingsSection = ({ project }: { project: ProjectListItem }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

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
