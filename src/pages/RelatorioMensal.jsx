// src/pages/RelatorioMensal.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS, API_HEADERS } from '@app/api';

import {
  Box,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Flex,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { format } from "date-fns";

export default function RelatorioMensal() {
  const [data, setData] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState(() =>
    format(new Date(), "yyyy-MM")
  );
  const [registroAtual, setRegistroAtual] = useState(null);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth(); // Supondo que você tenha um hook useAuth para obter o usuário logado
  const isAdmin = user?.role === "adm";


  // Função para extrair "HH:mm" de string "DD/MM/YYYY HH:mm:ss"
  const formatHora = (dataHoraStr) => {
    if (!dataHoraStr) return "";
    const partes = dataHoraStr.split(" ");
    if (partes.length < 2) return "";
    const horaCompleta = partes[1]; // "07:01:15"
    return horaCompleta.substring(0, 5); // "07:01"
  };

  // Função para combinar data antiga + hora nova para enviar ao backend
  const combinarDataHora = (dataHoraOriginal, horaStr) => {
    if (!dataHoraOriginal) return null;
    if (!horaStr) return null;
    const partes = dataHoraOriginal.split(" ");
    const dataParte = partes[0]; // "16/06/2025"
    return `${dataParte} ${horaStr}:00`;
  };

  const fetchData = async () => {
    try {
      const ano = mesSelecionado.slice(0, 4);
      const mes = mesSelecionado.slice(5, 7);

      const response = await fetch(
        `${API_ENDPOINTS.listarPontos}?mes=${mes}&ano=${ano}`
      );
      const json = await response.json();
      if (!Array.isArray(json)) throw new Error("Resposta inesperada da API");
      setData(json);
    } catch (error) {
      console.error("Erro ao buscar registros de ponto:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mesSelecionado]);

  const filtrarDados = () => {
  return data.filter((item) => {
    const nomeValido = (item.nome_usuario ?? "")
      .toLowerCase()
      .includes(filtroNome.toLowerCase());

    const dataRegistro = item.entrada?.split(" ")[0]; // pega "DD/MM/YYYY"
    if (!dataRegistro) return false;

    const [dia, mes, ano] = dataRegistro.split("/");
    const dataObj = new Date(`${ano}-${mes}-${dia}`);

    const inicioOk = !dataInicio || new Date(dataInicio) <= dataObj;
    const fimOk = !dataFim || new Date(dataFim) >= dataObj;

    return nomeValido && inicioOk && fimOk;
  });
};


  const formatarHorasTrabalhadas = (horas) => {
    if (horas == null) return "-";
    const totalMinutos = Math.round(horas * 60);
    const horasInt = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${horasInt.toString().padStart(2, "0")}:${minutos
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (registroAtual) {
      onOpen();
    }
  }, [registroAtual]);

  const abrirModalEdicao = (item) => {
    setRegistroAtual({ ...item });
    // onOpen será chamado pelo useEffect
  };

  const salvarEdicao = async () => {
    try {
      // Prepara os dados para enviar, combinando data original + hora editada
      const body = {
        ...registroAtual,
        entrada: combinarDataHora(registroAtual.entrada, registroAtual.entradaHoraEditada || formatHora(registroAtual.entrada)),
        entrada_almoco: combinarDataHora(registroAtual.entrada_almoco, registroAtual.entradaAlmocoHoraEditada || formatHora(registroAtual.entrada_almoco)),
        saida_almoco: combinarDataHora(registroAtual.saida_almoco, registroAtual.saidaAlmocoHoraEditada || formatHora(registroAtual.saida_almoco)),
        saida: combinarDataHora(registroAtual.saida, registroAtual.saidaHoraEditada || formatHora(registroAtual.saida)),
      };

      const response = await fetch(API_ENDPOINTS.editarPonto, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const resultado = await response.json();
      if (resultado.success) {
        alert("Registro atualizado com sucesso!");
        onClose();
        fetchData(); // Recarrega os dados
      } else {
        alert("Erro ao atualizar: " + resultado.message);
      }
    } catch (err) {
      console.error("Erro ao salvar edição:", err);
    }
  };

  const removerRegistro = async (id) => {
    const confirmar = confirm("Tem certeza que deseja remover este registro?");
    if (!confirmar) return;

    try {
      const response = await fetch(API_ENDPOINTS.removerPonto, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const resultado = await response.json();
      if (resultado.success) {
        alert("Registro removido com sucesso!");
        fetchData();
      } else {
        alert("Erro ao remover: " + resultado.message);
      }
    } catch (err) {
      console.error("Erro ao remover ponto:", err);
    }
  };

  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>
        Relatório Mensal de Ponto
      </Heading>
      {/*Filtros */} 
      <Flex gap={4} mb={4} wrap="wrap" align="center">
  <Input
    placeholder="Buscar colaborador"
    value={filtroNome}
    onChange={(e) => setFiltroNome(e.target.value)}
    maxW="300px"
  />
  <Input
    type="month"
    value={mesSelecionado}
    onChange={(e) => setMesSelecionado(e.target.value)}
    maxW="200px"
  />
  <Input
    type="date"
    value={dataInicio}
    onChange={(e) => setDataInicio(e.target.value)}
    maxW="200px"
    placeholder="Data Início"
  />
  <Input
    type="date"
    value={dataFim}
    onChange={(e) => setDataFim(e.target.value)}
    maxW="200px"
    placeholder="Data Fim"
  />
  <Button
    colorScheme="gray"
    variant="outline"
    onClick={() => {
      setFiltroNome("");
      setDataInicio("");
      setDataFim("");
    }}
  >
    Limpar Filtros
  </Button>
</Flex>



      <Table variant="striped" colorScheme="red">
        <Thead>
          <Tr>
            <Th>Colaborador</Th>
            <Th>Entrada</Th>
            <Th>Entrada Almoço</Th>
            <Th>Saída Almoço</Th>
            <Th>Saída</Th>
            <Th>Horas Trabalhadas</Th>
            <Th>Unidade</Th>
            <Th>Jornada</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtrarDados().map((item) => (
            <Tr key={item.id}>
              <Td>{item.nome_usuario}</Td>
              <Td>{item.entrada || "-"}</Td>
              <Td>{item.entrada_almoco || "-"}</Td>
              <Td>{item.saida_almoco || "-"}</Td>
              <Td>{item.saida || "-"}</Td>
              <Td>{formatarHorasTrabalhadas(item.horas_trabalhadas)}</Td>
              <Td>{item.nome_unidade}</Td>
              <Td>{item.tipo_jornada}</Td>
              <Td>
  <Flex gap={2}>
    <button onClick={() => abrirModalEdicao(item)} style={{ padding: '8px 16px', fontSize: '16px', cursor: 'pointer' }}>
      Editar
    </button>
    {isAdmin && user?.role !== "gerencia" && (
      <button
        onClick={() => removerRegistro(item.id)}
        style={{ padding: '8px 16px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#E53E3E', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Excluir
      </button>
    )}
  </Flex>
</Td>

            </Tr>
          ))}
        </Tbody>
      </Table>
<Box mt={6} fontWeight="bold" fontSize="lg">
  Total Horas Executadas: {
    formatarHorasTrabalhadas(
      filtrarDados().reduce((acc, item) => acc + (item.horas_trabalhadas || 0), 0)
    )
  }
</Box>

      {filtrarDados().length === 0 && (
        <Box mt={4} fontStyle="italic" color="gray.500">
          Nenhum registro encontrado.
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          maxW="500px"
          w="90%"
          margin="auto"
          position="relative"
          top="auto"
          left="auto"
          transform="none"
        >
          <ModalHeader
            textAlign="center"
            fontSize="lg"
            fontWeight="bold"
          >
            Editar Horários
          </ModalHeader>
          
          <ModalBody>
            <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
              <Box w="100%">
                <Text fontWeight="semibold" mb={1}>
                  Colaborador:
                </Text>
                <Input value={registroAtual?.nome_usuario || ""} isReadOnly />
              </Box>

              <Box w="100%">
                <Text fontWeight="semibold" mb={1}>
                  Entrada
                </Text>
                <Input
                  type="time"
                  value={
                    registroAtual?.entradaHoraEditada ??
                    formatHora(registroAtual?.entrada)
                  }
                  onChange={(e) =>
                    setRegistroAtual({
                      ...registroAtual,
                      entradaHoraEditada: e.target.value,
                    })
                  }
                />
              </Box>

              <Box w="100%">
                <Text fontWeight="semibold" mb={1}>
                  Entrada Almoço
                </Text>
                <Input
                  type="time"
                  value={
                    registroAtual?.entradaAlmocoHoraEditada ??
                    formatHora(registroAtual?.entrada_almoco)
                  }
                  onChange={(e) =>
                    setRegistroAtual({
                      ...registroAtual,
                      entradaAlmocoHoraEditada: e.target.value,
                    })
                  }
                />
              </Box>

              <Box w="100%">
                <Text fontWeight="semibold" mb={1}>
                  Saída Almoço
                </Text>
                <Input
                  type="time"
                  value={
                    registroAtual?.saidaAlmocoHoraEditada ??
                    formatHora(registroAtual?.saida_almoco)
                  }
                  onChange={(e) =>
                    setRegistroAtual({
                      ...registroAtual,
                      saidaAlmocoHoraEditada: e.target.value,
                    })
                  }
                />
              </Box>

              <Box w="100%">
                <Text fontWeight="semibold" mb={1}>
                  Saída
                </Text>
                <Input
                  type="time"
                  value={
                    registroAtual?.saidaHoraEditada ?? formatHora(registroAtual?.saida)
                  }
                  onChange={(e) =>
                    setRegistroAtual({
                      ...registroAtual,
                      saidaHoraEditada: e.target.value,
                    })
                  }
                />
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Button colorScheme="blue" mr={3} onClick={salvarEdicao}>
              Salvar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
