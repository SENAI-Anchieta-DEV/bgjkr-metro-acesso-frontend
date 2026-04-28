export const MAP_CENTER = [-23.5505, -46.6333]; // São Paulo (Sé)
export const DEFAULT_ZOOM = 13;

export const METRO_LINES = {
  AZUL: {
    nome: 'Linha 1 - Azul',
    cor: '#003399',
    estacoes: [
      { id: 1, nome: 'Sé', lat: -23.5505, lng: -46.6333 },
      { id: 2, nome: 'Luz', lat: -23.5365, lng: -46.6341 }
    ]
  },
  VERDE: {
    nome: 'Linha 2 - Verde',
    cor: '#008037',
    estacoes: [
      { id: 3, nome: 'Consolação', lat: -23.5587, lng: -46.6611 },
      { id: 4, nome: 'Paraíso', lat: -23.5760, lng: -46.6400 }
    ]
  }
};

export const MOCK_STATIONS = [
  { id: 1, nome: "Sé", lat: -23.5505, lng: -46.6333, linha: "Azul", cor: "#003399", pcds: 2, agentes: ["Carlos", "Ana"] },
  { id: 2, nome: "Luz", lat: -23.5365, lng: -46.6341, linha: "Azul", cor: "#003399", pcds: 0, agentes: ["Roberto"] },
  { id: 3, nome: "Consolação", lat: -23.5587, lng: -46.6611, linha: "Verde", cor: "#008037", pcds: 1, agentes: ["Juliana", "Marcos"] },
  { id: 4, nome: "Paraíso", lat: -23.5760, lng: -46.6400, linha: "Verde", cor: "#008037", pcds: 0, agentes: ["Luciana"] }
];

// Função para gerar as polilinhas das linhas
export const getLinePaths = () => {
  return [
    {
      id: 'L1',
      cor: '#003399',
      coords: [[-23.5365, -46.6341], [-23.5505, -46.6333]] // Luz -> Sé
    },
    {
      id: 'L2',
      cor: '#008037',
      coords: [[-23.5587, -46.6611], [-23.5760, -46.6400]] // Consolação -> Paraíso
    }
  ];
};