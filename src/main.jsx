import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react' // 👈 Volvemos al proveedor clásico de v2

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider> {/* 👈 Envolvemos con ChakraProvider */}
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)