export default function Drawer({ open, onClose, children }) {
  return (
    <>
      <div
        className={`drawer-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`drawer ${open ? "open" : ""}`}>
        <button className="drawer-close" onClick={onClose} aria-label="Close menu">
          &times;
        </button>
        <div className="drawer-content">{children}</div>
      </aside>
    </>
  );
}
