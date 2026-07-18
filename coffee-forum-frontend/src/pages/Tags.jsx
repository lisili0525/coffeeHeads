import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Tags() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    api.getTags().then(setTags).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Tags</h2>
      {tags.length === 0 && <p>No tags yet.</p>}
      <div className="tag-cloud">
        {tags.map((t) => (
          <Link key={t.id} to={`/tags/${t.name}/threads`} className="tag-badge">
            {t.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
