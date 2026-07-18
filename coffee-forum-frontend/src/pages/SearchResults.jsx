import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../api";
import Pagination from "../components/Pagination";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [threads, setThreads] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [prevQ, setPrevQ] = useState(q);
  if (q !== prevQ) {
    setPrevQ(q);
    setPage(0);
  }

  useEffect(() => {
    if (!q) return;
    api.searchThreads(q, page).then((data) => {
      setThreads(data.content);
      setTotalPages(data.totalPages);
    }).catch(console.error);
  }, [q, page]);

  return (
    <div>
      <h2>Search results for "{q}"</h2>
      {q && threads.length === 0 && <p>No threads match your search.</p>}
      <ul className="thread-list">
        {threads.map((t) => (
          <li key={t.id}>
            <Link to={`/threads/${t.slug}`}>{t.title}</Link>
            <span> by {t.author.displayName} · {t.viewCount} views</span>
            {t.tags?.length > 0 && (
              <div className="tag-cloud">
                {t.tags.map((tag) => (
                  <Link key={tag.id} to={`/tags/${tag.name}/threads`} className="tag-badge">
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
