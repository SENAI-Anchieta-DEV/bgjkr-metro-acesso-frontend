import axios from 'axios';
import { env } from '../config/env';

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
});

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

      // Se estivermos na tela de login ou na solicitação pública, não redirecionamos
      if (window.location.pathname === '/login' || window.location.pathname === '/solicitar-acesso') {






        return Promise.reject(error);
      }

      console.warn("Sessão expirada ou acesso negado. Redirecionando para o login...");


      localStorage.removeItem('@MetroAcesso:token');
      localStorage.removeItem('@MetroAcesso:user');


      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);