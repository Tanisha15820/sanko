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
import {
  machineProfiles,
  machineMaintenanceHistory,
  machineRecentBreakdowns,
} from './machineService';
import { useMachines } from '../../context/MachineContext';
import StatusBadge from '../../components/common/StatusBadge';

const buildMachineProfile = (item) => {
  const known = machineProfiles[item.id];
  if (known) {
    return {
      ...known,
      name: item.name || known.name,
      line: item.line || known.line,
      status: item.status || known.status,
      runningHours: item.runningHours || known.runningHours,
    };
  }
  return {
    id: item.id,
    name: item.name,
    line: item.line,
    status: item.status || 'Running',
    runningHours: item.runningHours || '0 hrs',
    cycleCounter: '84,200 shots',
    clampingForce: '250 Ton',
    screwDiameter: '55 mm',
    maxShotWeight: '480 g',
    motorRating: '45 kW Servo',
    cycleTime: '29.0 sec',
    oilTemp: '41.2 °C',
    availability: '94.0%',
    oee: '89.5%',
  };
};

const MachineDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { machines } = useMachines();

  const allProfiles = machines.map(buildMachineProfile);
  const queryId = searchParams.get('id') || location.state?.machine?.id || 'IMM-01';
  const matchedProfile =
    allProfiles.find((m) => m.id === queryId) ||
    (location.state?.machine ? buildMachineProfile(location.state.machine) : null) ||
    allProfiles[0] ||
    machineProfiles['IMM-01'];
  const selectedId = matchedProfile.id;
  const machine = matchedProfile;

  const handleMachineChange = (id) => {
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
              <StatusBadge status={machine.status} className="px-2.5 py-0.5 text-xs" />
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
            {allProfiles.map((m) => (
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
              <StatusBadge status={machine.status} className="px-2.5 py-0.5 text-xs mt-1" />
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
                {machineMaintenanceHistory.map((item) => (
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
            {machineRecentBreakdowns.map((bd) => (
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
                  <StatusBadge
                    status={bd.status}
                    variant={bd.status === 'Resolved' ? 'green' : 'orange'}
                    className="px-2.5 py-0.5 text-[11px]"
                  />
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
