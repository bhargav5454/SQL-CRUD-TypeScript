
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import reduxStore, { persistor } from './ReduxToolkit/Store/Store'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <Provider store={reduxStore}>
    <PersistGate persistor={persistor} >
      <BrowserRouter>
        <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '10px',
              border: '2px solid rgba(255, 255, 255, 0.7)',
              background: 'rgba(28, 15, 0, 0.7)', // Adjust the alpha value for transparency
              color: '#fff',
              backdropFilter: 'blur(5px)', // Use backdropFilter for blur effect
            },
          }}
        />
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
