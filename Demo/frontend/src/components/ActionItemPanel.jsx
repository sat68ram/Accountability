import React, { useMemo, useState } from "react";

/**
 * ActionItemsPanel
 * Props:
 * - items: array of action items
 * - people: [{ name, email }]
 * - currentUser: { name, email }  // assigner default
 * - onCreate: async (payload) => void
 */
export default function ActionItemsPanel({ items = [], people = [], currentUser, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [priority, setPriority] = useState("MEDIUM");
  const [assigneeEmail, setAssigneeEmail] = useState(people[0]?.email ?? "");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const assignee = useMemo(
    () => people.find(p => p.email === assigneeEmail),
    [people, assigneeEmail]
  );

  const sortedItems = useMemo(() => {
    // show non-done first, then earliest due date
    const rank = s => (s === "DONE" ? 2 : s === "CANCELED" ? 3 : 1);
    return [...items].sort((a, b) => {
      const r = rank(a.STATUS) - rank(b.STATUS);
      if (r !== 0) return r;
      const da = a.DUE_DATE ? new Date(a.DUE_DATE).getTime() : Number.MAX_SAFE_INTEGER;
      const db = b.DUE_DATE ? new Date(b.DUE_DATE).getTime() : Number.MAX_SAFE_INTEGER;
      return da - db;
    });
  }, [items]);

  async function handleCreate(e) {
    e.preventDefault();
    setErr("");

    if (!title.trim()) return setErr("Title is required.");
    if (!assigneeEmail) return setErr("Select an assignee.");
    if (!dueDate) return setErr("Due date is required.");

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      assigneeName: assignee?.name ?? "",
      assigneeEmail,
      assignerName: currentUser?.name ?? "System",
      assignerEmail: currentUser?.email ?? null,
      dueDate // "YYYY-MM-DD"
    };

    try {
      setSubmitting(true);
      await onCreate?.(payload);

      // reset (keep assignee as-is)
      setTitle("");
      setDescription("");
      setStatus("OPEN");
      setPriority("MEDIUM");
      setDueDate("");
    } catch (e2) {
      setErr(e2?.message || "Failed to create action item.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel-light action-panel">
      <div className="panel-header">Action Items</div>
      <div className="panel-sub">
        Track and assign follow-ups (owner + due date + status).
      </div>

      {/* Scrollable container that includes list + add form */}
      <div className="action-scroll">
        {/* LIST */}
        <div className="action-list">
          {sortedItems.length === 0 ? (
            <div className="action-empty">No action items yet.</div>
          ) : (
            sortedItems.map((it) => {
              const statusClass =
                it.STATUS === "DONE" ? "status-done" :
                it.STATUS === "BLOCKED" ? "status-blocked" :
                it.STATUS === "IN_PROGRESS" ? "status-progress" :
                it.STATUS === "CANCELED" ? "status-canceled" :
                "status-open";

              const priorityClass =
                it.PRIORITY === "CRITICAL" ? "prio-critical" :
                it.PRIORITY === "HIGH" ? "prio-high" :
                it.PRIORITY === "LOW" ? "prio-low" :
                "prio-medium";

              return (
                <div key={it.ACTION_ID ?? `${it.TITLE}-${it.DUE_DATE}`} className="action-row">
                  <div className="action-main">
                    <div className="action-title">{it.TITLE}</div>
                    {it.DESCRIPTION && <div className="action-desc">{it.DESCRIPTION}</div>}

                    <div className="action-meta">
                      <span className={`pill ${statusClass}`}>{it.STATUS}</span>
                      <span className={`pill ${priorityClass}`}>{it.PRIORITY}</span>
                      <span className="meta-chip">
                        <span className="meta-label">Assignee:</span> {it.ASSIGNEE_NAME}
                      </span>
                      <span className="meta-chip">
                        <span className="meta-label">Assigner:</span> {it.ASSIGNER_NAME ?? "—"}
                      </span>
                      <span className="meta-chip">
                        <span className="meta-label">Due:</span> {it.DUE_DATE}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ADD FORM (after list, inside scrollable area) */}
        <div className="action-add">
          <div className="action-add__title">Add action item</div>

          <form onSubmit={handleCreate} className="action-form">
            <label className="field">
              <span className="field__label">Title</span>
              <input
                className="field__input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Investigate NPS drop in Region West"
              />
            </label>

            <label className="field field--full">
              <span className="field__label">Description</span>
              <textarea
                className="field__input field__textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context, notes, acceptance criteria..."
              />
            </label>

            <div className="action-form__grid">
              <label className="field">
                <span className="field__label">Status</span>
                <select
                  className="field__input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="BLOCKED">BLOCKED</option>
                  <option value="DONE">DONE</option>
                  <option value="CANCELED">CANCELED</option>
                </select>
              </label>

              <label className="field">
                <span className="field__label">Priority</span>
                <select
                  className="field__input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </label>

              <label className="field">
                <span className="field__label">Assignee</span>
                <select
                  className="field__input"
                  value={assigneeEmail}
                  onChange={(e) => setAssigneeEmail(e.target.value)}
                >
                  <option value="" disabled>Select person</option>
                  {people.map((p) => (
                    <option key={p.email} value={p.email}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="field__label">Due date</span>
                <input
                  className="field__input"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </label>
            </div>

            {err && <div className="action-error">{err}</div>}

            <div className="action-actions">
              <button className="btn" type="submit" disabled={submitting}>
                {submitting ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
