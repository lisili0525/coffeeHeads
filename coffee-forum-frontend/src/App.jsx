import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Categories from "./pages/Categories";
import ThreadList from "./pages/ThreadList";
import ThreadDetail from "./pages/ThreadDetail";

function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav>
      <Link to="/">Coffee Forum</Link>
      <div className="nav-links">
        {user ? (
          <>
            <span>{user.sub} ({user.role})</span>
            <button onClick={logout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log In</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
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
          <Route path="/" element={<Categories />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/categories/:categoryId/threads" element={<ThreadList />} />
          <Route path="/threads/:slug" element={<ThreadDetail />} />
        </Routes>
      </main>
    </div>
  );
}
