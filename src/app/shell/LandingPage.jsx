import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import LogoImg from '../../assets/logo.svg';

export const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* HEADER PÚBLICO */}
      <header className="landing-header">
        <img src={LogoImg} alt="Metrô Acesso" className="landing-logo" style={{ filter: 'brightness(0)' }} />
        <Link to="/login" className="btn-login-header">
          Acesso Restrito
        </Link>
      </header>

      {/* ÁREA DE DESTAQUE (HERO) */}
      <section className="hero-section">
        <h1>Autonomia e Inclusão no <span>Transporte Público</span></h1>
        <p>
          O sistema Metrô Acesso facilita e automatiza a entrada de Pessoas com Deficiência (PCD) nas estações, garantindo um processo rápido, seguro e sem catracas bloqueadas.
        </p>
        <Link to="/solicitar-acesso" className="btn-solicitar">
          Solicitar Acesso Gratuito
        </Link>
      </section>

      {/* COMO FUNCIONA */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>1. Solicitação Online</h3>
          <p>Preencha os seus dados e envie o seu laudo médico diretamente pelo nosso portal de forma totalmente segura.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✅</div>
          <h3>2. Validação Rápida</h3>
          <p>A nossa equipa de agentes verifica a documentação e aprova o seu acesso especial no sistema.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🚇</div>
          <h3>3. Acesso Liberado</h3>
          <p>Receba a sua Tag ou utilize o sistema nas catracas adaptadas para uma viagem tranquila e sem barreiras.</p>
        </div>
      </section>
    </div>
  );
};