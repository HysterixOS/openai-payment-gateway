// pages/index.js - Public landing page
import React from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';

export default function Home() {
  const { user } = useUser();
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>OpenAI Gateway</h1>
      {user ? (
        <div>
          <p>You are logged in as {user.name || user.email}.</p>
          <Link href="/ask">
            <a style={styles.button}>Go to Dashboard</a>
          </Link>
        </div>
      ) : (
        <div>
          <p style={styles.description}>
            Prepaid AI answers at your fingertips. Sign up to start asking questions.      <a href="/api/auth/login" style={styles.button}>Sign In / Sign Up</a>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '2rem'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },
  description: {
    fontSize: '1.2rem',
    marginBottom: '2rem'
  },
  button: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#0070f3',
    border: 'none',
    borderRadius: '5px',
    textDecoration: 'none',
    cursor: 'pointer'
  }
};
