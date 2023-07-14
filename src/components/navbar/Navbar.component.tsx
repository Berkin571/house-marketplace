import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as OfferIcon } from "../../assets/svg/localOfferIcon.svg";
import { ReactComponent as PersonOutlineIcon } from "../../assets/svg/personOutlineIcon.svg";
import { ReactComponent as ExploreIcon } from "../../assets/svg/exploreIcon.svg";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route: string) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate("/")}>
            <ExploreIcon
              fill={pathMatchRoute("/") ? "#2c2c2c" : "#8f8f8f"}
              width="39px"
              height="38px"
            />
            <p
              className={
                pathMatchRoute("/")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Erkunden
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/angebote")}>
            <OfferIcon
              fill={pathMatchRoute("/angebote") ? "#2c2c2c" : "#8f8f8f"}
              width="39px"
              height="38px"
            />
            <p
              className={
                pathMatchRoute("/angebote")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Angebote
            </p>
          </li>
          <li
            className="navbarListItem"
            onClick={() => navigate("mein-profil")}
          >
            <PersonOutlineIcon
              fill={pathMatchRoute("/mein-profil") ? "#2c2c2c" : "#8f8f8f"}
              width="39px"
              height="38px"
            />
            <p
              className={
                pathMatchRoute("mein-profil")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Mein Profil
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
