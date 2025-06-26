import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  Heading,
  VStack,
  Stack,
  useToast,
  Divider,
} from "@chakra-ui/react";

export default function UnidadeForm() {
  const [nome, setNome] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [userId, setUserId] = useState(1); // Ajuste conforme o usuário logado
  const { user } = useAuth();
  const isAdmin = user?.role === "adm";

  const toast = useToast();

  // Buscar unidades cadastradas
  const fetchUnidades = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/associar/listar_unidades.php");
      const dados = await res.json();
      setUnidades(dados);
    } catch (error) {
      toast({
        title: "Erro ao carregar unidades",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchUnidades();
  }, []);

  // Cadastrar unidade nova
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/unidades/unidade.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome_unidade: nome, user_id: userId }),
      });

      if (res.ok) {
        toast({ title: "Unidade cadastrada.", status: "success", duration: 3000, isClosable: true });
        setNome("");
        fetchUnidades();
      } else {
        toast({ title: "Erro ao cadastrar unidade.", status: "error", duration: 3000, isClosable: true });
      }
    } catch (error) {
      toast({ title: "Erro ao cadastrar unidade.", status: "error", duration: 3000, isClosable: true });
    }
  };

  // Editar unidade com prompt simples
  const editarUnidade = async (id) => {
    const unidade = unidades.find((u) => u.id === id);
    if (!unidade) return;

    const novoNome = window.prompt("Digite o novo nome da unidade:", unidade.nome_unidade);
    if (!novoNome || novoNome.trim() === "") return;

    try {
      const res = await fetch("http://localhost:8000/api/unidades/update_unidade.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nome_unidade: novoNome }),
      });

      const data = await res.json();

      if (res.ok && data.success !== false) {
        toast({ title: "Unidade atualizada.", status: "success", duration: 3000, isClosable: true });
        fetchUnidades();
      } else {
        toast({
          title: "Erro ao atualizar unidade.",
          description: data?.message || "Verifique os dados enviados.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar unidade.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Excluir unidade com confirmação
  const excluirUnidade = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir esta unidade?");
    if (!confirmacao) return;

    try {
      const res = await fetch("http://localhost:8000/api/unidades/delete_unidade.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast({ title: "Unidade excluída.", status: "success", duration: 3000, isClosable: true });
        fetchUnidades();
      } else {
        toast({ title: "Erro ao excluir unidade.", status: "error", duration: 3000, isClosable: true });
      }
    } catch (error) {
      toast({ title: "Erro ao excluir unidade.", status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={8} p={6} bg="white" borderRadius="lg" shadow="md">
      <Heading fontSize="xl" mb={4}>
        Cadastrar Unidade
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Input
            placeholder="Nome da unidade"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            isRequired
          />
          <Button type="submit" colorScheme="blue" w="full">
            Cadastrar
          </Button>
        </VStack>
      </form>

      <Divider my={6} />

      <Heading fontSize="md" mb={3}>
        Unidades Cadastradas
      </Heading>

      <Stack spacing={3}>
        {unidades.map((unidade) => (
          <Box
            key={unidade.id}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text>{unidade.nome_unidade}</Text>
            <Box>
              <Button size="sm" colorScheme="blue" onClick={() => editarUnidade(unidade.id)}>
                Editar
              </Button>
              {isAdmin && user?.role !== "gerencia" && (
                <Button size="sm" colorScheme="red" ml={2} onClick={() => excluirUnidade(unidade.id)}>
                  Excluir
                </Button>
              )}

              
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
