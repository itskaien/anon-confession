import { useState, useEffect } from "react";
import * as fp from "fpyx";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [fingerprint, setFingerprint] = useState(null);

  const [honeypot, setHoneypot] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadFingerprint = async () => {
      try {
        const id = await fp.get();
        setFingerprint(id);
      } catch (err) {
        console.error("Failed to generate fingerprint", err);
      }
    };
    loadFingerprint();
  }, []);

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (honeypot) {
      setSuccess(true);
      return;
    }

    if (text.length < 15 || text.length > 2000) {
      setError("Text must be between 15 and 2,000 characters.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const res = await fetch(`${API_URL}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, fingerprint }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      setSuccess(true);
      setText("");
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1>Anon Confessions</h1>
      <p className="subtitle">Confess your crypto sins. 100% anonymous.</p>

      <form onSubmit={handleInitialSubmit}>
        <textarea
          placeholder="I bought the top because a guy with an anime pfp told me to..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          rows={6}
        />

        {/* Honeypot Field (Hidden from humans) */}
        <input
          type="text"
          name="honeypot"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: "none" }}
          tabIndex="-1"
          autoComplete="off"
        />

        <div className="form-footer">
          <span className="char-count">{text.length} / 2000</span>
          <button type="submit">Submit Confession</button>
        </div>
      </form>

      {error && <div className="error-msg">{error}</div>}
      {success && (
        <div className="success-msg">Confession broadcasted anonymously!</div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Are you sure?</h2>
            <p>
              This confession will be posted publicly to the Telegram channel
              and cannot be deleted.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="confirm-btn"
              >
                {isSubmitting ? "Submitting..." : "Yes, post it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
