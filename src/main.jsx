import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  CalendarDays, Clock, Sparkles, CheckCircle2, Phone, UserRound, BarChart3,
  Trash2, MessageCircle, ShieldCheck, LogIn, LogOut, Plus, Image as ImageIcon,
  Palette, Building2, Upload, Edit3, Save, XCircle, BellRing, Store, Search,
  Users, KeyRound, LayoutDashboard, Eye, PackageCheck, Home, Headphones, Copy,
  ArrowLeft, BadgeDollarSign, Megaphone
} from 'lucide-react';
import './style.css';

const HORARIOS = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00'];
const SUPORTE_USER = 'suporte';
const SUPORTE_PASS = '123456';

const defaultClients = [
  {
    id: 'cli-1', nomeEmpresa: 'Studio Bella Hair', segmento: 'Salão de beleza e estética', usuario: 'bella', senha: '123456', whatsappEmpresa: '92982452810',
    logo: '', logoInfo: null, corPrimaria: '#7c3aed', corSecundaria: '#06b6d4', corDestaque: '#f97316',
    descricao: 'Atendimento moderno para cabelo, beleza e estética com horários personalizados.',
    banners: [
      { titulo: 'Semana da beleza', texto: 'Pacotes promocionais para corte, escova e tratamento capilar.', imagem: '', imageInfo: null },
      { titulo: 'Agende com praticidade', texto: 'Escolha o serviço, data e horário e aguarde a confirmação.', imagem: '', imageInfo: null }
    ]
  },
  {
    id: 'cli-2', nomeEmpresa: 'Barbearia Prime', segmento: 'Barbearia premium', usuario: 'prime', senha: '123456', whatsappEmpresa: '92999999999',
    logo: '', logoInfo: null, corPrimaria: '#0ea5e9', corSecundaria: '#22c55e', corDestaque: '#f59e0b',
    descricao: 'Cortes, barba e acabamento com experiência profissional e agenda organizada.',
    banners: [
      { titulo: 'Combo corte + barba', texto: 'Atendimento completo com horário marcado.', imagem: '', imageInfo: null },
      { titulo: 'Visual renovado', texto: 'Confira nossos serviços e escolha o melhor horário.', imagem: '', imageInfo: null }
    ]
  }
];

const defaultServices = [
  { id: 'srv-1', clientId: 'cli-1', nome: 'Escova Profissional', valor: '60,00', descricao: 'Finalização elegante com acabamento profissional.', categoria: 'Cabelo', imagem: '', imageInfo: null },
  { id: 'srv-2', clientId: 'cli-1', nome: 'Limpeza de Pele', valor: '95,00', descricao: 'Procedimento estético para renovação facial.', categoria: 'Estética', imagem: '', imageInfo: null },
  { id: 'srv-3', clientId: 'cli-2', nome: 'Corte Masculino', valor: '35,00', descricao: 'Corte moderno com acabamento.', categoria: 'Barbearia', imagem: '', imageInfo: null },
  { id: 'srv-4', clientId: 'cli-2', nome: 'Barba Completa', valor: '30,00', descricao: 'Barba desenhada com toalha quente.', categoria: 'Barbearia', imagem: '', imageInfo: null },
];

const emptyClient = { nomeEmpresa: '', segmento: '', usuario: '', senha: '', whatsappEmpresa: '', logo: '', logoInfo: null, descricao: '', corPrimaria: '#7c3aed', corSecundaria: '#06b6d4', corDestaque: '#f97316', banners: [{ titulo: 'Promoção especial', texto: 'Divulgue seus serviços em destaque.', imagem: '', imageInfo: null }, { titulo: 'Atendimento com hora marcada', texto: 'Facilite o agendamento para seus clientes.', imagem: '', imageInfo: null }] };
const initialBooking = { nome: '', telefone: '', serviceId: '', data: '', horario: HORARIOS[0], observacao: '' };
const initialService = { id: '', nome: '', valor: '', descricao: '', categoria: '', imagem: '', imageInfo: null };
const defaultAdSlots = [
  { id: 'ad-left', titulo: 'Espaço publicitário', subtitulo: 'Divulgue sua marca, produto ou serviço', videos: [] },
  { id: 'ad-right', titulo: 'Sua empresa em destaque', subtitulo: 'Anuncie para pessoas interessadas em serviços locais', videos: [] }
];

