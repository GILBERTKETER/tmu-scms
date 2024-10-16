import axios from "axios";

const App = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default App;
