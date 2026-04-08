import axios from 'axios';
import { env } from '../config/env';

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Intercetor de Pedido: Antes de enviar qualquer pedido ao Java...
httpClient.interceptors.request.use(
  (config) => {
    // Procura o token guardado no navegador (vamos guardar isto no login)
    const token = localStorage.getItem('@MetroAcesso:token');
    
    // Se existir token, coloca o "Bearer" que o backend exige
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Intercetor de Resposta: Trata os erros globais (ex: Token inválido)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o Java devolver 403 (Proibido) ou 401 (Não Autorizado) -> Token expirou
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("Sessão expirada ou não autorizada.");
      localStorage.removeItem('@MetroAcesso:token');
      localStorage.removeItem('@MetroAcesso:user');
      
      // depois descomentar a linha abaixo para redirecionar para o login
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);