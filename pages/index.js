import { useEffect, useState } from 'react';

const IndexPage = () => {
  const [columnHValue, setColumnHValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const clientEmail = new URLSearchParams(window.location.search).get('email');
      
      if (clientEmail) {
        const fetchData = async () => {
          while (!columnHValue) { // Keep trying until columnHValue is found
            try {
              const res = await fetch(`https://qeclientcredits.netlify.app/.netlify/functions/fetchCredits?email=${clientEmail}`);
              const data = await res.json();

              if (data.columnHValue !== "Not Found") {
                setColumnHValue(data.columnHValue);
                break; // Exit loop once value is found
              }
            } catch (err) {
              console.error('Error fetching data:', err);
            }
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retrying
          }
          setLoading(false);
        };

        fetchData();
      } else {
        setError('Email parameter is missing.');
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (columnHValue && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const pageParam = urlParams.get('page');

      if (pageParam === 'home') {
        window.location.href = `https://www.quickedits.co/account-confirmation-home?link=${encodeURIComponent(columnHValue)}`;
      } else {
        window.location.href = `https://www.quickedits.co/account-confirmation?link=${encodeURIComponent(columnHValue)}`;
      }
    }
  }, [columnHValue]);

  return (
    <div style={styles.container}>
      <h1 style={styles.text}>Creating account...</h1>
      <p style={styles.subtext}>This should take about 10 seconds</p>
      
      {loading && (
        <div style={styles.loaderContainer}>
          <img src="https://i.gifer.com/ZKZg.gif" alt="Loading..." style={styles.loader} />
        </div>
      )}

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Lato, sans-serif',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: '24px',
    fontWeight: '400', // Regular weight
  },
  subtext: {
    fontSize: '16px',
    fontWeight: '300',
    color: '#666',
    marginTop: '10px',
  },
  loaderContainer: {
    marginTop: '20px',
  },
  loader: {
    width: '80px',
    height: '80px',
  },
};

export default IndexPage;
