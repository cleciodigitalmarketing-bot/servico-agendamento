import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, Clock, Sparkles, CheckCircle2, Phone, UserRound, BarChart3, Trash2, MessageCircle, ShieldCheck, LogIn, LogOut, Plus, Image as ImageIcon, Palette, Building2, Settings, Eye, Upload, XCircle } from 'lucide-react';
import './style.css';

const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const ADMIN_USER = 'admin';
const ADMIN_PASS = '123456';

const defaultTheme = {
  nomeEmpresa: 'AgendaPro SaaS',
  segmento: 'Barbearia, salão, estética, clínica ou autônomo',
  logo: '',
  corPrimaria: '#7c3aed',
  corSecundaria: '#06b6d4',
  corDestaque: '#f97316',
  whatsappEmpresa: '92982452810',
  banners: [
    { titulo: 'Atendimento profissional', texto: 'Agende serviços com praticidade e acompanhe a confirmação em tempo real.', imagem: '' },
    { titulo: 'Promoções e pacotes', texto: 'Use banners para divulgar combos, campanhas e serviços em destaque.', imagem: '' }
  ]
};

const defaultServices = [
  { id: '1', nome: 'Corte Masculino', valor: '35,00', descricao: 'Serviço rápido e profissional.', imagem: '', categoria: 'Barbearia' },
  { id: '2', nome: 'Barba Completa', valor: '25,00', descricao: 'Acabamento completo.', imagem: '', categoria: 'Barbearia' },
  { id: '3', nome: 'Limpeza de Pele', valor: '90,00', descricao: 'Procedimento estético.', imagem: '', categoria: 'Estética' },
  { id: '4', nome: 'Consulta / Atendimento', valor: '120,00', descricao: 'Serviço adaptável para qualquer negócio.', imagem: '', categoria: 'Serviços' },
];

const initialForm = { nome: '', telefone: '', servicoId: '1', data: '', horario: HORARIOS[0], observacao: '' };
const initialServiceForm = { nome: '', valor: '', descricao: '', categoria: '', imagem: '' };

function readStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}

