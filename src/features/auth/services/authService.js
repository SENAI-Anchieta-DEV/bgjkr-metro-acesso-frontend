import { httpClient } from '../../../core/api/httpClient';

export const authService = {
  /**
   * Envia as credenciais para o back-end e retorna token + dados do usuário.
   * O AuthContext é responsável por salvar no localStorage.
   */
  login: async (credentials) => {
    const response = await httpClient.post('/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('@MetroAcesso:token');
    localStorage.removeItem('@MetroAcesso:user');
    localStorage.removeItem('@MetroAcesso:role');
  },
};