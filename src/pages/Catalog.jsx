import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IconButton } from '@chakra-ui/react'; 
import { FiSettings, FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi'; 
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
  AlertIcon,
  HStack
} from '@chakra-ui/react';
import API from '../services/api'; 

// 📸 Logo transparente de la tienda
import logoImg from '../assets/logo.png'; 

// 🚀 Componente de Imagen Optimizada
import OptimizedImage from '../components/OptimizedImage';

// 🌟 Categorías con imágenes para las tarjetas
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

  // 📄 Estados para la gestión de la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  // Obtener parámetros de la URL
  const queryParams = new URLSearchParams(location.search);
  const categoriaActiva = queryParams.get('category');
  const busquedaActiva = queryParams.get('search');
  const verTodoActivo = categoriaActiva === 'all';

  // 📌 Determinar si el usuario está en la página inicial sin filtros
  const isHomePage = !categoriaActiva && !busquedaActiva;

  // Escuchar cambios en la URL para solicitar los productos según la vista
  useEffect(() => {
    const search = queryParams.get('search') || '';
    const category = queryParams.get('category') || '';
    const pageFromUrl = parseInt(queryParams.get('page'), 10) || 1;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryParam = category === 'all' ? '' : category;

        // 🎯 Definir el límite según la vista:
        // En la página inicial se solicitan solo 4 productos; en catálogo completo se solicitan 12.
        const limitParam = isHomePage ? 4 : 12;

        // 🚀 Petición a la API enviando los parámetros correspondientes
        const response = await API.get('/products', {
          params: {
            search: search,
            category: categoryParam,
            page: isHomePage ? 1 : pageFromUrl,
            limit: limitParam
          }
        }); 
        
        // Adaptación a la respuesta devuelta por el backend
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
          setCurrentPage(response.data.currentPage || 1);
          setTotalPages(response.data.totalPages || 1);
        } else if (Array.isArray(response.data)) {
          // Si el backend devuelve un arreglo plano, tomamos solo 4 elementos si es la página inicial
          const data = response.data;
          setProducts(isHomePage ? data.slice(0, 4) : data);
          setCurrentPage(1);
          setTotalPages(1);
        }

        setError(null);
      } catch (err) {
        console.error("Error al traer productos:", err);
        setError("No se pudo conectar con el servidor. ¿Está encendido el Backend?");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search, isHomePage]);

  // Manejo de la selección de categoría
  const handleCategorySelect = (categoriaQuery) => {
    if (!categoriaQuery) {
      navigate('/');
    } else {
      navigate(`/?category=${encodeURIComponent(categoriaQuery)}&page=1`);
    }
  };

  // Cambio de página en el catálogo completo
  const handlePageChange = (newPage) => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.set('page', newPage);
    navigate(`/?${currentParams.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      
      {/* 🌟 CABECERA CON LOGO Y TÍTULOS */}
      <Box textAlign="center" mb={8} bg="gray.50" py={8} borderRadius="xl" boxShadow="md">
        <VStack spacing={4} align="center">
          <OptimizedImage 
            src={logoImg} 
            alt="Entre Joyas J.M Logo" 
            h={{ base: '110px', md: '140px' }}
            w={{ base: '110px', md: '140px' }}
            borderRadius="full"
            priority={true}
          />

          <Box>
            <Heading as="h1" size="xl" color="gray.800" mb={2} letterSpacing="wide">
              {verTodoActivo ? "CATÁLOGO COMPLETO" :
               categoriaActiva ? `COLECCIÓN DE ${categoriaActiva.toUpperCase()}` : 
               busquedaActiva ? `RESULTADOS PARA: "${busquedaActiva}"` : 
               "¡Últimas Novedades!"}
            </Heading>
            <Text color="gray.600" fontStyle="italic" fontSize={{ base: 'md', md: 'lg' }}>
              {busquedaActiva 
                ? "Revisa las piezas que coinciden con tu criterio." 
                : (categoriaActiva || verTodoActivo)
                ? "Explora todos los modelos disponibles en nuestra tienda." 
                : "Descubre las últimas 4 piezas agregadas a nuestra colección."}
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
                <OptimizedImage 
                  src={cat.image} 
                  alt={cat.name}
                  h="100px"
                  w="100%"
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
          <Button onClick={() => handleCategorySelect('all')} colorScheme="teal" variant="outline" size="sm">
            Ver Todo el Catálogo
          </Button>
        </VStack>
      ) : (
        <VStack spacing={8} align="stretch">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
            {products.map((product, index) => (
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
                <OptimizedImage 
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500'} 
                  alt={product.name}
                  h="250px"
                  w="100%"
                  width={400}
                  height={400}
                  priority={index === 0}
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

          {/* 🔗 BOTÓN "VER TODO EL CATÁLOGO" EN LA PÁGINA INICIAL */}
          {isHomePage && (
            <Center pt={4}>
              <Button
                rightIcon={<FiArrowRight />}
                onClick={() => handleCategorySelect('all')}
                bg="#D4AF37"
                color="white"
                size="lg"
                px={8}
                _hover={{ bg: '#B39230', transform: 'scale(1.03)' }}
                transition="all 0.2s"
                boxShadow="md"
              >
                Ver Todo el Catálogo
              </Button>
            </Center>
          )}

          {/* 📄 PAGINACIÓN (SOLO CUANDO NO ESTAMOS EN LA PÁGINA INICIAL) */}
          {!isHomePage && totalPages > 1 && (
            <Center pt={8}>
              <HStack spacing={3}>
                <Button
                  leftIcon={<FiChevronLeft />}
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 1}
                  variant="outline"
                  borderColor="#D4AF37"
                  color="#D4AF37"
                  _hover={{ bg: '#FFF8E7' }}
                >
                  Anterior
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    bg={pageNum === currentPage ? '#D4AF37' : 'white'}
                    color={pageNum === currentPage ? 'white' : 'gray.700'}
                    border="1px solid"
                    borderColor="#D4AF37"
                    _hover={{ bg: pageNum === currentPage ? '#B39230' : '#FFF8E7' }}
                    size="md"
                  >
                    {pageNum}
                  </Button>
                ))}

                <Button
                  rightIcon={<FiChevronRight />}
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage === totalPages}
                  variant="outline"
                  borderColor="#D4AF37"
                  color="#D4AF37"
                  _hover={{ bg: '#FFF8E7' }}
                >
                  Siguiente
                </Button>
              </HStack>
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