/** Simple print-to-PDF report generator (uses the browser print dialog). */
export function exportPdfReport(title: string, sections: { heading: string; rows: string[][] }[]) {
  const win = window.open("", "_blank", "width=800,height=900");
  if (!win) {
    throw new Error("Popup blocked. Allow pop-ups to export your PDF.");
  }
  const stamp = new Intl.DateTimeFormat("en-NG", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  }).format(new Date());

  const body = sections
    .map(
      (s) => `
      <h2>${escapeHtml(s.heading)}</h2>
      <table>
        <tbody>
          ${s.rows
            .map(
              (r) =>
                `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`,
            )
            .join("")}
        </tbody>
      </table>`,
    )
    .join("");

  win.document.write(`<!doctype html><html><head><meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body{font-family:Poppins,Arial,sans-serif;color:#111;padding:32px;}
    h1{color:#10B981;margin:0 0 4px;font-size:22px}
    .sub{color:#666;font-size:12px;margin-bottom:24px}
    h2{font-size:14px;margin:24px 0 8px;color:#065f46}
    table{width:100%;border-collapse:collapse;font-size:12px}
    td{border-bottom:1px solid #e5e7eb;padding:8px 6px}
    tr td:first-child{color:#6b7280;width:34%}
    footer{margin-top:32px;font-size:10px;color:#9ca3af}
  </style></head><body>
  <h1>WakaSafe AI — ${escapeHtml(title)}</h1>
  <div class="sub">Generated ${stamp} (WAT, UTC+1)</div>
  ${body}
  <footer>This report is generated from data you entered in WakaSafe AI. It is not medical advice.</footer>
  <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
  </body></html>`);
  win.document.close();
}

function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}
