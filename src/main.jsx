import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  CalendarDays, Clock, Sparkles, CheckCircle2, Phone, UserRound, BarChart3,
  Trash2, MessageCircle, ShieldCheck, LogIn, LogOut, Plus, Image as ImageIcon,
  Palette, Building2, Settings, Upload, Edit3, Save, XCircle, BellRing
} from 'lucide-react';
import './style.css';

const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const ADMIN_USER = 'admin';
const ADMIN_PASS = '123456';

const defaultTheme = {
  nomeEmpresa: 'AgendaPro SaaS',
  segmento: 'Barbearia, salão, estética, clínica, assistência técnica ou autônomo',
  logo: '',
  corPrimaria: '#7c3aed',
  corSecundaria: '#06b6d4',
  corDestaque: '#f97316',
  whatsappEmpresa: '92982452810',
  logoInfo: null,
  banners: [
    { titulo: 'Atendimento profissional', texto: 'Agende serviços com praticidade e acompanhe a confirmação em tempo real.', imagem: '', imageInfo: null },
    { titulo: 'Promoções e pacotes', texto: 'Use banners para divulgar combos, campanhas e serviços em destaque.', imagem: '', imageInfo: null }
  ]
};

const defaultServices = [
  { id: '1', nome: 'Corte Masculino', valor: '35,00', descricao: 'Serviço rápido e profissional.', imagem: '', categoria: 'Barbearia' },
  { id: '2', nome: 'Barba Completa', valor: '25,00', descricao: 'Acabamento completo.', imagem: '', categoria: 'Barbearia' },
  { id: '3', nome: 'Limpeza de Pele', valor: '90,00', descricao: 'Procedimento estético.', imagem: '', categoria: 'Estética' },
  { id: '4', nome: 'Consulta / Atendimento', valor: '120,00', descricao: 'Serviço adaptável para qualquer negócio.', imagem: '', categoria: 'Serviços' },
];

const initialForm = { nome: '', telefone: '', servicoId: '1', data: '', horario: HORARIOS[0], observacao: '' };
const initialServiceForm = { id: '', nome: '', valor: '', descricao: '', categoria: '', imagem: '', imageInfo: null };

function readStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}

