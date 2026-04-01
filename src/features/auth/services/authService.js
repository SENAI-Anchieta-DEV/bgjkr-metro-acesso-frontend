import { httpClient } from '../../../core/api/httpClient';

export const authService = {
  /**
   * Envia as credenciais para o back-end e retorna o token e dados do usuário
   * @param {Object} credentials - { email, senha }
   */
  login: async (credentials) => {
    try {
      // Ajuste a rota '/auth/login' se o seu Controller no Java estiver mapeado diferente
      const response = await httpClient.post('/auth/login', credentials);
      
      // O Java deve devolver o Token JWT. Vamos salvá-lo no localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('@MetroAcesso:token', response.data.token);
        // Se o back-end devolver o perfil (Admin, Agente), salvamos também:
        if (response.data.role) {
          localStorage.setItem('@MetroAcesso:role', response.data.role);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error("Erro no serviço de login:", error);
      throw error; // Repassa o erro para a tela de Login exibir o alerta vermelho
    }
  },

  /**
   * Remove o token e desloga o usuário
   */
  logout: () => {
    localStorage.removeItem('@MetroAcesso:token');
    localStorage.removeItem('@MetroAcesso:role');
    localStorage.removeItem('@MetroAcesso:user');
  }
};