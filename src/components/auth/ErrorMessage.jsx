import React from "react";

export default function ErrorMessage({ error }) {
  if (!error) return null;
  return <div className="mb-4 text-red-500">{error}</div>;
}