function App() {
  const [theme, setTheme] = useState(defaultTheme);
  const [servicos, setServicos] = useState(defaultServices);
  const [form, setForm] = useState(initialForm);
  const [agendamentos, setAgendamentos] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [login, setLogin] = useState({ usuario: '', senha: '' });
  const [serviceForm, setServiceForm] = useState(initialServiceForm);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setTheme(readStore('agenda-theme', defaultTheme));
    setServicos(readStore('agenda-servicos', defaultServices));
    setAgendamentos(readStore('agenda-agendamentos', []));
    setAdmin(localStorage.getItem('agenda-admin') === 'true');
  }, []);

  useEffect(() => localStorage.setItem('agenda-theme', JSON.stringify(theme)), [theme]);
  useEffect(() => localStorage.setItem('agenda-servicos', JSON.stringify(servicos)), [servicos]);
  useEffect(() => localStorage.setItem('agenda-agendamentos', JSON.stringify(agendamentos)), [agendamentos]);
  useEffect(() => localStorage.setItem('agenda-admin', String(admin)), [admin]);

  const selectedService = servicos.find(s => s.id === form.servicoId) || servicos[0];
  const stats = useMemo(() => ({
    total: agendamentos.length,
    pendentes: agendamentos.filter(a => a.status === 'Aguardando confirmação').length,
    confirmados: agendamentos.filter(a => a.status === 'Confirmado').length,
  }), [agendamentos]);

  const cssVars = { '--brand': theme.corPrimaria, '--brand2': theme.corSecundaria, '--accent': theme.corDestaque };
  function notify(msg) { setToast(msg); setTimeout(() => setToast(''), 2800); }
  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

  function agendar(e) {
    e.preventDefault();
    if (!form.nome || !form.telefone || !form.data || !form.horario || !form.servicoId) return notify('Preencha todos os campos obrigatórios.');
    const novo = {
      ...form,
      id: crypto.randomUUID(),
      servicoNome: selectedService?.nome || 'Serviço',
      servicoValor: selectedService?.valor || '0,00',
      status: 'Aguardando confirmação',
      criadoEm: new Date().toLocaleString('pt-BR')
    };
    setAgendamentos(prev => [novo, ...prev]);
    setForm({ ...initialForm, servicoId: servicos[0]?.id || '' });
    notify('Agendamento enviado! Aguarde a confirmação do prestador.');
  }

  function confirmar(id) {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: 'Confirmado' } : a));
    notify('Agendamento confirmado. O painel do cliente já foi atualizado.');
  }

  function remover(id) { setAgendamentos(prev => prev.filter(a => a.id !== id)); }

  function whatsapp(a) {
    const tel = a.telefone.replace(/\D/g, '');
    const texto = `Olá ${a.nome}, seu agendamento para o serviço ${a.servicoNome} foi CONFIRMADO para ${formatDate(a.data)} às ${a.horario}. Obrigado pela preferência!`;
    return `https://wa.me/55${tel}?text=${encodeURIComponent(texto)}`;
  }

  function entrar(e) {
    e.preventDefault();
    if (login.usuario === ADMIN_USER && login.senha === ADMIN_PASS) { setAdmin(true); notify('Login realizado com sucesso.'); }
    else notify('Usuário ou senha inválidos. Use admin / 123456.');
  }

  function addServico(e) {
    e.preventDefault();
    if (!serviceForm.nome || !serviceForm.valor) return notify('Informe pelo menos nome e valor do serviço.');
    setServicos(prev => [{ ...serviceForm, id: crypto.randomUUID() }, ...prev]);
    setServiceForm(initialServiceForm);
    notify('Novo serviço cadastrado.');
  }

  function fileToDataUrl(file, callback) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  }

  function updateBanner(index, field, value) {
    setTheme(prev => ({ ...prev, banners: prev.banners.map((b, i) => i === index ? { ...b, [field]: value } : b) }));
  }

  return (
    <main style={cssVars}>
      {toast && <div className="toast">{toast}</div>}
      <section className="hero">
        <div className="hero-glow one"></div><div className="hero-glow two"></div>
        <nav className="nav glass">
          <div className="brand">{theme.logo ? <img src={theme.logo} className="brand-logo"/> : <span className="logo3d"><CalendarDays size={24}/></span>}<div><b>{theme.nomeEmpresa}</b><small>{theme.segmento}</small></div></div>
          <div className="nav-actions"><a href="#agendar">Agendar</a><a href="#admin">Painel do prestador</a></div>
        </nav>
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="badge"><Sparkles size={16}/> Sistema SaaS de agendamento</span>
            <h1>Agenda profissional para qualquer prestador de serviço.</h1>
            <p>Cliente solicita o agendamento, o status fica em laranja como aguardando confirmação, e o prestador confirma pelo painel com login. Depois da confirmação, o status muda para verde e o WhatsApp do cliente já fica pronto para envio.</p>
            <div className="hero-actions"><a href="#agendar" className="primary">Fazer agendamento</a><a href="#admin" className="secondary">Acessar painel</a></div>
          </div>
          <div className="dashboard-preview glass tilt">
            <div className="preview-head"><span></span><span></span><span></span></div>
            <div className="cube"><CalendarDays size={54}/></div>
            <h2>Status inteligente</h2>
            <div className="status-demo pending">Aguardando confirmação</div>
            <div className="status-demo confirmed">Confirmado</div>
          </div>
        </div>
      </section>

      <section className="stats">
        <Stat icon={<BarChart3/>} label="Total" value={stats.total}/>
        <Stat icon={<Clock/>} label="Pendentes" value={stats.pendentes}/>
        <Stat icon={<ShieldCheck/>} label="Confirmados" value={stats.confirmados}/>
      </section>

      <section className="banners">
        {theme.banners.map((b, i) => <div className="banner-card glass" key={i}>{b.imagem && <img src={b.imagem}/>}<div><span>Banner {i+1}</span><h3>{b.titulo}</h3><p>{b.texto}</p></div></div>)}
      </section>

      <section className="services" id="servicos">
        <div className="section-title"><span>Serviços cadastrados</span><h2>Compatível com vários segmentos</h2></div>
        <div className="service-grid">
          {servicos.map((s, i) => <div className="service-card" key={s.id} style={{'--delay': `${i * 35}ms`}}>{s.imagem ? <img src={s.imagem}/> : <div className="service-icon"><Building2/></div>}<h3>{s.nome}</h3><p>{s.descricao}</p><strong>R$ {s.valor}</strong><small>{s.categoria || 'Serviço'}</small></div>)}
        </div>
      </section>

      <section className="booking" id="agendar">
        <form className="form-card glass" onSubmit={agendar}>
          <div className="section-title left"><span>Cliente</span><h2>Solicitar agendamento</h2></div>
          <label>Nome do cliente<input value={form.nome} onChange={e => update('nome', e.target.value)} placeholder="Ex: João Silva" /></label>
          <label>WhatsApp<input value={form.telefone} onChange={e => update('telefone', e.target.value)} placeholder="92999999999" /></label>
          <label>Serviço<select value={form.servicoId} onChange={e => update('servicoId', e.target.value)}>{servicos.map(s => <option key={s.id} value={s.id}>{s.nome} - R$ {s.valor}</option>)}</select></label>
          <div className="two-cols"><label>Data<input type="date" value={form.data} onChange={e => update('data', e.target.value)} /></label><label>Horário<select value={form.horario} onChange={e => update('horario', e.target.value)}>{HORARIOS.map(h => <option key={h}>{h}</option>)}</select></label></div>
          <label>Observação<textarea value={form.observacao} onChange={e => update('observacao', e.target.value)} placeholder="Detalhes do atendimento" /></label>
          <button className="primary full" type="submit">Enviar solicitação</button>
        </form>

        <ClientPanel agendamentos={agendamentos} />
      </section>

      <section className="admin-area" id="admin">
        {!admin ? <LoginBox login={login} setLogin={setLogin} entrar={entrar}/> : <AdminPanel agendamentos={agendamentos} confirmar={confirmar} remover={remover} whatsapp={whatsapp} setAdmin={setAdmin} serviceForm={serviceForm} setServiceForm={setServiceForm} addServico={addServico} servicos={servicos} setServicos={setServicos} theme={theme} setTheme={setTheme} fileToDataUrl={fileToDataUrl} updateBanner={updateBanner}/>}        
      </section>

      <footer>Projeto React + Vite pronto para GitHub e Cloudflare Pages • Login demo: admin / 123456</footer>
    </main>
  );
}

