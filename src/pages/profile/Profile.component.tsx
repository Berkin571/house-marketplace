import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import { db } from "../../firebase.config";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import arrowRight from "../../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../../assets/svg/homeIcon.svg";

export function Profile() {
  const navigate = useNavigate();

  const auth = getAuth();

  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [changeDetails, setChangeDetails] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName ?? "",
    email: auth.currentUser?.email ?? "",
  });

  const { name, email } = formData;

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
      </main>
    </div>
  );
}
