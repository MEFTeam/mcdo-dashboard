function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

function exportCSV() {
  let csv = "التاريخ,الوقت,الإسم,الحدث\n";
  document.querySelectorAll("#logTable tr").forEach(row => {
    const cols = row.querySelectorAll("td");
    if (cols.length)
      csv += Array.from(cols).map(td => td.textContent).join(",") + "\n";
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "worker_logs.csv";
  link.click();
}
