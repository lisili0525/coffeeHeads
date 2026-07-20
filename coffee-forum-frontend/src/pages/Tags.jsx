import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    api.getTags().then(setTags).catch(console.error);
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await api.createTag(name);
      setTags(await api.getTags());
      setName("");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this tag? It will be removed from any threads using it.")) return;
    try {
      await api.deleteTag(id);
      setTags(await api.getTags());
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Tags</h2>
      {tags.length === 0 && <p>No tags yet.</p>}
      <div className="tag-cloud">
        {tags.map((t) => (
          <span key={t.id} className="tag-badge-group">
            <Link to={`/tags/${t.name}/threads`} className="tag-badge">
              {t.name}
            </Link>
            {user?.role === "ADMIN" && (
              <button className="delete-inline" onClick={() => handleDelete(t.id)}>&times;</button>
            )}
          </span>
        ))}
      </div>

      {user?.role === "ADMIN" && (
        <form onSubmit={handleCreate} className="create-form">
          <h3>New Tag (admin only)</h3>
          <input placeholder="Tag name" value={name}
            onChange={(e) => setName(e.target.value)} required />
          <button type="submit">Create</button>
        </form>
      )}
    </div>
  );
}
