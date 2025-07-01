// src/api.js

export const API_URL = 'https://gc-back.onrender.com';

export const API_ENDPOINTS = {
  // Usuários
  listarUsuarios: `${API_URL}/usuarios/listar_users.php`,  
  editarUsuario: `${API_URL}/usuarios/editar_user.php`,
  removerUsuario: `${API_URL}/usuarios/remover_user.php`,

  // Unidades
  cadastrarUnidade: `${API_URL}/unidades/unidade.php`,
  listarUnidades: `${API_URL}/unidades/listar_unidades.php`,
  editarUnidade: `${API_URL}/unidades/update_unidade.php`,
  excluirUnidade: `${API_URL}/unidades/delete_unidade.php`,
  getUsersByUnidade: `${API_URL}/api/associar/get_users_by_unidade.php`,

  // Escala
  listarEscalas: `${API_URL}/escala/escala.php`,
  carregarEscala: `${API_URL}/escala/carregar_escala.php`,
  salvarEscala: `${API_URL}/escala/salvar_escala.php`,

  // Relatórios
  gerarRelatorioMensal: `${API_URL}/relatorios/gerar_relatorio_mensal.php`,
  relatorioTurnos: `${API_URL}/associar/relatorio_turnos.php`,


  // Associações
  listarVinculos: (userId) => `${API_URL}/associar/listar_vinculos.php?user_id=${userId}`,
  vincularUsuario: `${API_URL}/associar/vincular_user_unidade.php`,
  getTurnos: `${API_URL}/api/associar/get_turnos.php`,
  salvarTurno: `${API_URL}/api/associar/salvar_turno.php`,
   limparTurnos: `${API_URL}/api/associar/limpar_turnos.php`,

  // Autenticação
  login: `${API_URL}/auth/login.php`,
  logout: `${API_URL}/auth/logout.php`,
  register: `${API_URL}/auth/register.php`,
  alterarSenha: `${API_URL}/auth/alterar_senha.php`,

  // Ponto
  registrarPonto: `${API_URL}/ponto/registrar.php`,
  listarPonto: (userId, mes, ano) => `${API_URL}/ponto/listar.php?user_id=${userId}&mes=${mes}&ano=${ano}`,
  cargaHoraria: (userId) => `${API_URL}/ponto/carga_horaria.php?user_id=${userId}`,
  cargaHorariaGeral: `${API_URL}/ponto/carga_horaria.php`,
  listarUnidades: `${API_URL}/api/ponto/listar.php`,
  listarPontos: `${API_URL}/api/ponto/listar.php`,
  registrarManual: `${API_URL}/api/ponto/registrar_manual.php`,
  editarPonto: `${API_BASE_URL}/ponto/editar_ponto.php`,
  removerPonto: `${API_BASE_URL}/ponto/remover_ponto.php`,

};

export const API_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};
