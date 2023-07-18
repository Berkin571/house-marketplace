import { Timestamp } from "firebase/firestore";

export type Listing = {
  id: string;
  data: {
    bathrooms: number;
    bedrooms: number;
    discountedPrice: number;
    furnished: boolean;
    geolocation: {
      lat: number;
      lng: number;
    };
    imageUrls: string[];
    location: string;
    name: string;
    offer: boolean;
    parking: boolean;
    regularPrice: number;
    timestamp: Timestamp;
    type: string;
    userRef: string;
  };
};
