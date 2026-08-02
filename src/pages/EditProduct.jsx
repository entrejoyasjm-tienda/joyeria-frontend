import { useState, useEffect } from 'react';
import {
  Box, Container, VStack, Heading, FormControl, FormLabel, Input,
  Textarea, Select, Button, useToast, Image, SimpleGrid, 
  InputGroup, InputLeftElement, HStack, Switch, Text, Icon
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPackage, FiDollarSign, FiType, FiArrowLeft, FiSave } from 'react-icons/fi';
import API from '../services/api';

/**
 * Componente EditProduct
 * Permite actualizar los datos de una joya existente y subir una nueva imagen
 * enviando un objeto FormData directamente a nuestro backend de Express.
 */
function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Estados para los campos de texto y propiedades de la joya
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);
  
  // Estados para el manejo de archivos y previsualización
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Carga los datos actuales de la joya al montar el componente.
   */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        const p = response.data;
        setName(p.name);
        setPrice(p.price);
        setCategory(p.category);
        setDescription(p.description);
        setInStock(p.inStock);
        setPreviewUrl(p.imageUrl); // Previsualización inicial con la URL guardada en MongoDB
      } catch (err) {
        console.error("Error al cargar la joya:", err);
        toast({
          title: "Error al cargar los datos del producto",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    loadProduct();
  }, [id, toast]);

  /**
   * Captura el archivo seleccionado por el usuario y genera una URL local de vista previa.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /**
   * Procesa el envío del formulario mediante FormData hacia la API Node.js.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Instanciamos el objeto FormData para enviar datos mixtos (texto + binario)
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('inStock', inStock);

      // 2. Si el usuario seleccionó una imagen nueva, la adjuntamos a 'image'
      // Esto coincide con el middleware upload.single('image') de tu backend
      if (imageFile) {
        formData.append('image', imageFile);
      } else {
        // Si no se eligió una nueva foto, conservamos la URL existente
        formData.append('imageUrl', previewUrl);
      }

      // 3. Enviamos la petición PUT a nuestro servidor con Axios (API)
      await API.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Pieza actualizada",
        description: "Los cambios y la imagen se guardaron correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redireccionamos a la vista de detalles de la joya
      navigate(`/product/${id}`);

    } catch (err) {
      console.error("Error al actualizar la joya:", err);
      toast({ 
        title: "Error al actualizar", 
        description: err.response?.data?.message || "Ocurrió un problema al guardar los cambios.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" py={10}>
      <Container maxW="container.md">
        <HStack mb={8} justify="space-between">
          <Button leftIcon={<FiArrowLeft />} variant="ghost" onClick={() => navigate(`/product/${id}`)}>
            Cancelar
          </Button>
          <Heading size="lg" color="gray.700">Editar Joya</Heading>
        </HStack>

        <Box bg="white" p={8} borderRadius="2xl" boxShadow="xl" border="1px solid" borderColor="gray.100">
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              
              {/* Campo: Nombre de la Pieza */}
              <FormControl isRequired>
                <FormLabel fontWeight="bold">Nombre de la Pieza</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={FiType} color="gray.400" />} />
                  <Input value={name} onChange={(e) => setName(e.target.value)} focusBorderColor="#D4AF37" />
                </InputGroup>
              </FormControl>

              {/* Campos: Precio y Categoría */}
              <SimpleGrid columns={2} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel fontWeight="bold">Precio ($)</FormLabel>
                  <InputGroup>
                    <InputLeftElement children={<Icon as={FiDollarSign} color="gray.400" />} />
                    <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} focusBorderColor="#D4AF37" />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="bold">Categoría</FormLabel>
                  <Select value={category} onChange={(e) => setCategory(e.target.value)} focusBorderColor="#D4AF37">
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

              {/* Campo: Descripción */}
              <FormControl>
                <FormLabel fontWeight="bold">Descripción</FormLabel>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} focusBorderColor="#D4AF37" rows={4} />
              </FormControl>

              {/* Campo: Selector de Imagen con vista previa */}
              <FormControl>
                <FormLabel fontWeight="bold">Imagen Actual / Nueva</FormLabel>
                <Box border="2px dashed" borderColor="gray.200" p={4} borderRadius="lg" textAlign="center">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {previewUrl && (
                    <Box mt={4}>
                      <Image src={previewUrl} borderRadius="md" maxH="200px" mx="auto" />
                    </Box>
                  )}
                </Box>
              </FormControl>

              {/* Campo: Interruptor de Stock */}
              <HStack w="100%" justify="space-between" p={3} bg="gray.50" borderRadius="lg">
                <HStack>
                  <Icon as={FiPackage} color="#D4AF37" />
                  <Text fontWeight="bold">Disponible en Stock</Text>
                </HStack>
                <Switch colorScheme="yellow" isChecked={inStock} onChange={(e) => setInStock(e.target.checked)} />
              </HStack>

              {/* Botón de envío */}
              <Button 
                type="submit" 
                w="100%" 
                size="lg" 
                bg="#D4AF37" 
                color="white" 
                _hover={{ bg: '#B39230' }} 
                isLoading={loading} 
                leftIcon={<FiSave />}
              >
                Guardar Cambios
              </Button>

            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
}

export default EditProduct;