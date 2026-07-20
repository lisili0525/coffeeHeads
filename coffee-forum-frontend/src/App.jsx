import { useRef, useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Drawer from "./components/Drawer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Categories from "./pages/Categories";
import ThreadList from "./pages/ThreadList";
import ThreadDetail from "./pages/ThreadDetail";
import Tags from "./pages/Tags";
import ThreadsByTag from "./pages/ThreadsByTag";
import History from "./pages/History";
import SearchResults from "./pages/SearchResults";
import Coffeepedia from "./pages/Coffeepedia";
import ProcessingMethods from "./pages/ProcessingMethods";
import Suggestions from "./pages/Suggestions";

function SearchBox({ onNavigate }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      onNavigate?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-box">
      <input placeholder="Search threads..." value={q}
        onChange={(e) => setQ(e.target.value)} />
    </form>
  );
}

function MusicToggle() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/music/background.mp3" loop preload="none" />
      <button
        className="music-toggle"
        onClick={toggleMusic}
        aria-label={playing ? "Mute background music" : "Play background music"}
        aria-pressed={playing}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" />
          {playing ? (
            <path
              d="M16.5 8.5a5 5 0 0 1 0 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M16 9l4 6M20 9l-4 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>
    </>
  );
}

function Nav() {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <nav>
        <div className="nav-start">
          <button className="hamburger" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            &#9776;
          </button>
          <MusicToggle />
        </div>
        <Link to="/" className="brand">CoffeeHeads</Link>
        <div className="nav-links">
          {user ? (
            <>
              <span>{user.sub} ({user.role})</span>
              <button onClick={logout}>Log Out</button>
            </>
          ) : (
            <Link to="/login" className="nav-login-btn">Log In</Link>
          )}
        </div>
      </nav>
      <Drawer open={drawerOpen} onClose={closeDrawer}>
        <Link to="/" onClick={closeDrawer}>Home</Link>
        <SearchBox onNavigate={closeDrawer} />
        <Link to="/categories" onClick={closeDrawer}>Categories</Link>
        <Link to="/tags" onClick={closeDrawer}>Tags</Link>
        <Link to="/coffeepedia" onClick={closeDrawer}>Coffeepedia</Link>
        {user ? (
          <>
            <Link to="/suggestions" onClick={closeDrawer}>Suggestions</Link>
            <Link to="/history" onClick={closeDrawer}>My History</Link>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeDrawer}>Log In</Link>
            <Link to="/register" onClick={closeDrawer}>Register</Link>
          </>
        )}
      </Drawer>
    </>
  );
}

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
}

function titlebarLabel(pathname) {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment ? segment.replace(/-/g, " ") : "home";
}

function OsTitlebar() {
  const { pathname } = useLocation();
  return (
    <div className="os-titlebar">
      <span className="os-dots">
        <span className="os-dot" />
        <span className="os-dot" />
        <span className="os-dot" />
      </span>
      <span className="os-titlebar-label">coffeeheads — {titlebarLabel(pathname)}</span>
    </div>
  );
}

export default function App() {
  return (
    <div className="os-window">
      <OsTitlebar />
      <div className="app">
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:categoryId/threads" element={<ThreadList />} />
            <Route path="/threads/:slug" element={<ThreadDetail />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/tags/:tagName/threads" element={<ThreadsByTag />} />
            <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/coffeepedia" element={<Coffeepedia />} />
            <Route path="/coffeepedia/processing-methods" element={<ProcessingMethods />} />
            <Route path="/suggestions" element={<RequireAuth><Suggestions /></RequireAuth>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
