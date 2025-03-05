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
            } else {
              setError('Data not found for this email.');
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
  }, []); // Empty dependency array ensures this effect runs only once on mount

  useEffect(() => {
    // Once the columnHValue is set, redirect to the new URL
    if (columnHValue && typeof window !== 'undefined') {
      window.location.href = `https://www.quickedits.co/free-video-confirmation?link=${encodeURIComponent(columnHValue)}`;
    }
  }, [columnHValue]);

  return (
    <div>
      <h1>Client Information</h1>
      
      {/* Loading GIF */}
      {loading && (
        <div style={styles.loaderContainer}>
          <img src="https://i.gifer.com/ZKZg.gif" alt="Loading..." style={styles.loader} />
        </div>
      )}
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {columnHValue && <div>Column H Value: {columnHValue}</div>}
    </div>
  );
};

// Styles for centering the loading GIF
const styles = {
  loaderContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional background overlay
    zIndex: 9999, // Ensures the loader stays on top
  },
  loader: {
    width: '100px', // Adjust the size of the loader as needed
    height: '100px',
  },
};

export default IndexPage;
