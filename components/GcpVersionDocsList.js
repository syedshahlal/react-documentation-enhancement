import React, { useEffect, useState } from "react";

/**
 * Props:
 * - selectedVersion: string (e.g. "gcp-5.6")
 * - onSelectFile: function (called with the file path when a file is clicked)
 */
export default function GcpVersionDocsList({ selectedVersion, onSelectFile }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedVersion) return;
    setLoading(true);
    setError(null);
    fetch(`/api/list-docs?version=${encodeURIComponent(selectedVersion)}`)
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [selectedVersion]);

  if (!selectedVersion) return <div className="text-gray-400">Select a version</div>;
  if (loading) return <div className="text-gray-400">Loading files...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-2">
      {files.length === 0 && <div className="text-gray-400">No markdown files found.</div>}
      {files.map((file) => (
        <button
          key={file}
          className="block w-full text-left px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900"
          onClick={() => onSelectFile && onSelectFile(file)}
        >
          {file.replace(/^.*[\\\/]/, "")}
        </button>
      ))}
    </div>
  );
}
