import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { format } from "date-fns";

export default function RelatorioMensal() {
  const [data, setData] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState(() =>
    format(new Date(), "yyyy-MM")
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ano = mesSelecionado.slice(0, 4);
        const mes = mesSelecionado.slice(5, 7);

        const response = await fetch(
          `http://localhost:8000/api/ponto/listar.php?mes=${mes}&ano=${ano}`
        );

        const json = await response.json();
        console.log("Dados recebidos da API:", json);
            if (!Array.isArray(json)) {
            throw new Error("Resposta inesperada da API");
}
        setData(json);

      } catch (error) {
        console.error("Erro ao buscar registros de ponto:", error);
      }
    };
    fetchData();
  }, [mesSelecionado]);

  // Filtra só pelo nome do usuário
  const filtrarDados = () => {
    return data.filter((item) =>
      (item.nome_usuario ?? "").toLowerCase().includes(filtroNome.toLowerCase())
    );
  };

  // Como a API já calcula horas trabalhadas, só formatar (exemplo para mostrar 2 decimais)
  const formatarHorasTrabalhadas = (horas) => {
  if (horas == null) return "-";

  const totalMinutos = Math.round(horas * 60);
  const horasInt = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  return `${horasInt.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}`;
};


  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>
        Relatório Mensal de Ponto
      </Heading>
      <Flex gap={4} mb={4} wrap="wrap">
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
      </Flex>

      <Table variant="striped" colorScheme="gray">
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
      </Tr>
    ))}
  </Tbody>
</Table>

{/* ✅ MENSAGEM FORA DA TABELA */}
{filtrarDados().length === 0 && (
  <Box mt={4} fontStyle="italic" color="gray.500">
    Nenhum registro encontrado.
  </Box>
)}

    </Box>
  );
}