function readStore(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } }
function onlyNumbers(v) { return String(v || '').replace(/\D/g, ''); }
function formatDate(date) { if (!date) return ''; const [y,m,d] = date.split('-'); return `${d}/${m}/${y}`; }
function waLink(phone, text) { const tel = onlyNumbers(phone); return `https://wa.me/55${tel}?text=${encodeURIComponent(text)}`; }
function currency(v) { return String(v || '0,00').replace('R$','').trim(); }
function filesToVideoData(files, cb, onError) {
  const selected = Array.from(files || []);
  if (!selected.length) return;
  const invalid = selected.find(file => !file.type.startsWith('video/'));
  if (invalid) return onError?.('Selecione somente arquivos de vídeo.');
  const tooLarge = selected.find(file => file.size > 4 * 1024 * 1024);
  if (tooLarge) return onError?.('Cada vídeo deve ter no máximo 4 MB nesta versão estática.');
  Promise.all(selected.map(file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ id: crypto.randomUUID(), url: reader.result, nome: file.name, tipo: file.type, sizeKb: Math.round(file.size/1024) });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  }))).then(cb).catch(() => onError?.('Não foi possível processar um dos vídeos.'));
}

function fileToImageData(file, cb) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const url = reader.result; const img = new Image();
    img.onload = () => cb(url, { width: img.naturalWidth, height: img.naturalHeight, name: file.name, sizeKb: Math.round(file.size/1024), type: file.type || 'imagem' });
    img.src = url;
  };
  reader.readAsDataURL(file);
}

