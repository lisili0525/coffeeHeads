import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

export default function ThreadDetail() {
  const { slug } = useParams();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyBody, setReplyBody] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    api.getThread(slug).then((t) => {
      setThread(t);
      return api.getReplies(t.id);
    }).then(setReplies).catch(console.error);
  }, [slug]);

  async function handleReply(e) {
    e.preventDefault();
    const idempotencyKey = crypto.randomUUID();
    try {
      const created = await api.createReply(thread.id, replyBody, idempotencyKey);
      setReplies([...replies, created]);
      setReplyBody("");
    } catch (err) {
      alert(err.message);
    }
  }

  if (!thread) return <p>Loading...</p>;

  return (
    <div>
      <h2>{thread.title}</h2>
      <p className="meta">by {thread.author.displayName} · {thread.viewCount} views</p>
      <p>{thread.body}</p>

      <h3>Replies</h3>
      <ul className="reply-list">
        {replies.map((r) => (
          <li key={r.id}>
            <strong>{r.user.displayName}:</strong> {r.body}
          </li>
        ))}
      </ul>

      {user && (
        <form onSubmit={handleReply} className="create-form">
          <textarea placeholder="Write a reply..." value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)} required />
          <button type="submit">Reply</button>
        </form>
      )}
    </div>
  );
}