import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Clock,
  RefreshCw,
  Activity,
  Wrench,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Gauge,
  Thermometer,
  Zap,
  Layers,
} from 'lucide-react';

const machineProfiles = {
  'IMM-01': {
    id: 'IMM-01',
    name: 'Toshiba 180T Injection',
    line: 'Line A - Automotive',
    status: 'Running',
    runningHours: '1,420 hrs',
    cycleCounter: '148,920 shots',
    clampingForce: '180 Ton',
    screwDiameter: '45 mm',
    maxShotWeight: '310 g',
    motorRating: '37 kW Servo',
    cycleTime: '28.4 sec',
    oilTemp: '42.5 °C',
    availability: '96.4%',
    oee: '91.2%',
  },
  'IMM-02': {
    id: 'IMM-02',
    name: 'Sumitomo 220T High-Speed',
    line: 'Line A - Automotive',
    status: 'Under Scheduled PM',
    runningHours: '1,185 hrs',
    cycleCounter: '124,600 shots',
    clampingForce: '220 Ton',
    screwDiameter: '50 mm',
    maxShotWeight: '410 g',
    motorRating: '45 kW Electric',
    cycleTime: '24.0 sec',
    oilTemp: '38.0 °C',
    availability: '88.0%',
    oee: '85.5%',
  },
  'IMM-03': {
    id: 'IMM-03',
    name: 'Fanuc Roboshot 150T',
    line: 'Line A - Automotive',
    status: 'Running',
    runningHours: '1,640 hrs',
    cycleCounter: '192,400 shots',
    clampingForce: '150 Ton',
    screwDiameter: '40 mm',
    maxShotWeight: '240 g',
    motorRating: '30 kW All-Electric',
    cycleTime: '21.5 sec',
    oilTemp: '39.2 °C',
    availability: '97.8%',
    oee: '93.4%',
  },
  'IMM-04': {
    id: 'IMM-04',
    name: 'Toshiba 250T Servo',
    line: 'Line B - Interior Trim',
    status: 'Under Breakdown',
    runningHours: '980 hrs',
    cycleCounter: '94,110 shots',
    clampingForce: '250 Ton',
    screwDiameter: '55 mm',
    maxShotWeight: '540 g',
    motorRating: '48 kW Servo-Hydraulic',
    cycleTime: '32.0 sec',
    oilTemp: '46.8 °C',
    availability: '79.5%',
    oee: '76.8%',
  },
  'IMM-05': {
    id: 'IMM-05',
    name: 'Nissei 350T Precision',
    line: 'Line B - Interior Trim',
    status: 'Running',
    runningHours: '1,510 hrs',
    cycleCounter: '138,750 shots',
    clampingForce: '350 Ton',
    screwDiameter: '65 mm',
    maxShotWeight: '820 g',
    motorRating: '55 kW Hybrid',
    cycleTime: '35.2 sec',
    oilTemp: '41.0 °C',
    availability: '95.1%',
    oee: '90.0%',
  },
  'IMM-06': {
    id: 'IMM-06',
    name: 'JSW 450T Heavy Mold',
    line: 'Line C - Bumper Line',
    status: 'Running',
    runningHours: '1,890 hrs',
    cycleCounter: '165,300 shots',
    clampingForce: '450 Ton',
    screwDiameter: '75 mm',
    maxShotWeight: '1,250 g',
    motorRating: '75 kW Servo',
    cycleTime: '44.0 sec',
    oilTemp: '43.1 °C',
    availability: '94.8%',
    oee: '89.7%',
  },
  'IMM-07': {
    id: 'IMM-07',
    name: 'Engel 300T Duo',
    line: 'Line C - Bumper Line',
    status: 'Idle',
    runningHours: '760 hrs',
    cycleCounter: '72,400 shots',
    clampingForce: '300 Ton',
    screwDiameter: '60 mm',
    maxShotWeight: '700 g',
    motorRating: '52 kW Servo',
    cycleTime: '36.0 sec',
    oilTemp: '35.0 °C',
    availability: '84.2%',
    oee: '82.0%',
  },
  'IMM-08': {
    id: 'IMM-08',
    name: 'Sumitomo 180T Electric',
    line: 'Line D - Precision Gear',
    status: 'Under Breakdown',
    runningHours: '1,120 hrs',
    cycleCounter: '115,800 shots',
    clampingForce: '180 Ton',
    screwDiameter: '45 mm',
    maxShotWeight: '300 g',
    motorRating: '37 kW Electric',
    cycleTime: '23.0 sec',
    oilTemp: '44.0 °C',
    availability: '81.0%',
    oee: '78.4%',
  },
};