function App() {
  const [page, setPage] = useState('home');
  const [clients, setClients] = useState(defaultClients);
  const [services, setServices] = useState(defaultServices);
  const [appointments, setAppointments] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('cli-1');
  const [provider, setProvider] = useState(null);
  const [support, setSupport] = useState(false);
  const [toast, setToast] = useState('');
  const [adSlots, setAdSlots] = useState(defaultAdSlots);

  useEffect(() => {
    setClients(readStore('saas-clients', defaultClients));
    setServices(readStore('saas-services', defaultServices));
    setAppointments(readStore('saas-appointments', []));
    setAdSlots(readStore('saas-ad-slots', defaultAdSlots));
    const savedProvider = readStore('saas-provider-session', null); if (savedProvider) setProvider(savedProvider);
    setSupport(localStorage.getItem('saas-support-session') === 'true');
  }, []);
  useEffect(() => localStorage.setItem('saas-clients', JSON.stringify(clients)), [clients]);
  useEffect(() => localStorage.setItem('saas-services', JSON.stringify(services)), [services]);
  useEffect(() => localStorage.setItem('saas-appointments', JSON.stringify(appointments)), [appointments]);
  useEffect(() => { try { localStorage.setItem('saas-ad-slots', JSON.stringify(adSlots)); } catch { notify('O armazenamento do navegador ficou cheio. Use vídeos menores ou remova arquivos antigos.'); } }, [adSlots]);
  useEffect(() => provider ? localStorage.setItem('saas-provider-session', JSON.stringify(provider)) : localStorage.removeItem('saas-provider-session'), [provider]);
  useEffect(() => localStorage.setItem('saas-support-session', String(support)), [support]);

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const cssVars = selectedClient ? {'--brand': selectedClient.corPrimaria, '--brand2': selectedClient.corSecundaria, '--accent': selectedClient.corDestaque} : {};
  function notify(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  function createAppointment(payload) {
    const service = services.find(s => s.id === payload.serviceId);
    const client = clients.find(c => c.id === payload.clientId);
    const novo = { ...payload, id: crypto.randomUUID(), servicoNome: service?.nome || 'Serviço', servicoValor: service?.valor || '0,00', empresaNome: client?.nomeEmpresa || '', status: 'Aguardando confirmação', criadoEm: new Date().toLocaleString('pt-BR') };
    setAppointments(prev => [novo, ...prev]);
    notify('Agendamento enviado. O prestador será avisado pelo WhatsApp.');
    if (onlyNumbers(client?.whatsappEmpresa).length >= 10) {
      const texto = `🔔 Novo agendamento recebido!\n\nEmpresa: ${client.nomeEmpresa}\nCliente: ${novo.nome}\nWhatsApp: ${novo.telefone}\nServiço/produto: ${novo.servicoNome}\nValor: R$ ${novo.servicoValor}\nData: ${formatDate(novo.data)}\nHorário: ${novo.horario}\nObservação: ${novo.observacao || 'Sem observação'}\n\nAcesse seu dashboard para confirmar.`;
      setTimeout(() => window.open(waLink(client.whatsappEmpresa, texto), '_blank'), 350);
    }
  }

  return <main style={cssVars}>
    {toast && <div className="toast">{toast}</div>}
    <TopNav page={page} setPage={setPage} provider={provider} support={support} setProvider={setProvider} setSupport={setSupport}/>
    {page === 'home' && <HomePage clients={clients} services={services} appointments={appointments} selectedClientId={selectedClientId} setSelectedClientId={setSelectedClientId} onBook={createAppointment} adSlots={adSlots}/>} 
    {page === 'providerLogin' && <ProviderLogin clients={clients} setProvider={setProvider} setPage={setPage} notify={notify}/>} 
    {page === 'supportLogin' && <SupportLogin setSupport={setSupport} setPage={setPage} notify={notify}/>} 
    {page === 'providerDashboard' && (provider ? <ProviderDashboard provider={provider} setProvider={setProvider} clients={clients} setClients={setClients} services={services} setServices={setServices} appointments={appointments} setAppointments={setAppointments} notify={notify}/> : <ProviderLogin clients={clients} setProvider={setProvider} setPage={setPage} notify={notify}/>) }
    {page === 'supportDashboard' && (support ? <SupportDashboard clients={clients} setClients={setClients} services={services} appointments={appointments} notify={notify} adSlots={adSlots} setAdSlots={setAdSlots}/> : <SupportLogin setSupport={setSupport} setPage={setPage} notify={notify}/>) }
    <footer>AgendaPro Marketplace SaaS • Vitrine pública + dashboards por cliente • Pronto para GitHub e Cloudflare Pages</footer>
  </main>;
}

function TopNav({ page, setPage, provider, support, setProvider, setSupport }) {
  return <nav className="topbar glass">
    <button className="brand-btn" onClick={() => setPage('home')}><div className="app-logo"><CalendarDays/></div><div><b>AgendaPro Marketplace</b><small>SaaS para empresas e autônomos</small></div></button>
    <div className="top-actions">
      <button onClick={() => setPage('home')} className={page==='home'?'active':''}><Home size={17}/> Vitrine</button>
      <button onClick={() => setPage(provider?'providerDashboard':'providerLogin')} className={page.includes('provider')?'active':''}><Store size={17}/> Prestador</button>
      <button onClick={() => setPage(support?'supportDashboard':'supportLogin')} className={page.includes('support')?'active':''}><Headphones size={17}/> Suporte</button>
      {(provider || support) && <button onClick={() => { setProvider(null); setSupport(false); setPage('home'); }}><LogOut size={17}/> Sair</button>}
    </div>
  </nav>
}

function HomePage({ clients, services, appointments, selectedClientId, setSelectedClientId, onBook, adSlots }) {
  const [query, setQuery] = useState('');
  const selected = clients.find(c => c.id === selectedClientId) || clients[0];
  const clientServices = services.filter(s => s.clientId === selected?.id);
  const filteredClients = clients.filter(c => `${c.nomeEmpresa} ${c.segmento}`.toLowerCase().includes(query.toLowerCase()));
  const stats = { empresas: clients.length, servicos: services.length, agendamentos: appointments.length };
  return <>
    <section className="hero-market">
      <div className="hero-glow one"></div><div className="hero-glow two"></div>
      <div className="hero-copy">
        <span className="badge"><Sparkles size={16}/> Plataforma SaaS multiempresas</span>
        <h1>Um espaço moderno para empresas divulgarem serviços e receberem agendamentos.</h1>
        <p>O público escolhe a empresa na vitrine, visualiza banners, produtos/serviços, seleciona o item desejado e solicita o agendamento direto pelo sistema.</p>
        <div className="hero-actions"><a href="#vitrine" className="primary">Explorar vitrine</a><a href="#como-funciona" className="secondary">Ver fluxo</a></div>
      </div>
      <div className="market-preview glass tilt"><div className="cube"><Store size={58}/></div><h2>Marketplace de agendamentos</h2><p>Vitrine pública + painel individual para cada cliente.</p></div>
    </section>
    <section className="stats"><Stat icon={<Building2/>} label="Clientes cadastrados" value={stats.empresas}/><Stat icon={<PackageCheck/>} label="Produtos e serviços" value={stats.servicos}/><Stat icon={<CalendarDays/>} label="Agendamentos" value={stats.agendamentos}/></section>
    <section className="ad-showcase" aria-label="Espaços publicitários">{adSlots.map(slot => <VideoAdCarousel key={slot.id} slot={slot}/>)}</section>
    <section className="market-shell" id="vitrine">
      <aside className="company-sidebar glass">
        <div className="side-head"><h3><Store/> Empresas e autônomos</h3><label className="search"><Search size={16}/><input placeholder="Buscar empresa..." value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
        {filteredClients.map(c => <button key={c.id} onClick={()=>setSelectedClientId(c.id)} className={`company-item ${selected?.id===c.id?'selected':''}`}><LogoBox logo={c.logo}/><span><b>{c.nomeEmpresa}</b><small>{c.segmento}</small></span></button>)}
      </aside>
      {selected && <Storefront client={selected} services={clientServices} onBook={onBook}/>} 
    </section>
    <section className="flow" id="como-funciona"><div className="section-title"><span>Fluxo do sistema</span><h2>Organizado para venda em formato SaaS</h2></div><div className="flow-grid"><Step n="1" title="Suporte cria o cliente" text="Você cria login e senha para cada empresa ou autônomo."/><Step n="2" title="Cliente monta a vitrine" text="Ele envia logo, banners, serviços, valores, fotos e WhatsApp."/><Step n="3" title="Público agenda" text="O visitante seleciona empresa, serviço, data e horário."/><Step n="4" title="Prestador confirma" text="No dashboard ele confirma, edita, exclui e chama o cliente no WhatsApp."/></div></section>
  </>
}

function Storefront({ client, services, onBook }) {
  const [booking, setBooking] = useState({ ...initialBooking, serviceId: services[0]?.id || '' });
  useEffect(() => setBooking({ ...initialBooking, serviceId: services[0]?.id || '' }), [client.id, services.length]);
  const selectedService = services.find(s => s.id === booking.serviceId) || services[0];
  function submit(e) { e.preventDefault(); if (!booking.nome || !booking.telefone || !booking.data || !booking.horario || !booking.serviceId) return alert('Preencha todos os campos obrigatórios.'); onBook({ ...booking, clientId: client.id }); setBooking({ ...initialBooking, serviceId: services[0]?.id || '' }); }
  return <section className="storefront glass">
    <div className="store-head"><LogoBox logo={client.logo} large/><div><span>{client.segmento}</span><h2>{client.nomeEmpresa}</h2><p>{client.descricao}</p></div></div>
    <div className="banners">{client.banners.map((b,i)=><div className="banner-card glass" key={i}>{b.imagem && <img src={b.imagem}/>}<div><span>Promoção {i+1}</span><h3>{b.titulo}</h3><p>{b.texto}</p></div></div>)}</div>
    <div className="section-title left"><span>Produtos e serviços</span><h2>Escolha o que deseja agendar</h2></div>
    <div className="service-grid public">{services.length===0 && <div className="empty">Essa empresa ainda não cadastrou serviços.</div>}{services.map(s=><button className={`service-card selectable ${booking.serviceId===s.id?'chosen':''}`} key={s.id} onClick={()=>setBooking({...booking, serviceId: s.id})}>{s.imagem ? <img src={s.imagem}/> : <div className="service-icon"><PackageCheck/></div>}<h3>{s.nome}</h3><p>{s.descricao}</p><strong>R$ {s.valor}</strong><small>{s.categoria || 'Serviço'}</small></button>)}</div>
    <form className="booking-panel" onSubmit={submit}><h3><BellRing/> Agendar {selectedService?.nome || 'serviço'}</h3><div className="two-cols"><label>Nome<input value={booking.nome} onChange={e=>setBooking({...booking,nome:e.target.value})} placeholder="Nome completo"/></label><label>WhatsApp<input value={booking.telefone} onChange={e=>setBooking({...booking,telefone:e.target.value})} placeholder="92999999999"/></label></div><div className="two-cols"><label>Data<input type="date" value={booking.data} onChange={e=>setBooking({...booking,data:e.target.value})}/></label><label>Horário<select value={booking.horario} onChange={e=>setBooking({...booking,horario:e.target.value})}>{HORARIOS.map(h=><option key={h}>{h}</option>)}</select></label></div><label>Observação<textarea value={booking.observacao} onChange={e=>setBooking({...booking,observacao:e.target.value})} placeholder="Detalhes do atendimento"/></label><button className="primary full" type="submit"><CalendarDays size={18}/> Solicitar agendamento</button><small className="hint">O agendamento entra como laranja: aguardando confirmação.</small></form>
  </section>
}

function ProviderLogin({ clients, setProvider, setPage, notify }) {
  const [login, setLogin] = useState({ usuario:'', senha:'' });
  function enter(e) { e.preventDefault(); const c = clients.find(x => x.usuario === login.usuario && x.senha === login.senha); if (!c) return notify('Login ou senha do prestador inválidos.'); setProvider({ id: c.id, nomeEmpresa: c.nomeEmpresa }); setPage('providerDashboard'); notify('Login do prestador realizado.'); }
  return <section className="auth-page"><form className="auth-card glass" onSubmit={enter}><span className="badge"><Store size={16}/> Área do prestador</span><h1>Login exclusivo da empresa/autônomo</h1><p>Esse painel é separado da página principal. Cada cliente acessa somente seu próprio dashboard.</p><label>Usuário<input value={login.usuario} onChange={e=>setLogin({...login,usuario:e.target.value})} placeholder="bella ou prime"/></label><label>Senha<input type="password" value={login.senha} onChange={e=>setLogin({...login,senha:e.target.value})} placeholder="123456"/></label><button className="primary full"><LogIn size={18}/> Entrar no dashboard</button><small className="hint">Exemplo: bella / 123456 ou prime / 123456</small></form></section>
}

function SupportLogin({ setSupport, setPage, notify }) {
  const [login, setLogin] = useState({ usuario:'', senha:'' });
  function enter(e) { e.preventDefault(); if (login.usuario !== SUPORTE_USER || login.senha !== SUPORTE_PASS) return notify('Login de suporte inválido.'); setSupport(true); setPage('supportDashboard'); notify('Área de suporte acessada.'); }
  return <section className="auth-page support-bg"><form className="auth-card glass" onSubmit={enter}><span className="badge"><Headphones size={16}/> Área de suporte</span><h1>Painel administrativo do dono do SaaS</h1><p>Aqui você cria os logins dos seus clientes, empresas e autônomos.</p><label>Usuário<input value={login.usuario} onChange={e=>setLogin({...login,usuario:e.target.value})} placeholder="suporte"/></label><label>Senha<input type="password" value={login.senha} onChange={e=>setLogin({...login,senha:e.target.value})} placeholder="123456"/></label><button className="primary full"><KeyRound size={18}/> Entrar no suporte</button><small className="hint">Usuário: suporte • Senha: 123456</small></form></section>
}

function ProviderDashboard({ provider, setProvider, clients, setClients, services, setServices, appointments, setAppointments, notify }) {
  const client = clients.find(c => c.id === provider.id);
  const [company, setCompany] = useState(client);
  const [serviceForm, setServiceForm] = useState(initialService);
  const [editAppt, setEditAppt] = useState(null);
  useEffect(()=>setCompany(client), [client?.id]);
  if (!client) return <div className="empty">Cliente não encontrado.</div>;
  const myServices = services.filter(s => s.clientId === client.id);
  const myAppointments = appointments.filter(a => a.clientId === client.id);
  const stats = { total: myAppointments.length, pendentes: myAppointments.filter(a=>a.status==='Aguardando confirmação').length, confirmados: myAppointments.filter(a=>a.status==='Confirmado').length };
  function saveCompany(e) { e.preventDefault(); setClients(prev=>prev.map(c=>c.id===client.id?company:c)); setProvider({ id: company.id, nomeEmpresa: company.nomeEmpresa }); notify('Dados da empresa atualizados.'); }
  function updateBanner(index, field, value) { setCompany(prev=>({...prev,banners:prev.banners.map((b,i)=>i===index?{...b,[field]:value}:b)})); }
  function saveService(e) { e.preventDefault(); if (!serviceForm.nome || !serviceForm.valor) return notify('Informe nome e valor.'); if (serviceForm.id) setServices(prev=>prev.map(s=>s.id===serviceForm.id?{...serviceForm, clientId: client.id}:s)); else setServices(prev=>[{...serviceForm,id:crypto.randomUUID(),clientId:client.id},...prev]); setServiceForm(initialService); notify('Serviço/produto salvo.'); }
  function confirm(id) { setAppointments(prev=>prev.map(a=>a.id===id?{...a,status:'Confirmado'}:a)); notify('Agendamento confirmado.'); }
  function remove(id) { setAppointments(prev=>prev.filter(a=>a.id!==id)); notify('Agendamento removido.'); }
  function saveAppt(e) { e.preventDefault(); setAppointments(prev=>prev.map(a=>a.id===editAppt.id?editAppt:a)); setEditAppt(null); notify('Agendamento editado.'); }
  function removeService(id) { setServices(prev=>prev.filter(s=>s.id!==id)); notify('Serviço removido.'); }
  return <section className="dashboard-page">
    <div className="dashboard-header glass"><div><span>Dashboard do cliente</span><h1>{client.nomeEmpresa}</h1><p>Gerencie sua vitrine, serviços, banners, WhatsApp e agendamentos.</p></div><button className="secondary" onClick={()=>setProvider(null)}><LogOut size={18}/> Sair</button></div>
    <section className="stats"><Stat icon={<CalendarDays/>} label="Total" value={stats.total}/><Stat icon={<Clock/>} label="Pendentes" value={stats.pendentes}/><Stat icon={<ShieldCheck/>} label="Confirmados" value={stats.confirmados}/></section>
    <div className="admin-grid">
      <div className="admin-card glass wide"><h3><Clock/> Agendamentos recebidos</h3><div className="appointments admin-list">{myAppointments.length===0 && <div className="empty">Nenhum agendamento recebido.</div>}{myAppointments.map(a=><AppointmentCard key={a.id} a={a} onConfirm={confirm} onRemove={remove} onEdit={setEditAppt}/>)}</div></div>
      <form className="admin-card glass" onSubmit={saveCompany}><h3><Palette/> Personalização da vitrine</h3><label>Nome da empresa<input value={company.nomeEmpresa} onChange={e=>setCompany({...company,nomeEmpresa:e.target.value})}/></label><label>Segmento<input value={company.segmento} onChange={e=>setCompany({...company,segmento:e.target.value})}/></label><label>Descrição<textarea value={company.descricao} onChange={e=>setCompany({...company,descricao:e.target.value})}/></label><label>WhatsApp do prestador<input value={company.whatsappEmpresa} onChange={e=>setCompany({...company,whatsappEmpresa:e.target.value})} placeholder="92999999999"/></label><label className="upload"><Upload/> Inserir logo<input type="file" accept="image/*" onChange={e=>fileToImageData(e.target.files[0],(url,info)=>setCompany({...company,logo:url,logoInfo:info}))}/></label>{company.logoInfo && <ImageResolution info={company.logoInfo} ideal="Logo recomendada: 1000 x 1000 px em PNG. A moldura usa preenchimento total com object-fit: cover."/>}<div className="logo-preview-wrap"><LogoBox logo={company.logo} large/><span>A logo preenche a moldura sem deixar borda branca.</span></div><div className="color-row"><label>Primária<input type="color" value={company.corPrimaria} onChange={e=>setCompany({...company,corPrimaria:e.target.value})}/></label><label>Secundária<input type="color" value={company.corSecundaria} onChange={e=>setCompany({...company,corSecundaria:e.target.value})}/></label><label>Destaque<input type="color" value={company.corDestaque} onChange={e=>setCompany({...company,corDestaque:e.target.value})}/></label></div><button className="primary full"><Save size={18}/> Salvar vitrine</button></form>
      <form className="admin-card glass" onSubmit={saveService}><h3><Plus/> {serviceForm.id?'Editar':'Inserir'} produto/serviço</h3><label>Nome<input value={serviceForm.nome} onChange={e=>setServiceForm({...serviceForm,nome:e.target.value})}/></label><div className="two-cols"><label>Valor<input value={serviceForm.valor} onChange={e=>setServiceForm({...serviceForm,valor:e.target.value})}/></label><label>Categoria<input value={serviceForm.categoria} onChange={e=>setServiceForm({...serviceForm,categoria:e.target.value})}/></label></div><label>Descrição<textarea value={serviceForm.descricao} onChange={e=>setServiceForm({...serviceForm,descricao:e.target.value})}/></label><label className="upload"><ImageIcon/> Foto opcional<input type="file" accept="image/*" onChange={e=>fileToImageData(e.target.files[0],(url,info)=>setServiceForm({...serviceForm,imagem:url,imageInfo:info}))}/></label>{serviceForm.imageInfo && <ImageResolution info={serviceForm.imageInfo} ideal="Serviço recomendado: 1080 x 1080 px ou 1200 x 800 px."/>}{serviceForm.imagem && <img className="thumb" src={serviceForm.imagem}/>}<button className="primary full"><Save size={18}/> Salvar item</button>{serviceForm.id && <button type="button" className="secondary full gap-top" onClick={()=>setServiceForm(initialService)}>Cancelar edição</button>}<div className="mini-services">{myServices.map(s=><span key={s.id}>{s.nome}<button type="button" onClick={()=>setServiceForm(s)}><Edit3 size={14}/></button><button type="button" onClick={()=>removeService(s.id)}><Trash2 size={14}/></button></span>)}</div></form>
      <div className="admin-card glass"><h3><Megaphone/> Banners promocionais</h3>{company.banners.map((b,i)=><div className="banner-editor" key={i}><label>Título<input value={b.titulo} onChange={e=>updateBanner(i,'titulo',e.target.value)}/></label><label>Texto<textarea value={b.texto} onChange={e=>updateBanner(i,'texto',e.target.value)}/></label><label className="upload"><Upload/> Imagem do banner<input type="file" accept="image/*" onChange={e=>fileToImageData(e.target.files[0],(url,info)=>{updateBanner(i,'imagem',url); updateBanner(i,'imageInfo',info);})}/></label>{b.imageInfo && <ImageResolution info={b.imageInfo} ideal="Banner recomendado: 1600 x 600 px ou 1920 x 720 px."/>}</div>)}<button className="primary full" onClick={saveCompany}><Save size={18}/> Salvar banners</button></div>
    </div>
    {editAppt && <EditAppointmentModal item={editAppt} setItem={setEditAppt} onSave={saveAppt} services={myServices}/>} 
  </section>
}

function SupportDashboard({ clients, setClients, services, appointments, notify, adSlots, setAdSlots }) {
  const [form, setForm] = useState(emptyClient); const [editing, setEditing] = useState(null);
  function save(e) { e.preventDefault(); if (!form.nomeEmpresa || !form.usuario || !form.senha) return notify('Informe nome da empresa, usuário e senha.'); if (editing) { setClients(prev=>prev.map(c=>c.id===editing?{...form,id:editing}:c)); notify('Cliente atualizado.'); } else { setClients(prev=>[{...form,id:crypto.randomUUID()},...prev]); notify('Cliente criado com login próprio.'); } setForm(emptyClient); setEditing(null); }
  function edit(c) { setEditing(c.id); setForm(c); }
  function remove(id) { setClients(prev=>prev.filter(c=>c.id!==id)); notify('Cliente removido da vitrine.'); }
  function copyAccess(c) { navigator.clipboard?.writeText(`Login do prestador\nEmpresa: ${c.nomeEmpresa}\nUsuário: ${c.usuario}\nSenha: ${c.senha}`); notify('Dados de acesso copiados.'); }
  function addVideos(slotId, files) { filesToVideoData(files, videos => { setAdSlots(prev => prev.map(slot => slot.id === slotId ? {...slot, videos:[...slot.videos, ...videos]} : slot)); notify(`${videos.length} vídeo(s) adicionado(s) ao carrossel.`); }, notify); }
  function removeAdVideo(slotId, videoId) { setAdSlots(prev => prev.map(slot => slot.id === slotId ? {...slot, videos:slot.videos.filter(video => video.id !== videoId)} : slot)); notify('Vídeo removido do carrossel.'); }
  function updateAdSlot(slotId, field, value) { setAdSlots(prev => prev.map(slot => slot.id === slotId ? {...slot, [field]:value} : slot)); }
  return <section className="dashboard-page"><div className="dashboard-header glass"><div><span>Área de suporte</span><h1>Gerenciar clientes do SaaS</h1><p>Crie os acessos das empresas/autônomos que vão alugar o sistema.</p></div></div><section className="stats"><Stat icon={<Users/>} label="Clientes" value={clients.length}/><Stat icon={<PackageCheck/>} label="Itens cadastrados" value={services.length}/><Stat icon={<CalendarDays/>} label="Agendamentos" value={appointments.length}/></section><div className="admin-grid"><form className="admin-card glass" onSubmit={save}><h3><Plus/> {editing?'Editar cliente':'Criar login do cliente'}</h3><label>Nome da empresa/autônomo<input value={form.nomeEmpresa} onChange={e=>setForm({...form,nomeEmpresa:e.target.value})}/></label><label>Segmento<input value={form.segmento} onChange={e=>setForm({...form,segmento:e.target.value})}/></label><label>WhatsApp<input value={form.whatsappEmpresa} onChange={e=>setForm({...form,whatsappEmpresa:e.target.value})}/></label><div className="two-cols"><label>Usuário<input value={form.usuario} onChange={e=>setForm({...form,usuario:e.target.value})}/></label><label>Senha<input value={form.senha} onChange={e=>setForm({...form,senha:e.target.value})}/></label></div><label>Descrição<textarea value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})}/></label><button className="primary full"><Save size={18}/> Salvar cliente</button>{editing && <button type="button" className="secondary full gap-top" onClick={()=>{setEditing(null); setForm(emptyClient)}}>Cancelar edição</button>}</form><div className="admin-card glass wide"><h3><LayoutDashboard/> Clientes cadastrados</h3><div className="client-table">{clients.map(c=><div className="client-row" key={c.id}><LogoBox logo={c.logo}/><div><b>{c.nomeEmpresa}</b><small>{c.segmento}</small><small>Login: {c.usuario} • Senha: {c.senha}</small></div><button onClick={()=>copyAccess(c)}><Copy size={16}/> Copiar</button><button onClick={()=>edit(c)}><Edit3 size={16}/> Editar</button><button className="delete" onClick={()=>remove(c.id)}><Trash2 size={16}/> Remover</button></div>)}</div></div><div className="admin-card glass wide"><h3><Megaphone/> Espaços publicitários em vídeo</h3><p className="muted">Envie vários vídeos em cada espaço. Eles serão reproduzidos em sequência e reiniciarão automaticamente ao final.</p><div className="ad-admin-grid">{adSlots.map(slot=><div className="ad-editor" key={slot.id}><label>Título<input value={slot.titulo} onChange={e=>updateAdSlot(slot.id,'titulo',e.target.value)}/></label><label>Chamada comercial<input value={slot.subtitulo} onChange={e=>updateAdSlot(slot.id,'subtitulo',e.target.value)}/></label><label className="upload ad-upload"><Upload/> Adicionar vídeos ao carrossel<input type="file" accept="video/*" multiple onChange={e=>{addVideos(slot.id,e.target.files);e.target.value=''}}/></label><small className="hint">Formatos recomendados: MP4/WebM, vertical ou horizontal, até 4 MB por arquivo.</small><VideoAdCarousel slot={slot} preview/>{slot.videos.length>0 && <div className="video-admin-list">{slot.videos.map((video,index)=><div key={video.id}><span><b>{index+1}. {video.nome}</b><small>{video.sizeKb} KB</small></span><button className="delete" onClick={()=>removeAdVideo(slot.id,video.id)}><Trash2 size={15}/> Remover</button></div>)}</div>}</div>)}</div></div></div></section>
}


