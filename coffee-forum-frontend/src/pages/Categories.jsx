import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import Pagination from "../components/Pagination";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    api.getCategories(page).then((data) => {
      setCategories(data.content);
      setTotalPages(data.totalPages);
    }).catch(console.error);
  }, [page]);

  async function handleCreate(e) {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    try {
      await api.createCategory(name, slug, description);
      const data = await api.getCategories(page);
      setCategories(data.content);
      setTotalPages(data.totalPages);
      setName("");
      setDescription("");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Categories</h2>
      <ul className="category-list">
        {categories.map((c) => (
          <li key={c.id}>
            <Link to={`/categories/${c.id}/threads`} className="category-card-link">
              <span>{c.name}</span>
              <p>{c.description}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {user?.role === "ADMIN" && (
        <form onSubmit={handleCreate} className="create-form">
          <h3>New Category (admin only)</h3>
          <input placeholder="Name" value={name}
            onChange={(e) => setName(e.target.value)} required />
          <input placeholder="Description" value={description}
            onChange={(e) => setDescription(e.target.value)} />
          <button type="submit">Create</button>
        </form>
      )}
    </div>
  );
}
