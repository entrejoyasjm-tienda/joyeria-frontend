import { useState , useEffect} from 'react';
import {
  Box, Container, VStack, Heading, FormControl, FormLabel, Input,
  Textarea, Select, Button, useToast, Image, SimpleGrid, 
  InputGroup, InputLeftElement, HStack, Switch, Text, Icon
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiTag, FiDollarSign, FiType, FiImage, FiArrowLeft, FiLogOut } from 'react-icons/fi';
import API from '../services/api';

function Admin() {
 
  const navigate = useNavigate();
  
  const toast = useToast();
 
// ==========================================
  // 🔥 CÓDIGO CORREGIDO: Seguridad contra recarga de pantalla (F5)
  // ==========================================
  // ==========================================
  // 🔥 CÓDIGO CORREGIDO: Control de sesión y detector de F5 en tiempo real
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const esSesionFresca = sessionStorage.getItem('sesionFresca');

    // Caso A: Acceso directo no autorizado sin Token
    if (!token) {
      navigate('/login');
      return;
    }

    // Caso B: Si no existe la bandera de sesión fresca en la pestaña, se asume violación de seguridad
    if (!esSesionFresca) {
      localStorage.removeItem('adminToken');
      navigate('/login');
      return;
    }

    // Función que se ejecuta JUSTO cuando el usuario presiona F5, recarga o cierra la pestaña
    const manejarRecargaPagina = () => {
      // Destruimos las credenciales en el almacenamiento local antes de que la página se reinicie
      localStorage.removeItem('adminToken');
      sessionStorage.removeItem('sesionFresca');
    };

    // Escuchamos el evento de desinstalación o recarga física del DOM en el navegador
    window.addEventListener('beforeunload', manejarRecargaPagina);

    // Limpieza del evento cuando el componente se desmonte para evitar fugas de memoria
    return () => {
      window.removeEventListener('beforeunload', manejarRecargaPagina);
    };
  }, [navigate]);

   
  // Estados del formulario
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);
  
  // Estados para la imagen
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Manejar la selección de imagen y crear vista previa
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Crea una URL temporal para ver la foto
    }
  };

  // 2. Función para subir a Cloudinary y luego al Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';

      // Subida a Cloudinary (Usando FormData)
      if (imageFile) {
        const data = new FormData();
        data.append("file", imageFile);
        data.append("upload_preset", "entrejoyas_preset"); // ⚠️ Reemplaza con tu preset de Cloudinary
        data.append("cloud_name", "dxqawrvrq");    // ⚠️ Reemplaza con tu cloud name

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dxqawrvrq/image/upload",
          { method: "POST", body: data }
        );
        const fileData = await res.json();
        imageUrl = fileData.secure_url;
      }

      // Enviar datos finales a TU Backend de MongoDB
      const newProduct = {
        name,
        price: Number(price),
        category,
        description,
        imageUrl, // Aquí mandamos la URL que nos dio Cloudinary
        inStock
      };

      await API.post('/products', newProduct);

      toast({
        title: "¡Joya creada!",
        description: "La pieza se ha añadido al catálogo correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate('/'); // Volver al inicio para ver la nueva joya
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "No se pudo guardar la joya. Revisa la consola.",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🌟 FUNCIÓN: Cierre de sesión
  const handleLogout = () => {
    // 1. Removemos el token de seguridad y la bandera de sesión del almacenamiento
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('sesionFresca');

    // 2. Disparamos un evento manual para notificar a componentes como ProductDetail.jsx
    window.dispatchEvent(new Event('storage'));

    // 3. Notificamos al usuario con Chakra UI Toast
    toast({
      title: "Sesión cerrada",
      description: "Has salido del panel de administración.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });

    // 4. Redirigimos al Login inmediatamente
    navigate('/login');
  };
  
  return (
    <Box bg="gray.50" minH="100vh" py={10}>
      <Container maxW="container.md">
        
        {/* Encabezado */}
         <Button 
      leftIcon={<FiLogOut />} 
      colorScheme="red" 
      variant="outline"
      size="sm"
      onClick={handleLogout}
    >
      Cerrar Sesión
    </Button>
        <HStack mb={8} justify="space-between">
          <Button leftIcon={<FiArrowLeft />} variant="ghost" onClick={() => navigate('/')}>
            Volver
          </Button>
          <Heading size="lg" color="gray.700">Panel de Inventario</Heading>
        </HStack>

        <Box bg="white" p={8} borderRadius="2xl" boxShadow="xl" border="1px solid" borderColor="gray.100">
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              
              {/* Nombre */}
              <FormControl isRequired>
                <FormLabel fontWeight="bold">Nombre de la Pieza</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={FiType} color="gray.400" />} />
                  <Input 
                    placeholder="Ej: Anillo de Oro 18k" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    focusBorderColor="#D4AF37"
                  />
                </InputGroup>
              </FormControl>

              <SimpleGrid columns={2} spacing={4} w="100%">
                {/* Precio */}
                <FormControl isRequired>
                  <FormLabel fontWeight="bold">Precio</FormLabel>
                  <InputGroup>
                    <InputLeftElement children={<Icon as={FiDollarSign} color="gray.400" />} />
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)}
                      focusBorderColor="#D4AF37"
                    />
                  </InputGroup>
                </FormControl>

                {/* Categoría */}
                <FormControl isRequired>
                  <FormLabel fontWeight="bold">Categoría</FormLabel>
                  <Select 
                    placeholder="Seleccionar..." 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    focusBorderColor="#D4AF37"
                  >
                    <option value="Anillos">Anillos</option>
                    <option value="Cadenas">Cadenas</option>
                    <option value="Pulseras">Pulseras</option>
                    <option value="Aros">Aros</option>
                    <option value="Conjuntos">Conjuntos</option>
                    <option value="Abridores">Abridores</option>
                    <option value="Dijes">Dijes</option>
                    <option value="Grabados">Grabados</option>
                    <option value="Otros">Otros</option>

                  </Select>
                </FormControl>
              </SimpleGrid>

              {/* Descripción */}
              <FormControl>
                <FormLabel fontWeight="bold">Descripción Detallada</FormLabel>
                <Textarea 
                  placeholder="Describe los materiales, quilates, etc..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  focusBorderColor="#D4AF37"
                  rows={4}
                />
              </FormControl>

              {/* Subida de Imagen */}
              <FormControl isRequired>
                <FormLabel fontWeight="bold">Imagen de la Joya</FormLabel>
                <Box 
                  border="2px dashed" 
                  borderColor="gray.200" 
                  p={4} 
                  borderRadius="lg" 
                  textAlign="center"
                  _hover={{ borderColor: '#D4AF37' }}
                  transition="0.3s"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    style={{ cursor: 'pointer' }}
                  />
                  {previewUrl && (
                    <Box mt={4} position="relative">
                      <Image src={previewUrl} borderRadius="md" maxH="200px" mx="auto" />
                      <Text fontSize="xs" color="gray.500" mt={2}>Vista previa del archivo</Text>
                    </Box>
                  )}
                </Box>
              </FormControl>

              {/* Stock */}
              <HStack w="100%" justify="space-between" p={3} bg="gray.50" borderRadius="lg">
                <HStack>
                  <Icon as={FiPackage} color="#D4AF37" />
                  <Text fontWeight="bold">Disponible en Stock</Text>
                </HStack>
                <Switch 
                  colorScheme="yellow" 
                  isChecked={inStock} 
                  onChange={(e) => setInStock(e.target.checked)} 
                />
              </HStack>

              {/* Botón de Envío */}
              <Button 
                type="submit" 
                w="100%" 
                size="lg" 
                bg="#D4AF37" 
                color="white" 
                _hover={{ bg: '#B39230' }}
                isLoading={loading}
                loadingText="Subiendo joya..."
                leftIcon={<FiTag />}
              >
                Publicar Pieza
              </Button>

            </VStack>
          </form>
        </Box>
        
      </Container>
     
  
    </Box>
  );
}

export default Admin;