import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/notesPage.css";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const [error, setError] = useState(null);
  const [addNoteError, setAddNoteError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  const API_URL = process.env.REACT_APP_API_URL;

  const user = useMemo(() => {
    try {
      return userString ? JSON.parse(userString) : null;
    } catch {
      return null;
    }
  }, [userString]);

  // Redirect if no token/user
  useEffect(() => {
    if (!token || !user) {
      navigate("/");
    }
  }, [navigate, token, user]);

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoadingNotes(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Unable to load notes. Please try again.");
    } finally {
      setIsLoadingNotes(false);
    }
  }, [token, API_URL]);

  useEffect(() => {
    if (token && user) {
      fetchNotes();
    }
  }, [fetchNotes, token, user]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    setAddNoteError(null);

    if (!newNote.trim()) {
      setAddNoteError("Note content cannot be empty.");
      return;
    }

    try {
      setIsAddingNote(true);
      const response = await axios.post(
        `${API_URL}/api/notes`,
        { content: newNote.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) => [...prev, response.data]);
      setNewNote("");
    } catch (err) {
      console.error("Error adding note:", err);
      setAddNoteError("Could not add note. Try again.");
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      setDeletingNoteId(id);
      await axios.delete(`${API_URL}/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Could not delete note.");
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!token || !user) {
    return (
      <div className="loading-page">
        <div className="spinner large"></div>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="notes-page-container">
      <header className="notes-header">
        <h1>Welcome, {user.username || "User"}!</h1>
        <button onClick={handleLogout} className="logout-btn">Sign Out</button>
      </header>

      <main className="notes-main-content">
        <section className="add-note-section">
          <h2>Add New Note</h2>
          <form onSubmit={handleAddNote} className="add-note-form">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your note here..."
              disabled={isAddingNote}
            />
            <button type="submit" disabled={isAddingNote || !newNote.trim()}>
              {isAddingNote ? (
                <>
                  <span className="spinner small"></span> Creating...
                </>
              ) : (
                "Create Note"
              )}
            </button>
          </form>
          {addNoteError && <p className="error-message">{addNoteError}</p>}
        </section>

        <section className="notes-list-section">
          <h2>Your Notes</h2>
          {isLoadingNotes ? (
            <div className="loading-state">
              <div className="spinner large"></div>
              <p>Loading your notes...</p>
            </div>
          ) : error ? (
            <p className="error-message large">{error}</p>
          ) : notes.length === 0 ? (
            <div className="empty-state"><p>No notes yet. Start writing!</p></div>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <div key={note._id} className="note-item">
                  <p className="note-content">{note.content}</p>
                  <div className="note-actions">
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="delete-btn"
                      disabled={deletingNoteId === note._id}
                    >
                      {deletingNoteId === note._id ? (
                        <>
                          <span className="spinner tiny"></span> Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default NotesPage;
