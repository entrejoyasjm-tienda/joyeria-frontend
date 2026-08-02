import { useState } from 'react';
import { Box, Button, Input, VStack, Heading, Text, useToast, Container } from '@chakra-ui/react';
import API from '../services/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      toast({
        title: "Correo enviado",
        description: "Revisa tu bandeja de entrada para continuar.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "No se pudo procesar la solicitud.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" centerContent py={10}>
      <Box p={8} borderWidth={1} borderRadius="xl" boxShadow="lg" bg="white" w="100%">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Heading size="md" color="gray.700">Recuperar Contraseña</Heading>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Ingresa el correo electrónico de administrador registrado para recibir el enlace de acceso.
            </Text>
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              focusBorderColor="#D4AF37"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            />
            <Button type="submit" bg="#D4AF37" color="white" _hover={{ bg: '#B39230' }} w="100%" isLoading={isLoading}>
              Enviar Enlace
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
}

export default ForgotPassword;