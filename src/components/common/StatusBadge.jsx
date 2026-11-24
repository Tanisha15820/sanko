
const VARIANT_STYLES = {
  green: { badge: 'bg-[#e8f8ef] text-[#15803d]', dot: 'bg-[#16a34a]' },
  red: { badge: 'bg-[#feeceb] text-[#b91c1c]', dot: 'bg-[#dc2626]' },
  orange: { badge: 'bg-[#fff4e5] text-[#c2410c]', dot: 'bg-[#ea580c]' },
  blue: { badge: 'bg-[#eef4ff] text-[#0b57d0]', dot: 'bg-[#0b57d0]' },
  slate: { badge: 'bg-[#f1f5f9] text-[#475569]', dot: 'bg-[#94a3b8]' },
};

const STATUS_TO_VARIANT = {
  // Machine statuses
  Running: 'green',
  'Under Breakdown': 'red',
  'Under Scheduled PM': 'orange',
  Idle: 'slate',
  // Breakdown & escalation statuses
  Active: 'red',
  Resolved: 'green',
  'Escalated to Top Management': 'red',
  'Under Review': 'blue',
  Pending: 'slate',
  // Production plan statuses
  Completed: 'green',
  'In Progress': 'blue',
  Scheduled: 'orange',
  // PM statuses & results
  'Due Today': 'orange',
  Overdue: 'red',
  Upcoming: 'blue',
  'Completed On Time': 'green',
  Delayed: 'orange',
  'All Passed': 'green',
  // Spare parts statuses
  'In Stock': 'green',
  'Low Stock': 'orange',
  'Out of Stock': 'red',
  // Tool statuses
  'In Press': 'green',
  'In Tool Room': 'blue',
  'Under Maintenance': 'orange',
  // Notification priorities & statuses
  Critical: 'red',
  High: 'orange',
  Medium: 'blue',
  Low: 'slate',
  Unread: 'blue',
  Read: 'slate',
};

// Reusable status / priority pill badge with optional leading dot
const StatusBadge = ({
  status,
  label,
  variant,
  showDot = false,
  className = 'px-2.5 py-1 text-xs',
}) => {
  const resolvedVariant = variant || STATUS_TO_VARIANT[status] || 'blue';
  const styles = VARIANT_STYLES[resolvedVariant] || VARIANT_STYLES.blue;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ${styles.badge} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />}
      {label || status}
    </span>
  );
};

export default StatusBadge;
