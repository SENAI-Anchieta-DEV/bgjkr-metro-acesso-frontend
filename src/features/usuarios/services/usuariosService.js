import { httpClient } from '../../../core/api/httpClient';

export const usuariosService = {
  
  // Fio 1: Administrador
  cadastrarAdmin: async (dados) => {
    return await httpClient.post('/api/admin', dados);
  }, // <--- Vírgula essencial aqui!

  // Fio 2: Agente de Atendimento
  cadastrarAgente: async (dados) => {
    return await httpClient.post('/api/agente', dados);
  }, // <--- Vírgula essencial aqui!

  // Fio 3: Formulário Público PCD (Aquele com o Laudo PDF)
  cadastrarPcd: async (formData) => {
    // Como envia arquivo, o header precisa ser multipart/form-data
    return await httpClient.post('/api/formulario/solicitar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Fio 4: Listar todo mundo na tabela
  listarUsuarios: async () => {
    // Ajuste essa rota dependendo de onde o seu Java lista os usuários
    // Geralmente é algo como GET /api/admin/usuarios
    return await httpClient.get('/api/admin/usuarios'); 
  }

};