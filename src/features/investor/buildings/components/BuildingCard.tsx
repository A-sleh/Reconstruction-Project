import { MapPin, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { BuildingListItem } from "../api/types";

interface BuildingCardProps {
  building: BuildingListItem;
  onEdit?: (building: BuildingListItem) => void;
  onDelete?: (buildingId: number) => void;
}

const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="group overflow-hidden shadow-card border-border/60 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-44 overflow-hidden bg-muted">
        {/* {building.coverImageUrl ? (
          <img
            src={building.coverImageUrl}
            alt={building.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )} */}
        <div className="absolute inset-0 bg-linear-to-t from-navy-deep/80 via-navy-deep/10 to-transparent" />
        <Badge
          className="absolute top-3 left-3 border bg-primary/10 text-primary border-primary/20"
          variant="outline"
        >
          {building.buildingType}
        </Badge>
        {onDelete && (
          <div className="absolute top-3 right-3 z-20">
            <Button
              size="icon"
              className="h-8 w-8 rounded-full shadow-md bg-white text-red-300 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => {
                e.preventDefault();
                onDelete(building.buildingId);
              }}
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-semibold text-lg leading-tight">
            {building.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-white/80 mt-1">
            <MapPin className="h-3 w-3" /> {building.address}
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Area
            </p>
            <p className="font-semibold text-foreground">
              {building.area.toLocaleString()} m²
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              City
            </p>
            <p className="font-semibold text-foreground">{building.city}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Orientation
            </p>
            <p className="font-semibold text-foreground">
              {building.orientation}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Parts
            </p>
            <p className="font-semibold text-foreground">
              {building.buildingParts.length}
            </p>
          </div>
        </div>
        {onEdit && (
          <div className="mt-4">
            <Button
              size="sm"
              variant="outline"
              className="gap-1 w-full"
              onClick={() => onEdit(building)}
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuildingCard;
