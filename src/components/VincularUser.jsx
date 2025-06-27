import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Checkbox,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  useToast,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { API_ENDPOINTS } from "../api"; // Certifique-se que o caminho está correto

export default function VincularUser() {
  const [users, setUsers] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [vinculos, setVinculos] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  const toast = useToast();
  const bgBox = useColorModeValue("white", "gray.700");
  const boxHover = useColorModeValue("gray.50", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.500");

  useEffect(() => {
    fetch(API_ENDPOINTS.listarUsuarios)
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error("Erro ao buscar usuários:", err));

    fetch(API_ENDPOINTS.listarUnidades)
      .then((res) => res.json())
      .then(setUnidades)
      .catch((err) => console.error("Erro ao buscar unidades:", err));
  }, []);

  useEffect(() => {
    users.forEach((user) => {
      fetch(API_ENDPOINTS.listarVinculos(user.id))
        .then((res) => res.json())
        .then((data) =>
          setVinculos((prev) => ({
            ...prev,
            [user.id]: data.map((v) => v.unidade_id),
          }))
        )
        .catch((err) =>
          console.error(`Erro ao buscar vínculos de ${user.nome}:`, err)
        );
    });
  }, [users]);

  const toggleVinculo = async (userId, unidadeId) => {
    const vinculado = vinculos[userId]?.includes(unidadeId);
    setLoading(true);
    setError(null);
    setLastAction({ userId, unidadeId });

    try {
      const response = await fetch(API_ENDPOINTS.vincularUsuario, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          unidade_id: unidadeId,
          acao: vinculado ? "remover" : "adicionar",
        }),
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      setVinculos((prev) => {
        const atual = prev[userId] || [];
        const novo = vinculado
          ? atual.filter((id) => id !== unidadeId)
          : [...atual, unidadeId];
        return { ...prev, [userId]: novo };
      });

      toast({
        title: `Unidade ${vinculado ? "removida de" : "vinculada a"} ${users.find(u => u.id === userId)?.nome}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (err) {
      const msg = `Erro ao atualizar vínculo: ${err.message || err}`;
      setError(msg);
      console.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const retryLastAction = () => {
    if (lastAction) {
      toggleVinculo(lastAction.userId, lastAction.unidadeId);
    }
  };

  return (
    <Box maxW="900px" mx="auto" mt={8} p={6} bg={bgBox} borderRadius="lg" boxShadow="md">
      <Heading mb={4}>Vincular Colaboradores às Unidades</Heading>

      {error && (
        <Alert status="error" mb={6} borderRadius="md" variant="left-accent">
          <AlertIcon />
          <Box>
            <AlertTitle>Erro ao vincular</AlertTitle>
            <AlertDescription fontSize="sm">
              {error}
              <Button
                size="sm"
                ml={4}
                onClick={retryLastAction}
                isDisabled={loading}
                isLoading={loading}
                loadingText="Tentando..."
                colorScheme="red"
                variant="outline"
              >
                Tentar novamente
              </Button>
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {loading && (
        <Box textAlign="center" mb={6}>
          <Spinner size="lg" thickness="4px" speed="0.65s" color="blue.500" />
        </Box>
      )}

      <Stack spacing={6}>
        {users.map((user) => (
          <Box
            key={user.id}
            p={4}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
            transition="0.2s"
            _hover={{ bg: boxHover, transform: "scale(1.01)" }}
          >
            <Text fontWeight="bold" mb={2}>{user.nome}</Text>
            <Stack direction="row" flexWrap="wrap" spacing={4}>
              {unidades.map((unidade) => (
                <Checkbox
                  key={unidade.id}
                  isChecked={vinculos[user.id]?.includes(unidade.id) || false}
                  onChange={() => !loading && toggleVinculo(user.id, unidade.id)}
                  isDisabled={loading}
                  colorScheme="blue"
                  _hover={{ bg: "blue.50" }}
                >
                  {unidade.nome_unidade}
                </Checkbox>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
// VincularUser.jsx