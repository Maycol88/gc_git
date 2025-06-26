// src/api.js
export const API_URL = 'http://100.109.226.27:8000';
export const API_ENDPOINTS = {
  listarUsuarios: `${API_URL}/api/usuarios/listar_users.php`,
  cadastrarUsuario: `${API_URL}/api/usuarios/cadastrar_user.php`,
  editarUsuario: `${API_URL}/api/usuarios/editar_user.php`,
  excluirUsuario: `${API_URL}/api/usuarios/excluir_user.php`,
  vincularColaborador: `${API_URL}/api/colaboradores/vincular_colaborador.php`,
  cadastrarUnidade: `${API_URL}/api/unidades/cadastrar_unidade.php`,
  listarUnidades: `${API_URL}/api/unidades/listar_unidades.php`,
  carregarEscala: `${API_URL}/api/escala/carregar_escala.php`,
  salvarEscala: `${API_URL}/api/escala/salvar_escala.php`,
  gerarRelatorioMensal: `${API_URL}/api/relatorios/gerar_relatorio_mensal.php`
};  