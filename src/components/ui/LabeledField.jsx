import React from "react";

export default function LabeledField({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <p className="mt-1 text-gray-900">{value || "Not set"}</p>
    </div>
  );
}
