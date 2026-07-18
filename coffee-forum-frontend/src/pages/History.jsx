import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function History() {
  const [views, setViews] = useState([]);

  useEffect(() => {
    api.getMyHistory().then(setViews).catch(console.error);
  }, []);

  return (
    <div>
      <h2>My History</h2>
      {views.length === 0 && <p>You haven't viewed any threads yet.</p>}
      <ul className="thread-list">
        {views.map((v) => (
          <li key={v.id}>
            <Link to={`/threads/${v.thread.slug}`}>{v.thread.title}</Link>
            <span className="meta"> · viewed {new Date(v.viewedAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
