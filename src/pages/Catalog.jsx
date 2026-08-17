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

// 🌟 Arreglo con la tarjeta "Ver Todo" + las 9 categorías reales de la joyería
const CATEGORIES = [
  { id: 'todos', name: 'Ver Todo', image: '/images/todas.jpg', query: '' },
  { id: 'pulseras', name: 'Pulseras', image: '/images/pulseras.jpg', query: 'pulseras' },
  { id: 'aros', name: 'Aros', image: '/images/aros.jpg', query: 'aros' },
  { id: 'abridores', name: 'Abridores', image: '/images/abridores.jpg', query: 'abridores' },
  { id: 'anillos', name: 'Anillos', image: '/images/anillos.jpg', query: 'anillos' },
  { id: 'cadenas', name: 'Cadenas', image: '/images/cadenas.jpg', query: 'cadenas' },
  { id: 'dijes', name: 'Dijes', image: '/images/dijes.jpg', query: 'dijes' },
  { id: 'conjuntos', name: 'Conjuntos', image: '/images/conjuntos.jpg', query: 'conjuntos' },
  { id: 'grabados', name: 'Grabados', image: '/images/grabados.jpg', query: 'grabados' },
  { id: 'otros', name: 'Otros', image: '/images/otros.jpg', query: 'otros' },
];

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

  // Título dinámico basado en el filtro activo
  const queryParams = new URLSearchParams(location.search);
  const categoriaActiva = queryParams.get('category');
  const busquedaActiva = queryParams.get('search');

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

  return (
    <Container maxW="container.xl" py={8}>
      
      {/* 🌟 CABECERA CON LOGO DESTACADO Y TÍTULOS */}
      <Box textAlign="center" mb={8} bg="gray.50" py={8} borderRadius="xl" boxShadow="md">
        <VStack spacing={4} align="center">
          
          {/* Logo circular destacado */}
          <Image 
            src={logoImg} 
            alt="Entre Joyas J.M Logo" 
            h={{ base: '110px', md: '140px' }}
            w={{ base: '110px', md: '140px' }}
            borderRadius="full"
            objectFit="cover"
            transition="all 0.3s ease-in-out"
            _hover={{ transform: 'scale(1.05)' }}
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

      {/* 💎 SECCIÓN DE TARJETAS DE CATEGORÍAS */}
      <Box mb={10}>
        <Heading size="md" mb={4} color="gray.700" textAlign="center">
          Explora por Categoría
        </Heading>

        <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={4}>
          {CATEGORIES.map((cat) => {
            // Verificar si esta tarjeta es la activa según la URL
            const isSelected = 
              (cat.query === '' && !categoriaActiva) || 
              (categoriaActiva?.toLowerCase() === cat.query.toLowerCase());

            return (
              <Box
                key={cat.id}
                as={Link}
                to={cat.query ? `/?category=${cat.query}` : '/'}
                borderRadius="xl"
                overflow="hidden"
                bg="white"
                border="2px solid"
                borderColor={isSelected ? '#D4AF37' : 'gray.200'}
                boxShadow={isSelected ? 'md' : 'sm'}
                transition="all 0.2s ease-in-out"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'md',
                  borderColor: '#D4AF37'
                }}
                textAlign="center"
              >
                <Image 
                  src={cat.image} 
                  alt={cat.name}
                  h="100px"
                  w="100%"
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/150?text=Joya"
                />
                <Box p={2}>
                  <Text 
                    fontSize="sm" 
                    fontWeight={isSelected ? 'bold' : 'medium'}
                    color={isSelected ? '#D4AF37' : 'gray.700'}
                  >
                    {cat.name}
                  </Text>
                </Box>
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>

      {/* 📦 GRILLA DE PRODUCTOS */}
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