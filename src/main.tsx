import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/space-grotesk/wght.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-600.css';
import App from './App';
import { LedgerProvider } from './state/LedgerContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><LedgerProvider><App /></LedgerProvider></React.StrictMode>);
