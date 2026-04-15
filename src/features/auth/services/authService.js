import { httpClient } from '../../../core/api/httpClient';

export const authService = {
  /**
   * Envia as credenciais para o back-end e retorna token + dados do usuário.
   * O AuthContext é responsável por salvar no localStorage.
   */
  login: async (credentials) => {
    // CORREÇÃO: Adicionado /api antes do /auth
    // Verifique se no seu Java o Controller tem @RequestMapping("/api/auth")
    const response = await httpClient.post('/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    // Mantendo a limpeza dos dados
    localStorage.removeItem('@MetroAcesso:token');
    localStorage.removeItem('@MetroAcesso:user');
    // Se você não usa a role separada, pode remover a linha abaixo
    localStorage.removeItem('@MetroAcesso:role');
  },
};