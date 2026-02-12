import React from "react";

/** Panel 9: PMO_doubts says "To do" – placeholder keeping same layout */
export default function IssuesExceptions() {
  return (
    <section className="panel-light">
      <div className="panel-header">Issues & Exceptions</div>
      <div className="panel-sub">
        SLA performance and export-compliance exceptions.
      </div>

      <div className="chart-sla">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none">
          <line className="evacpv-axis" x1="5" y1="45" x2="95" y2="45" />
          <line className="evacpv-axis" x1="5" y1="5" x2="5" y2="45" />
          <polyline className="sla-line" points="5,35 25,30 45,26 65,22 85,18" />
        </svg>
      </div>

      <table className="table-small">
        <thead>
          <tr>
            <th>Category</th>
            <th>Last 30 days</th>
            <th>Open</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Critical issues</td>
            <td>--</td>
            <td>--</td>
          </tr>
          <tr>
            <td>Major issues</td>
            <td>--</td>
            <td>--</td>
          </tr>
          <tr>
            <td>Export-compliance exceptions</td>
            <td>--</td>
            <td>--</td>
          </tr>
        </tbody>
      </table>
      <div className="panel-sub" style={{ marginTop: "8px", color: "#666" }}>
        Data source to be added (Panel 9 – To do).
      </div>
    </section>
  );
}
