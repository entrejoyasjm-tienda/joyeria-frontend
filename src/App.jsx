import { useEffect } from 'react'; // 👈 1. Importamos useEffect desde React
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Catalog from './pages/Catalog'; // 👈 Importamos tu página de catálogo
import ProductDetail from './pages/ProductDetail'; // 👈 Importamos tu página de detalle de producto
import Admin from './pages/Admin';
import EditProduct from './pages/EditProduct'; // 👈 Importamos la página de editado
import CartPage from './pages/CartPage'; // 👈 Importamos la página del carrito
import Navbar from './components/Navbar'; // 👈 Importamos el componente Navbar
import ForgotPassword from './pages/ForgotPassword'; // 👈 Importamos la página de recuperación de contraseña
import ChangePassword from './pages/ChangePassword'; // 👈 Importamos la página de cambio de contraseña
import Footer from './components/Footer';
import TopBanner from './components/TopBanner';

function App() {

  // ==========================================
  // 🔥 CONTROL DE SEGURIDAD GLOBAL CONTRA RECARGAS (F5)
  // ==========================================
  useEffect(() => {
    const manejarRecargaGlobal = () => {
      // Al recargar cualquier página de la app, limpiamos las credenciales por seguridad
      localStorage.removeItem('adminToken');
      sessionStorage.removeItem('sesionFresca');
      
      // Forzamos la actualización de componentes activos (como ProductDetail.jsx)
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
      <Navbar /> {/* Renderizamos el Navbar en todas las páginas */}
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* La página de inicio "/" ahora mostrará el catálogo oficial */}
        <Route path="/" element={<Catalog />} />
        
        {/* Ruta dinámica que recibe el ID de la joya */}
        <Route path="/product/:id" element={<ProductDetail />} />
        
        {/* Ruta para la página de administración */}
        <Route path="/admin" element={<Admin />} />
         {/* Ruta para la página de edición */}
        <Route path="/edit-product/:id" element={<EditProduct />} />
      <Route path="/cart" element={<CartPage />} />
     <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/change-password/:token" element={<ChangePassword />} />
      </Routes>
      <Footer />
    </Router>
    </CartProvider>
  );
}

export default App;