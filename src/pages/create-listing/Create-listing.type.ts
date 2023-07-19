export type FormDataType = {
  type: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  furnished: boolean;
  address: string;
  offer: boolean;
  regularPrice: number;
  discountedPrice: number;
  images: FileList | {} | null;
  latitude: number;
  longitude: number;
  userRef: string;
};