const maintenanceHistoryData = [
  {
    id: 'MH-101',
    date: '12 Nov 2026',
    type: 'Monthly PM',
    description: 'Replaced hydraulic return line filter element & calibrated clamping pressure.',
    technician: 'Karan Mehta',
    status: 'Completed',
  },
  {
    id: 'MH-102',
    date: '04 Nov 2026',
    type: 'Weekly PM',
    description: 'Inspected toggle pins, automatic grease lubrication check & safety door interlocks.',
    technician: 'Deepak Patel',
    status: 'Completed',
  },
  {
    id: 'MH-103',
    date: '25 Oct 2026',
    type: 'Cycle-based PM',
    description: 'Completed 100,000-shot barrel heater band resistance & thermocouple verification.',
    technician: 'Rohan Sharma',
    status: 'Completed',
  },
  {
    id: 'MH-104',
    date: '14 Oct 2026',
    type: 'Corrective Repair',
    description: 'Replaced worn nozzle heater band and cleaned mold platen cooling channels.',
    technician: 'Suresh Nair',
    status: 'Completed',
  },
];

const recentBreakdownsHistory = [
  {
    id: 'BD-2026-041',
    date: '20 Nov 2026, 10:15 AM',
    category: 'Hydraulic Pressure Drop',
    downtime: '2h 20m',
    technician: 'Suresh Nair',
    status: 'Under Repair',
  },
  {
    id: 'BD-2026-033',
    date: '08 Nov 2026, 02:15 PM',
    category: 'Heater Zone-2 Sensor Alarm',
    downtime: '1h 10m',
    technician: 'Vikram Singh',
    status: 'Resolved',
  },
  {
    id: 'BD-2026-024',
    date: '29 Oct 2026, 11:05 AM',
    category: 'Ejector Limit Switch Fault',
    downtime: '45m',
    technician: 'Amit Verma',
    status: 'Resolved',
  },
];

const statusBadgeStyle = (status) => {
  switch (status) {
    case 'Running':
      return 'bg-[#e8f8ef] text-[#15803d]';
    case 'Under Breakdown':
      return 'bg-[#feeceb] text-[#b91c1c]';
    case 'Under Scheduled PM':
      return 'bg-[#fff4e5] text-[#c2410c]';
    case 'Idle':
      return 'bg-[#f1f5f9] text-[#475569]';
    default:
      return 'bg-[#eef4ff] text-[#0b57d0]';
  }
};

const MachineDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryId = searchParams.get('id') || location.state?.machine?.id || 'IMM-01';
  const [selectedId, setSelectedId] = useState(
    machineProfiles[queryId] ? queryId : 'IMM-01'
  );

  useEffect(() => {
    if (queryId && machineProfiles[queryId]) {
      setSelectedId(queryId);
    }
  }, [queryId]);

  const machine = machineProfiles[selectedId] || machineProfiles['IMM-01'];

  const handleMachineChange = (id) => {
    setSelectedId(id);
    setSearchParams({ id });
  };

  return (
    <div className="space-y-5">
      {/* Top Bar: Back to Machine Status + Machine Selector */}
      <div className="bg-white rounded-2xl border border-[#edf1f7] p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/machines')}
            className="p-2 rounded-xl bg-[#f3f6fb] hover:bg-[#eef4ff] text-[#334155] hover:text-[#0b57d0] transition-colors cursor-pointer"
            title="Back to Machine Status"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-extrabold text-[#0b57d0] bg-[#eef4ff] px-2.5 py-0.5 rounded-lg">
                {machine.id}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                {machine.name}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadgeStyle(
                  machine.status
                )}`}
              >
                {machine.status}
              </span>
            </div>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              {machine.line} • Sanko Gosei Smart Molding Unit
            </p>
          </div>
        </div>

        {/* Switch Machine Dropdown */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs font-bold text-[#64748b] whitespace-nowrap">
            Select Machine:
          </label>
          <select
            value={selectedId}
            onChange={(e) => handleMachineChange(e.target.value)}
            className="h-9 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
          >
            {Object.values(machineProfiles).map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} — {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Telemetry & Counter KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#eef4ff] text-[#0b57d0] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#475569]">Running Hours</p>
            <h3 className="text-2xl font-extrabold text-[#0f172a] mt-0.5">
              {machine.runningHours}
            </h3>
            <p className="text-[11px] font-medium text-[#94a3b8]">Cumulative shift hours</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f3eefe] text-[#7c3aed] flex items-center justify-center shrink-0">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#475569]">Stroke / Cycle Counter</p>
            <h3 className="text-2xl font-extrabold text-[#0f172a] mt-0.5">
              {machine.cycleCounter}
            </h3>
            <p className="text-[11px] font-medium text-[#94a3b8]">PM threshold: 150,000 shots</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#e8f8ef] text-[#16a34a] flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#475569]">Machine Availability</p>
            <h3 className="text-2xl font-extrabold text-[#0f172a] mt-0.5">
              {machine.availability}
            </h3>
            <p className="text-[11px] font-medium text-[#94a3b8]">OEE Index: {machine.oee}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fff4e5] text-[#ea580c] flex items-center justify-center shrink-0">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#475569]">Avg. Cycle Time</p>
            <h3 className="text-2xl font-extrabold text-[#0f172a] mt-0.5">
              {machine.cycleTime}
            </h3>
            <p className="text-[11px] font-medium text-[#94a3b8]">Oil Temp: {machine.oilTemp}</p>
          </div>
        </div>
      </section>

      {/* Machine Specifications & Machine Status Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Machine Specifications Card (7 cols) */}
        <section className="xl:col-span-7 bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4 mb-5">
            <div>
              <h3 className="text-lg font-extrabold text-[#0f172a]">
                Machine Information &amp; Specifications
              </h3>
              <p className="text-xs font-medium text-[#64748b] mt-0.5">
                Technical parameters and factory line configuration
              </p>
            </div>
            <Cpu className="w-5 h-5 text-[#0b57d0]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
              <p className="text-xs font-medium text-[#64748b]">Machine ID</p>
              <p className="text-sm font-extrabold text-[#0b57d0] mt-1">{machine.id}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
              <p className="text-xs font-medium text-[#64748b]">Machine Name</p>
              <p className="text-sm font-extrabold text-[#0f172a] mt-1">{machine.name}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
              <p className="text-xs font-medium text-[#64748b]">Production Line</p>
              <p className="text-sm font-extrabold text-[#0f172a] mt-1">{machine.line}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
              <p className="text-xs font-medium text-[#64748b]">Clamping Force</p>
              <p className="text-sm font-extrabold text-[#0f172a] mt-1">{machine.clampingForce}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
              <p className="text-xs font-medium text-[#64748b]">Screw Diameter</p>
              <p className="text-sm font-extrabold text-[#0f172a] mt-1">{machine.screwDiameter}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
              <p className="text-xs font-medium text-[#64748b]">Max Shot Weight</p>
              <p className="text-sm font-extrabold text-[#0f172a] mt-1">{machine.maxShotWeight}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
              <p className="text-xs font-medium text-[#64748b]">Drive / Motor Rating</p>
              <p className="text-sm font-extrabold text-[#0f172a] mt-1">{machine.motorRating}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
              <p className="text-xs font-medium text-[#64748b]">Hydraulic / Barrel Temp</p>
              <p className="text-sm font-extrabold text-[#0f172a] mt-1">{machine.oilTemp}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
              <p className="text-xs font-medium text-[#64748b]">Current Operational Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${statusBadgeStyle(
                  machine.status
                )}`}
              >
                {machine.status}
              </span>
            </div>
          </div>
        </section>

        {/* Machine Status Overview / Health Diagnostics (5 cols) */}
        <section className="xl:col-span-5 bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4 mb-5">
              <div>
                <h3 className="text-lg font-extrabold text-[#0f172a]">Machine Status Overview</h3>
                <p className="text-xs font-medium text-[#64748b] mt-0.5">
                  Subsystem health &amp; stroke cycle utilization
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#eef4ff] text-[#0b57d0] text-xs font-bold">
                Live Telemetry
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-[#f4f7fb] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Thermometer className="w-4 h-4 text-[#0b57d0]" />
                  <span className="text-xs font-semibold text-[#334155]">
                    Barrel Heater Zones (1-4)
                  </span>
                </div>
                <span className="text-xs font-bold text-[#15803d] bg-[#e8f8ef] px-2.5 py-0.5 rounded-full">
                  Normal (220°C)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f4f7fb] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-[#0b57d0]" />
                  <span className="text-xs font-semibold text-[#334155]">
                    Servo Clamping Pressure
                  </span>
                </div>
                <span className="text-xs font-bold text-[#0f172a]">145 Bar • Stable</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f4f7fb] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#0b57d0]" />
                  <span className="text-xs font-semibold text-[#334155]">
                    Active Mold Tooling ID
                  </span>
                </div>
                <span className="text-xs font-bold text-[#0b57d0]">MLD-SG-204 (4-Cavity)</span>
              </div>
            </div>
          </div>

          {/* PM Cycle Progress Bar */}
          <div className="mt-5 pt-4 border-t border-[#f1f5f9]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-[#475569]">PM Stroke Counter Progress</span>
              <span className="text-[#0b57d0]">{machine.cycleCounter} / 150,000</span>
            </div>
            <div className="w-full h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
              <div className="h-full bg-[#0b57d0] rounded-full w-[92%]" />
            </div>
          </div>
        </section>
      </div>

      {/* Maintenance History & Recent Breakdown History */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Maintenance History Table (7 cols) */}
        <section className="xl:col-span-7 bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="p-6 border-b border-[#f1f5f9] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-[#0f172a]">Maintenance History</h3>
              <p className="text-xs font-medium text-[#64748b] mt-0.5">
                Preventive and corrective maintenance log for {machine.id}
              </p>
            </div>
            <Wrench className="w-5 h-5 text-[#0b57d0]" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                  <th className="py-3.5 px-5">Maintenance Date</th>
                  <th className="py-3.5 px-5">Maintenance Type</th>
                  <th className="py-3.5 px-5">Description</th>
                  <th className="py-3.5 px-5">Technician</th>
                  <th className="py-3.5 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                {maintenanceHistoryData.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f8fafc]/80 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[#0f172a] whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-[#0b57d0] whitespace-nowrap">
                      {item.type}
                    </td>
                    <td className="py-3.5 px-5 text-[#475569] max-w-xs">
                      {item.description}
                    </td>
                    <td className="py-3.5 px-5 text-[#334155] font-medium whitespace-nowrap">
                      {item.technician}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#e8f8ef] text-[#15803d]">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Breakdown History (5 cols) */}
        <section className="xl:col-span-5 bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="p-6 border-b border-[#f1f5f9] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-[#0f172a]">Recent Breakdown History</h3>
              <p className="text-xs font-medium text-[#64748b] mt-0.5">
                Past fault incidents logged on {machine.id}
              </p>
            </div>
            <AlertTriangle className="w-5 h-5 text-[#dc2626]" />
          </div>

          <div className="p-5 space-y-3">
            {recentBreakdownsHistory.map((bd) => (
              <div
                key={bd.id}
                className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7] flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#0b57d0]">{bd.id}</span>
                    <span className="text-xs font-bold text-[#0f172a]">{bd.category}</span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-1">
                    {bd.date} • Technician: <strong className="text-[#334155]">{bd.technician}</strong>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      bd.status === 'Resolved'
                        ? 'bg-[#e8f8ef] text-[#15803d]'
                        : 'bg-[#fff4e5] text-[#c2410c]'
                    }`}
                  >
                    {bd.status}
                  </span>
                  <p className="text-[11px] font-bold text-[#64748b] mt-1">
                    Downtime: {bd.downtime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MachineDetails;
