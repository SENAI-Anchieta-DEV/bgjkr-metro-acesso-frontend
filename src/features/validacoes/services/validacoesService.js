import { httpClient } from '../../../core/api/httpClient';

export const validacoesService = {
  /**
   * Busca todos os formulários que estão com status PENDENTE no Java
   */
  buscarPendentes: async () => {
    try {
      const response = await httpClient.get('/formulario/pendentes');
      return response.data; // Retorna a lista de formulários
    } catch (error) {
      console.error("Erro ao buscar formulários pendentes:", error);
      throw error;
    }
  },

  /**
   * Envia a decisão de aprovação ou reprovação para o Java
   * @param {Object} dados - { idFormulario, aprovado, motivoReprovacao }
   */
  processarValidacao: async (dados) => {
    try {
      // Bate no @PostMapping("/validar") do seu FormularioController
      const response = await httpClient.post('/formulario/validar', dados);
      return response.data;
    } catch (error) {
      console.error("Erro ao processar validação:", error);
      throw error;
    }
  }
};