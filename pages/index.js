import { useEffect, useState } from 'react';

const IndexPage = () => {
  const [columnHValue, setColumnHValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const clientEmail = new URLSearchParams(window.location.search).get('email');
      
      if (clientEmail) {
        const fetchData = async () => {
          while (!columnHValue) {
            try {
              const res = await fetch(`https://qeclientcredits.netlify.app/.netlify/functions/fetchCredits?email=${clientEmail}`);
              const data = await res.json();

              if (data.columnHValue !== "Not Found") {
                setColumnHValue(data.columnHValue);
                break;
              }
            } catch (err) {
              console.error('Error fetching data:', err);
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
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

  // Animate progress bar over ~30 seconds
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 1;
          if (next >= 100) clearInterval(interval);
          return next;
        });
      }, 300); // 300ms * 100 = 30,000ms (30 seconds)

      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <div style={styles.container}>
      <img src="https://i.imgur.com/UkDKdtb.png" alt="Icon" style={styles.icon} />
      <h1 style={styles.text}>Creating account...</h1>
      <p style={styles.subtext}>This should take about 30 seconds</p>

      {loading && (
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }} />
        </div>
      )}

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: '100px',
    fontFamily: 'Arial, sans-serif',
  },
  icon: {
    width: '40px',
    height: '40px',
    marginBottom: '20px',
  },
  text: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  subtext: {
    fontSize: '16px',
    color: '#777',
    marginBottom: '30px',
  },
  progressContainer: {
    width: '80%',
    height: '10px',
    backgroundColor: '#eee',
    margin: '0 auto',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    transition: 'width 0.3s ease-in-out',
  }
};

export default IndexPage;
