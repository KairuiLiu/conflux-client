import ReactDOM from 'react-dom/client';
import '@/styles/index.css';
import App from './App';
import 'webrtc-adapter';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
