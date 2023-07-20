import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase.config";
import { Slider, Spinner } from "../../components";
import shareIcon from "../../assets/svg/shareIcon.svg";

export function SingleListing() {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [shareLinkCopied, setShareLinkCopied] = useState<boolean>(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      if (params.listingId !== undefined) {
        const docRef = doc(db, "listings", params.listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setListing(docSnap.data());
          setLoading(false);
        }
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopied(true);
    setTimeout(() => {
      setShareLinkCopied(false);
    }, 2000);
  };

  if (loading) return <Spinner />;

  return (
    <main>
      <div style={{ margin: "0.5rem 1rem" }}>
        <Slider objectFilter={listing.name} />
      </div>

      <div className="shareIconDiv" onClick={handleShare}>
        <img src={shareIcon} alt="share icon" />
      </div>

      {shareLinkCopied && <p className="linkCopied">Der Link wurde kopiert!</p>}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} -{" "}
          {listing.offer ? listing.discountedPrice : listing.regularPrice} EUR
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          Zum {listing.type === "Miete" ? "Mieten" : "Verkaufen"}
        </p>
        {listing.offer && (
          <p className="listingOffer">
            {listing.discountedPrice}€ statt {listing.regularPrice}€
          </p>
        )}

        <ul className="listingDetailsList">
          <li>{listing.bedrooms} Schlafzimmer</li>
          <li>{listing.bathrooms} Badezimmer</li>
          <li>Parkplatz: {listing.parking ? "Ja" : "Nein"}</li>
          <li>Möbeliert: {listing.furnished ? "Ja" : "Nein"}</li>
        </ul>

        <p className="listingLocationTitle">Lage</p>

        <div className="leafletContainer">
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/kontakt/${listing.userRef}?titel=${listing.name}&lage=${listing.location}`}
            className="primaryButton"
          >
            Kontaktiere den Eigentümer
          </Link>
        )}
      </div>
    </main>
  );
}
