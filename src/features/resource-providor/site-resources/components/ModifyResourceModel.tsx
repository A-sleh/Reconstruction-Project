import Model from "@/components/model/Model";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import React, { useRef } from "react";
import { NewResourceForm } from "./NewResourceForm";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { PureResource } from "../api";

interface Props {
  initial?: PureResource | null;
  openButton?: React.ReactNode | null;
}

const ModifyResourceModel: React.FC<Props> = ({ initial, openButton }) => {
  const { t } = useTranslation();
  const { siteId } = useParams();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Model>
      <Model.Open opens="new-work-site">
        {openButton || (
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            {t("resourceProvidor.workSites.new-site")}
          </Button>
        )}
      </Model.Open>
      <Model.Window name="new-work-site">
        <div className="flex justify-between items-start my-3">
          <div>
            <h2 className="text-xl font-semibold">
              {t("resourceProvidor.workSites.resource.edit-resource-heading")}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t(
                "resourceProvidor.workSites.resource.sub-heading-edit-description",
              )}
            </p>
          </div>
          <Model.Close>
            <button
              type="button"
              className="rounded-full p-2 text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
              ref={closeBtnRef}
            >
              <X className="h-4 w-4" />
            </button>
          </Model.Close>
        </div>
        <NewResourceForm
          initial={initial}
          updateable={true}
          fromWorkSiteId={Number(siteId)}
          onSateled={() => {
            closeBtnRef.current?.click();
          }}
        />
      </Model.Window>
    </Model>
  );
};

export default ModifyResourceModel;
