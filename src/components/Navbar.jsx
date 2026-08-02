import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiSearch } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  Container,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Image // 👈 Importamos el componente Image de Chakra UI
} from '@chakra-ui/react';

// 📸 Importamos la imagen de tu logo desde la carpeta assets
import logoImg from '../assets/logo.png'; // Asegúrate de que la ruta sea correcta

function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Configuración de datos de contacto
  const telefonoWhatsApp = "5493425543758";
  const mensajePredefinido = encodeURIComponent("¡Hola! Vengo de la tienda Entre Joyas J.M y quería hacer una consulta.");
  const urlInstagram = "https://www.instagram.com/entrejoyas.jm?igsh=MWtqM2V4YWRzMGJ1bA==";

  const categorias = [
    'Anillos', 
    'Cadenas', 
    'Pulseras', 
    'Aros', 
    'Conjuntos', 
    'Abridores', 
    'Dijes', 
    'Grabados', 
    'Otros'
  ];

  const cantidadTotalArticulos = cart.reduce((acumulador, item) => acumulador + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCategorySelect = (categoria) => {
    navigate(`/?category=${encodeURIComponent(categoria)}`);
  };

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="10"
      bg="white"
      borderBottom="1px"
      borderColor="gray.100"
      boxShadow="sm"
      py={3}
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          
          {/* 🌟 LOGO + MENÚ DESPLEGABLE DE CATEGORÍAS */}
          <Menu>
            <MenuButton 
              as={Button} 
              variant="ghost" 
              p={1} 
              _hover={{ bg: 'transparent', opacity: 0.85 }}
              _active={{ bg: 'transparent' }}
              rightIcon={<IoIosArrowDown color="#D4AF37" />}
            >
              <HStack spacing={3} align="center">
                {/* Imagen del logo */}
                <Image 
                  src={logoImg} 
                  alt="Entre Joyas J.M Logo" 
                  h="42px" // Ajusta la altura según la proporción de tu imagen
                  objectFit="contain"
                  fallbackSrc="https://via.placeholder.com/40" // Mantiene elegancia si tarda en cargar
                />
                
                {/* Texto del título */}
                <Heading
                  as="h1"
                  size="md"
                  letterSpacing="wider"
                  color="gray.700"
                  display={{ base: 'none', sm: 'block' }} // Oculta el texto en pantallas muy pequeñas para cuidar el espacio
                >
                  Nuestra Colección
                </Heading>
              </HStack>
            </MenuButton>

            <MenuList zIndex="20">
              <MenuItem onClick={() => navigate('/')} fontWeight="bold" color="#D4AF37">
                Ver Todo el Catálogo
              </MenuItem>
              {categorias.map((cat, index) => (
                <MenuItem key={index} onClick={() => handleCategorySelect(cat)}>
                  {cat}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* BUSCADOR DE ARTÍCULOS */}
          <Box as="form" onSubmit={handleSearchSubmit} flex={{ base: '1', md: '0.4' }} mx={{ base: 0, md: 2 }}>
            <InputGroup size="sm">
              <Input
                pr="4.5rem"
                type="text"
                placeholder="Buscar productos..."
                focusBorderColor="#D4AF37"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="md"
              />
              <InputRightElement width="2.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  variant="ghost"
                  icon={<FiSearch />}
                  type="submit"
                  aria-label="Buscar"
                  color="gray.500"
                  _hover={{ color: '#D4AF37' }}
                />
              </InputRightElement>
            </InputGroup>
          </Box>

          {/* CONTENEDOR DE INTERACCIONES Y REDES */}
          <HStack spacing={2} position="relative">
            
            {/* BOTÓN WHATSAPP */}
            <IconButton
              as="a"
              href={`https://wa.me/${telefonoWhatsApp}?text=${mensajePredefinido}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              icon={<FaWhatsapp size="20px" />}
              variant="ghost"
              color="#25D366"
              _hover={{ bg: 'whatsapp.50', transform: 'scale(1.1)' }}
              size="sm"
              transition="all 0.2s"
            />

            {/* BOTÓN INSTAGRAM */}
            <IconButton
              as="a"
              href={urlInstagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar Instagram"
              icon={<FaInstagram size="20px" />}
              variant="ghost"
              color="#E1306C"
              _hover={{ bg: 'pink.50', transform: 'scale(1.1)' }}
              size="sm"
              transition="all 0.2s"
            />

            {/* CARRITO */}
            <Box position="relative">
              <IconButton
                aria-label="Ver carrito de compras"
                icon={<FiShoppingCart size="22px" />}
                variant="ghost"
                color="gray.600"
                onClick={() => navigate('/cart')}
                _hover={{ bg: 'gray.50', color: '#D4AF37' }}
              />
              
              {cantidadTotalArticulos > 0 && (
                <Box
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  bg="#D4AF37"
                  color="white"
                  borderRadius="full"
                  minW="20px"
                  h="20px"
                  px={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                  fontWeight="bold"
                  pointerEvents="none"
                  boxShadow="0 0 0 2px white"
                >
                  <Text as="span">{cantidadTotalArticulos}</Text>
                </Box>
              )}
            </Box>

          </HStack>

        </Flex>
      </Container>
    </Box>
  );
}

export default Navbar;