function formatDate(date) {
  if (!date) return '';
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

function onlyNumbers(value) {
  return String(value || '').replace(/\D/g, '');
}

function waLink(phone, text) {
  const tel = onlyNumbers(phone);
  return `https://wa.me/55${tel}?text=${encodeURIComponent(text)}`;
}

function App() {
  const [theme, setTheme] = useState(defaultTheme);
  const [servicos, setServicos] = useState(defaultServices);
  const [form, setForm] = useState(initialForm);
  const [agendamentos, setAgendamentos] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [login, setLogin] = useState({ usuario: '', senha: '' });
  const [serviceForm, setServiceForm] = useState(initialServiceForm);
  const [editingAppointment, setEditingAppointment] = useState(null);
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
  function notify(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }
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
    notify('Agendamento enviado! O prestador será avisado pelo WhatsApp.');

    if (onlyNumbers(theme.whatsappEmpresa).length >= 10) {
      const texto = `🔔 Novo agendamento recebido!\n\nCliente: ${novo.nome}\nWhatsApp: ${novo.telefone}\nServiço: ${novo.servicoNome}\nValor: R$ ${novo.servicoValor}\nData: ${formatDate(novo.data)}\nHorário: ${novo.horario}\nObservação: ${novo.observacao || 'Sem observação'}\n\nAcesse o painel do prestador para confirmar o agendamento.`;
      setTimeout(() => window.open(waLink(theme.whatsappEmpresa, texto), '_blank'), 350);
    }
  }

  function confirmar(id) {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: 'Confirmado' } : a));
    notify('Agendamento confirmado. O painel do cliente já foi atualizado.');
  }

  function remover(id) {
    setAgendamentos(prev => prev.filter(a => a.id !== id));
    notify('Agendamento removido.');
  }

  function salvarEdicao(e) {
    e.preventDefault();
    setAgendamentos(prev => prev.map(a => a.id === editingAppointment.id ? editingAppointment : a));
    setEditingAppointment(null);
    notify('Agendamento atualizado.');
  }

  function mensagemCliente(a) {
    return waLink(a.telefone, `Olá ${a.nome}, seu agendamento para o serviço ${a.servicoNome} foi CONFIRMADO para ${formatDate(a.data)} às ${a.horario}. Obrigado pela preferência!`);
  }

  function entrar(e) {
    e.preventDefault();
    if (login.usuario === ADMIN_USER && login.senha === ADMIN_PASS) { setAdmin(true); notify('Login realizado com sucesso.'); }
    else notify('Usuário ou senha inválidos. Use admin / 123456.');
  }

  function salvarServico(e) {
    e.preventDefault();
    if (!serviceForm.nome || !serviceForm.valor) return notify('Informe pelo menos nome e valor do serviço.');
    if (serviceForm.id) {
      setServicos(prev => prev.map(s => s.id === serviceForm.id ? serviceForm : s));
      notify('Serviço atualizado.');
    } else {
      setServicos(prev => [{ ...serviceForm, id: crypto.randomUUID() }, ...prev]);
      notify('Novo serviço cadastrado.');
    }
    setServiceForm(initialServiceForm);
  }

  function editarServico(servico) { setServiceForm(servico); }
  function removerServico(id) {
    setServicos(prev => prev.filter(s => s.id !== id));
    notify('Serviço removido.');
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

  function fileToImageData(file, callback) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      const img = new Image();
      img.onload = () => callback(url, {
        width: img.naturalWidth,
        height: img.naturalHeight,
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        type: file.type || 'imagem'
      });
      img.src = url;
    };
    reader.readAsDataURL(file);
  }

  return (
    <main style={cssVars}>
      {toast && <div className="toast">{toast}</div>}
      <section className="hero">
        <div className="hero-glow one"></div><div className="hero-glow two"></div>
        <nav className="nav glass">
          <div className="brand">
            <LogoBox logo={theme.logo}/>
            <div><b>{theme.nomeEmpresa}</b><small>{theme.segmento}</small></div>
          </div>
          <div className="nav-actions"><a href="#agendar">Agendar</a><a href="#admin">Painel do prestador</a></div>
        </nav>
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="badge"><Sparkles size={16}/> Sistema SaaS de agendamento</span>
            <h1>Agenda profissional para qualquer prestador de serviço.</h1>
            <p>Cliente solicita o horário, o status aparece laranja como aguardando confirmação, e o prestador gerencia tudo pelo painel com login: confirmar, editar, remover e chamar no WhatsApp.</p>
            <div className="hero-actions"><a href="#agendar" className="primary">Fazer agendamento</a><a href="#admin" className="secondary">Acessar painel</a></div>
          </div>
          <div className="dashboard-preview glass tilt">
            <div className="preview-head"><span></span><span></span><span></span></div>
            <div className="cube"><CalendarDays size={54}/></div>
            <h2>Fluxo completo</h2>
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
          <button className="primary full" type="submit"><BellRing size={18}/> Enviar solicitação e avisar prestador</button>
        </form>

        <div className="schedule-card glass">
          <div className="section-title left"><span>Painel do cliente</span><h2>Meus agendamentos</h2></div>
          <div className="appointments">
            {agendamentos.length === 0 && <div className="empty">Nenhum agendamento ainda.</div>}
            {agendamentos.map(a => <AppointmentCard key={a.id} a={a} client />)}
          </div>
        </div>
      </section>

      <section className="admin-area" id="admin">
        {!admin ? (
          <form className="login-card glass" onSubmit={entrar}>
            <div className="section-title"><span>Área restrita</span><h2>Login do prestador</h2></div>
            <p>Acesse para confirmar, editar, remover agendamentos, chamar clientes no WhatsApp, cadastrar serviços e personalizar a vitrine.</p>
            <label>Usuário<input value={login.usuario} onChange={e => setLogin({...login, usuario: e.target.value})} placeholder="admin" /></label>
            <label>Senha<input type="password" value={login.senha} onChange={e => setLogin({...login, senha: e.target.value})} placeholder="123456" /></label>
            <button className="primary full" type="submit"><LogIn size={18}/> Entrar no painel</button>
            <small className="hint">Usuário: admin • Senha: 123456</small>
          </form>
        ) : (
          <div className="admin-grid">
            <div className="admin-header glass"><div><span>Painel do prestador</span><h2>Gerenciamento do negócio</h2></div><button className="secondary" onClick={() => setAdmin(false)}><LogOut size={18}/> Sair</button></div>

            <div className="admin-card glass wide">
              <h3><Clock/> Agendamentos pendentes e confirmados</h3>
              <div className="appointments admin-list">
                {agendamentos.length === 0 && <div className="empty">Nenhum agendamento recebido.</div>}
                {agendamentos.map(a => <AppointmentCard key={a.id} a={a} onConfirm={confirmar} onRemove={remover} onEdit={setEditingAppointment} msgLink={mensagemCliente(a)} />)}
              </div>
            </div>

            <div className="admin-card glass">
              <h3><Phone/> WhatsApp do prestador</h3>
              <p className="muted">Esse número receberá o aviso quando o cliente concluir o formulário. Informe DDD + número.</p>
              <label>Número do WhatsApp<input value={theme.whatsappEmpresa} onChange={e => setTheme({...theme, whatsappEmpresa: e.target.value})} placeholder="92999999999" /></label>
              <div className="info-box">No modelo estático, o sistema abre o WhatsApp Web/App com a mensagem pronta. Para envio 100% automático sem abrir janela, será necessário integrar uma API oficial de WhatsApp.</div>
            </div>

            <form className="admin-card glass" onSubmit={salvarServico}>
              <h3><Plus/> {serviceForm.id ? 'Editar serviço' : 'Cadastrar serviço'}</h3>
              <label>Nome do serviço<input value={serviceForm.nome} onChange={e => setServiceForm({...serviceForm, nome: e.target.value})} placeholder="Ex: Manicure, consulta, manutenção" /></label>
              <div className="two-cols"><label>Valor<input value={serviceForm.valor} onChange={e => setServiceForm({...serviceForm, valor: e.target.value})} placeholder="80,00" /></label><label>Categoria<input value={serviceForm.categoria} onChange={e => setServiceForm({...serviceForm, categoria: e.target.value})} placeholder="Estética" /></label></div>
              <label>Descrição<textarea value={serviceForm.descricao} onChange={e => setServiceForm({...serviceForm, descricao: e.target.value})} placeholder="Descrição do serviço" /></label>
              <label className="upload"><ImageIcon/> Imagem opcional do serviço<input type="file" accept="image/*" onChange={e => fileToImageData(e.target.files[0], (url, info) => setServiceForm({...serviceForm, imagem: url, imageInfo: info}))}/></label>
              {serviceForm.imageInfo && <ImageResolution info={serviceForm.imageInfo} ideal="Recomendado: 1080 x 1080 px para card quadrado ou 1200 x 800 px para foto horizontal." />}
              {serviceForm.imagem && <img className="thumb" src={serviceForm.imagem}/>} 
              <button className="primary full" type="submit"><Save size={18}/> {serviceForm.id ? 'Salvar alterações' : 'Adicionar serviço'}</button>
              {serviceForm.id && <button className="secondary full gap-top" type="button" onClick={() => setServiceForm(initialServiceForm)}><XCircle size={18}/> Cancelar edição</button>}
              <div className="mini-services">{servicos.map(s => <span key={s.id}>{s.nome}<button type="button" title="Editar" onClick={() => editarServico(s)}><Edit3 size={14}/></button><button type="button" title="Remover" onClick={() => removerServico(s.id)}><Trash2 size={14}/></button></span>)}</div>
            </form>

            <div className="admin-card glass">
              <h3><Palette/> Personalizar layout</h3>
              <label>Nome da empresa<input value={theme.nomeEmpresa} onChange={e => setTheme({...theme, nomeEmpresa: e.target.value})}/></label>
              <label>Segmento<input value={theme.segmento} onChange={e => setTheme({...theme, segmento: e.target.value})}/></label>
              <label className="upload"><Upload/> Inserir logo<input type="file" accept="image/*" onChange={e => fileToImageData(e.target.files[0], (url, info) => setTheme({...theme, logo: url, logoInfo: info}))}/></label>
              {theme.logoInfo && <ImageResolution info={theme.logoInfo} ideal="Recomendado: 800 x 800 px ou 1000 x 1000 px em PNG com fundo transparente." />}
              <div className="logo-preview-wrap"><LogoBox logo={theme.logo} large/><span>A logo é centralizada, recortada com preenchimento da moldura e sem deformar.</span></div>
              <div className="color-row"><label>Primária<input type="color" value={theme.corPrimaria} onChange={e => setTheme({...theme, corPrimaria: e.target.value})}/></label><label>Secundária<input type="color" value={theme.corSecundaria} onChange={e => setTheme({...theme, corSecundaria: e.target.value})}/></label><label>Destaque<input type="color" value={theme.corDestaque} onChange={e => setTheme({...theme, corDestaque: e.target.value})}/></label></div>
            </div>

            <div className="admin-card glass">
              <h3><ImageIcon/> Banners de propaganda</h3>
              {theme.banners.map((b, i) => <div className="banner-editor" key={i}>
                <label>Título<input value={b.titulo} onChange={e => updateBanner(i, 'titulo', e.target.value)}/></label>
                <label>Texto<textarea value={b.texto} onChange={e => updateBanner(i, 'texto', e.target.value)}/></label>
                <label className="upload"><Upload/> Imagem do banner<input type="file" accept="image/*" onChange={e => fileToImageData(e.target.files[0], (url, info) => { updateBanner(i, 'imagem', url); updateBanner(i, 'imageInfo', info); })}/></label>
                {b.imageInfo && <ImageResolution info={b.imageInfo} ideal="Recomendado: 1600 x 600 px ou 1920 x 720 px para banner horizontal." />}
              </div>)}
            </div>
          </div>
        )}
      </section>

      {editingAppointment && <EditAppointmentModal item={editingAppointment} setItem={setEditingAppointment} onSave={salvarEdicao} servicos={servicos}/>} 

      <footer>AgendaPro SaaS • Projeto pronto para GitHub e Cloudflare Pages</footer>
    </main>
  );
}


