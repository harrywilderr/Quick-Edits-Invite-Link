import { useEffect, useState } from 'react';

const IndexPage = () => {
  const [columnHValue, setColumnHValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get email parameter from URL
  const clientEmail = new URLSearchParams(window.location.search).get('email');

  useEffect(() => {
    if (clientEmail) {
      const fetchData = async () => {
        try {
          // Replace with the full URL of the function from the other Netlify site
          const res = await fetch(`https://qeclientcredits.netlify.app/.netlify/functions/fetchCredits?email=${clientEmail}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*', // Fix for CORS issue
            },
          });

          const data = await res.json();

          if (data.columnHValue !== "Not Found") {
            setColumnHValue(data.columnHValue);
            // Redirect to the new URL once we have the invite URL
            window.location.href = `https://www.quickedits.co/free-video-confirmation?inviteUrl=${encodeURIComponent(data.columnHValue)}`;
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
  }, [clientEmail]);

  return (
    <div>
      <h1>Client Information</h1>
      {loading && <div>Buffering... Please wait while we fetch your data...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default IndexPage;
