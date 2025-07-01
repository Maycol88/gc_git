import React, { useState, useRef } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  Flex,
  Text,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS } from "../api";

export default function UserMenu() {
  const { user, logout: authLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef();

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const handleLogoutConfirm = () => {
    authLogout();
    onClose();
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "user":
        return "Colaborador";
      case "gerencia":
        return "Gerente";
      case "adm":
        return "Admin";
      default:
        return "Usuário";
    }
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          rounded="full"
          variant="ghost"
          title="Deslogar"
          minW={0}
          p={0}
          _focus={{ boxShadow: "none" }}
          boxShadow="0 1px 3px rgba(0,0,0,0.3)"
          _hover={{ bg: "gray.100" }}
        >
          <Box
            bg="#4285F4"
            color="white"
            rounded="full"
            w="40px"
            h="40px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="700"
            fontSize="20px"
            fontFamily="'Google Sans', sans-serif"
            userSelect="none"
            textShadow="0 1px 2px rgba(0,0,0,0.2)"
          >
            {getInitial(user?.nome)}
          </Box>
        </MenuButton>

        <MenuList
          minW="240px"
          borderRadius="12px"
          boxShadow="0 4px 12px rgba(0,0,0,0.15)"
          p={5}
          fontFamily="'Google Sans', sans-serif"
        >
          <Flex direction="column" align="center" mb={5}>
            <Box
              bg="#4285F4"
              color="GRAY"
              rounded="full"
              w="80px"
              h="80px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="700"
              fontSize="50px"
              mb={1}
              textShadow="0 1px 3px rgba(0,0,0,0.3)"
              userSelect="none"
            >
              {getInitial(user?.nome)}
            </Box>
            <Text fontWeight="600" fontSize="18px" color="gray.800" textAlign="center">
              {getRoleLabel(user?.role)}<br/> {user?.nome} logado.
            </Text>
          </Flex>

          <MenuItem
            onClick={onOpen}
            color="red.500"
            fontWeight="400"
            justifyContent="center"
            _hover={{ bg: "#fce8e6" }}
            borderRadius="8px"
          >
            Sair
          </MenuItem>
        </MenuList>
      </Menu>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(4px)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          minH="100vh"
        >
          <AlertDialogContent borderRadius="12px" boxShadow="0 10px 25px rgba(0,0,0,0.3)" bg="white" color="black">
            <AlertDialogHeader textAlign="center" fontWeight="700" fontSize="lg">
             
            </AlertDialogHeader>

            <AlertDialogBody
              display="flex"
              alignItems="center"
              justifyContent="center"
              minH="80px"
              textAlign="center"
              fontSize="30px"
            >
              Deseja realmente sair da aplicação?
            </AlertDialogBody>

            <AlertDialogFooter justifyContent="center" gap={4}>
              <Button ref={cancelRef} onClick={onClose} variant="outline">
                Cancelar
              </Button>
              <Button onClick={handleLogoutConfirm}>
                Sair
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
