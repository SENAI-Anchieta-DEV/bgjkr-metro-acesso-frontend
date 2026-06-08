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

  listarPcds: async () => {
    const response = await httpClient.get('/api/pcd');
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

    removerPcd: async (email) => {
    const response = await httpClient.delete(`/api/pcd/${email}`);
    return response.data;
  },


  cadastrarAdmin: async (dados) => {
    const response = await httpClient.post('/api/admin', dados);
    return response.data;
  },

  atualizarAdmin: async (email, dados) => {
    const response = await httpClient.put(`/api/admin/${email}`, dados);
    return response.data;
  },

  buscarAdmin: async (email) => {
    const response = await httpClient.get(`/api/admin/${email}`);
    return response.data;
  },

  cadastrarAgente: async (dados) => {
    const response = await httpClient.post('/api/agente', dados);
    return response.data;
  },

  atualizarAgente: async (email, dados) => {
    const response = await httpClient.put(`/api/agente/${email}`, dados);
    return response.data;
  },

  buscarAgente: async (email) => {
    const response = await httpClient.get(`/api/agente/${email}`);
    return response.data;
  },

  cadastrarPcd: async (formData) => {
    // Como envia arquivo, o header precisa ser multipart/form-data
    const response = await httpClient.post('/api/formulario', formData);
    return response.data;
  },

  cadastrarPcdDireto: async (dados) => {
    // Cadastro administrativo com arquivo (multipart/form-data)
    const response = await httpClient.post('/api/pcd', dados, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  buscarPcd: async (email) => {
    const response = await httpClient.get(`/api/pcd/${email}`);
    return response.data;
  },

  atualizarPcd: async (email, dados) => {
    const response = await httpClient.put(`/api/pcd/${email}`, dados, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  listarUsuarios: async () => {
    const response = await httpClient.get('/api/admin/usuarios');
    return response.data;
  }
}