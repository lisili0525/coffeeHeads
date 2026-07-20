import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import Pagination from "../components/Pagination";
import { getCategoryVisual } from "../data/categoryVisuals";

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

  async function handleDelete(id) {
    if (!confirm("Delete this category? This only works if it has no threads.")) return;
    try {
      await api.deleteCategory(id);
      const data = await api.getCategories(page);
      setCategories(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Categories</h2>
      <div className="category-summary-row">
        {categories.map((c) => {
          const { Icon, tagline } = getCategoryVisual(c.name);
          return (
            <div key={c.id} className="category-summary-card-wrap">
              <Link to={`/categories/${c.id}/threads`} className="category-summary-card">
                <Icon className="category-summary-icon" />
                <h3>{c.name}</h3>
                <p>{tagline || c.description}</p>
              </Link>
              {user?.role === "ADMIN" && (
                <button className="delete-inline" onClick={() => handleDelete(c.id)}>Delete</button>
              )}
            </div>
          );
        })}
      </div>
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
