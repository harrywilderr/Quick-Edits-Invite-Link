import { useEffect, useState } from 'react';

const IndexPage = () => {
  const [columnHValue, setColumnHValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get email parameter from URL
      const clientEmail = new URLSearchParams(window.location.search).get('email');
      
      if (clientEmail) {
        const fetchData = async () => {
          try {
            // Replace with the full URL of the function from the other Netlify site
            const res = await fetch(`https://qeclientcredits.netlify.app/.netlify/functions/fetchCredits?email=${clientEmail}`);
            const data = await res.json();

            if (data.columnHValue !== "Not Found") {
              setColumnHValue(data.columnHValue);
            } 
          } catch (err) {
            setError('There was an error fetching the data.');
          } finally {
            setLoading(false);
          }
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
      const redirectUrl = urlParams.get('page') === 'home' 
        ? `https://www.quickedits.co/account-confirmation-home?link=${encodeURIComponent(columnHValue)}`
        : `https://www.quickedits.co/free-video-confirmation?link=${encodeURIComponent(columnHValue)}`;
      
      window.location.href = redirectUrl;
    }
  }, [columnHValue]);

  return (
    <div style={styles.container}>
      <h1 style={styles.text}>Creating account...</h1>
      {loading && (
        <div style={styles.loaderContainer}>
          <img src="https://i.gifer.com/ZKZg.gif" alt="Loading..." style={styles.loader} />
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Lato, sans-serif',
  },
  text: {
    fontSize: '24px',
    fontWeight: 'bold',
    fontFamily: 'Lato, sans-serif',
  },
  loaderContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999,
  },
  loader: {
    width: '100px',
    height: '100px',
  },
};

export default IndexPage;