function ImageResolution({ info, ideal }) {
  if (!info) return null;
  return (
    <div className="resolution-box">
      <b>Resolução enviada: {info.width} x {info.height} px</b>
      <span>{info.name} • {info.sizeKb} KB • {info.type}</span>
      <small>{ideal}</small>
    </div>
  );
}

function LogoBox({ logo, large = false }) {
  return <div className={large ? 'logo-frame large' : 'logo-frame'}>{logo ? <img src={logo}/> : <CalendarDays size={large ? 34 : 24}/>}</div>;
}

function Stat({ icon, label, value }) { return <div className="stat glass"><div>{icon}</div><span>{label}</span><b>{value}</b></div>; }

function AppointmentCard({ a, client, onConfirm, onRemove, onEdit, msgLink }) {
  const ok = a.status === 'Confirmado';
  return <div className={`appointment ${ok ? 'ok' : 'wait'} ${client ? 'client-status' : ''}`}>
    <div className="avatar"><UserRound/></div>
    <div className="appointment-info"><b>{a.nome}</b><span>{a.servicoNome} • R$ {a.servicoValor}</span><small>{formatDate(a.data)} às {a.horario} • WhatsApp: {a.telefone}</small>{a.observacao && <em>{a.observacao}</em>}<strong className="status-pill">{a.status}</strong></div>
    {!client && <div className="appointment-actions">
      {!ok && <button className="confirm" onClick={() => onConfirm(a.id)}><CheckCircle2 size={16}/> Confirmar</button>}
      <a className="zap" href={msgLink} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a>
      <button onClick={() => onEdit(a)}><Edit3 size={16}/> Editar</button>
      <button className="delete" onClick={() => onRemove(a.id)}><Trash2 size={16}/> Remover</button>
    </div>}
  </div>;
}

