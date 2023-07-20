import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";

export function Contact() {
  const [message, setMessage] = useState<string>("");
  const [userRefId, setUserRefId] = useState<Record<string, any> | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getUserRef = async () => {
      const docRef = doc(db, "users", params.userRefId ?? "");
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setUserRefId(docSnapshot.data());
      } else {
        toast.error("Benutzer existiert nicht.");
      }
    };

    getUserRef();
  }, [params.userRefId]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(e.target.value);

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Kontaktiere den Eigentümer</p>
      </header>

      {userRefId !== null && (
        <main>
          <div className="contactLandlord">
            <p className="lanlordName">Eigentümer: {userRefId?.name}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Nachricht
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={onChange}
              ></textarea>
            </div>

            <a
              href={`mailto:${userRefId.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}
