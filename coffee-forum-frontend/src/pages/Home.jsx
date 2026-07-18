import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="hero">
      <span className="hero-icon">☕</span>
      <h1>Welcome to CoffeeHeads</h1>
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

      <div className="hero-actions">
        <Link to="/coffeepedia" className="btn-primary">
          CoffeePedia
        </Link>
        <Link to="/categories" className="btn-secondary">
          Browse Categories
        </Link>
        {!user && (
          <Link to="/register" className="btn-secondary">
            Join the Conversation
          </Link>
        )}
      </div>
    </div>
  );
}
