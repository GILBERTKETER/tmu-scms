import axios from 'axios';
import App from '../api';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await App.get('/api/auth/get-user', {
        headers: { Cookie: req.headers.cookie }
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json(error.response?.data || { message: 'An error occurred' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}