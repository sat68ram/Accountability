export async function createActionItem(payload) {
  const res = await fetch("http://localhost:4000/api/vision/action-items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Create action item failed");
  }

  console.log("Create action item:", payload);
  return res.json();
}
