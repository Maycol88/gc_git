import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";

export default function AuthLayout({ children }) {
  const navigate = useNavigate();

  return (
    <Box
      minH="100vh"
      sx={{
        
         background: "linear-gradient(135deg, #1e3c72, #2a5298)"     }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="blue"
        p={10}
        borderRadius="2xl"
        boxShadow="lg"
        w="100%"
        maxW="md"
        textAlign="center"
      >
        
        <VStack spacing={4}>
          
          <Button colorScheme="blue" w="full" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button
            variant="outline"
            colorScheme="blue"
            w="full"
            onClick={() => navigate("/register")}
          >
            Cadastro
          </Button>
        </VStack>
        <Box mt={6}>{children}</Box>
      </Box>
    </Box>
  );
}
