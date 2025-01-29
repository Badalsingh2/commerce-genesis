import React, { useEffect, useState } from 'react';
import { fetchSampleData } from './services/api';

// Define the expected structure of the API response
interface ApiResponse {
  message: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<string>(''); // State for API data

  useEffect(() => {
    const getData = async () => {
      try {
        const response: ApiResponse = await fetchSampleData(); // Type-safe API response
        setData(response.message);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, []); // Dependency array ensures the effect runs once on mount

  return (
    <div>
      <h1>Server Response</h1>
      <p>{data || 'Loading...'}</p>
    </div>
  );
};

export default App;
