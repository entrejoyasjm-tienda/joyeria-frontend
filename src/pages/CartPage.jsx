import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../services/api';
import { IoMdArrowBack } from 'react-icons/io';
import { FiTrash2 } from 'react-icons/fi';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Select,
  SimpleGrid,
  Image,
  Divider,
  FormControl,
  FormLabel,
  useToast
} from '@chakra-ui/react';

function CartPage() {
  const { cart, removeFromCart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  // Estado del formulario en español para facilitar la escritura del usuario
  const [formData, setFormData] = useState({
    nombreApellido: '',
    correo: '',
    celular: '',
    metodoEnvio: 'Retiro en sucursal',
    direccion: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos antes de finalizar la compra.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const totalCompra = getCartTotal();
    const esRetiro = formData.metodoEnvio === 'Retiro en sucursal';

// 📧 ENVÍO DE DATOS A TU BACKEND (Express / Mongoose / Nodemailer)
    try {
      // 1. Petición HTTP POST al backend mapeando las variables a inglés
      await API.post('/orders', {
        clientName: formData.nombreApellido,
        clientEmail: formData.correo,
        clientPhone: formData.celular,
        isPickup: esRetiro,
        deliveryAddress: esRetiro ? 'Retiro en Local' : formData.direccion,
        products: cart.map(item => ({
         productId: item._id,
            name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: totalCompra
      });

      // 2. Construcción del mensaje para la API de WhatsApp
      const listaProductosTexto = cart
        .map(item => `- ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString()}`)
        .join('\n');

      const numeroTienda = "5493425543758"; // 👈 Configura aquí el WhatsApp de tu tienda
      const mensajeWhatsApp = `*Nueva Orden - Entre Joyas J.M*\n\n` +
        `*Cliente:* ${formData.nombreApellido}\n` +
        `*Celular:* ${formData.celular}\n` +
        `*Correo:* ${formData.correo}\n` +
        `*Envío:* ${formData.metodoEnvio}\n` +
        `*Dirección:* ${esRetiro ? 'Retiro en Local' : (formData.direccion || 'N/A')}\n\n` +
        `*Productos:*\n${listaProductosTexto}\n\n` +
        `*Total de la Compra:* $${totalCompra.toLocaleString()}`;

      const urlWhatsApp = `https://wa.me/${numeroTienda}?text=${encodeURIComponent(mensajeWhatsApp)}`;

      toast({
        title: "¡Pedido Procesado!",
        description: "Orden guardada. Redirigiendo a WhatsApp para coordinar pago y entrega.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      // 3. Limpieza de estado y redirecciones
      clearCart();
      window.open(urlWhatsApp, '_blank');// Abrimos la ventana de chat
      navigate('/'); // Volvemos al catálogo

    } catch (err) {
      console.error("Error en el proceso de checkout:", err.response?.data || err);
      toast({
        title: "Error de conexión",
        description: "No se pudo registrar el pedido en el servidor. Inténtalo nuevamente.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // Interfaz en caso de que no haya elementos en el carrito
  if (cart.length === 0) {
    return (
      <Container maxW="container.md" py={20} textAlign="center">
        <Heading size="lg" mb={6} color="gray.700">Tu carrito está vacío</Heading>
        <Button 
          leftIcon={<IoMdArrowBack />} 
          bg="#D4AF37" 
          color="white" 
          _hover={{ bg: '#B39230' }} 
          onClick={() => navigate('/')}
        >
          Volver al Catálogo
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Button leftIcon={<IoMdArrowBack />} variant="ghost" mb={6} onClick={() => navigate('/')}>
        Seguir Comprando
      </Button>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
        {/* COLUMNA IZQUIERDA: RESUMEN DE PRODUCTOS */}
        <VStack align="stretch" spacing={4}>
          <Heading size="md" mb={2} color="gray.700">Productos seleccionados</Heading>
          
          {cart.map((item) => (
            <HStack key={item._id} spacing={4} p={4} borderWidth="1px" borderRadius="lg" justify="space-between" bg="white">
              <Image src={item.imageUrl} alt={item.name} boxSize="80px" objectFit="cover" borderRadius="md" fallbackSrc="https://via.placeholder.com/80" />
              <VStack align="start" flex={1} spacing={1}>
                <Text fontWeight="bold" color="gray.700">{item.name}</Text>
                <Text color="gray.500" fontSize="sm">Cantidad: {item.quantity}</Text>
                <Text color="#D4AF37" fontWeight="semibold">${(item.price * item.quantity).toLocaleString()}</Text>
              </VStack>
              <Button colorScheme="red" variant="ghost" onClick={() => removeFromCart(item._id)}>
                <FiTrash2 />
              </Button>
            </HStack>
          ))}
          
          <Divider />
          <HStack justify="space-between" px={2}>
            <Text fontSize="lg" fontWeight="bold" color="gray.700">Total General:</Text>
            <Text fontSize="xl" fontWeight="bold" color="#D4AF37">${getCartTotal().toLocaleString()}</Text>
          </HStack>
        </VStack>

        {/* COLUMNA DERECHA: FORMULARIO DE CHECKOUT */}
        <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="sm" bg="white">
          <Heading size="md" mb={4} color="gray.700">Datos de Entrega y Contacto</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="gray.600">Nombre y Apellido</FormLabel>
                <Input name="nombreApellido" value={formData.nombreApellido} onChange={handleChange} placeholder="Ej: Juan Pérez" focusBorderColor="#D4AF37" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.600">Número de Celular</FormLabel>
                <Input type="tel" name="celular" value={formData.celular} onChange={handleChange} placeholder="Ej: 3421234567" focusBorderColor="#D4AF37" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.600">Correo Electrónico</FormLabel>
                <Input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="nombre@correo.com" focusBorderColor="#D4AF37" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.600">Método de Envío</FormLabel>
                <Select name="metodoEnvio" value={formData.metodoEnvio} onChange={handleChange} focusBorderColor="#D4AF37">
                  <option value="Retiro en sucursal">Retiro en sucursal</option>
                  <option value="Envío a domicilio">Envío a domicilio</option>
                </Select>
              </FormControl>

              {formData.metodoEnvio === 'Envío a domicilio' && (
                <FormControl isRequired>
                  <FormLabel color="gray.600">Dirección Completa</FormLabel>
                  <Input name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Calle, Número, Localidad" focusBorderColor="#D4AF37" />
                </FormControl>
              )}

              <Button type="submit" w="100%" bg="#D4AF37" color="white" _hover={{ bg: '#B39230' }} size="lg" mt={4} shadow="md">
                Confirmar Compra y Enviar Pedido
              </Button>
            </VStack>
          </form>
        </Box>
      </SimpleGrid>
    </Container>
  );
}

export default CartPage;