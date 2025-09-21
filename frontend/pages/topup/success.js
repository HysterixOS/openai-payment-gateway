// pages/topup/success.js - Shown after a successful credit top-up
import React from 'react';
import Link from 'next/link';
import NavBar from '../../components/NavBar';

export default function Success() {
  return (
    <div style={styles.container}>
      <NavBar />
      <div style={styles.content}>
        <h2>Top-up Successful</h2>
        <p>Thank you! Your account has been credited. You can now ask more questions.</p>
        <Link href="/ask">
          <a style={styles.button}>Back to Ask Page</a>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f9f9f9'
  },
  content: {
    maxWidth: '600px',
    margin: '2rem auto',
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  button: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px'
  }
};
