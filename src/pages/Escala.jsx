// src/pages/Escala.jsx
import React from "react"; 
import { useEffect, useState, useMemo } from "react";
import { format, getDaysInMonth, isWeekend, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { API_ENDPOINTS } from "../api";
import {
  Box,
  Select,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Alert,
  AlertIcon,
  Center,
  Button,
} from "@chakra-ui/react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const turnoHoras = {
  M: 6,
  T: 6,
  N: 12,
  P: 12,
  B1: 8,
  B2: 8,
};

const turnosDisponiveis = Object.keys(turnoHoras);

export default function Escala() {
  const [unidades, setUnidades] = useState([]);
  const [selectedUnidade, setSelectedUnidade] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [turnos, setTurnos] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [escalaRapida, setEscalaRapida] = useState({});

  const diasDoMes = useMemo(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const diasNoMes = getDaysInMonth(hoje);

    return Array.from({ length: diasNoMes }, (_, i) => {
      const data = new Date(ano, mes, i + 1);
      return {
        dia: format(data, "dd", { locale: ptBR }),
        semana: "DSTQQSS"[data.getDay()],
        data: format(data, "yyyy-MM-dd"),
      };
    });
  }, []);

  useEffect(() => {
    fetch(API_ENDPOINTS.listarUnidades)
      .then((res) => res.json())
      .then(setUnidades)
      .catch((err) => console.error("Erro ao carregar unidades:", err));
  }, []);

  useEffect(() => {
    if (!selectedUnidade) {
      setUsuarios([]);
      setTurnos({});
      return;
    }

    setLoadingUsers(true);
    Promise.all([
      fetch(`${API_ENDPOINTS.getUsersByUnidade}?unidade_id=${selectedUnidade}`)
        .then((res) => res.json())
        .catch(() => []),
      fetch(`${API_ENDPOINTS.getTurnos}?unidade_id=${selectedUnidade}`)
        .then((res) => res.json())
        .catch(() => []),
    ])
      .then(([usuariosData, turnosSalvos]) => {
        setUsuarios(usuariosData || []);
        const dadosTurnos = {};
        (turnosSalvos || []).forEach(({ user_id, data, turno }) => {
          const dataFormatada = data.slice(0, 10);
          const key = `${user_id}-${dataFormatada}`;
          dadosTurnos[key] = turno;
        });
        setTurnos(dadosTurnos);
      })
      .finally(() => {
        setLoadingUsers(false);
      });
  }, [selectedUnidade]);

  const salvarTurno = (userId, data, turno) => {
    if (!turno) return;
    fetch(API_ENDPOINTS.salvarTurno, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        unidade_id: selectedUnidade,
        data,
        turno,
      }),
    }).catch((err) => console.error("Erro ao salvar turno:", err));
  };

  const handleTurnoInput = (userId, data, valor) => {
    const upper = valor.toUpperCase();
    if (upper !== "" && !turnosDisponiveis.includes(upper)) return;
    const key = `${userId}-${data}`;
    setTurnos((prev) => ({ ...prev, [key]: upper }));
    salvarTurno(userId, data, upper);
  };

  const preencherEscalaRapida = (userId, tipoParidade, turnoSelecionado) => {
    if (!turnoSelecionado) return;
    const novosTurnos = { ...turnos };
    diasDoMes.forEach(({ dia, data }) => {
      const numeroDia = parseInt(dia, 10);
      const parOuImpar = numeroDia % 2 === 0 ? "par" : "impar";
      if (parOuImpar === tipoParidade) {
        const key = `${userId}-${data}`;
        novosTurnos[key] = turnoSelecionado;
        salvarTurno(userId, data, turnoSelecionado);
      }
    });
    setTurnos(novosTurnos);
  };

  const preencherDiasUteis = (userId, turnoSelecionado) => {
    if (!turnoSelecionado) return;
    const novosTurnos = { ...turnos };
    diasDoMes.forEach(({ data }) => {
      const dateObj = parseISO(data);
      if (!isWeekend(dateObj)) {
        const key = `${userId}-${data}`;
        novosTurnos[key] = turnoSelecionado;
        salvarTurno(userId, data, turnoSelecionado);
      }
    });
    setTurnos(novosTurnos);
  };

  const calcularHorasTotais = (userId) => {
    return diasDoMes.reduce((total, d) => {
      const key = `${userId}-${d.data}`;
      const turno = turnos[key];
      return total + (turnoHoras[turno] || 0);
    }, 0);
  };

  const totalGeralHoras = usuarios.reduce(
    (acc, user) => acc + calcularHorasTotais(user.id),
    0
  );

  const exportarCSV = () => {
    const dataAtual = new Date();
    const nomeMes = format(dataAtual, "MMMM yyyy", { locale: ptBR });
    const titulo = [`Escala de ${nomeMes}`];
    const header = ["Usuário", ...diasDoMes.map((d) => d.dia), "Total", ""];
    const linhas = usuarios.map((user) => {
      const valores = diasDoMes.map((d) => {
        const key = `${user.id}-${d.data}`;
        return turnos[key] || "";
      });
      return [user.nome, ...valores, calcularHorasTotais(user.id), ""];
    });
    const linhaTotal = [
      "Total Geral",
      ...diasDoMes.map((d) =>
        usuarios.reduce((soma, user) => {
          const key = `${user.id}-${d.data}`;
          const turno = turnos[key];
          return soma + (turnoHoras[turno] || 0);
        }, 0)
      ),
      totalGeralHoras,
      "",
    ];
    const csv = [titulo, [], header, ...linhas, linhaTotal]
      .map((row) =>
        row
          .map((cell) =>
            (cell?.toString() || "").match(/("|,|\n)/)
              ? `"${cell.replace(/"/g, '""')}"`
              : cell
          )
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `escala_${nomeMes}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportarPDF = () => {
    const doc = new jsPDF("landscape");

    const dataAtual = new Date();
    const nomeMes = format(dataAtual, "MMMM yyyy", { locale: ptBR });

    doc.setFontSize(16);
    doc.text(`Escala de ${nomeMes}`, 14, 15);

    const header = [
      "Usuário",
      ...diasDoMes.map((d) => `${d.dia}\n${d.semana.toUpperCase()}`),
      "Total",
    ];

    const body = usuarios.map((user) => {
      const valores = diasDoMes.map((d) => {
        const key = `${user.id}-${d.data}`;
        return turnos[key] || "";
      });
      return [user.nome, ...valores, calcularHorasTotais(user.id)];
    });

    const linhaTotal = [
      "Total Geral",
      ...diasDoMes.map((d) =>
        usuarios.reduce((soma, user) => {
          const key = `${user.id}-${d.data}`;
          const turno = turnos[key];
          return soma + (turnoHoras[turno] || 0);
        }, 0)
      ),
      totalGeralHoras,
    ];

    autoTable(doc, {
      head: [header],
      body: body,
      foot: [linhaTotal],
      startY: 25,
      styles: { fontSize: 8, halign: "center" },
      headStyles: { fillColor: [0, 118, 192], textColor: 255 },
      footStyles: { fillColor: [220, 220, 220], textColor: 0, fontStyle: "bold" },
      theme: "striped",
      columnStyles: { 0: { halign: "left" } },
    });

    doc.save(`escala_${nomeMes}.pdf`);
  };

  const limparEscala = () => {
    if (!selectedUnidade) return;
    setTurnos({});
    setEscalaRapida({});

    fetch(API_ENDPOINTS.limparTurnos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unidade_id: selectedUnidade }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          alert("Falha ao limpar turnos no servidor");
        }
      })
      .catch((err) => console.error("Erro ao limpar turnos:", err));
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Escala Mensal</Heading>

      <Box mb={4} display="flex" flexWrap="wrap" alignItems="center" gap="1rem">
        <Select
          placeholder="Selecione a unidade"
          value={selectedUnidade}
          onChange={(e) => setSelectedUnidade(e.target.value)}
          width="220px"
        >
          {unidades.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nome_unidade}
            </option>
          ))}
        </Select>

        {usuarios.length > 0 && (
          <>
            <Button colorScheme="red" size="sm" onClick={limparEscala}>
              Limpar Escala
            </Button>

            <Button colorScheme="teal" size="sm" onClick={exportarCSV}>
              Exportar CSV
            </Button>

            <Button colorScheme="blue" size="sm" onClick={exportarPDF}>
              Exportar PDF
            </Button>
          </>
        )}
      </Box>

      {loadingUsers ? (
        <Center>
          <Spinner size="lg" />
        </Center>
      ) : usuarios.length === 0 && selectedUnidade ? (
        <Alert status="info" mb={1}>
          <AlertIcon />
          Nenhum usuário encontrado para essa unidade.
        </Alert>
      ) : (
        <Table variant="simple" size="sm">
          <Thead position="sticky" top={0} bg="gray.100" zIndex={10}>
            <Tr>
              <Th>Usuário</Th>
              {diasDoMes.map((d) => (
                <Th
                  key={d.dia}
                  fontSize="xs"
                  textAlign="center"
                  color={
                    ["sáb", "dom"].includes(d.semana.toLowerCase())
                      ? "red.500"
                      : "black"
                  }
                >
                  {d.dia}
                  <br />
                  {d.semana}
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {usuarios.map((user) => (
              <React.Fragment key={user.id}>
                <Tr>
                  <Td>{user.nome}</Td>
                  {diasDoMes.map((d) => {
                    const key = `${user.id}-${d.data}`;
                    const turno = turnos[key] || "";
                    return (
                      <Td key={key} p={0} textAlign="center">
                        <Select
                          size="xs"
                          value={turno}
                          onChange={(e) =>
                            handleTurnoInput(user.id, d.data, e.target.value)
                          }
                          placeholder="-"
                          width="45px"
                          fontWeight="bold"
                          textAlign="center"
                        >
                          {turnosDisponiveis.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </Select>
                      </Td>
                    );
                  })}
                </Tr>
                <Tr>
                  <Td colSpan={diasDoMes.length + 1}>
                    <Box border="1px solid #ccc" borderRadius="md" p={3} mt={2}>
                      <Box fontWeight="bold" mb={2}>
                        Total de Horas: {calcularHorasTotais(user.id)}h
                      </Box>
                      <Select
                        placeholder="Turno rápido"
                        size="sm"
                        width="120px"
                        mb={2}
                        value={escalaRapida[user.id] || ""}
                        onChange={(e) =>
                          setEscalaRapida((prev) => ({
                            ...prev,
                            [user.id]: e.target.value,
                          }))
                        }
                      >
                        {turnosDisponiveis.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </Select>{" "}
                      <Button
                        size="sm"
                        colorScheme="blue"
                        mr={2}
                        onClick={() =>
                          preencherEscalaRapida(
                            user.id,
                            "par",
                            escalaRapida[user.id]
                          )
                        }
                      >
                        Dias Pares
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="green"
                        mr={2}
                        onClick={() =>
                          preencherEscalaRapida(
                            user.id,
                            "impar",
                            escalaRapida[user.id]
                          )
                        }
                      >
                        Dias Ímpares
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="purple"
                        mr={2}
                        onClick={() =>
                          preencherDiasUteis(user.id, escalaRapida[user.id])
                        }
                      >
                        Dias Úteis
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => {
                          const novosTurnos = { ...turnos };
                          diasDoMes.forEach(({ data }) => {
                            const key = `${user.id}-${data}`;
                            delete novosTurnos[key];
                          });
                          setTurnos(novosTurnos);
                        }}
                      >
                        Limpar Escala
                      </Button>
                    </Box>
                  </Td>
                </Tr>
              </React.Fragment>
            ))}
            <Tr fontWeight="bold">
              <Td>Total Geral</Td>
              {diasDoMes.map((d) => {
                const soma = usuarios.reduce((acc, user) => {
                  const key = `${user.id}-${d.data}`;
                  return acc + (turnoHoras[turnos[key]] || 0);
                }, 0);
                return (
                  <Td key={d.data} textAlign="center">
                    {soma}
                  </Td>
                );
              })}
            </Tr>
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
