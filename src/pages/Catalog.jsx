import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IconButton } from '@chakra-ui/react'; 
import { FiSettings, FiPlus } from 'react-icons/fi'; 
import { 
  Box, 
  Heading, 
  Text, 
  Container, 
  SimpleGrid, 
  Button, 
  VStack, 
  Badge, 
  Spinner, 
  Center,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import API from '../services/api'; 

import logoImg from '../assets/logo.png'; 
import OptimizedImage from '../components/OptimizedImage';

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const categoriaActiva = queryParams.get('category');
  const busquedaActiva = queryParams.get('search');
  const verTodoActivo = categoriaActiva === 'all';

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isHomePage = !categoriaActiva && !busquedaActiva;

  // 1. Carga Inicial: Solo se dispara cuando cambian los filtros (categoría o búsqueda)
  useEffect(() => {
    const search = queryParams.get('search') || '';
    const category = queryParams.get('category') || '';

    const fetchInitialProducts = async () => {
      setLoading(true);
      setCurrentPage(1); // Reiniciamos a la página 1 cuando cambia el filtro
      try {
        const categoryParam = category === 'all' ? '' : category;
        const limitParam = isHomePage ? 4 : 12;

        const response = await API.get('/products', {
          params: {
            search: search,
            category: categoryParam,
            page: 1,
            limit: limitParam
          }
        }); 
        
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages || 1);
        } else if (Array.isArray(response.data)) {
          const data = response.data;
          setProducts(isHomePage ? data.slice(0, 4) : data);
          setTotalPages(1);
        }

        setError(null);
      } catch (err) {
        console.error("Error al traer productos:", err);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialProducts();
  }, [categoriaActiva, busquedaActiva, isHomePage]);

  // 2. Cargar Más: Petición asíncrona limpia sin modificar la navegación del enrutador
  const handleLoadMore = async () => {
    if (currentPage >= totalPages || loadingMore) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;
    const search = queryParams.get('search') || '';
    const category = queryParams.get('category') || '';
    const categoryParam = category === 'all' ? '' : category;

    try {
      const response = await API.get('/products', {
        params: {
          search: search,
          category: categoryParam,
          page: nextPage,
          limit: 12
        }
      });

      if (response.data && Array.isArray(response.data.products)) {
        // Concatenamos los nuevos productos conservando la lista previa intacta
        setProducts((prevProducts) => [...prevProducts, ...response.data.products]);
        setCurrentPage(nextPage);
      }
    } catch (err) {
      console.error("Error al cargar más productos:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCategorySelect = (categoriaQuery) => {
    if (!categoriaQuery) {
      navigate('/');
    } else {
      navigate(`/?category=${encodeURIComponent(categoriaQuery)}`);
    }
  };

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
      
      {/* Encabezado */}
      <Box textAlign="center" mb={8} bg="gray.50" py={8} borderRadius="xl" boxShadow="md">
        <VStack spacing={4} align="center">
          <OptimizedImage 
            src={logoImg} 
            alt="Logo" 
            h={{ base: '110px', md: '140px' }}
            w={{ base: '110px', md: '140px' }}
            borderRadius="full"
            priority={true}
          />
          <Box>
            <Heading as="h1" size="xl" color="gray.800" mb={2}>
              {verTodoActivo ? "CATÁLOGO COMPLETO" :
               categoriaActiva ? `COLECCIÓN DE ${categoriaActiva.toUpperCase()}` : 
               busquedaActiva ? `RESULTADOS PARA: "${busquedaActiva}"` : 
               "¡Últimas Novedades!"}
            </Heading>
            <Text color="gray.600" fontStyle="italic">
              Explora nuestras piezas exclusivas.
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* Selector de Categorías */}
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
                textAlign="center"
              >
                <OptimizedImage 
                  src={cat.image} 
                  alt={cat.name}
                  h="100px"
                  w="100%"
                />
                <Box p={2}>
                  <Text fontSize="sm" fontWeight={isSelected ? 'bold' : 'medium'} color={isSelected ? '#D4AF37' : 'gray.700'}>
                    {cat.name}
                  </Text>
                </Box>
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>

      {/* Grilla de Productos */}
      {products.length === 0 ? (
        <VStack spacing={4} py={10}>
          <Text textAlign="center" color="gray.500" fontSize="lg">
            No se encontraron joyas disponibles.
          </Text>
          <Button onClick={() => handleCategorySelect('all')} colorScheme="teal" variant="outline" size="sm">
            Ver Todo el Catálogo
          </Button>
        </VStack>
      ) : (
        <VStack spacing={8} align="stretch">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
            {products.map((product, index) => (
              <Box 
                key={product._id || product.id || index}
                bg="white" 
                borderRadius="xl" 
                overflow="hidden" 
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
              >
                <OptimizedImage 
                  src={product.imageUrl || 'https://via.placeholder.com/400'} 
                  alt={product.name}
                  h="250px"
                  w="100%"
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
                    onClick={() => navigate(`/product/${product._id || product.id}`)} 
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

          {/* Botón Cargar Más */}
          {!isHomePage && currentPage < totalPages && (
            <Center pt={8}>
              <Button
                leftIcon={<FiPlus />}
                onClick={handleLoadMore}
                isLoading={loadingMore}
                loadingText="Cargando más joyas..."
                bg="#D4AF37"
                color="white"
                _hover={{ bg: '#B39230' }}
                size="lg"
                px={8}
                borderRadius="full"
                boxShadow="md"
              >
                Cargar más
              </Button>
            </Center>
          )}
        </VStack>
      )}

      {/* Botón Flotante de Administración */}
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
        zIndex="1000"
      />
    </Container>
  );
}

export default Catalog;