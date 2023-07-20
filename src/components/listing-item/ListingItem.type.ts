import { ListingType } from "../../shared/listings.type";

export type ListingItemProps = {
  listing: ListingType;
  id: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string, name: string) => void;
};
