// src/api.js
export const API_URL = 'https://gc-back.onrender.com';

export const API_ENDPOINTS = {
  listarUsuarios: `${API_URL}/usuarios/listar_users.php`,
  cadastrarUsuario: `${API_URL}/usuarios/cadastrar_user.php`,
  editarUsuario: `${API_URL}/usuarios/editar_user.php`,
  excluirUsuario: `${API_URL}/usuarios/excluir_user.php`,  
  cadastrarUnidade: `${API_URL}/unidades/cadastrar_unidade.php`,
  listarUnidades: `${API_URL}/unidades/listar_unidades.php`,
  carregarEscala: `${API_URL}/escala/carregar_escala.php`,
  salvarEscala: `${API_URL}/escala/salvar_escala.php`,
  gerarRelatorioMensal: `${API_URL}/relatorios/gerar_relatorio_mensal.php`,
  listarVinculos: (userId) => `${API_URL}/associar/listar_vinculos.php?user_id=${userId}`,
  vincularUsuario: `${API_URL}/associar/vincular_user_unidade.php`,
  login: `${API_URL}/auth/login.php`,
  logout: `${API_URL}/auth/logout.php`,

};
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': '*'
};