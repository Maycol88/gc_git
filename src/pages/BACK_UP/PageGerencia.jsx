import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiLogOut, FiClock, FiSettings } from "react-icons/fi";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button as ChakraButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";

const PageContainer = styled.div`
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f4f6f8;
`;

const TopBar = styled.div`
  background-color: #1976d2;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
`;

const ActionButton = styled.button`
  background-color: #ffffff;
  border: 1px solid #d0d7de;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s;
  color: #1a202c; /* COR ESCURA PARA O TEXTO */

  &:hover {
    background-color: #e3f2fd;
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.3rem;
    color: #1976d2;
  }
`;


export default function PageGerencia() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  function handleLogout() {
    // Aqui você pode limpar o token, contexto, etc.
    localStorage.clear();
    navigate("/");
  }

  return (
    <>
      <PageContainer>
        <TopBar>
          <Title>Gerência</Title>
          
        </TopBar>

        <Content>
          <ButtonGroup>
            <ActionButton onClick={() => navigate("/registro-ponto")}>
              <FiClock />
              Registro de Ponto
            </ActionButton>
            <ActionButton onClick={() => navigate("/gerencia/bem-vindo")}>
              <FiSettings />
              Ir para Gerenciar
            </ActionButton>
          </ButtonGroup>
        </Content>
      </PageContainer>

      {/* Modal de confirmação */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay
          bg="rgba(0, 0, 0, 0.7)"
          backdropFilter="blur(4px)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          minH="100vh"
        >
          <AlertDialogContent borderRadius="xl">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" textAlign="center">
              Deseja realmente sair?
            </AlertDialogHeader>

            <AlertDialogBody textAlign="center">
              Você será desconectado do sistema.
            </AlertDialogBody>

            <AlertDialogFooter justifyContent="center">
              <ChakraButton ref={cancelRef} onClick={onClose}>
                Cancelar
              </ChakraButton>
              <ChakraButton colorScheme="red" onClick={handleLogout} ml={3}>
                Sair
              </ChakraButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
// Compare this snippet from frontend/src/pages/RegistroPonto.jsx:
// import React, { useState, useEffect } from "react";