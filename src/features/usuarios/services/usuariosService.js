import { httpClient } from '../../../core/api/httpClient';

export const usuariosService = {

  listarAdmins: async () => {
    const response = await httpClient.get('/api/admin');
    return response.data;
  },

  listarAgentes: async () => {
    const response = await httpClient.get('/api/agente');
    return response.data;
  },

  removerAdmin: async (email) => {
    const response = await httpClient.delete(`/api/admin/${email}`);
    return response.data;
  },

  removerAgente: async (email) => {
    const response = await httpClient.delete(`/api/agente/${email}`);
    return response.data;
  },
  
  cadastrarAdmin: async (dados) => {
    const response = await httpClient.post('/api/admin', dados);
    return response.data;
  },

  cadastrarAgente: async (dados) => {
    const response = await httpClient.post('/api/agente', dados);
    return response.data;
  },

  cadastrarPcd: async (formData) => {
    // Como envia arquivo, o header precisa ser multipart/form-data
    const response = await httpClient.post('/api/formulario/solicitar', formData);
    return response.data;
  },

  listarUsuarios: async () => {
    const response = await httpClient.get('/api/admin/usuarios'); 
    return response.data;
  }
}