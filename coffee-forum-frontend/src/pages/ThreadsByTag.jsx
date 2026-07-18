import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import Pagination from "../components/Pagination";

export default function ThreadsByTag() {
  const { tagName } = useParams();
  const [threads, setThreads] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [prevTagName, setPrevTagName] = useState(tagName);
  if (tagName !== prevTagName) {
    setPrevTagName(tagName);
    setPage(0);
  }

  useEffect(() => {
    api.getThreadsByTag(tagName, page).then((data) => {
      setThreads(data.content);
      setTotalPages(data.totalPages);
    }).catch(console.error);
  }, [tagName, page]);

  return (
    <div>
      <h2>Threads tagged "{tagName}"</h2>
      <ul className="thread-list">
        {threads.map((t) => (
          <li key={t.id}>
            <Link to={`/threads/${t.slug}`} className="thread-card-link">
              <span>{t.title}</span>
              <span className="thread-card-meta">by {t.author.displayName} · {t.viewCount} views</span>
            </Link>
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
