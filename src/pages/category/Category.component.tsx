import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import { Spinner } from "../../components";
import { Listing } from "../../shared/listings.type";
import { ListingItem } from "../../components/listing-item";

export function Category() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // get reference
        const listingsRef = collection(db, "listings");

        // create query
        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        // execute query
        const querySnapshot = await getDocs(q);

        const listings: Array<any> = [];

        querySnapshot.forEach((doc) => {
          return listings.push({ id: doc.id, data: doc.data() });
        });

        setListings(listings);
        setLoading(false);

        console.log(listings);
      } catch (error) {
        toast.error("Anzeigen konnten nicht geladen werden.");
      }
    };

    fetchListings();
  }, [params.categoryName]);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "Miete"
            ? "Bereich zum Mieten"
            : "Bereich zum Kaufen"}
        </p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />
          {/* {lastFetchedListing && (
            <p className='loadMore' onClick={() => {}}>
              Load More
            </p>
          )} */}
        </>
      ) : (
        <>
          <p>Keine Anzeigen für {params.categoryName}</p>
        </>
      )}
    </div>
  );
}