function ClientPanel({ agendamentos }) {
  return <div className="schedule-card glass"><div className="section-title left"><span>Painel do cliente</span><h2>Acompanhamento do agendamento</h2></div>{agendamentos.length === 0 && <div className="empty">Depois de agendar, sua solicitação aparecerá aqui em laranja aguardando confirmação.</div>}<div className="appointments">{agendamentos.map(a => <Appointment key={a.id} a={a} client />)}</div></div>;
}

function LoginBox({ login, setLogin, entrar }) {
  return <form className="login-card glass" onSubmit={entrar}><div className="section-title left"><span>Prestador</span><h2>Login do responsável</h2></div><p>Área privada para visualizar pendentes, confirmar agendamentos, cadastrar serviços e personalizar o SaaS.</p><label>Usuário<input value={login.usuario} onChange={e => setLogin({ ...login, usuario: e.target.value })} placeholder="admin" /></label><label>Senha<input type="password" value={login.senha} onChange={e => setLogin({ ...login, senha: e.target.value })} placeholder="123456" /></label><button className="primary full"><LogIn size={18}/> Entrar no painel</button><small className="hint">Login de demonstração: admin / 123456</small></form>;
}

function AdminPanel(props) {
  const pendentes = props.agendamentos.filter(a => a.status === 'Aguardando confirmação');
  const confirmados = props.agendamentos.filter(a => a.status === 'Confirmado');
  return <div className="admin-grid">
    <div className="admin-header glass"><div><span>Painel do prestador</span><h2>Gerenciamento completo</h2></div><button className="secondary" onClick={() => props.setAdmin(false)}><LogOut size={18}/> Sair</button></div>
    <div className="admin-card glass wide"><h3><Eye/> Agendamentos pendentes</h3>{pendentes.length === 0 && <div className="empty">Nenhum agendamento pendente.</div>}<div className="appointments">{pendentes.map(a => <Appointment key={a.id} a={a} admin confirmar={props.confirmar} remover={props.remover} whatsapp={props.whatsapp}/>)}</div></div>
    <div className="admin-card glass"><h3><CheckCircle2/> Confirmados</h3>{confirmados.map(a => <Appointment key={a.id} a={a} compact />)}{confirmados.length === 0 && <div className="empty">Nenhum confirmado ainda.</div>}</div>
    <ServiceManager {...props}/>
    <Customizer {...props}/>
  </div>;
}

