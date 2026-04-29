import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import LogoImg from '../../assets/logo.svg';
import station from '../../assets/station.jpg'
import pcdStation from '../../assets/pcd-station.jpg'
import tag from '../../assets/tag.png'

export const LandingPage = () => {
  return (
    <div className="landing-container">

      {/* HEADER */}
      <header className="landing-header">
        <div className="logo-nome">
          <img src={LogoImg} alt="MetroAcesso" className="landing-logo" />
          <div id="nome-metro-acesso">
            <h1>Metro</h1>
            <div id="acesso-azul">
              <h1>Acesso</h1>
            </div>
          </div>
        </div>
        <Link to="/login" className="btn-login-header">
          Acesso Restrito
        </Link>
      </header>

      {/* HERO */}
      <section className="hero-section">
        <div className="overlay-azul-banner"></div>
        <img src={station} className="banner-hero"></img>
        <h1>Autonomia e Inclusão no <span>Transporte Público</span></h1>
        <p>
          Automatizamos o atendimento a pessoas com deficiência no metrô, tornando o processo mais rápido, previsível e independente.
        </p>
        <Link to="/solicitar-acesso" className="btn-solicitar">
          Solicitar Acesso Gratuito
        </Link>
      </section>

      {/* PROBLEMA */}
      <section className="content-section">
        <h2>O Problema Atual</h2>
        <div className="content-grid">
          <div>
            <p>
              Hoje, o atendimento a PcDs no metrô depende de interação manual com agentes,
              comunicação verbal entre estações e processos reativos.
            </p>
            <ul>
              <li>Atendimento começa apenas após contato presencial</li>
              <li>Usuário precisa repetir informações a cada viagem</li>
              <li>Comunicação entre estações é manual e sujeita a falhas</li>
            </ul>
          </div>

          <div className="image-placeholder">
              <img src={pcdStation} className="img-content"></img>
          </div>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="content-section dark">
        <h2>Nossa Solução</h2>
        <div className="content-grid reverse">
          <div className="image-placeholder">
            <img src={tag} className="img-content"></img>
          </div>

          <div>
            <p>
              Criamos um sistema que identifica automaticamente o usuário PcD na entrada
              da estação e notifica as equipes de apoio com antecedência.
            </p>
            <ul>
              <li>Identificação automática via tag</li>
              <li>Notificação proativa de agentes</li>
              <li>Respeito à autonomia do usuário</li>
              <li>Redução de falhas humanas</li>
            </ul>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Solicitação</h3>
          <p>Cadastro online com envio de laudo médico.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📡</div>
          <h3>Identificação</h3>
          <p>Detecção automática do usuário ao entrar na estação.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👷</div>
          <h3>Atendimento</h3>
          <p>Agentes são notificados antes mesmo do embarque.</p>
        </div>
      </section>

      {/* OBJETIVOS */}
      <section className="content-section">
        <h2>Objetivos do Projeto</h2>

        <div className="cards-grid">
          <div className="info-card">
            <h4>Autonomia</h4>
            <p>Permitir que o usuário escolha quando deseja suporte.</p>
          </div>

          <div className="info-card">
            <h4>Eficiência</h4>
            <p>Reduzir falhas e retrabalho no atendimento.</p>
          </div>

          <div className="info-card">
            <h4>Antecipação</h4>
            <p>Preparar equipes antes da chegada do usuário.</p>
          </div>

          <div className="info-card">
            <h4>Escalabilidade</h4>
            <p>Expandir para múltiplas linhas e cenários.</p>
          </div>
        </div>
      </section>

      {/* ESCOPO */}
      <section className="content-section dark">
        <h2>Escopo Atual (MVP)</h2>

        <div className="scope-grid">
          <div className="scope-card positive">
            <h3>Incluído</h3>
            <ul>
              <li>Cadastro do usuário PcD</li>
              <li>Identificação automática por tag</li>
              <li>Notificação de agentes</li>
              <li>Confirmação de atendimento</li>
            </ul>
          </div>

          <div className="scope-card negative">
            <h3>Fora do escopo</h3>
            <ul>
              <li>Comunicação automática entre estações</li>
              <li>Gestão de rotas completas</li>
              <li>Baldeações</li>
              <li>App completo do usuário</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FUTURO */}
      <section className="content-section">
        <h2>Visão de Futuro</h2>
        <p className="center-text">
          O MetroAcesso evoluirá para um sistema totalmente integrado,
          com suporte completo em embarque, baldeações e desembarque,
          garantindo uma jornada contínua e inclusiva.
        </p>

        <div className="timeline">
          <div>🚧 MVP atual</div>
          <div>🔄 Integração entre estações</div>
          <div>📱 App completo</div>
          <div>🌐 Expansão para toda a rede</div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section">
        <h2>Pronto para transformar o acesso no metrô?</h2>
        <br></br>
        <br></br>
        <br></br>
        <Link to="/solicitar-acesso" className="btn-solicitar">
          Solicitar Acesso
        </Link>
      </section>

    </div>
  );
};