import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

// Fetcher function for SWR
const fetcher = (url) => fetch(url).then(res => res.json());

export default function NavBar() {
  // Fetch the current balance using SWR
  const { data } = useSWR('/api/balance', fetcher);
  const balance = data ? data.balance : null;
  // Track client rendering to avoid hydration mismatches
  const [clientRendered, setClientRendered] = useState(false);
  useEffect(() => {
    setClientRendered(true);
  }, []);

  return (
    <div style={styles.nav}>
      <div style={styles.brand}>OpenAI Gateway</div>
      <div style={styles.navRight}>
        {clientRendered && balance !== null && (
          <span style={styles.balance}>Balance: ${balance.toFixed(2)}</span>
        )}
        {/* Logout link */}
        <Link href="/api/auth/logout">
          <a style={styles.navLink}>Logout</a>
        </Link>
        {/* Top-up link */}
        <Link href="/api/create-checkout-session">
          <a style={{ ...styles.navLink, ...styles.topUp }}>Top Up</a>
        </Link>
      </div>
    </div>
  );
}

// Inline styles for the navigation bar
const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    backgroundColor: '#0070f3',
    color: '#fff'
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center'
  },
  balance: {
    marginRight: '1rem'
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '1rem',
    cursor: 'pointer'
  },
  topUp: {
    fontWeight: 'bold'
  }
};
