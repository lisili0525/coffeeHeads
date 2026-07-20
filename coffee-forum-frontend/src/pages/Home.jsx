import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { api } from "../api";
import { CupSteamIllustration } from "../components/Illustrations";
import { getCategoryVisual } from "../data/categoryVisuals";

const FEATURED_CATEGORIES = ["Brew Methods", "Bean Reviews", "Gear Talk"];

export default function Home() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getCategories(0, 50).then((data) => setCategories(data.content)).catch(() => {});
  }, []);

  return (
    <div className="hero">
      <CupSteamIllustration className="hero-illustration" />
      <p className="hero-meta">forum.exe — coffee enthusiasts only</p>
      <h1>hi! this is <span className="hero-accent">CoffeeHeads</span></h1>
      <p className="hero-tagline">
        A place for coffee enthusiasts to talk brewing, beans, gears, and more.
      </p>
      <p>
        Browse categories like <strong>Brew Methods</strong>,{" "}
        <strong>Bean Reviews</strong>, and <strong>Gear Talk</strong>, start
        discussion threads, and reply to share what's working (or not) in
        your own cup. Just here to read? No account needed &mdash; register
        only if you want to post a thread or reply yourself.
      </p>

      <div className="hero-icon-row">
        {FEATURED_CATEGORIES.map((name) => {
          const { Icon } = getCategoryVisual(name);
          const category = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
          return (
            <Link
              key={name}
              to={category ? `/categories/${category.id}/threads` : "/categories"}
              className="hero-icon-card"
            >
              <Icon className="hero-icon-svg" />
              <span>{name}</span>
            </Link>
          );
        })}
      </div>

      <div className="hero-actions">
        <Link to="/coffeepedia" className="btn-primary">
          CoffeePedia
        </Link>
        <Link to="/news" className="btn-secondary">
          Coffee News
        </Link>
        {user && (
          <Link to="/categories" className="btn-muted">
            What are people discussing?
          </Link>
        )}
      </div>
    </div>
  );
}
