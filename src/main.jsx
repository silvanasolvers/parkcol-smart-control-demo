import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Camera,
  Car,
  Bike,
  CreditCard,
  ShieldCheck,
  Smartphone,
  BarChart3,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  ScanLine,
  ReceiptText,
  LockKeyhole,
  Crown,
  Zap,
  ArrowRight,
  Play,
  RotateCcw,
  MonitorSmartphone,
  BadgeDollarSign,
  Users,
  CalendarCheck,
  KeyRound,
} from 'lucide-react';
import './styles.css';

const money = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const initialVehicles = [
  { plate: 'PVT33F', type: 'Moto', service: 'Mensualidad', status: 'Dentro', paid: true, entry: '10:50', amount: 0, owner: 'Juan Camilo Londoño', camera: 'Ingreso 02' },
  { plate: 'HZH40F', type: 'Moto', service: 'Horas', status: 'Dentro', paid: false, entry: '09:16', amount: 9000, owner: 'Visitante', camera: 'Ingreso 01' },
  { plate: 'KXL70E', type: 'Carro', service: 'Valet', status: 'Solicitado', paid: true, entry: '08:42', amount: 18000, owner: 'Valet Parkcol', camera: 'Ingreso 03' },
  { plate: 'IXA14F', type: 'Moto', service: 'Amanecida', status: 'Dentro', paid: false, entry: '22:31', amount: 15000, owner: 'Visitante', camera: 'Ingreso 02' },
];

const cameraGrid = [
  'Ingreso motos', 'Salida motos', 'Ingreso carros', 'Salida carros', 'Caja principal',
  'Valet recepción', 'Zona R', 'Zona E', 'Amanecida', 'Perímetro'
];

const services = [
  { title: 'Mensualidad', icon: Crown, detail: '2 placas autorizadas, solo 1 adentro.', value: '58 clientes' },
  { title: 'Por horas', icon: Clock3, detail: 'Cálculo automático por tiempo real.', value: '$135k hoy' },
  { title: 'Amanecida', icon: CalendarCheck, detail: 'Tarifa nocturna y control especial.', value: '12 activas' },
  { title: 'Valet parking', icon: KeyRound, detail: 'Recepción, custodia y entrega trazable.', value: '7 solicitudes' },
  { title: 'Caja/Cierres', icon: ReceiptText, detail: '3 turnos, cierre móvil y auditoría.', value: 'Turno 02' },
];

function StatCard({ label, value, detail, icon: Icon, tone = 'blue' }) {
  return <div className={`stat-card ${tone}`}>
    <div className="stat-icon"><Icon size={20}/></div>
    <div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </div>
  </div>
}

function Pill({ children, tone = 'neutral' }) {
  return <span className={`pill ${tone}`}>{children}</span>
}

