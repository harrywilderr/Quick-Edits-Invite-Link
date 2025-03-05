import { useEffect, useState } from 'react';

const IndexPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get email parameter from URL
  const clientEmail = new URLSearchParams(window.location.search).get('email');

  useEffect(() => {
    if (clientEmail) {
      const fetchData = async () => {
        try {
          // Faster fetch attempt by setting headers for better performance
          const res = await fetch(`https://qeclientcredits.netlify.app/.netlify/functions/fetchCredits?email=${clientEmail}`, {
            headers: {
              "Cache-Control": "no-cache", // Bypass cache for fresh data
              "Pragma": "no-cache", // Same as Cache-Control
            }
          });
          const data = await res.json();

          if (data.columnHValue !== "Not Found") {
            // Redirect the page once the invite URL is fetched
            window.location.href = `https://www.quickedits.co/free-video-confirmation?${encodeURIComponent(data.columnHValue)}`;
          } else {
            setError('No invite URL found for this email.');
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
  }, [clientEmail]);

  return (
    <div>
      <h1>Client Information</h1>
      {loading && <div>Loading...</div>} {/* Display buffering while waiting */}
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error if any */}
    </div>
  );
};

export default IndexPage;
