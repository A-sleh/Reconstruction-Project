import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { NewResourceForm } from "./NewResourceForm";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { PureResource } from "../api/types";
import PopuupLayout from "@/components/layouts/Popup-layout";

interface Props {
  initial?: PureResource | null;
  openButton?: React.ReactNode | null;
}

const ModifyResourceModel: React.FC<Props> = ({ initial, openButton }) => {
  const { t } = useTranslation();
  const { siteId } = useParams();

  return (
    <PopuupLayout
      openKey="modify-resource"
      title={t("workSites.resource.edit-resource-heading")}
      subTitle={t("workSites.resource.sub-heading-edit-description")}
      openButton={
        openButton || (
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            {t("workSites.new-site")}
          </Button>
        )
      }
    >
      {(closeModel) => (
        <NewResourceForm
          initial={initial}
          updateable={true}
          fromWorkSiteId={Number(siteId)}
          onSateled={closeModel}
        />
      )}
    </PopuupLayout>
  );
};

export default ModifyResourceModel;
