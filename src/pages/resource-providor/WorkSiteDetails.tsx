import Header from "@/features/resource-providor/site-resources/components/Header";
import ResourcesTable from "@/features/resource-providor/site-resources/components/ResourcesTable";

export default function WorkSiteDetails() {
  return (
    <div className="min-h-screen bg-background">
      {/* <Header site={site} /> */}

      <section className="container py-8">
        <ResourcesTable />
      </section>
    </div>
  );
}
