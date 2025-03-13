import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom CSS for Thai font support
const style = document.createElement('style');
style.textContent = `
  :root {
    font-family: 'Sarabun', 'Inter', sans-serif;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Prompt', 'Inter', sans-serif;
  }
  
  .font-heading {
    font-family: 'Prompt', 'Inter', sans-serif;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
