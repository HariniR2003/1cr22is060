import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [stats, setStats] = useState({});

  const shorten = async () => {
    const res = await axios.post("http://localhost:5000/shorten", { url });
    setShortUrl(res.data.short_url);
    fetchStats();
  };

  const fetchStats = async () => {
    const res = await axios.get("http://localhost:5000/stats");
    setStats(res.data);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>URL Shortener Statistics</h1>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button onClick={shorten}>Shorten</button>

      {shortUrl && (
        <p>
          Short URL: <a href={shortUrl}>{shortUrl}</a>
        </p>
      )}

      <h2>Statistics</h2>
      {Object.keys(stats).length === 0 ? (
        <p>No URLs created yet</p>
      ) : (
        Object.entries(stats).map(([code, data]) => (
          <div key={code} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
            <p><b>Short Code:</b> {code}</p>
            <p><b>Original URL:</b> {data.original_url}</p>
            <p><b>Created:</b> {data.created_at}</p>
            <p><b>Expires:</b> {data.expires_at}</p>
            <p><b>Total Clicks:</b> {data.total_clicks}</p>
            <h4>Click Details:</h4>
            <ul>
              {data.clicks.map((c, i) => (
                <li key={i}>
                  {c.timestamp} | {c.source} | {c.ip}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
