import { Box, HStack, Text, Icon } from '@chakra-ui/react';
// 📸 Importamos los íconos específicos desde FontAwesome (react-icons/fa)
import { FaMotorcycle, FaMapMarkerAlt, FaStore } from 'react-icons/fa';

function TopBanner() {
  // Función auxiliar para renderizar la secuencia completa de entregas con sus íconos
  const RenderContenidoEnvíos = () => (
    <HStack spacing={3} display="inline-flex" align="center" px={4}>
      {/* 🛵 1. Envíos a domicilio (Moto / Cadetería) */}
      <Icon as={FaMotorcycle} w={4} h={4} />
      <Text as="span">Envíos a domicilio</Text>

      <Text as="span" mx={2} color="whiteAlpha.700">•</Text>

      {/* 📍 2. Punto de encuentro (Alfiler en mapa) */}
      <Icon as={FaMapMarkerAlt} w={3.5} h={3.5} />
      <Text as="span">Punto de encuentro</Text>

      <Text as="span" mx={2} color="whiteAlpha.700">•</Text>

      {/* 🏪 3. Retiro gratis en punto de venta (Casita / Tienda) */}
      <Icon as={FaStore} w={3.5} h={3.5} />
      <Text as="span">Retiro gratis en punto de venta</Text>
    </HStack>
  );

  return (
    <Box
      bg="#D4AF37" // Color dorado institucional de la tienda
      color="white"
      py={1.5}
      overflow="hidden"
      whiteSpace="nowrap"
      position="relative"
      zIndex="11"
      fontSize="xs"
      fontWeight="bold"
      letterSpacing="wider"
      textTransform="uppercase"
      boxShadow="sm"
    >
      {/* Contenedor animado */}
      <Box
        display="inline-block"
        animation="marquee 22s linear infinite"
        _hover={{ animationPlayState: 'paused' }} // Pausa la animación al pasar el mouse
        sx={{
          '@keyframes marquee': {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(-100%)' }
          }
        }}
      >
        <HStack spacing={8} display="inline-flex" align="center">
          {/* Duplicamos el bloque para generar continuidad visual mientras se desplaza */}
          <RenderContenidoEnvíos />
          <Text as="span" fontWeight="light">•</Text>
          <RenderContenidoEnvíos />
        </HStack>
      </Box>
    </Box>
  );
}

export default TopBanner;