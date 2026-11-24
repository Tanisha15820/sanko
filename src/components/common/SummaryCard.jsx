
// Reusable KPI summary card used in Notifications and Escalation Management
const SummaryCard = ({ title, value, support, icon: Icon, iconBg }) => (
  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition-all flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}
    >
      <Icon className="w-6 h-6" />
    </div>

    <div className="min-w-0">
      <p className="text-[12.5px] font-semibold text-[#475569] truncate">{title}</p>
      <h3 className="text-2xl sm:text-[28px] font-extrabold text-[#0f172a] leading-tight mt-0.5 tracking-tight">
        {value}
      </h3>
      <p className="text-[11px] font-medium text-[#94a3b8] truncate mt-0.5">{support}</p>
    </div>
  </div>
);

export default SummaryCard;
