import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../../assets/svg/editIcon.svg";
import bedIcon from "../../assets/svg/bedIcon.svg";
import bathtubIcon from "../../assets/svg/bathtubIcon.svg";
import { ListingItemProps } from "./ListingItem.type";

export function ListingItem({
  listing,
  id,
  onEdit,
  onDelete,
}: ListingItemProps) {
  return (
    <li className="categoryListing">
      <Link
        to={`/Erkunden/${listing.data.type}/${id}`}
        className="categoryListingLink"
      >
        <img
          src={listing.data.imageUrls[0]}
          alt={listing.data.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{listing.data.location}</p>
          <p className="categoryListingName">{listing.data.name}</p>

          <p className="categoryListingPrice">
            {listing.data.offer
              ? listing.data.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              : listing.data.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            €{listing.data.type === "Miete" && " / Monat"}
          </p>
          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt="bed" />
            <p className="categoryListingInfoText">
              {listing.data.bedrooms > 1
                ? `${listing.data.bedrooms} Schlafzimmer`
                : "1 Schlafzimmer"}
            </p>
            <img src={bathtubIcon} alt="bath" />
            <p className="categoryListingInfoText">
              {listing.data.bathrooms > 1
                ? `${listing.data.bathrooms} Badezimmer`
                : "1 Badezimmer"}
            </p>
          </div>
        </div>
      </Link>

      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231, 76,60)"
          onClick={() => onDelete(listing.id, listing.data.name)}
        />
      )}

      {onEdit && <EditIcon className="editIcon" onClick={() => onEdit(id)} />}
    </li>
  );
}
