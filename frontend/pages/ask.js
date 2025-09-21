// pages/ask.js - Protected page for asking questions
import React, { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import NavBar from '../components/NavBar';

export const getServerSideProps = withPageAuthRequired();

export default function AskPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error querying AI');
      }
      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <NavBar />
      <div style={styles.container}>
        <h2>Ask a Question</h2>
        <form onSubmit={handleAsk} style={styles.form}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            rows={4}
            style={styles.textarea}
            required
          />
          <button type="submit" style={styles.askButton} disabled={loading}>
            {loading ? 'Asking...' : 'Ask AI'}
          </button>
        </form>
        {error && <p style={styles.error}>Error: {error}</p>}
        {answer && (
          <div style={styles.answerBox}>
            <h3>Answer:</h3>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f9f9f9'
  },
  container: {
  maxWidth: '600px',
    margin: '2rem auto',
    padding: '1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem'
  },
  textarea: {
    resize: 'vertical',
    padding: '0.5rem',
    fontSize: '1rem',
    marginBottom: '0.5rem'
  },
  askButton: {
    alignSelf: 'flex-start',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#0070f3',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  error: {
    color: 'red'
  },
  answerBox: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '4px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)'
  }
};
