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
  }, [clientEmail]);

  return (
    <div>
      <h1>Client Information</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {columnHValue && <div>Column H Value: {columnHValue}</div>}
    </div>
  );
};

export default IndexPage;
