import { Link, useParams } from "react-router-dom";
import { coffeeFarms } from "../data/coffeeFarms";
import { farmDetails } from "../data/farmDetails";
import { RegionLandscapeIllustration, FlavorProfileIllustration } from "../components/Illustrations";

export default function FarmDetail() {
  const { slug } = useParams();
  const farm = coffeeFarms.find((f) => f.slug === slug);
  const detail = farmDetails[slug];

  if (!farm || !detail) {
    return (
      <div className="coffeepedia">
        <h2>Region not found</h2>
        <p><Link to="/coffeepedia">&larr; Back to Coffeepedia</Link></p>
      </div>
    );
  }

  return (
    <div className="coffeepedia">
      <p className="meta"><Link to="/coffeepedia">&larr; Back to Coffeepedia</Link></p>
      <h2>{farm.name}, {farm.country}</h2>
      <p className="hero-meta">{farm.note}</p>

      <section className="coffeepedia-section-with-art">
        <div>
          {detail.paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <RegionLandscapeIllustration
          terrain={detail.terrain}
          accent={detail.accent}
          className="coffeepedia-illustration"
        />
      </section>

      <section>
        <h3>Tasting notes</h3>
        <FlavorProfileIllustration notes={detail.notes} className="flavor-profile-illustration" />
      </section>
    </div>
  );
}
