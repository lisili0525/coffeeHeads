import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import Pagination from "../components/Pagination";
import { getCategoryVisual } from "../data/categoryVisuals";

export default function ThreadList() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [threads, setThreads] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const { user } = useAuth();
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

  // Reset to page 0 when navigating to a different category. Adjusting
  // state during render (rather than in an effect) avoids an extra
  // render pass - React's documented pattern for this exact case.
  const [prevCategoryId, setPrevCategoryId] = useState(categoryId);
  if (categoryId !== prevCategoryId) {
    setPrevCategoryId(categoryId);
    setPage(0);
  }

  useEffect(() => {
    api.getCategory(categoryId).then(setCategory).catch(console.error);
  }, [categoryId]);

  useEffect(() => {
    api.getThreadsByCategory(categoryId, page).then((data) => {
      setThreads(data.content);
      setTotalPages(data.totalPages);
    }).catch(console.error);
  }, [categoryId, page]);

  async function handleCreate(e) {
    e.preventDefault();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
    const tagNames = tags.split(",").map((t) => t.trim()).filter(Boolean);
    try {
      const created = await api.createThread(Number(categoryId), title, slug, body, tagNames);
      navigate(`/threads/${created.slug}`);
    } catch (err) {
      alert(err.message);
    }
  }

  const { Icon, tagline } = category ? getCategoryVisual(category.name) : {};

  return (
    <div>
      {category ? (
        <div className="category-intro">
          <Icon className="category-intro-icon" />
          <div>
            <h2>{category.name}</h2>
            <p className="category-intro-text">{tagline || category.description}</p>
          </div>
        </div>
      ) : (
        <h2>Threads</h2>
      )}
      <ul className="thread-list">
        {threads.map((t) => (
          <li
            key={t.id}
            role="link"
            tabIndex={0}
            onClick={() => openThread(t.slug)}
            onKeyDown={(e) => handleThreadKeyDown(e, t.slug)}
          >
            <Link to={`/threads/${t.slug}`} className="thread-card-link">
              <span>{t.title}</span>
              <span className="thread-card-meta">by {t.author.displayName} · {t.viewCount} views</span>
            </Link>
            {t.tags?.length > 0 && (
              <div className="tag-cloud">
                {t.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/tags/${tag.name}/threads`}
                    className="tag-badge"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {user && (
        <form onSubmit={handleCreate} className="create-form">
          <h3>New Thread</h3>
          <input placeholder="Title" value={title}
            onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Body" value={body}
            onChange={(e) => setBody(e.target.value)} required />
          <input placeholder="Tags (comma separated, optional)" value={tags}
            onChange={(e) => setTags(e.target.value)} />
          <button type="submit">Post</button>
        </form>
      )}
    </div>
  );
}
