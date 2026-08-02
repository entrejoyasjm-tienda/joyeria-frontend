import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Input, VStack, Heading, useToast, Container } from '@chakra-ui/react';
import API from '../services/api';

function ChangePassword() {
  const { token } = useParams(); // 1. Captura el token directamente desde la URL
  const navigate = useNavigate();
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Contraseñas no coinciden", status: "error", duration: 3000 });
      return;
    }

    setIsLoading(true);
    try {
      // 2. Enviamos la nueva contraseña junto al token dinámico
      await API.post(`/auth/reset-password/${token}`, { password });
      toast({
        title: "Contraseña restablecida",
        description: "Tu clave ha sido actualizada correctamente.",
        status: "success",
        duration: 4000,
      });
      navigate('/login');
    } catch (err) {
      toast({
        title: "Error de validación",
        description: err.response?.data?.message || "El token expiró o es inválido.",
        status: "error",
        duration: 4000,
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
            <Heading size="md" color="gray.700">Nueva Contraseña</Heading>
            <Input
              type="password"
              placeholder="Nueva contraseña"
              focusBorderColor="#D4AF37"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            />
            <Input
              type="password"
              placeholder="Confirmar nueva contraseña"
              focusBorderColor="#D4AF37"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isRequired
            />
            <Button type="submit" bg="#D4AF37" color="white" _hover={{ bg: '#B39230' }} w="100%" isLoading={isLoading}>
              Actualizar Contraseña
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
}

export default ChangePassword;