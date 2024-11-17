import axios from "axios";

const App = axios.create({
  baseURL: "https://ketercoder.pythonanywhere.com",
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default App;
