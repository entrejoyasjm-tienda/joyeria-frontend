import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // 🌟 Si el usuario navega a una nueva página ("PUSH"), scroll arriba
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
    // Si la navegación es "POP" (botón atrás), no forzamos (0,0) 
    // para permitir que el navegador preserve el scroll anterior.
  }, [pathname, navigationType]);

  return null;
}

export default ScrollToTop;