function VideoAdCarousel({ slot, preview=false }) {
  const [current, setCurrent] = useState(0);
  const videos = slot.videos || [];
  useEffect(() => { if (current >= videos.length) setCurrent(0); }, [videos.length, current]);
  function nextVideo() { setCurrent(index => videos.length ? (index + 1) % videos.length : 0); }
  return <article className={`video-ad-card ${preview?'preview':''}`}>
    <div className="video-ad-head"><span><Megaphone size={15}/> PUBLICIDADE</span>{videos.length>1 && <small>{current+1}/{videos.length}</small>}</div>
    <div className="video-stage">
      {videos.length ? <video key={videos[current]?.id} src={videos[current]?.url} autoPlay muted playsInline controls={preview} onEnded={nextVideo} onError={nextVideo}/> : <div className="video-placeholder"><div className="ad-pulse"><Megaphone size={34}/></div><strong>{slot.titulo}</strong><p>{slot.subtitulo}</p><span>Anuncie aqui</span></div>}
      {videos.length>1 && <div className="video-dots">{videos.map((video,index)=><button key={video.id} aria-label={`Exibir vídeo ${index+1}`} className={index===current?'active':''} onClick={()=>setCurrent(index)}/>)}</div>}
    </div>
    <div className="video-ad-copy"><strong>{slot.titulo}</strong><p>{slot.subtitulo}</p><span>Espaço disponível para locação</span></div>
  </article>;
}

