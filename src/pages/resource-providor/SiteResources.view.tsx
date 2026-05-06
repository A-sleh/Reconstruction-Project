import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ResourceModal } from "@/features/resource-providor/site-resources/components/ResourceModel";
import { Button } from "@/components/ui/button";
import { Resource } from "@/data/resource-providor/mockData";
import { useAppStore } from "@/stores/useAppStore";
import { toast } from "sonner";
import Header from "@/features/resource-providor/site-resources/components/Header";
import ResourcesTable from "@/features/resource-providor/site-resources/components/ResourcesTable";
import SiteResourceProvidor from "@/features/resource-providor/site-resources/context/SiteResourcesContext";

const SiteResources = () => {
  const { siteId = "" } = useParams();
  const navigate = useNavigate();
  const site = useAppStore((s) => s.sites[3]) ;
  const allResources = useAppStore((s) => s.resources);
  const resources = useMemo(
    () => allResources.filter((r) => true),
    [allResources, siteId],
  );
  const addResource = useAppStore((s) => s.addResource);
  const updateResource = useAppStore((s) => s.updateResource);
  const deleteResource = useAppStore((s) => s.deleteResource);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);

  if (!site) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Site not found.</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Back to sites
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = (data: Omit<Resource, "id" | "siteId">) => {
    if (editing) {
      updateResource(editing.id, { ...data, siteId });
      toast.success("Resource updated");
    } else {
      addResource({ ...data, siteId });
      toast.success("Resource added");
    }
    setEditing(null);
  };

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (r: Resource) => {
    setEditing(r);
    setModalOpen(true);
  };
  const handleDelete = (r: Resource) => {
    if (confirm(`Delete "${r.name}"?`)) {
      deleteResource(r.id);
      toast.success("Resource deleted");
    }
  };

  const contextValue = {
    openEdit,
    handleDelete,
    resources,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        site={site}
        CallToAction={
          <Button
            variant="accent"
            size="lg"
            onClick={openAdd}
            className="self-start lg:self-auto"
          >
            <Plus className="h-4 w-4" /> Add New Resource
          </Button>
        }
      />

      <section className="container py-8">
        <SiteResourceProvidor value={contextValue}>
          <ResourcesTable />
        </SiteResourceProvidor>
      </section>

      <ResourceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
};

export default SiteResources;
