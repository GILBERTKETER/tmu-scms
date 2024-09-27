import App from '../api';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await App.post('/api/auth/signin', req.body);
      res.setHeader('Set-Cookie', response.headers['set-cookie']);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json(error.response?.data || { message: 'An error occurred' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}