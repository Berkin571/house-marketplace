import { Listing } from "../../shared/listings.type";

export type ListingItemProps = {
  listing: Listing;
  id: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string, name: string) => void;
};
