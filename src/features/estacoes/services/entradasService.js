import { httpClient } from '../../../core/api/httpClient';

export const entradasService = {
    listarPorEstacao: async (codigoEstacao) => {
        const response = await httpClient.get(`/api/entrada/estacao/${codigoEstacao}`);
        return response.data;
    },
    buscarPorCodigo: async (codigoEntrada) => {
        const response = await httpClient.get(`/api/entrada/${codigoEntrada}`);
        return response.data;
    },
    cadastrar: async (dados) => {
        const response = await httpClient.post('/api/entrada', dados);
        return response.data;
    },
    atualizar: async (codigoEntradaOriginal, dados) => {
        const response = await httpClient.put(`/api/entrada/${codigoEntradaOriginal}`, {
            codigoEntrada: dados.codigoEntrada,
            bssid: dados.bssid,
            codigoEstacao: dados.codigoEstacao
        });
        return response.data;
    },
    remover: async (codigoEntrada) => {
        await httpClient.delete(`/api/entrada/${codigoEntrada}`);
    }
};