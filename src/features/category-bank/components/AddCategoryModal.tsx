import { useReducer } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PopuupLayout from "@/components/layouts/Popup-layout";

type CategoryType = "resource" | "service";

export interface CategoryFormData {
  name: string;
  description: string;
  type: CategoryType;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof CategoryFormData; value: string }
  | { type: "RESET"; initialState: CategoryFormData };

const defaultInitialState: CategoryFormData = {
  name: "",
  description: "",
  type: "resource",
};

function categoryFormReducer(
  state: CategoryFormData,
  action: FormAction
): CategoryFormData {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return action.initialState;
    default:
      return state;
  }
}

interface AddCategoryModalProps {
  openButton: React.ReactNode;
  initialState?: CategoryFormData;
  onConfirm?: (data: CategoryFormData) => void;
}

export function AddCategoryModal({
  openButton,
  initialState = defaultInitialState,
  onConfirm,
}: AddCategoryModalProps) {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(categoryFormReducer, initialState);
  const { name, description, type } = state;
  const OPEN_KEY = initialState === defaultInitialState ? "add-category-modal" : "edit-category-modal";

  const handleSubmit = () => {
    if (name.trim() && description.trim()) {
      onConfirm(state);
      dispatch({ type: "RESET", initialState: defaultInitialState });
    }
  };

  const isUpdate = initialState !== defaultInitialState;

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      title={t(
        isUpdate ? "categoryBank.editModal.title" : "categoryBank.addModal.title",
        { defaultValue: isUpdate ? "Edit Category" : "Add New Category" }
      )}
      subTitle={t(
        isUpdate ? "categoryBank.editModal.description" : "categoryBank.addModal.description",
        {
          defaultValue: isUpdate
            ? "Update category details."
            : "Create a new category in the system.",
        }
      )}
      openButton={openButton}
    >
      <div className="space-y-4 my-4">
        <div>
          <Label htmlFor="cat-name">
            {t("categoryBank.addModal.nameLabel", { defaultValue: "Category Name" })}
          </Label>
          <Input
            id="cat-name"
            value={name}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })
            }
            placeholder={t("categoryBank.addModal.namePlaceholder", {
              defaultValue: "Enter category name...",
            })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cat-desc">
            {t("categoryBank.addModal.descriptionLabel", { defaultValue: "Description" })}
          </Label>
          <Textarea
            id="cat-desc"
            value={description}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "description",
                value: e.target.value,
              })
            }
            placeholder={t("categoryBank.addModal.descriptionPlaceholder", {
              defaultValue: "Enter category description...",
            })}
            rows={3}
            className="mt-1"
          />
        </div>
        <div>
          <Label>
            {t("categoryBank.addModal.typeLabel", { defaultValue: "Type" })}
          </Label>
          <Select
            value={type}
            onValueChange={(v) =>
              dispatch({ type: "SET_FIELD", field: "type", value: v })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="resource">
                {t("categoryBank.table.resource", "Resource")}
              </SelectItem>
              <SelectItem value="service">
                {t("categoryBank.table.service", "Service")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          variant="default"
          disabled={!name.trim() || !description.trim()}
          onClick={handleSubmit}
        >
          {t(
            isUpdate
              ? "categoryBank.editModal.actions.confirm"
              : "categoryBank.addModal.actions.confirm",
            { defaultValue: isUpdate ? "Update Category" : "Add Category" }
          )}
        </Button>
      </div>
    </PopuupLayout>
  );
}
