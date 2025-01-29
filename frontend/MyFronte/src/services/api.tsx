import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Django backend URL
});

// Function to fetch sample data
export const fetchSampleData = async (): Promise<{ message: string }> => {
  const response = await api.get('/sample/');
  return response.data;
};
