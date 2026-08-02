import { Box, Container, HStack, Text, Icon } from '@chakra-ui/react';
import { MdLocationOn } from 'react-icons/md'; // 👈 Ícono de ubicación estilo Google Maps
import { FaWhatsapp} from 'react-icons/fa';

function Footer() {
  return (
    <Box 
      as="footer" 
      bg="gray.50" 
      color="gray.600" 
      py={6} 
      mt={12} 
      borderTop="1px solid" 
      borderColor="gray.100"
    >
      <Container maxW="container.xl">
        <HStack justify="center" spacing={2} align="center">
          
          {/* 📍 Ícono de ubicación estilo Google */}
          <Icon 
            as={MdLocationOn} 
            w={5} 
            h={5} 
            color="#D4AF37" // Color dorado institucional de Entre Joyas J.M
          />

          {/* Texto de ubicación */}
          <Text fontSize="sm" fontWeight="medium" letterSpacing="wide">
            Santa Fe, Capital - Argentina
          </Text>

         {/* 📍 Ícono de ubicación estilo Google */}
          <Icon 
            as={FaWhatsapp} 
            w={5} 
            h={5} 
            color="#D4AF37" // Color dorado institucional de Entre Joyas J.M
          />

          {/* Número de celular */}
          <Text fontSize="sm" fontWeight="medium" letterSpacing="wide">
            5493425543758
          </Text>
        
        </HStack>
      </Container>
    </Box>
  );
}

export default Footer;