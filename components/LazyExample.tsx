import React from "react";

export default function LazyExample() {
  return (
    <div style={{ padding: 16, background: "#f0f0f0" }}>
      <h2>This component is loaded lazily!</h2>
      <p>Use dynamic imports for heavy or rarely-used components.</p>
    </div>
  );
}
