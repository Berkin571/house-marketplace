import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import { db } from "../../firebase.config";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import arrowRight from "../../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../../assets/svg/homeIcon.svg";
import { ListingItem } from "../../components/listing-item";
import { ListingType } from "../../shared/listings.type";

export function Profile() {
  const navigate = useNavigate();

  const auth = getAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [listings, setListings] = useState<ListingType[] | null>([]);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [changeDetails, setChangeDetails] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName ?? "",
    email: auth.currentUser?.email ?? "",
  });

  const { name, email } = formData;

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser?.uid),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);

      const listings: Array<any> = [];

      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser?.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate("/anmelden");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser?.displayName !== name) {
        await updateProfile(auth.currentUser!, {
          displayName: name,
        });

        const userRef = doc(db, "users", auth.currentUser!.uid);
        await updateDoc(userRef, { name });

        setUpdateSuccess(true);
        updateSuccess === true &&
          toast.success("Die Änderungen wurden gespeichert.");
        setUpdateSuccess(false);
      }
    } catch (error) {
      toast.error("Das Speichern ist fehlgeschlagen.");
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (id: string) => {
    if (window.confirm("Möchtest du diese Anzeige wirklich löschen?")) {
      const docRef = doc(db, "listings", id);
      await deleteDoc(docRef);
      const updatedListings: any = listings?.filter(
        (listing) => listing.id !== id
      );
      setListings(updatedListings);
      toast.success("Die Anzeige wurde gelöscht.");
    }
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">Mein Profil</p>
        <button className="logOut" type="button" onClick={onLogout}>
          Abmelden
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Persönliche Daten</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails(!changeDetails);
            }}
          >
            {changeDetails ? "Speichern" : "Ändern"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />

            <input
              type="text"
              id="email"
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
              style={{
                marginTop: "0.5rem",
                paddingTop: "0.5rem",
              }}
            />
          </form>
        </div>

        <Link to="/anzeige-erstellen" className="createListing">
          <img src={homeIcon} alt="homeIcon" />
          <p className="createListingText">Anzeige erstellen</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>

        {!loading && listings && listings?.length > 0 && (
          <>
            <p className="listingText">Deine aktuellen Anzeigen</p>

            <ul className="listingsList">
              {listings.map((listing: ListingType) => (
                <li key={listing.id}>
                  {listing.data && (
                    <ListingItem
                      key={listing.id}
                      listing={listing}
                      id={listing.id}
                      onDelete={() => onDelete(listing.id)}
                    />
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
