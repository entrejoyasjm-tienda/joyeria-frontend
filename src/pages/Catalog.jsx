import { useLocation, useNavigate, Link } from 'react-router-dom';
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

// 🌟 Categorías con imágenes para las tarjetas (La primera opción representa "Ver Todo")
const CATEGORIES = [
  { id: 'todos', name: 'Ver Todo', image: '/images/todas.jpg', query: 'all' },
  { id: 'anillos', name: 'Anillos', image: '/images/anillos.jpg', query: 'Anillos' },
  { id: 'cadenas', name: 'Cadenas', image: '/images/cadenas.jpg', query: 'Cadenas' },
  { id: 'pulseras', name: 'Pulseras', image: '/images/pulseras.jpg', query: 'Pulseras' },
  { id: 'aros', name: 'Aros', image: '/images/aros.jpg', query: 'Aros' },
  { id: 'conjuntos', name: 'Conjuntos', image: '/images/conjuntos.jpg', query: 'Conjuntos' },
  { id: 'abridores', name: 'Abridores', image: '/images/abridores.jpg', query: 'Abridores' },
  { id: 'dijes', name: 'Dijes', image: '/images/dijes.jpg', query: 'Dijes' },
  { id: 'grabados', name: 'Grabados', image: '/images/grabados.jpg', query: 'Grabados' },
  { id: 'otros', name: 'Otros', image: '/images/otros.jpg', query: 'Otros' },
];

function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Escuchar cambios en la URL para solicitar productos al backend
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search') || '';
    const category = queryParams.get('category') || '';

    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Si el usuario seleccionó 'all', traemos todos los productos sin filtro de categoría
        const categoryParam = category === 'all' ? '' : category;

        const response = await API.get('/products', {
          params: {
            search: search,
            category: categoryParam
          }
        }); 
        
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error al traer productos:", err);
        setError("No se pudo conectar con el servidor. ¿Está encendido el Backend?");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  // Obtener estado activo de filtros desde los parámetros de la URL
  const queryParams = new URLSearchParams(location.search);
  const categoriaActiva = queryParams.get('category');
  const busquedaActiva = queryParams.get('search');

  // Navegación respetando los parámetros de la URL
  const handleCategorySelect = (categoriaQuery) => {
    if (!categoriaQuery) {
      navigate('/');
    } else {
      navigate(`/?category=${encodeURIComponent(categoriaQuery)}`);
    }
  };

  // 🌟 LÓGICA DE RENDERIZADO CONDICIONAL:
  // Determina si debemos mostrar todos los productos o solo los últimos 4.
  const verTodoActivo = categoriaActiva === 'all';
  const showAllProducts = Boolean((categoriaActiva && !verTodoActivo) || busquedaActiva || verTodoActivo);
  
  const displayedProducts = showAllProducts 
    ? products 
    : [...products].slice(-4).reverse();

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
      
      {/* 🌟 CABECERA CON LOGO Y TÍTULOS */}
      <Box textAlign="center" mb={8} bg="gray.50" py={8} borderRadius="xl" boxShadow="md">
        <VStack spacing={4} align="center">
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
              {verTodoActivo ? "CATÁLOGO COMPLETO" :
               categoriaActiva ? `COLECCIÓN DE ${categoriaActiva.toUpperCase()}` : 
               busquedaActiva ? `RESULTADOS PARA: "${busquedaActiva}"` : 
               "Últimas Incorporaciones"}
            </Heading>
            <Text color="gray.600" fontStyle="italic" fontSize={{ base: 'md', md: 'lg' }}>
              {busquedaActiva 
                ? "Revisa las piezas que coinciden con tu criterio." 
                : (categoriaActiva || verTodoActivo)
                ? "Explora todos los modelos disponibles en nuestra tienda." 
                : "Nuestras piezas más recientes agregadas al catálogo."}
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* 💎 1. SECCIÓN DE TARJETAS DE CATEGORÍAS (Incluye la tarjeta "Ver Todo") */}
      <Box mb={10}>
        <Heading size="md" mb={4} color="gray.700" textAlign="center">
          Explora por Categoría
        </Heading>

        <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={4}>
          {CATEGORIES.map((cat) => {
            const isSelected = 
              (cat.query === 'all' && verTodoActivo) || 
              (!categoriaActiva && cat.query === '') ||
              (categoriaActiva?.toLowerCase() === cat.query.toLowerCase());

            return (
              <Box
                key={cat.id}
                onClick={() => handleCategorySelect(cat.query)}
                cursor="pointer"
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
      {displayedProducts.length === 0 ? (
        <VStack spacing={4} py={10}>
          <Text textAlign="center" color="gray.500" fontSize="lg">
            No se encontraron joyas disponibles para tu criterio de búsqueda.
          </Text>
          <Button onClick={() => handleCategorySelect('all')} colorScheme="teal" variant="outline" size="sm">
            Ver Todo el Catálogo
          </Button>
        </VStack>
      ) : (
        <VStack spacing={8} align="stretch">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
            {displayedProducts.map((product) => (
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
                    onClick={() => navigate(`/product/${product._id}`)} 
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

          {/* 🔘 2. BOTÓN INFERIOR DE ACCIÓN (Aparece al pie de la grilla si solo hay 4 productos en pantalla) */}
          {!showAllProducts && (
            <Center pt={6}>
              <Button
                onClick={() => handleCategorySelect('all')}
                size="lg"
                bg="#D4AF37"
                color="white"
                _hover={{ bg: '#B39230', transform: 'scale(1.03)' }}
                px={10}
                py={6}
                borderRadius="full"
                boxShadow="lg"
                transition="all 0.2s ease-in-out"
              >
                Ver Todo el Catálogo
              </Button>
            </Center>
          )}
        </VStack>
      )}

      {/* 🛠️ BOTÓN FLOTANTE DE ADMINISTRACIÓN */}
      <IconButton
        onClick={() => navigate(localStorage.getItem('adminToken') ? "/admin" : "/login")}
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