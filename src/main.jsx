import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, Clock, Sparkles, CheckCircle2, Phone, Scissors, UserRound, BarChart3, Trash2, MessageCircle, ShieldCheck } from 'lucide-react';
import './style.css';

const SERVICOS = [
  { nome: 'Corte Masculino', preco: 'R$ 35,00', cor: 'violet' },
  { nome: 'Barba Completa', preco: 'R$ 25,00', cor: 'cyan' },
  { nome: 'Sobrancelha', preco: 'R$ 15,00', cor: 'amber' },
  { nome: 'Combo Corte + Barba', preco: 'R$ 55,00', cor: 'pink' },
  { nome: 'Escova / Finalização', preco: 'R$ 45,00', cor: 'green' },
  { nome: 'Atendimento Premium', preco: 'R$ 80,00', cor: 'blue' },
];

const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const initialForm = {
  nome: '', telefone: '', servico: SERVICOS[0].nome, data: '', horario: HORARIOS[0], observacao: ''
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [agendamentos, setAgendamentos] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem('agendamentos-pro') || '[]');
    setAgendamentos(salvos);
  }, []);

  useEffect(() => {
    localStorage.setItem('agendamentos-pro', JSON.stringify(agendamentos));
  }, [agendamentos]);

  const stats = useMemo(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    return {
      total: agendamentos.length,
      hoje: agendamentos.filter(a => a.data === hoje).length,
      confirmados: agendamentos.filter(a => a.status === 'Confirmado').length,
    };
  }, [agendamentos]);

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

  function agendar(e) {
    e.preventDefault();
    if (!form.nome || !form.telefone || !form.data || !form.horario) {
      setToast('Preencha nome, telefone, data e horário.');
      setTimeout(() => setToast(''), 2800);
      return;
    }
    const novo = { ...form, id: crypto.randomUUID(), status: 'Agendado', criadoEm: new Date().toLocaleString('pt-BR') };
    setAgendamentos(prev => [novo, ...prev]);
    setForm(initialForm);
    setToast('Agendamento realizado com sucesso!');
    setTimeout(() => setToast(''), 2800);
  }

  function confirmar(id) {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'Confirmado' ? 'Agendado' : 'Confirmado' } : a));
  }

  function remover(id) { setAgendamentos(prev => prev.filter(a => a.id !== id)); }

  function whatsapp(a) {
    const texto = `Olá ${a.nome}, seu agendamento para ${a.servico} está marcado para ${a.data} às ${a.horario}.`;
    return `https://wa.me/55${a.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(texto)}`;
  }

  return (
    <main>
      {toast && <div className="toast">{toast}</div>}
      <section className="hero">
        <div className="hero-glow one"></div>
        <div className="hero-glow two"></div>
        <nav className="nav glass">
          <div className="brand"><span className="logo3d"><CalendarDays size={24}/></span><b>AgendaPro 3D</b></div>
          <a href="#agendar" className="nav-btn">Novo agendamento</a>
        </nav>
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="badge"><Sparkles size={16}/> Sistema web profissional</span>
            <h1>Agendamentos modernos com visual elegante, colorido e efeito 3D.</h1>
            <p>Ideal para barbearias, salões, clínicas, consultórios, estética, autônomos e prestadores de serviço. Projeto pronto para subir no GitHub e publicar no Cloudflare Pages.</p>
            <div className="hero-actions">
              <a href="#agendar" className="primary">Começar agora</a>
              <a href="#painel" className="secondary">Ver painel</a>
            </div>
          </div>
          <div className="phone-card glass tilt">
            <div className="phone-top"><span></span><span></span><span></span></div>
            <div className="floating-icon"><Scissors size={42}/></div>
            <h2>Agenda Premium</h2>
            <p>Controle seus horários com praticidade.</p>
            <div className="mini-list">
              <div><CheckCircle2/> Confirmação rápida</div>
              <div><Clock/> Horários organizados</div>
              <div><MessageCircle/> Chamada pelo WhatsApp</div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats" id="painel">
        <Stat icon={<BarChart3/>} label="Total" value={stats.total}/>
        <Stat icon={<CalendarDays/>} label="Hoje" value={stats.hoje}/>
        <Stat icon={<ShieldCheck/>} label="Confirmados" value={stats.confirmados}/>
      </section>

      <section className="services">
        <div className="section-title"><span>Serviços</span><h2>Cards coloridos com profundidade 3D</h2></div>
        <div className="service-grid">
          {SERVICOS.map((s) => <div className={`service-card ${s.cor}`} key={s.nome}><Scissors/><h3>{s.nome}</h3><p>{s.preco}</p></div>)}
        </div>
      </section>

      <section className="booking" id="agendar">
        <form className="form-card glass" onSubmit={agendar}>
          <div className="section-title left"><span>Agendar</span><h2>Novo atendimento</h2></div>
          <label>Nome do cliente<input value={form.nome} onChange={e => update('nome', e.target.value)} placeholder="Ex: João Silva" /></label>
          <label>WhatsApp<input value={form.telefone} onChange={e => update('telefone', e.target.value)} placeholder="92999999999" /></label>
          <label>Serviço<select value={form.servico} onChange={e => update('servico', e.target.value)}>{SERVICOS.map(s => <option key={s.nome}>{s.nome}</option>)}</select></label>
          <div className="two-cols">
            <label>Data<input type="date" value={form.data} onChange={e => update('data', e.target.value)} /></label>
            <label>Horário<select value={form.horario} onChange={e => update('horario', e.target.value)}>{HORARIOS.map(h => <option key={h}>{h}</option>)}</select></label>
          </div>
          <label>Observação<textarea value={form.observacao} onChange={e => update('observacao', e.target.value)} placeholder="Detalhes do atendimento" /></label>
          <button className="primary full" type="submit">Salvar agendamento</button>
        </form>

        <div className="schedule-card glass">
          <div className="section-title left"><span>Painel</span><h2>Agendamentos</h2></div>
          {agendamentos.length === 0 && <div className="empty">Nenhum agendamento cadastrado ainda.</div>}
          <div className="appointments">
            {agendamentos.map(a => (
              <article className="appointment" key={a.id}>
                <div className="avatar"><UserRound/></div>
                <div className="appointment-info">
                  <strong>{a.nome}</strong>
                  <span>{a.servico}</span>
                  <small>{a.data} às {a.horario} • {a.status}</small>
                </div>
                <div className="appointment-actions">
                  <button onClick={() => confirmar(a.id)} title="Confirmar"><CheckCircle2/></button>
                  <a href={whatsapp(a)} target="_blank" rel="noreferrer" title="WhatsApp"><Phone size={18}/></a>
                  <button onClick={() => remover(a.id)} title="Excluir"><Trash2/></button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer>AgendaPro 3D • Projeto pronto para Cloudflare Pages</footer>
    </main>
  );
}

function Stat({ icon, label, value }) { return <div className="stat glass"><div>{icon}</div><span>{label}</span><b>{value}</b></div>; }

createRoot(document.getElementById('root')).render(<App />);
