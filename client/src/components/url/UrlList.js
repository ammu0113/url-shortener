import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartBar, FaCopy, FaTrash, FaEdit } from "react-icons/fa";
import "./UrlList.scss";

const UrlList = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/url", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch URLs");
      }

      const data = await response.json();
      setUrls(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (shortUrl) => {
    try {
      const fullUrl = `${window.location.origin}/${shortUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      // Add toast notification here
      alert("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleViewAnalytics = (shortId) => {
    navigate(`/analytics/${shortId}`);
  };

  const handleDelete = async (shortId) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) return;

    try {
      const response = await fetch(`/api/url/${shortId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete URL");
      }

      // Refresh the URL list
      fetchUrls();
    } catch (err) {
      console.error("Error deleting URL:", err);
      // Add error notification here
    }
  };

  if (loading) {
    return <div className="loading">Loading URLs...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="url-list">
      <div className="url-list-header">
        <h2>Your URLs</h2>
      </div>

      <div className="url-table-container">
        <table>
          <thead>
            <tr>
              <th>Short URL</th>
              <th>Original URL</th>
              <th>Clicks</th>
              <th>Created</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr key={url.shortId}>
                <td>
                  <a
                    href={`/${url.shortId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {url.shortId}
                  </a>
                </td>
                <td className="original-url" title={url.redirectURL}>
                  {url.redirectURL}
                </td>
                <td>{url.clicks}</td>
                <td>{new Date(url.createdAt).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`status ${url.active ? "active" : "inactive"}`}
                  >
                    {url.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button
                      onClick={() => handleCopy(url.shortId)}
                      title="Copy URL"
                    >
                      <FaCopy />
                    </button>
                    <button
                      onClick={() => handleViewAnalytics(url.shortId)}
                      title="View Analytics"
                    >
                      <FaChartBar />
                    </button>
                    <button
                      onClick={() => handleDelete(url.shortId)}
                      title="Delete URL"
                      className="delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {urls.length === 0 && (
        <div className="no-urls">
          <p>You haven't created any URLs yet.</p>
        </div>
      )}
    </div>
  );
};

export default UrlList;