function App() {
  const [scenario, setScenario] = useState('entrada');
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [selectedPlate, setSelectedPlate] = useState('HZH40F');
  const [step, setStep] = useState(0);
  const [mobileMode, setMobileMode] = useState(false);

  const selectedVehicle = vehicles.find(v => v.plate === selectedPlate) || vehicles[0];
  const unpaid = vehicles.filter(v => !v.paid).reduce((sum, v) => sum + v.amount, 0);
  const paidToday = vehicles.filter(v => v.paid).reduce((sum, v) => sum + v.amount, 135000);
  const monthlyInside = vehicles.filter(v => v.service === 'Mensualidad' && v.status === 'Dentro').length;

  const flow = useMemo(() => {
    const flows = {
      entrada: [
        'Cámara detecta vehículo en el carril de ingreso.',
        'Smart Control toma foto de placa y la lee automáticamente.',
        'El sistema valida servicio: visitante, mensualidad, amanecida o valet.',
        'Se crea el ticket digital con QR y queda visible en caja y móvil.'
      ],
      pago: [
        'Cliente escanea QR o consulta por placa.',
        'El sistema calcula el valor exacto y muestra medios de pago.',
        'Pago aprobado: Nequi, PSE, tarjeta o Wompi.',
        'La salida queda autorizada sin depender del cajero.'
      ],
      salida: [
        'Cámara de salida lee la placa.',
        'Smart Control valida si hay pago, mensualidad activa o autorización valet.',
        'Si cumple reglas, marca salida aprobada.',
        'Si no cumple, genera alerta: pago pendiente o placa no autorizada.'
      ],
      cierre: [
        'Cajero finaliza Turno 02 desde caja.',
        'Sistema separa recaudo por horas, motos, mensualidad, valet y amanecida.',
        'Cruza efectivo vs pagos digitales y detecta diferencias.',
        'Dueño recibe cierre desde celular con trazabilidad completa.'
      ],
    };
    return flows[scenario];
  }, [scenario]);

  function simulatePayment() {
    setVehicles(prev => prev.map(v => v.plate === selectedPlate ? { ...v, paid: true, status: 'Salida autorizada' } : v));
    setScenario('salida');
    setStep(2);
  }

  function simulateEntry() {
    const exists = vehicles.some(v => v.plate === 'LPR24A');
    if (!exists) {
      setVehicles(prev => [{ plate: 'LPR24A', type: 'Moto', service: 'Mensualidad', status: 'Bloqueado', paid: true, entry: 'Ahora', amount: 0, owner: 'Mensualidad: Familia Ríos', camera: 'Ingreso 01' }, ...prev]);
      setSelectedPlate('LPR24A');
    }
    setScenario('entrada');
    setStep(2);
  }

  function resetDemo() {
    setVehicles(initialVehicles);
    setSelectedPlate('HZH40F');
    setScenario('entrada');
    setStep(0);
  }

  return <main className={mobileMode ? 'app mobile-preview' : 'app'}>
    <section className="hero">
      <nav className="topbar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <strong>Parkcol Smart Control</strong>
            <span>Demo interactivo · Sistema a la medida</span>
          </div>
        </div>
        <div className="top-actions">
          <button onClick={() => setMobileMode(!mobileMode)} className="ghost"><MonitorSmartphone size={17}/> {mobileMode ? 'Vista desktop' : 'Vista dueño móvil'}</button>
          <button onClick={resetDemo} className="ghost"><RotateCcw size={17}/> Reiniciar demo</button>
        </div>
      </nav>

      <div className="hero-grid">
        <div className="hero-copy">
          <Pill tone="gold">Operación tipo USA · diseñada para Parkcol</Pill>
          <h1>Un solo centro de control para cámaras, caja, pagos, mensualidades y salida automática.</h1>
          <p>Este demo muestra cómo Parkcol puede pasar de dos sistemas y operación manual a una plataforma propia, hecha sobre sus reglas reales: 10 cámaras, 3 turnos, mensualidades con dos placas, pico y placa, valet, amanecida y cierres desde celular.</p>
          <div className="hero-cta">
            <button onClick={simulateEntry} className="primary"><Play size={18}/> Simular ingreso con placa</button>
            <button onClick={simulatePayment} className="secondary"><CreditCard size={18}/> Simular pago y salida</button>
          </div>
        </div>
        <div className="roi-card">
          <div className="roi-header"><BadgeDollarSign/><span>Retorno operativo esperado</span></div>
          <div className="roi-number">menos fuga, más control</div>
          <p>El valor no está solo en cobrar más rápido. Está en reducir errores de digitación, cerrar turnos sin fricción, detectar diferencias y darle al dueño visibilidad diaria desde el teléfono.</p>
          <div className="roi-list">
            <span><CheckCircle2/> Control de caja por turno</span>
            <span><CheckCircle2/> Menos filas en pago</span>
            <span><CheckCircle2/> Trazabilidad por placa</span>
          </div>
        </div>
      </div>
    </section>

    <section className="dashboard-shell">
      <aside className="sidebar">
        <div className="section-label">Módulos Parkcol</div>
        {[
          ['entrada', ScanLine, 'Ingreso inteligente'],
          ['pago', CreditCard, 'Pago autoservicio'],
          ['salida', ShieldCheck, 'Salida automática'],
          ['cierre', Smartphone, 'Cierre móvil'],
        ].map(([key, Icon, label]) => <button key={key} onClick={() => { setScenario(key); setStep(0); }} className={scenario === key ? 'active nav-btn' : 'nav-btn'}><Icon size={18}/>{label}</button>)}
        <div className="sidebar-note">
          <LockKeyhole size={18}/>
          <p><strong>Reglas propias:</strong> mensualidad con 2 placas, solo 1 adentro; pico y placa configurable; 3 turnos de cajero.</p>
        </div>
      </aside>

      <div className="dashboard">
        <div className="stats-grid">
          <StatCard icon={Car} label="Carros dentro" value="10" detail="90 disponibles" />
          <StatCard icon={Bike} label="Motos dentro" value="96" detail="404 disponibles" tone="green" />
          <StatCard icon={Camera} label="Cámaras" value="10/10" detail="Ingreso, salida, valet y zonas" tone="purple" />
          <StatCard icon={BarChart3} label="Recaudo hoy" value={money.format(paidToday)} detail={`Pendiente ${money.format(unpaid)}`} tone="gold" />
        </div>

        <div className="workspace-grid">
          <section className="panel camera-panel">
            <div className="panel-head">
              <div><span className="eyebrow">Cámara LPR</span><h2>Lectura de placa en vivo</h2></div>
              <Pill tone={selectedVehicle.paid ? 'green' : selectedVehicle.status === 'Bloqueado' ? 'red' : 'orange'}>{selectedVehicle.status}</Pill>
            </div>
            <div className="camera-feed">
              <div className="scan-line" />
              <div className="plate-card">
                <span>PLACA DETECTADA</span>
                <strong>{selectedVehicle.plate}</strong>
                <small>{selectedVehicle.camera} · {selectedVehicle.type}</small>
              </div>
              <div className="camera-meta">
                <span>Foto placa guardada</span>
                <span>Confianza 98.4%</span>
              </div>
            </div>
            <div className="vehicle-summary">
              <div><span>Servicio</span><strong>{selectedVehicle.service}</strong></div>
              <div><span>Cliente</span><strong>{selectedVehicle.owner}</strong></div>
              <div><span>Entrada</span><strong>{selectedVehicle.entry}</strong></div>
              <div><span>Valor</span><strong>{selectedVehicle.amount ? money.format(selectedVehicle.amount) : 'Cubierto'}</strong></div>
            </div>
          </section>

          <section className="panel flow-panel">
            <div className="panel-head">
              <div><span className="eyebrow">Demo guiado</span><h2>{scenario === 'entrada' ? 'Ingreso inteligente' : scenario === 'pago' ? 'Pago autoservicio' : scenario === 'salida' ? 'Salida automática' : 'Cierre de caja desde celular'}</h2></div>
              <button className="mini" onClick={() => setStep((step + 1) % flow.length)}>Siguiente <ArrowRight size={15}/></button>
            </div>
            <div className="flow-steps">
              {flow.map((item, i) => <div key={item} className={i <= step ? 'flow-step done' : 'flow-step'}>
                <div className="step-index">{i + 1}</div>
                <p>{item}</p>
              </div>)}
            </div>
            <div className="smart-alert">
              <AlertTriangle size={18}/>
              {selectedVehicle.plate === 'LPR24A'
                ? <span><strong>Regla mensualidad:</strong> esta cuenta tiene dos placas, pero otra placa del mismo cliente ya está dentro. El sistema bloquea o pide autorización.</span>
                : <span><strong>Pico y placa:</strong> validación automática por último dígito y excepciones configurables para convenios, valet o autorización administrativa.</span>}
            </div>
          </section>
        </div>

        <div className="lower-grid">
          <section className="panel">
            <div className="panel-head"><div><span className="eyebrow">Operación actualizada</span><h2>Vehículos activos</h2></div><Pill>{vehicles.length} registros</Pill></div>
            <div className="table">
              {vehicles.map(v => <button key={v.plate} onClick={() => setSelectedPlate(v.plate)} className={selectedPlate === v.plate ? 'row selected' : 'row'}>
                <span className="plate-mini">{v.plate}</span>
                <span>{v.type}</span>
                <span>{v.service}</span>
                <span>{v.paid ? <Pill tone="green">Pago OK</Pill> : <Pill tone="orange">Debe {money.format(v.amount)}</Pill>}</span>
              </button>)}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head"><div><span className="eyebrow">Caja inteligente</span><h2>Turno 02</h2></div><Pill tone="green">Listo para cierre</Pill></div>
            <div className="cash-grid">
              <div><span>Horas carro</span><strong>{money.format(45000)}</strong><small>90 vehículos</small></div>
              <div><span>Horas moto</span><strong>{money.format(90000)}</strong><small>96 motos</small></div>
              <div><span>Digital</span><strong>{money.format(76000)}</strong><small>Conciliado</small></div>
              <div><span>Efectivo</span><strong>{money.format(59000)}</strong><small>Por validar</small></div>
            </div>
            <button className="full-action" onClick={() => setScenario('cierre')}>Ver cierre desde celular</button>
          </section>
        </div>
      </div>
    </section>

    <section className="services-section">
      <div className="section-title">
        <Pill tone="blue">5 vertientes Parkcol</Pill>
        <h2>El demo no muestra pantallas genéricas. Muestra la operación real del parqueadero.</h2>
      </div>
      <div className="service-grid">
        {services.map(({ title, icon: Icon, detail, value }) => <article className="service-card" key={title}>
          <Icon size={22}/>
          <strong>{title}</strong>
          <p>{detail}</p>
          <span>{value}</span>
        </article>)}
      </div>
    </section>

    <section className="closing-section">
      <div>
        <Pill tone="gold">Mensaje para dirección</Pill>
        <h2>Parkcol puede operar con menos dependencia del cajero y más trazabilidad por cada placa, peso y turno.</h2>
      </div>
      <div className="closing-grid">
        <div><Users/><strong>Dueño con control</strong><p>Reportes, cierres y alertas desde celular, sin estar sentado en caja.</p></div>
        <div><Zap/><strong>Cliente sin fila</strong><p>Pago QR/digital y salida validada automáticamente.</p></div>
        <div><ReceiptText/><strong>Caja auditable</strong><p>Turnos, recaudos, diferencias y consecutivos en una sola vista.</p></div>
      </div>
    </section>
  </main>
}

createRoot(document.getElementById('root')).render(<App />);
