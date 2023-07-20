import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ProgressBar, Spinner } from "../../components";
import { FormDataType, GeoLocation } from "./Create-listing.type";
import { db } from "../../firebase.config";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export function CreateListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [formData, setFormData] = useState<FormDataType>({
    type: "Miete",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
    userRef: "",
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/anmelden");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    setLoading(true);
    if (discountedPrice && discountedPrice >= regularPrice) {
      toast.warning(
        "Der reduzierte Preis muss kleiner als der reguläre Preis sein."
      );
      return;
    }

    if (images instanceof FileList && images.length > 6) {
      toast.warning("Es können maximal 6 Bilder hochgeladen werden.");
      return;
    }

    let geolocation: GeoLocation = {};
    let location;

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );

      const data = await response.json();

      console.log(data);
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location =
        data.status === "ZERO_RESULTS"
          ? undefined
          : data.results[0]?.formatted_address;

      if (location === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.warning("Bitte geben Sie eine korrekte Adresse ein.");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    // store image in sotrage(firebase)
    const storeImage = async (image: File) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser?.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, `images/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            setUploadProgress(progress);
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    if (images && images instanceof FileList) {
      const imageUrls = await Promise.all(
        Array.from(images).map((image) => storeImage(image))
      ).catch((error) => {
        setLoading(false);
        toast.error("Bilder konnten nicht hochgeladen werden!");
        return;
      });

      const formDataCopy = {
        ...formData,
        imageUrls,
        geolocation,
        timestamp: serverTimestamp(),
      };

      delete formDataCopy.address;
      delete formDataCopy.images;
      location && (formDataCopy.location = location);
      !formDataCopy.offer && delete formDataCopy.discountedPrice;

      const docRef = await addDoc(collection(db, "listings"), formDataCopy);
      setLoading(false);
      toast.success("Anzeige erfolgreich erstellt!");
      navigate(`/Erkunden/${formDataCopy.type}/${docRef.id}`);
    }

    setLoading(false);
  };

  const onMutate = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    let boolean: boolean | null = null;

    const target = e.target as HTMLInputElement;

    if (target.value === "true") {
      boolean = true;
    }
    if (target.value === "false") {
      boolean = false;
    }

    // Files
    if (target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: target.files,
      }));
    }

    // Text/Booleans/Numbers
    if (!target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [target.id]: boolean ?? target.value,
      }));
    }
  };

  const onMutateTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Erstellen Sie eine neue Anzeige</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">Verkaufen / Miete</label>
          <div className="formButtons">
            <button
              type="button"
              className={
                type === "verkaufen" ? "formButtonActive" : "formButton"
              }
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Verkaufen
            </button>
            <button
              type="button"
              className={type === "Miete" ? "formButtonActive" : "formButton"}
              id="type"
              value="rent"
              onClick={onMutate}
            >
              Miete
            </button>
          </div>

          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength={32}
            minLength={10}
            required
          />

          <div className="formRooms flex">
            <div>
              <label className="formLabel">Schlafzimmer</label>
              <input
                className="formInputSmall"
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
            <div style={{ marginLeft: "15px" }}>
              <label className="formLabel">Badezimmer</label>
              <input
                className="formInputSmall"
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <label className="formLabel">Parkplatz</label>
          <div className="formButtons">
            <button
              className={parking ? "formButtonActive" : "formButton"}
              type="button"
              id="parking"
              value={"true"}
              onClick={onMutate}
            >
              Ja
            </button>
            <button
              className={
                !parking && parking !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="parking"
              value={"false"}
              onClick={onMutate}
            >
              Nein
            </button>
          </div>

          <label className="formLabel">Möbliert</label>
          <div className="formButtons">
            <button
              className={furnished ? "formButtonActive" : "formButton"}
              type="button"
              id="furnished"
              value={"true"}
              onClick={onMutate}
            >
              Ja
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="furnished"
              value={"false"}
              onClick={onMutate}
            >
              Nein
            </button>
          </div>

          <label className="formLabel">Adresse</label>
          <textarea
            className="formInputAddress"
            id="address"
            value={address}
            onChange={onMutateTextArea}
            required
          />

          {!geolocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Breite</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className="formLabel">Längengrad</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className="formLabel">Angebote</label>
          <div className="formButtons">
            <button
              className={offer ? "formButtonActive" : "formButton"}
              type="button"
              id="offer"
              value={"true"}
              onClick={onMutate}
            >
              Ja
            </button>
            <button
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="offer"
              value={"false"}
              onClick={onMutate}
            >
              Nein
            </button>
          </div>

          <label className="formLabel">Regulärer Preis</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min="50"
              max="750000000"
              required
            />
            {type === "Miete" && <p className="formPriceText">EUR / Monat</p>}
          </div>

          {offer && (
            <>
              <label className="formLabel">Reduzierter Preis</label>
              <input
                className="formInputSmall"
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required={offer}
              />
            </>
          )}

          <label className="formLabel">Bilder</label>
          <p className="imagesInfo">
            Das erste Bild wird das Cover sein (maximal 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <ProgressBar uploadProgress={uploadProgress} />
          <button type="submit" className="primaryButton createListingButton">
            Anzeige erstellen
          </button>
        </form>
      </main>
    </div>
  );
}
