import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

export default function History() {
  const [views, setViews] = useState([]);
  const navigate = useNavigate();

  function openThread(slug) {
    navigate(`/threads/${slug}`);
  }

  function handleThreadKeyDown(e, slug) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openThread(slug);
    }
  }

  useEffect(() => {
    api.getMyHistory().then(setViews).catch(console.error);
  }, []);

  return (
    <div>
      <h2>My History</h2>
      {views.length === 0 && <p>You haven't viewed any threads yet.</p>}
      <ul className="thread-list">
        {views.map((v) => (
          <li
            key={v.id}
            role="link"
            tabIndex={0}
            onClick={() => openThread(v.thread.slug)}
            onKeyDown={(e) => handleThreadKeyDown(e, v.thread.slug)}
          >
            <Link to={`/threads/${v.thread.slug}`} className="thread-card-link">
              <span>{v.thread.title}</span>
              <span className="thread-card-meta">viewed {new Date(v.viewedAt).toLocaleString()}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
