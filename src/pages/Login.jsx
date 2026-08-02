import { useState } from 'react';
import { 
  Box, Container, VStack, Heading, FormControl, FormLabel, Input, 
  Button, useToast, InputGroup, InputLeftElement, Icon, Text
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiArrowLeft } from 'react-icons/fi';
import API from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post('/auth/login', { email, password });
      localStorage.setItem('adminToken', response.data.token);
      sessionStorage.setItem('sesionFresca', 'true');

      toast({
        title: "Sesión Iniciada",
        description: "Bienvenido al Panel de Administración.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate('/admin'); 
    } catch (err) {
      console.error(err);
      toast({
        title: "Error de autenticación",
        description: err.response?.data?.message || "Credenciales incorrectas o error de servidor.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" display="flex" flexDirection="column" justifyContent="center">
      <Container maxW="md">
        
        {/* Botón para volver al catálogo */}
        <Box mb={4} textAlign="left">
          <Button 
            leftIcon={<FiArrowLeft />} 
            variant="ghost" 
            color="gray.600"
            _hover={{ bg: 'gray.100', color: '#D4AF37' }}
            onClick={() => navigate('/')}
            size="sm"
          >
            Volver al Catálogo
          </Button>
        </Box>

        {/* Tarjeta de Login Principal */}
        <Box p={8} borderWidth={1} borderRadius="2xl" boxShadow="xl" bg="white" borderColor="gray.100">
          <VStack spacing={5} align="flex-start" w="100%">
            <VStack spacing={1} align="center" w="100%" mb={2}>
              <Heading size="lg" color="gray.700" letterSpacing="wide">Entre Joyas J.M</Heading>
              <Text fontSize="sm" color="gray.400">Acceso exclusivo para el Administrador</Text>
            </VStack>
            
            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              <VStack spacing={4}>
                
                {/* Campo de Correo Electrónico */}
                <FormControl isRequired>
                  <FormLabel fontWeight="medium" color="gray.600">Correo Electrónico</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FiMail} color="gray.400" />
                    </InputLeftElement>
                    <Input 
                      type="email" 
                      placeholder="Mail o Usuario"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      focusBorderColor="#D4AF37"
                    />
                  </InputGroup>
                </FormControl>

                {/* Campo de Contraseña */}
                <FormControl isRequired>
                  <FormLabel fontWeight="medium" color="gray.600">Contraseña</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FiLock} color="gray.400" />
                    </InputLeftElement>
                    <Input 
                      type="password" 
                      placeholder="••••••••"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      focusBorderColor="#D4AF37"
                    />
                  </InputGroup>
                  
                  {/* 🌟 ENLACE DE RECUPERACIÓN MODIFICADO: Ahora redirige al formulario de email */}
                  <Box textAlign="right" mt={2} w="100%">
                    <Button 
                      variant="link" 
                      size="xs" 
                      color="gray.500" 
                      _hover={{ color: '#D4AF37', textDecoration: 'underline' }}
                      onClick={() => navigate('/forgot-password')}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </Box>
                </FormControl>

                <Button 
                  type="submit" 
                  bg="#D4AF37" 
                  color="white" 
                  _hover={{ bg: '#B39230', transform: 'translateY(-1px)' }} 
                  _active={{ bg: '#917524' }}
                  w="100%" 
                  isLoading={loading}
                  loadingText="Verificando..."
                  size="lg"
                  mt={2}
                  boxShadow="md"
                  transition="all 0.2s"
                >
                  Ingresar al Panel
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;