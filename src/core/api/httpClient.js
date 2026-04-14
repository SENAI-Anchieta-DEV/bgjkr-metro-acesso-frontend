import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. INTERCEPTADOR DE ENVIO (Coloca o token no cabeçalho)
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('@MetroAcesso:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. INTERCEPTADOR DE RESPOSTA (O "Sensor" de Expiração)
httpClient.interceptors.response.use(
  (response) => response, // Se a resposta for OK (200), não faz nada
  (error) => {
    // Se o servidor devolver 401 (Token Expirado ou Inválido)
    if (error.response && error.response.status === 401) {
      console.warn("Sessão expirada. Redirecionando para o login...");
      
      // Limpa os dados do utilizador para "deslogar" no Front-end
      localStorage.removeItem('@MetroAcesso:token');
      localStorage.removeItem('@MetroAcesso:user');
      
      // Força o redirecionamento para o login
      // Nota: window.location.href garante que o estado do React seja resetado
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);