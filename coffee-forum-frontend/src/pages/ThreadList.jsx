import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

export default function ThreadList() {
  const { categoryId } = useParams();
  const [threads, setThreads] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.getThreadsByCategory(categoryId).then(setThreads).catch(console.error);
  }, [categoryId]);

  async function handleCreate(e) {
    e.preventDefault();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
    try {
      const created = await api.createThread(Number(categoryId), title, slug, body);
      navigate(`/threads/${created.slug}`);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Threads</h2>
      <ul className="thread-list">
        {threads.map((t) => (
          <li key={t.id}>
            <Link to={`/threads/${t.slug}`}>{t.title}</Link>
            <span> by {t.author.displayName} · {t.viewCount} views</span>
          </li>
        ))}
      </ul>

      {user && (
        <form onSubmit={handleCreate} className="create-form">
          <h3>New Thread</h3>
          <input placeholder="Title" value={title}
            onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Body" value={body}
            onChange={(e) => setBody(e.target.value)} required />
          <button type="submit">Post</button>
        </form>
      )}
    </div>
  );
}