import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    try {
      const created = await api.createCategory(name, slug, description);
      setCategories([...categories, created]);
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
            <Link to={`/categories/${c.id}/threads`}>{c.name}</Link>
            <p>{c.description}</p>
          </li>
        ))}
      </ul>

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