function ServiceManager({ serviceForm, setServiceForm, addServico, servicos, setServicos, fileToDataUrl }) {
  return <div className="admin-card glass"><h3><Plus/> Criar novo serviço</h3><form onSubmit={addServico}><label>Nome<input value={serviceForm.nome} onChange={e => setServiceForm({ ...serviceForm, nome: e.target.value })} placeholder="Ex: Manicure, Consulta, Lavagem" /></label><label>Valor<input value={serviceForm.valor} onChange={e => setServiceForm({ ...serviceForm, valor: e.target.value })} placeholder="Ex: 80,00" /></label><label>Categoria<input value={serviceForm.categoria} onChange={e => setServiceForm({ ...serviceForm, categoria: e.target.value })} placeholder="Ex: Estética, Saúde, Automotivo" /></label><label>Descrição<textarea value={serviceForm.descricao} onChange={e => setServiceForm({ ...serviceForm, descricao: e.target.value })}/></label><label className="upload"><ImageIcon/> Imagem opcional<input type="file" accept="image/*" onChange={e => fileToDataUrl(e.target.files[0], img => setServiceForm({ ...serviceForm, imagem: img }))}/></label>{serviceForm.imagem && <img className="thumb" src={serviceForm.imagem}/>}<button className="primary full">Cadastrar serviço</button></form><div className="mini-services">{servicos.map(s => <span key={s.id}>{s.nome}<button onClick={() => setServicos(prev => prev.filter(x => x.id !== s.id))}><XCircle size={14}/></button></span>)}</div></div>;
}

function Customizer({ theme, setTheme, fileToDataUrl, updateBanner }) {
  return <div className="admin-card glass"><h3><Palette/> Personalização do cliente SaaS</h3><label>Nome da empresa<input value={theme.nomeEmpresa} onChange={e => setTheme({ ...theme, nomeEmpresa: e.target.value })}/></label><label>Segmento<input value={theme.segmento} onChange={e => setTheme({ ...theme, segmento: e.target.value })}/></label><label>WhatsApp da empresa<input value={theme.whatsappEmpresa} onChange={e => setTheme({ ...theme, whatsappEmpresa: e.target.value })}/></label><div className="color-row"><label>Cor principal<input type="color" value={theme.corPrimaria} onChange={e => setTheme({ ...theme, corPrimaria: e.target.value })}/></label><label>Cor secundária<input type="color" value={theme.corSecundaria} onChange={e => setTheme({ ...theme, corSecundaria: e.target.value })}/></label><label>Cor destaque<input type="color" value={theme.corDestaque} onChange={e => setTheme({ ...theme, corDestaque: e.target.value })}/></label></div><label className="upload"><Upload/> Logo da empresa<input type="file" accept="image/*" onChange={e => fileToDataUrl(e.target.files[0], img => setTheme({ ...theme, logo: img }))}/></label>{theme.logo && <img className="thumb" src={theme.logo}/>}<h4>Banners de propaganda</h4>{theme.banners.map((b, i) => <div className="banner-editor" key={i}><input value={b.titulo} onChange={e => updateBanner(i, 'titulo', e.target.value)} placeholder="Título do banner"/><textarea value={b.texto} onChange={e => updateBanner(i, 'texto', e.target.value)} /><label className="upload"><ImageIcon/> Imagem do banner<input type="file" accept="image/*" onChange={e => fileToDataUrl(e.target.files[0], img => updateBanner(i, 'imagem', img))}/></label></div>)}</div>;
}

function Appointment({ a, admin, confirmar, remover, whatsapp, client, compact }) {
  return <article className={`appointment ${a.status === 'Confirmado' ? 'ok' : 'wait'} ${compact ? 'compact' : ''}`}><div className="avatar"><UserRound/></div><div className="appointment-info"><strong>{a.nome}</strong><span>{a.servicoNome} • R$ {a.servicoValor}</span><small>{formatDate(a.data)} às {a.horario}</small>{a.observacao && !compact && <em>{a.observacao}</em>}<b className="status-pill">{a.status}</b></div>{admin && <div className="appointment-actions"><button className="confirm" onClick={() => confirmar(a.id)}><CheckCircle2/> Confirmar</button><a className="zap" href={whatsapp(a)} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp</a><button className="delete" onClick={() => remover(a.id)}><Trash2/></button></div>}{client && <div className="client-status"><Clock/></div>}</article>;
}

function Stat({ icon, label, value }) { return <div className="stat glass"><div>{icon}</div><span>{label}</span><b>{value}</b></div>; }
function formatDate(date) { if (!date) return ''; const [y,m,d] = date.split('-'); return `${d}/${m}/${y}`; }

createRoot(document.getElementById('root')).render(<App />);
