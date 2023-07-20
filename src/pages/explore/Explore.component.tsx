import { Link } from "react-router-dom";
import rentCategoryImage from "../../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../../assets/jpg/sellCategoryImage.jpg";
import { Slider } from "../../components";

export function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Erkunden</p>
      </header>

      <main>
        <Slider />
        <p className="exploreCategoryHeading">Kategorien</p>
        <div className="exploreCategories">
          <Link to="/Erkunden/Miete">
            <img
              src={rentCategoryImage}
              alt="Mieten"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Bereich zum Mieten</p>
          </Link>
          <Link to="/Erkunden/Kaufen">
            <img
              src={sellCategoryImage}
              alt="Kaufen"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Bereich zum Kaufen</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
