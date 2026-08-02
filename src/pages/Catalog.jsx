import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IconButton } from '@chakra-ui/react'; 
import { FiSettings } from 'react-icons/fi'; 
import { 
  Box, 
  Heading, 
  Text, 
  Container, 
  SimpleGrid, 
  Image, 
  Button, 
  VStack, 
  Badge, 
  Spinner, 
  Center,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import API from '../services/api'; 

// 📸 Importación del logo transparente de la tienda
import logoImg from '../assets/logo.png'; 

function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Hook para escuchar la barra de direcciones del navegador
  const location = useLocation();

  useEffect(() => {
    // 2. Extraer parámetros de búsqueda (?search=... o ?category=...)
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search') || '';
    const category = queryParams.get('category') || '';

    const fetchProducts = async () => {
      setLoading(true); // Activamos el spinner al cambiar de filtro
      try {
        // 3. Enviamos los parámetros limpios al Backend mediante Axios
        const response = await API.get('/products', {
          params: {
            search: search,
            category: category
          }
        }); 
        
        setProducts(response.data);
        setError(null); // Limpiamos errores previos si la petición fue exitosa
      } catch (err) {
        console.error("Error al traer productos:", err);
        setError("No se pudo conectar con el servidor. ¿Está encendido el Backend?");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
    // 4. Se vuelve a ejecutar cada vez que cambia la query string de la URL
  }, [location.search]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="#D4AF37" thickness="4px" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" mt={10}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  // Título dinámico basado en el filtro activo
  const queryParams = new URLSearchParams(location.search);
  const categoriaActiva = queryParams.get('category');
  const busquedaActiva = queryParams.get('search');

  return (
    <Container maxW="container.xl" py={8}>
      
      {/* 🌟 CABECERA CON LOGO DESTACADO Y TÍTULOS */}
      <Box textAlign="center" mb={10} bg="gray.50" py={8} borderRadius="xl" boxShadow="md">
        <VStack spacing={4} align="center">
          
          {/* Logo circular destacado */}
          <Image 
            src={logoImg} 
            alt="Entre Joyas J.M Logo" 
            h={{ base: '110px', md: '140px' }}
            w={{ base: '110px', md: '140px' }}
            borderRadius="full"
            //boxShadow="md"
            //border="3px solid"
            //borderColor="white"
            objectFit="cover"
            transition="all 0.3s ease-in-out"
            _hover={{ transform: 'scale(1.05)', /*boxShadow: 'lg' */}}
          />

          <Box>
            <Heading as="h1" size="xl" color="gray.800" mb={2} letterSpacing="wide">
              {categoriaActiva ? `COLECCIÓN DE ${categoriaActiva.toUpperCase()}` : 
               busquedaActiva ? `RESULTADOS PARA: "${busquedaActiva}"` : 
               "Entre Joyas J.M"}
            </Heading>
            <Text color="gray.600" fontStyle="italic" fontSize={{ base: 'md', md: 'lg' }}>
              {busquedaActiva ? "Revisa las piezas que coinciden con tu criterio." : "Descubre piezas únicas diseñadas con pasión."}
            </Text>
          </Box>

        </VStack>
      </Box>

      {/* Grilla de Productos */}
      {products.length === 0 ? (
        <VStack spacing={4} py={10}>
          <Text textAlign="center" color="gray.500" fontSize="lg">
            No se encontraron joyas disponibles para tu criterio de búsqueda.
          </Text>
          {(categoriaActiva || busquedaActiva) && (
            <Button as={Link} to="/" colorScheme="teal" variant="outline" size="sm">
              Ver Todo el Catálogo
            </Button>
          )}
        </VStack>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
          {products.map((product) => (
            <Box 
              key={product._id} 
              bg="white" 
              borderRadius="xl" 
              overflow="hidden" 
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.100"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}
            >
              <Image 
                src={product.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500'} 
                alt={product.name}
                h="250px"
                w="100%"
                objectFit="cover"
              />

              <VStack p={5} spacing={3} align="start">
                <Badge colorScheme="amber" variant="outline" borderRadius="full" px={2}>
                  {product.category || 'Joya'}
                </Badge>
                
                <Heading size="md" color="gray.800" isTruncated maxW="100%">
                  {product.name}
                </Heading>

                <Text fontSize="lg" fontWeight="bold" color="#D4AF37">
                  ${product.price?.toLocaleString()}
                </Text>

                <Button 
                  as={Link}
                  to={`/product/${product._id}`} 
                  w="100%" 
                  bg="#D4AF37" 
                  color="white" 
                  _hover={{ bg: '#B39230' }}
                  size="sm"
                >
                  Ver Detalles
                </Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* 🛠️ BOTÓN FLOTANTE DE ADMINISTRACIÓN */}
      <IconButton
        as={Link}
        to={localStorage.getItem('adminToken') ? "/admin" : "/login"}
        icon={<FiSettings />}
        aria-label="Panel de Administración"
        position="fixed"
        bottom="40px"
        right="40px"
        size="lg"
        bg="#D4AF37"
        color="white"
        borderRadius="full"
        boxShadow="dark-lg"
        _hover={{ bg: '#B39230', transform: 'scale(1.1)' }}
        transition="all 0.2s"
        zIndex="1000"
      />
    </Container>
  );
}

export default Catalog;