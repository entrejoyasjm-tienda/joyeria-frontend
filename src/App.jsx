import React, { useEffect, lazy, Suspense } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Center, Spinner } from '@chakra-ui/react';
import { CartProvider } from './context/CartContext';

// 🌟 Importación estándar para componentes globales (permanecen en memoria)
import Navbar from './components/Navbar'; 
import Footer from './components/Footer';
import TopBanner from './components/TopBanner';

// 🚀 CARGA DIFERIDA (React.lazy): Las rutas de la carpeta /pages se cargan bajo demanda
const Login = lazy(() => import('./pages/Login'));
const Catalog = lazy(() => import('./pages/Catalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Admin = lazy(() => import('./pages/Admin'));
const EditProduct = lazy(() => import('./pages/EditProduct'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));

// ⏳ Componente de fallback visual mientras React descarga el chunk JS de la vista
const PageLoader = () => (
  <Center h="60vh">
    <Spinner size="xl" color="#D4AF37" thickness="4px" />
  </Center>
);

function App() {

  // ==========================================
  // 🔥 CONTROL DE SEGURIDAD GLOBAL CONTRA RECARGAS (F5)
  // ==========================================
  useEffect(() => {
    const manejarRecargaGlobal = () => {
      // Al recargar cualquier página de la app, limpiamos las credenciales por seguridad
      localStorage.removeItem('adminToken');
      sessionStorage.removeItem('sesionFresca');
      
      // Forzamos la actualización de componentes activos
      window.dispatchEvent(new Event('storage'));
    };

    // Escuchamos el evento de descarga/recarga del navegador
    window.addEventListener('beforeunload', manejarRecargaGlobal);

    // Limpieza al desmontar el componente raíz
    return () => {
      window.removeEventListener('beforeunload', manejarRecargaGlobal);
    };
  }, []);

  return (
    <CartProvider>
      <Router>
        <TopBanner />
        <Navbar /> {/* Renderizado síncrono estándar */}
        
        {/* 🌟 Suspense envuelve únicamente la zona dinámica de las páginas */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/change-password/:token" element={<ChangePassword />} />
          </Routes>
        </Suspense>

        <Footer /> {/* Renderizado síncrono estándar */}
      </Router>
    </CartProvider>
  );
}

export default App;