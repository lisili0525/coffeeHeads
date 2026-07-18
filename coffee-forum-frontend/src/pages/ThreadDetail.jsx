import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

function canModify(ownerEmail, user) {
  return !!user && (user.role === "ADMIN" || user.sub === ownerEmail);
}

export default function ThreadDetail() {
  const { slug } = useParams();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyBody, setReplyBody] = useState("");
  const [editingThread, setEditingThread] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyBody, setEditReplyBody] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

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

  function startEditThread() {
    setEditTitle(thread.title);
    setEditBody(thread.body);
    setEditTags(thread.tags.map((t) => t.name).join(", "));
    setEditingThread(true);
  }

  async function handleSaveThread(e) {
    e.preventDefault();
    const tagNames = editTags.split(",").map((t) => t.trim()).filter(Boolean);
    try {
      const updated = await api.updateThread(thread.id, editTitle, editBody, tagNames);
      setThread(updated);
      setEditingThread(false);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteThread() {
    if (!confirm("Delete this thread and all its replies?")) return;
    try {
      await api.deleteThread(thread.id);
      navigate(`/categories/${thread.category.id}/threads`);
    } catch (err) {
      alert(err.message);
    }
  }

  function startEditReply(reply) {
    setEditingReplyId(reply.id);
    setEditReplyBody(reply.body);
  }

  async function handleSaveReply(e, replyId) {
    e.preventDefault();
    try {
      const updated = await api.updateReply(thread.id, replyId, editReplyBody);
      setReplies(replies.map((r) => (r.id === replyId ? updated : r)));
      setEditingReplyId(null);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteReply(replyId) {
    if (!confirm("Delete this reply?")) return;
    try {
      await api.deleteReply(thread.id, replyId);
      setReplies(replies.filter((r) => r.id !== replyId));
    } catch (err) {
      alert(err.message);
    }
  }

  if (!thread) return <p>Loading...</p>;

  return (
    <div>
      {editingThread ? (
        <form onSubmit={handleSaveThread} className="create-form">
          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
          <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} required />
          <input placeholder="Tags (comma separated)" value={editTags}
            onChange={(e) => setEditTags(e.target.value)} />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditingThread(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <h2>{thread.title}</h2>
          <p className="meta">by {thread.author.displayName} · {thread.viewCount} views</p>
          <p>{thread.body}</p>
          {thread.tags?.length > 0 && (
            <div className="tag-cloud">
              {thread.tags.map((tag) => (
                <Link key={tag.id} to={`/tags/${tag.name}/threads`} className="tag-badge">
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
          {canModify(thread.author.email, user) && (
            <div className="item-actions">
              <button onClick={startEditThread}>Edit</button>
              <button onClick={handleDeleteThread}>Delete</button>
            </div>
          )}
        </>
      )}

      <h3>Replies</h3>
      <ul className="reply-list">
        {replies.map((r) => (
          <li key={r.id}>
            {editingReplyId === r.id ? (
              <form onSubmit={(e) => handleSaveReply(e, r.id)} className="create-form">
                <textarea value={editReplyBody} onChange={(e) => setEditReplyBody(e.target.value)} required />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingReplyId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <strong>{r.user.displayName}:</strong> {r.body}
                {canModify(r.user.email, user) && (
                  <div className="item-actions">
                    <button onClick={() => startEditReply(r)}>Edit</button>
                    <button onClick={() => handleDeleteReply(r.id)}>Delete</button>
                  </div>
                )}
              </>
            )}
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
