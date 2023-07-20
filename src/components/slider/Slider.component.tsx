import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { Spinner } from "../spinner";
import "./Slider.styles.css";
import { ReactComponent as ArrowRight } from "../../assets/svg/keyboardArrowRightIcon.svg";

type SliderProps = {
  objectFilter?: string;
};

export function Slider({ objectFilter }: SliderProps) {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings");
      let q;

      if (objectFilter) {
        q = query(
          listingsRef,
          where("name", "==", objectFilter),
          orderBy("timestamp", "desc"),
          limit(5)
        );
      } else {
        q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      }

      const querySnapshot = await getDocs(q);

      let listingsData: any[] = [];

      querySnapshot.forEach((doc) => {
        listingsData.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listingsData);
      setLoading(false);
    };

    fetchListings();
  }, [objectFilter]);

  if (loading) {
    return <Spinner />;
  }

  if (listings.length === 0) {
    return <></>;
  }

  const handlePreviousClick = () => {
    setSlideIndex((oldSlideIndex) => {
      if (oldSlideIndex === 0) {
        return listings.length - 1;
      } else {
        return oldSlideIndex - 1;
      }
    });
  };

  const handleNextClick = () => {
    setSlideIndex((oldSlideIndex) => {
      if (oldSlideIndex === listings.length - 1) {
        return 0;
      } else {
        return oldSlideIndex + 1;
      }
    });
  };

  return listings ? (
    <>
      {!objectFilter && <p className="exploreHeading">Empfohlene Immobilien</p>}

      <div className="slider">
        <button onClick={handlePreviousClick}>
          {" "}
          <ArrowRight style={{ transform: "rotate(180deg)" }} />
        </button>

        <div
          onClick={() =>
            navigate(
              `/Erkunden/${listings[slideIndex].data.type}/${listings[slideIndex].id}`
            )
          }
          style={{
            backgroundImage: `url(${listings[slideIndex].data.imageUrls[0]})`,
          }}
          className="sliderSlideDiv"
        >
          <p className="sliderSlideText">{listings[slideIndex].data.name}</p>
          <p className="sliderSlidePrice">
            {listings[slideIndex].data.discountedPrice ??
              listings[slideIndex].data.regularPrice}{" "}
            EUR {listings[slideIndex].data.type === "Miete" && "/ Monat"}
          </p>
        </div>

        <button onClick={handleNextClick}>
          <ArrowRight />
        </button>
      </div>
    </>
  ) : (
    <></>
  );
}
