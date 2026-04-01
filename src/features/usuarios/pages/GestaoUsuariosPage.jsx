import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GestaoUsuariosPage.css';

// Seus ícones
import addIcon from '../../../assets/addUSer.svg';

export default function GestaoUsuariosPage() {
  const navigate = useNavigate();

  const perfis = [
    {
      id: 'admin',
      titulo: 'Administrador',
      descricao: 'Gestão total do sistema, relatórios e controle de estações.',
      rota: '/usuarios/novo-admin'
    },
    {
      id: 'agente',
      titulo: 'Agente de Metrô',
      descricao: 'Responsável por validar presencialmente e auxiliar PcDs.',
      rota: '/usuarios/novo-agente'
    },
    {
      id: 'pcd',
      titulo: 'Usuário PcD',
      descricao: 'Cadastro de passageiros para liberação de Tags RFID.',
      rota: '/usuarios/novo-pcd'
    }
  ];

  return (
    <div className="gestao-container">
      <div className="gestao-header">
        <h1>Gestão de Usuários</h1>
        <p>Selecione o tipo de perfil que deseja cadastrar no sistema</p>
      </div>

      <div className="cards-grid">
        {perfis.map((perfil) => (
          <div key={perfil.id} className="perfil-card">
            <div className="card-icon">
              <img src={addIcon} alt="Adicionar" />
            </div>
            <h3>{perfil.titulo}</h3>
            <p>{perfil.descricao}</p>
            <button 
              className="btn-cadastrar" 
              onClick={() => navigate(perfil.rota)}
            >
              Novo Cadastro
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}