function AppointmentCard({ a, onConfirm, onRemove, onEdit }) {
  const ok = a.status === 'Confirmado';
  const msg = `Olá ${a.nome}, seu agendamento para ${a.servicoNome} foi CONFIRMADO para ${formatDate(a.data)} às ${a.horario}. Obrigado pela preferência!`;
  return <div className={`appointment ${ok?'ok':'wait'}`}><div className="avatar"><UserRound/></div><div className="appointment-info"><b>{a.nome}</b><span>{a.servicoNome} • R$ {a.servicoValor}</span><small>{formatDate(a.data)} às {a.horario} • WhatsApp: {a.telefone}</small>{a.observacao && <em>{a.observacao}</em>}<strong className="status-pill">{a.status}</strong></div><div className="appointment-actions">{!ok && <button className="confirm" onClick={()=>onConfirm(a.id)}><CheckCircle2 size={16}/> Confirmar</button>}<a className="zap" href={waLink(a.telefone,msg)} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a><button onClick={()=>onEdit(a)}><Edit3 size={16}/> Editar</button><button className="delete" onClick={()=>onRemove(a.id)}><Trash2 size={16}/> Remover</button></div></div>
}

function EditAppointmentModal({ item, setItem, onSave, services }) {
  function setService(id) { const s=services.find(x=>x.id===id); setItem({...item,serviceId:id,servicoNome:s?.nome||item.servicoNome,servicoValor:s?.valor||item.servicoValor}); }
  return <div className="modal-backdrop"><form className="modal glass" onSubmit={onSave}><div className="modal-head"><h3><Edit3/> Editar agendamento</h3><button type="button" onClick={()=>setItem(null)}><XCircle/></button></div><label>Nome<input value={item.nome} onChange={e=>setItem({...item,nome:e.target.value})}/></label><label>WhatsApp<input value={item.telefone} onChange={e=>setItem({...item,telefone:e.target.value})}/></label><label>Serviço<select value={item.serviceId} onChange={e=>setService(e.target.value)}>{services.map(s=><option key={s.id} value={s.id}>{s.nome} - R$ {s.valor}</option>)}</select></label><div className="two-cols"><label>Data<input type="date" value={item.data} onChange={e=>setItem({...item,data:e.target.value})}/></label><label>Horário<select value={item.horario} onChange={e=>setItem({...item,horario:e.target.value})}>{HORARIOS.map(h=><option key={h}>{h}</option>)}</select></label></div><label>Status<select value={item.status} onChange={e=>setItem({...item,status:e.target.value})}><option>Aguardando confirmação</option><option>Confirmado</option></select></label><label>Observação<textarea value={item.observacao} onChange={e=>setItem({...item,observacao:e.target.value})}/></label><button className="primary full"><Save size={18}/> Salvar edição</button></form></div>
}
function LogoBox({ logo, large=false }) { return <div className={large?'logo-frame large':'logo-frame'}>{logo ? <img src={logo}/> : <CalendarDays size={large?34:24}/>}</div>; }
function ImageResolution({ info, ideal }) { if (!info) return null; return <div className="resolution-box"><b>Resolução enviada: {info.width} x {info.height} px</b><span>{info.name} • {info.sizeKb} KB • {info.type}</span><small>{ideal}</small></div>; }
function Stat({ icon, label, value }) { return <div className="stat glass"><div>{icon}</div><span>{label}</span><b>{value}</b></div>; }
function Step({ n, title, text }) { return <div className="step glass"><strong>{n}</strong><h3>{title}</h3><p>{text}</p></div>; }

createRoot(document.getElementById('root')).render(<App />);