function EditAppointmentModal({ item, setItem, onSave, servicos }) {
  const selected = servicos.find(s => s.id === item.servicoId);
  function setService(id) {
    const s = servicos.find(x => x.id === id);
    setItem({ ...item, servicoId: id, servicoNome: s?.nome || item.servicoNome, servicoValor: s?.valor || item.servicoValor });
  }
  return <div className="modal-backdrop">
    <form className="modal glass" onSubmit={onSave}>
      <div className="modal-head"><h3><Edit3/> Editar agendamento</h3><button type="button" onClick={() => setItem(null)}><XCircle/></button></div>
      <label>Nome<input value={item.nome} onChange={e => setItem({...item, nome: e.target.value})}/></label>
      <label>WhatsApp<input value={item.telefone} onChange={e => setItem({...item, telefone: e.target.value})}/></label>
      <label>Serviço<select value={item.servicoId} onChange={e => setService(e.target.value)}>{servicos.map(s => <option key={s.id} value={s.id}>{s.nome} - R$ {s.valor}</option>)}</select></label>
      <div className="two-cols"><label>Data<input type="date" value={item.data} onChange={e => setItem({...item, data: e.target.value})}/></label><label>Horário<select value={item.horario} onChange={e => setItem({...item, horario: e.target.value})}>{HORARIOS.map(h => <option key={h}>{h}</option>)}</select></label></div>
      <label>Status<select value={item.status} onChange={e => setItem({...item, status: e.target.value})}><option>Aguardando confirmação</option><option>Confirmado</option></select></label>
      <label>Observação<textarea value={item.observacao} onChange={e => setItem({...item, observacao: e.target.value})}/></label>
      <button className="primary full" type="submit"><Save size={18}/> Salvar edição</button>
    </form>
  </div>
}

createRoot(document.getElementById('root')).render(<App />);
