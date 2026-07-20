import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import Pagination from "../components/Pagination";
import { CupSteamIllustration } from "../components/Illustrations";

export default function News() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    api.getNews(page).then((data) => {
      setItems(data.content);
      setTotalPages(data.totalPages);
    }).catch(console.error);
  }, [page]);

  async function handleDelete(id) {
    if (!confirm("Remove this news item?")) return;
    try {
      await api.deleteNewsItem(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="news-header">
        <CupSteamIllustration className="news-header-illustration" />
        <div>
          <h2>Coffee News</h2>
          <p className="meta">
            Real headlines from the coffee industry, pulled in automatically and kept fresh
            &mdash; no one here is writing these, they just link out to the original source.
          </p>
        </div>
      </div>

      {items.length === 0 && <p>No news yet &mdash; check back soon.</p>}

      <ul className="reply-list">
        {items.map((item) => (
          <li key={item.id}>
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="news-title">
              {item.title}
            </a>
            <div className="thread-card-meta">
              {item.sourceName} &middot; {new Date(item.publishedAt).toLocaleDateString()}
            </div>
            <p className="news-summary">{item.summary}</p>
            {user?.role === "ADMIN" && (
              <button className="delete-inline" onClick={() => handleDelete(item.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
