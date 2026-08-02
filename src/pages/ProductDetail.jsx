import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { IoMdArrowBack } from 'react-icons/io';
import { 
  Box, 
  Container, 
  SimpleGrid, 
  Image, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  Badge, 
  Spinner, 
  Center,
  Alert,
  AlertIcon,
  Divider,
  HStack
} from '@chakra-ui/react';

import API from '../services/api';

function ProductDetail() {
  const { addToCart } = useCart();
  const { id } = useParams(); // Captura el ID de la joya desde la URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🌟 ESTADO NUEVO: Controla si el usuario actual es el administrador
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verificamos si existe la sesión del administrador activa
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAdmin(true);
    }

    const fetchProductSingle = async () => {
      try {
        const response = await API.get(`/products/${id}`); 
        setProduct(response.data);
      } catch (err) {
        console.error("Error al traer el detalle:", err);
        setError("No se pudo obtener la información de esta joya.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductSingle();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("¿Seguro que deseas eliminar esta joya de forma permanente?")) {
      try {
        await API.delete(`/products/${id}`);
        navigate('/'); // Volvemos al catálogo ya que el producto no existe
      } catch (err) {
        console.error("Error al eliminar:", err);
        alert("No se pudo eliminar el producto.");
      }
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="#D4AF37" thickness="4px" />
      </Center>
    );
  }

  if (error || !product) {
    return (
      <Container maxW="container.md" mt={10}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error || "Producto no encontrado."}
        </Alert>
        <Button leftIcon={<IoMdArrowBack />} mt={4} onClick={() => navigate('/')}>
          Volver al Catálogo
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={12}>
      {/* Botón Volver */}
      <Button 
        leftIcon={<IoMdArrowBack />} 
        variant="ghost" 
        mb={8} 
        color="gray.600"
        _hover={{ color: '#D4AF37' }}
        onClick={() => navigate('/')}
      >
        Volver al catálogo
      </Button>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {/* Imagen de la Joya */}
        <Box borderRadius="xl" overflow="hidden" boxShadow="md" border="1px solid" borderColor="gray.100">
          <Image 
            src={product.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500'} 
            alt={product.name}
            w="100%"
            h={{ base: '350px', md: '500px' }}
            objectFit="cover"
          />
        </Box>

        {/* Información Técnica */}
        <VStack align="start" spacing={5}>
          <Badge colorScheme="amber" variant="solid" borderRadius="full" px={3} py={1}>
            {product.category || 'Colección Exclusiva'}
          </Badge>

          <Heading as="h1" size="xl" color="gray.800">
            {product.name}
          </Heading>

          <Text fontSize="2xl" fontWeight="bold" color="#D4AF37">
            ${product.price?.toLocaleString()}
          </Text>

          <Divider />

          <Box w="100%">
            <Text fontWeight="bold" color="gray.700" mb={2}>
              Descripción del producto:
            </Text>
            <Text color="gray.600" lineHeight="tall">
              {product.description || "Esta pieza no cuenta con una descripción detallada todavía."}
            </Text>
          </Box>

          <HStack w="100%" justify="space-between" pt={4}>
            <Text fontSize="sm" color="gray.500">
              Disponibilidad: 
              <Badge ml={2} colorScheme={product.inStock ? "green" : "red"}>
                {product.inStock ? "En Stock" : "Sin Stock"}
              </Badge>
            </Text>
          </HStack>

          <Button 
  w="100%" 
  size="lg"
  bg="#D4AF37" 
  color="white" 
  _hover={{ bg: '#B39230' }}
  shadow="md"
  mt={6}
  onClick={() => {
    addToCart(product, 1);
    navigate('/cart'); // Te redirigirá a la página de checkout del carrito
  }}
>
  Iniciar Compra / Consultar
</Button>

          {/* 🌟 BOTONERA DE ADMINISTRACIÓN PROTEGIDA CON RENDERIZADO CONDICIONAL */}
          {isAdmin && (
            <VStack w="100%" spacing={3} pt={4}>
              <Divider />
              <Text fontSize="xs" fontWeight="bold" color="gray.400" alignSelf="start">
                ACCIONES DE ADMINISTRADOR
              </Text>
              <Button 
                leftIcon={<FiEdit2 />} 
                colorScheme="blue" 
                variant="outline" 
                w="100%"
                onClick={() => navigate(`/edit-product/${product._id || product.id}`)}
              >
                Modificar
              </Button>
              <Button 
                leftIcon={<FiTrash2 />} 
                colorScheme="red" 
                variant="outline" 
                w="100%"
                onClick={handleDelete}
              >
                Eliminar
              </Button>
            </VStack>
          )}

        </VStack>
      </SimpleGrid>
    </Container>
  );
}

export default ProductDetail;