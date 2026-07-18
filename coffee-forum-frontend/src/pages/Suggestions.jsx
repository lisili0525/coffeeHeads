import { useEffect, useState } from "react";
import { api } from "../api";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.getMySuggestions().then(setSuggestions).catch(console.error);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const created = await api.createSuggestion(title, body);
      setSuggestions([created, ...suggestions]);
      setTitle("");
      setBody("");
      setMessage("Suggestion sent.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Suggestions</h2>
      <form onSubmit={handleSubmit} className="create-form">
        <h3>Suggest an improvement</h3>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <input
          placeholder="Suggestion title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          required
        />
        <textarea
          placeholder="What should CoffeeHeads add, fix, or improve?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <button type="submit">Post Suggestion</button>
      </form>

      <h3>Your Suggestions</h3>
      {suggestions.length === 0 && <p>You haven't posted any suggestions yet.</p>}
      <ul className="suggestion-list">
        {suggestions.map((suggestion) => (
          <li key={suggestion.id}>
            <div className="suggestion-header">
              <strong>{suggestion.title}</strong>
              <span>{suggestion.status}</span>
            </div>
            <p>{suggestion.body}</p>
            <span className="meta">
              posted {new Date(suggestion.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
