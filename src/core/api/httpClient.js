import axios from 'axios';
import { env } from '../config/env';

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
} );

// 1. INTERCEPTADOR DE ENVIO (Coloca o token no cabeçalho)
httpClient.interceptors.request.use((config ) => {
  const token = localStorage.getItem('@MetroAcesso:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. INTERCEPTADOR DE RESPOSTA (O "Sensor" de Expiração)
httpClient.interceptors.response.use(
  (response ) => response, // Se a resposta for OK (200), não faz nada
  (error) => {
    // Se o servidor devolver 401 (Token Expirado ou Inválido) ou 403 (Acesso Negado)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // Rotas que não devem disparar o redirecionamento automático para o login
      const rotasPublicas = ['/login', '/solicitar-acesso', '/'];
      const isPublicPath = rotasPublicas.some(path => window.location.pathname === path);
      
      // Se for um erro 403 em uma rota pública (como tentar postar no formulário sem permissão no backend)
      // nós apenas rejeitamos o erro para que o componente trate a mensagem, sem deslogar o usuário
      if (isPublicPath) {
        return Promise.reject(error);
      }

      console.warn("Sessão expirada ou acesso negado. Redirecionando para o login...");
      
      // Limpa os dados do utilizador para "deslogar" no Front-end
      localStorage.removeItem('@MetroAcesso:token');
      localStorage.removeItem('@MetroAcesso:user');
      
      // Força o redirecionamento para o login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
