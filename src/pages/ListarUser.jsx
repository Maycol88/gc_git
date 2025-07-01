import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../api";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Heading,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

export default function ListarUser() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [nomeEditado, setNomeEditado] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios
      .get(API_ENDPOINTS.listarUsuarios)
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error("Erro ao carregar usuários:", err));
  }, []);

  const abrirModalEdicao = (usuario) => {
    setUsuarioEditar(usuario);
    setNomeEditado(usuario.nome);
    onOpen();
  };

  const fecharModal = () => {
    onClose();
    setUsuarioEditar(null);
    setNomeEditado("");
  };

  const salvarEdicao = async () => {
    if (!nomeEditado.trim()) {
      alert("O nome não pode ficar vazio.");
      return;
    }

    try {
      await axios.put(API_ENDPOINTS.editarUsuario, {
        id: usuarioEditar.id,
        nome: nomeEditado.trim(),
      });

      setUsuarios((oldUsuarios) =>
        oldUsuarios.map((u) =>
          u.id === usuarioEditar.id ? { ...u, nome: nomeEditado.trim() } : u
        )
      );

      fecharModal();
    } catch (error) {
      alert("Erro ao editar usuário.");
      console.error(error);
    }
  };

  const removerUsuario = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja remover este usuário?");
    if (!confirmar) return;

    try {
      await axios.delete(API_ENDPOINTS.removerUsuario, {
        data: { id }, // passa o id no corpo da requisição
      });

      setUsuarios((oldUsuarios) => oldUsuarios.filter((u) => u.id !== id));
    } catch (error) {
      alert("Erro ao remover usuário.");
      console.error(error);
    }
  };

  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>
        Lista de Usuários
      </Heading>
      <Table variant="striped" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {usuarios.map((user) => (
            <Tr key={user.id}>
              <Td>{user.nome}</Td>
              <Td>
                <Flex gap={2}>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => abrirModalEdicao(user)}
                    aria-label="Editar usuário"
                  >
                    Editar
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => removerUsuario(user.id)}
                    aria-label="Remover usuário"
                  >
                    Excluir
                  </Button>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={fecharModal} isCentered>
        <ModalOverlay />
        <ModalContent maxW="500px" w="90%" margin="auto" position="relative" top="auto" left="auto" transform="none">
          <ModalHeader textAlign="center" fontSize="lg" fontWeight="bold">
            Editar Usuário
          </ModalHeader>

          <ModalBody>
            <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
              <Box w="100%">
                <Text fontWeight="semibold" mb={1}>
                  Nome
                </Text>
                <Input value={nomeEditado} onChange={(e) => setNomeEditado(e.target.value)} autoFocus />
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Button colorScheme="blue" mr={3} onClick={salvarEdicao}>
              Salvar
            </Button>
            <Button variant="ghost" onClick={fecharModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
