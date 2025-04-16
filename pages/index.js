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

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 1;
          if (next >= 100) clearInterval(interval);
          return next;
        });
      }, 400); // 40s total

      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <div style={styles.container}>
      <img src="https://s8.ezgif.com/tmp/ezgif-8d6f004730a865.gif" alt="Icon" style={styles.icon} />
      <h1 style={styles.text}>Creating account...</h1>
      <p style={styles.subtext}>This should take about 30 seconds</p>

      {loading && (
        <div style={styles.loaderContainer}>
          <div style={styles.progressBarWrapper}>
            <div style={{ ...styles.progressBar, width: `${progress}%` }} />
          </div>
        </div>
      )}

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: '80px',
    fontFamily: 'Arial, sans-serif'
  },
  icon: {
    width: '40px',
    marginBottom: '10px'
  },
  text: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  subtext: {
    fontSize: '16px',
    color: '#777',
    marginBottom: '30px'
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressBarWrapper: {
    width: '200px',
    height: '8px',
    backgroundColor: '#eee',
    borderRadius: '5px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000',
    transition: 'width 0.3s ease'
  }
};

export default IndexPage;
