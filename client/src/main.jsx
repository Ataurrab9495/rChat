import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import App from './App.jsx'
import store from './Redux/Store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <CssBaseline />
        <App />
      </HelmetProvider>
    </Provider>
  </StrictMode>,
)
