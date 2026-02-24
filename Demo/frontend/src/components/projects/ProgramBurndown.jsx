import React, { useMemo, useState } from "react";
import { useTaskBurndown } from "../../hooks/useProjects";

export default function ProgramBurndown() {
  const { data = [], isLoading, error } = useTaskBurndown();

  const programs = useMemo(() => {
    const map = new Map();
    (data || []).forEach((row) => {
      const id = row.PROGRAM_ID;
      if (!id) return;
      if (!map.has(id)) {
        map.set(id, row.PROGRAM_NAME || id);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [data]);

  const [selectedProgramId, setSelectedProgramId] = useState(
    () => (programs[0] && programs[0].id) || null
  );

  const series = useMemo(() => {
    if (!selectedProgramId) return [];
    const filtered = (data || []).filter(
      (r) => r.PROGRAM_ID === selectedProgramId
    );
    const byWeek = new Map();
    filtered.forEach((row) => {
      const key = row.WEEK_START_DATE;
      const total = Number(row.TOTAL_TASKS ?? 0) || 0;
      const completed = Number(row.TASKS_COMPLETED ?? 0) || 0;
      const remaining = Number(row.TASKS_REMAINING ?? 0) || 0;
      const existing = byWeek.get(key) || {
        WEEK_START_DATE: key,
        total: 0,
        completed: 0,
        remaining: 0,
      };
      existing.total += total;
      existing.completed += completed;
      existing.remaining += remaining;
      byWeek.set(key, existing);
    });

    return Array.from(byWeek.values()).sort(
      (a, b) =>
        new Date(a.WEEK_START_DATE).getTime() -
        new Date(b.WEEK_START_DATE).getTime()
    );
  }, [data, selectedProgramId]);

  const yMax = useMemo(() => {
    if (!series.length) return 1;
    return Math.max(...series.map((p) => p.total || p.remaining || 0), 1);
  }, [series]);

  const viewTop = 8;
  const viewBottom = 45;

  const points = useMemo(() => {
    if (!series.length) return "";
    const count = series.length;
    return series
      .map((p, i) => {
        const x =
          count === 1 ? 50 : 5 + (i * 90) / Math.max(count - 1, 1);
        const frac = yMax ? (p.remaining || 0) / yMax : 0;
        const y = viewBottom - frac * (viewBottom - viewTop);
        return `${x},${Math.max(viewTop, Math.min(viewBottom, y))}`;
      })
      .join(" ");
  }, [series, yMax]);

  if (isLoading) {
    return (
      <div className="chart-burndown">
        <div style={{ padding: "8px", color: "#666" }}>Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-burndown">
        <div style={{ padding: "8px", color: "#c00" }}>
          Failed to load burndown.
        </div>
      </div>
    );
  }

  const selectedProgram =
    programs.find((p) => p.id === selectedProgramId) || programs[0];

  return (
    <div className="chart-burndown" style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <select
          value={selectedProgram?.id || ""}
          onChange={(e) => setSelectedProgramId(e.target.value)}
          style={{
            fontSize: "12px",
            padding: "2px 6px",
            borderRadius: "4px",
            border: "1px solid #d1d5db",
            background: "#fff",
          }}
        >
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <svg viewBox="0 0 100 50" preserveAspectRatio="none">
        <g className="burndown-grid">
          <line x1="0" y1="10" x2="100" y2="10" />
          <line x1="0" y1="20" x2="100" y2="20" />
          <line x1="0" y1="30" x2="100" y2="30" />
          <line x1="0" y1="40" x2="100" y2="40" />
        </g>
        <line className="burndown-axis" x1="5" y1="45" x2="95" y2="45" />
        <line className="burndown-axis" x1="5" y1="5" x2="5" y2="45" />

        {series.length > 0 && (
          <>
            <polyline className="burndown-actual" points={points} />
            {series.map((p, i) => {
              const count = series.length;
              const x =
                count === 1 ? 50 : 5 + (i * 90) / Math.max(count - 1, 1);
              const frac = yMax ? (p.remaining || 0) / yMax : 0;
              const y = viewBottom - frac * (viewBottom - viewTop);
              const date = new Date(p.WEEK_START_DATE);
              const label = `${date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}: ${p.remaining} tasks remaining`;
              return (
                <circle
                  key={p.WEEK_START_DATE || i}
                  cx={x}
                  cy={Math.max(viewTop, Math.min(viewBottom, y))}
                  r="1.5"
                  fill="#3b82f6"
                >
                  <title>{label}</title>
                </circle>
              );
            })}
          </>
        )}
      </svg>
    </div>
  );
}

