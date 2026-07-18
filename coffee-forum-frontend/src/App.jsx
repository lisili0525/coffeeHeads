import { useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
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

function Nav() {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <nav>
        <button className="hamburger" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
          &#9776;
        </button>
        <Link to="/" className="brand">CoffeeHeads</Link>
        <div className="nav-links">
          <Link to="/coffeepedia">Coffeepedia</Link>
          {user && (
            <>
              <span>{user.sub} ({user.role})</span>
              <button onClick={logout}>Log Out</button>
            </>
          )}
        </div>
      </nav>
      <Drawer open={drawerOpen} onClose={closeDrawer}>
        <SearchBox onNavigate={closeDrawer} />
        <Link to="/categories" onClick={closeDrawer}>Categories</Link>
        <Link to="/tags" onClick={closeDrawer}>Tags</Link>
        {user ? (
          <Link to="/history" onClick={closeDrawer}>My History</Link>
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

export default function App() {
  return (
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
        </Routes>
      </main>
    </div>
  );
}
