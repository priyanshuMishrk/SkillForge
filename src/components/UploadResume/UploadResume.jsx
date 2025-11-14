import React, { useState, useRef } from "react";
import { FiUploadCloud, FiFile, FiX } from "react-icons/fi";

export default function UploadResume({ onResult }) {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openFileDialog = () => fileInputRef.current?.click();

  const handleFileSelect = (file) => {
    if (!file) return;
    setFile(file);
    setError("");
  };

  const onInputChange = (e) => handleFileSelect(e.target.files?.[0]);

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    handleFileSelect(droppedFile);
  };

  const analyzeResume = async () => {
    if (!file) return setError("Please select a resume first.");

    const form = new FormData();
    form.append("resume", file);

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error(await res.text());

      const json = await res.json();
      onResult?.(json);

      // ⭐ SCROLL DOWN TO SECTION AFTER ANALYSIS
      setTimeout(() => {
        document.getElementById("kohol")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 350);

    } catch (err) {
      setError("Upload or analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-wrapper">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={onInputChange}
        style={{ display: "none" }}
      />

      {/* Drag & drop zone */}
      <div
        className={`drop-zone ${dragActive ? "active" : ""}`}
        onClick={openFileDialog}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <FiUploadCloud size={52} className="drop-icon" />
        <p className="drop-title">
          {file ? "Replace Your Resume" : "Drag & Drop to Upload"}
        </p>
        <p className="drop-sub">or click to browse files</p>
      </div>

      {/* File preview */}
      {file && (
        <div className="file-preview">
          <div className="file-info">
            <FiFile size={22} />
            <span>{file.name}</span>
          </div>
          <button className="clear-file" onClick={() => setFile(null)}>
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* BUTTON with LOADING SPINNER */}
      <button
        className="sf-cta upload-btn"
        onClick={file ? analyzeResume : openFileDialog}
        disabled={loading}
      >
        {loading ? (
          <div className="loader"></div>
        ) : file ? (
          "Analyze Resume →"
        ) : (
          "Select Resume"
        )}
      </button>

      {error && <div className="error-text">{error}</div>}
    </div>
  );
}
