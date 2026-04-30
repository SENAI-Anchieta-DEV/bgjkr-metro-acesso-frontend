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
        <div className="botoes-header">
          <Link to="/solicitar-acesso" className="btn-solicitar-pequeno">
            Cadastro para PcD
          </Link>
          <Link to="/login" className="btn-login-header">
            Entre com uma conta
          </Link>
        </div>
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
          Solicitar Acesso Gratuito para PcD
        </Link>
      </section>

      {/* PROBLEMA */}
      <section className="content-section">
        <h2>O <span className="destaque-azul">Problema</span> Atual</h2>
        <div className="content-grid">
          <div>
            <p>
              O atendimento a pessoas com deficiência (PcD) no metrô é realizado de
              forma predominantemente <span className="destaque-azul">manual</span> e
              <span className="destaque-azul"> reativa</span>, dependendo da iniciativa do
              próprio usuário e da comunicação direta com agentes nas estações. Isso
              gera baixa previsibilidade, falhas operacionais e <span className="destaque-azul">
                maior carga de trabalho para as equipes</span>.
            </p>
            <ul>
              <li>Atendimento reativo, iniciado somente após contato presencial.</li>
              <li>Dependência do usuário para solicitar ajuda e informar necessidades.</li>
              <li>Comunicação manual entre estações, sujeita a erros e inconsistências.</li>
              <li>Ausência de preparação prévia das equipes de atendimento.</li>
              <li>Baixa padronização do fluxo de suporte.</li>
            </ul>
          </div>

          <div className="image-placeholder">
            <img src={pcdStation} className="img-content"></img>
          </div>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="content-section dark">
        <h2>Nossa <span className="destaque-azul">Solução</span></h2>
        <div className="content-grid reverse">
          <div>
            <p>
              Criamos um sistema de <span className="destaque-azul">identificação automática</span> de usuários PcD no metrô,
              integrado a notificações em tempo real para as equipes de atendimento.
              O objetivo é tornar o <span className="destaque-azul">suporte mais ágil</span>, coordenado e previsível,
              reduzindo a necessidade de intervenção manual. O PcD também recebe a <span className="destaque-azul">escolha </span>
              de evitar atendimentos se desejado.
            </p>
            <ul>
              <li>Identificação automática via tag na entrada da estação.</li>
              <li>Notificação antecipada dos agentes de atendimento.</li>
              <li>Registro controlado de solicitação de suporte pelo usuário.</li>
              <li>Redução de falhas de comunicação entre equipes.</li>
              <li>Fluxo estruturado e escalável de atendimento.</li>
            </ul>
          </div>
          <div className="image-placeholder">
            <img src={tag} className="img-content"></img>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Solicitação de uma tag</h3>
          <p>
            Receba uma tag que notifique os agentes de atendimento até o PcD,
            <span className="destaque-azul"> instantaneamente.</span>
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📡</div>
          <h3>Identificação automática</h3>
          <p>
            Ao entrar na estação, a tag é detectada pelo sistema e <span className="destaque-azul">aciona automaticamente </span>
            o fluxo de atendimento, se pré-definido pelo usuário.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👷</div>
          <h3>Atendimento ágil</h3>
          <p>
            O sistema notifica um agente disponível na estação para realizar o atendimento.
            Isso <span className="destaque-azul">reduz o tempo de espera</span> e melhora a coordenação entre equipes.
          </p>
        </div>
      </section>

      {/* OBJETIVOS */}
      <section className="content-section">
        <h2>Objetivos do Projeto</h2>

        <div className="cards-grid">
          <div className="info-card">
            <h4>Automatização</h4>
            <p>Permitir reconhecimento automático na entrada da estação, eliminando a necessidade de abordagem inicial.</p>
          </div>

          <div className="info-card">
            <h4>Prevenção</h4>
            <p>Minimizar erros e inconsistências causadas por repasses manuais de informação entre agentes.</p>
          </div>

          <div className="info-card">
            <h4>Autonomia</h4>
            <p>Garantir que o usuário possa escolher quando deseja ou não suporte durante o deslocamento.</p>
          </div>

          <div className="info-card">
            <h4>Eficiência</h4>
            <p>Otimizar a alocação de agentes e reduzir retrabalho no atendimento.</p>
          </div>

          <div className="info-card">
            <h4>Padronização</h4>
            <p>Criar um processo consistente entre diferentes estações e equipes.</p>
          </div>

          <div className="info-card">
            <h4>Escalabilidade</h4>
            <p>Permitir expansão para múltiplas linhas, integrações e fluxos mais complexos.</p>
          </div>
        </div>
      </section>

      {/* ESCOPO */}
      <section className="content-section dark">
        <h2>Onde nós estamos</h2>

        <div className="scope-grid">
          <div className="scope-card positive">
            <h3>Acessível agora</h3>
            <ul>
              <li>Cadastro básico do usuário PcD (dados e necessidade de suporte)</li>
              <li>Associação de tag com identificador único</li>
              <li>Identificação automática na entrada da estação</li>
              <li>Notificação automática de agentes de atendimento</li>
              <li>Confirmação manual de atendimento pelos agentes</li>
              <li>Controle de ativação ou não do suporte pelo usuário</li>
            </ul>
          </div>

          <div className="scope-card negative">
            <h3>Nossos objetivos futuros</h3>
            <ul>
              <li>Automação da comunicação entre estação de embarque e desembarque</li>
              <li>Integração entre múltiplas linhas e baldeações</li>
              <li>Definição de rotas completas pelo sistema</li>
              <li>Atendimento automatizado em múltiplos pontos da viagem</li>
              <li>Aplicativo completo para o usuário PcD com gestão de trajetos</li>
              <li>Expansão para outros tipos de necessidades e serviços de acessibilidade</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FUTURO */}
      <section className="content-section">
        <h2>Visão de Futuro</h2>
        <p className="center-text">
          Pretendemos evoluir para uma <span className="destaque-azul">infraestrutura integrada de mobilidade acessível</span>, onde o
          atendimento a pessoas com deficiência é contínuo, automatizado e <span className="destaque-azul">coordenado entre
            todas as etapas da viagem</span>. O objetivo é eliminar barreiras operacionais, reduzir
          dependência de intervenção manual e garantir uma experiência de transporte mais
          autônoma, previsível e <span className="destaque-azul">inclusiva em toda a rede metroviária</span>.
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
        <h2>Deseja pegar o metrô com atendimento focado em <span className="destaque-azul">acessibilidade, agilidade e autonomia?</span></h2>
        <br></br>
        <br></br>
        <br></br>
        <Link to="/solicitar-acesso" className="btn-solicitar-grande">
          Solicitar Acesso Gratuito para PcD
        </Link>
      </section>

    </div>
  );
};