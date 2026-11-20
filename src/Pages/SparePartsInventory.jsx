import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Plus,
  Edit3,
  Eye,
  RotateCcw,
  X,
  MapPin,
} from 'lucide-react';

const getStockStatus = (availableStock, minThreshold) => {
  if (Number(availableStock) <= 0) return 'Out of Stock';
  if (Number(availableStock) < Number(minThreshold)) return 'Low Stock';
  return 'In Stock';
};

const statusBadgeStyle = (status) => {
  switch (status) {
    case 'In Stock':
      return 'bg-[#e8f8ef] text-[#15803d]';
    case 'Low Stock':
      return 'bg-[#fff4e5] text-[#c2410c]';
    case 'Out of Stock':
      return 'bg-[#feeceb] text-[#b91c1c]';
    default:
      return 'bg-[#eef4ff] text-[#0b57d0]';
  }
};

const statusDotStyle = (status) => {
  switch (status) {
    case 'In Stock':
      return 'bg-[#16a34a]';
    case 'Low Stock':
      return 'bg-[#ea580c]';
    case 'Out of Stock':
      return 'bg-[#dc2626]';
    default:
      return 'bg-[#0b57d0]';
  }
};

const SparePartsInventory = ({
  spareParts = [],
  stockLedger = [],
  onSaveSparePart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [machineFilter, setMachineFilter] = useState('All Machines');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [binFilter, setBinFilter] = useState('All Bins');

  // Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPartDetails, setSelectedPartDetails] = useState(null);

  const [formData, setFormData] = useState({
    partCode: '',
    description: '',
    compatibleMachine: 'IMM-01 / IMM-02 (Toshiba & Sumitomo)',
    binLocation: 'Rack A-01',
    availableStock: 10,
    minThreshold: 5,
    unit: 'pcs',
  });

  // Dynamically derive stock status for every item
  const partsWithStatus = spareParts.map((part) => ({
    ...part,
    stockStatus: getStockStatus(part.availableStock, part.minThreshold),
  }));

  // Unique Filter Options
  const machineOptions = [
    'All Machines',
    ...Array.from(new Set(partsWithStatus.map((p) => p.compatibleMachine))),
  ];
  const binOptions = [
    'All Bins',
    ...Array.from(new Set(partsWithStatus.map((p) => p.binLocation))),
  ];

  // Filtered Spare Parts
  const filteredParts = partsWithStatus.filter((part) => {
    const matchesSearch =
      !searchQuery.trim() ||
      part.partCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMachine =
      machineFilter === 'All Machines' || part.compatibleMachine === machineFilter;
    const matchesStatus =
      statusFilter === 'All Status' || part.stockStatus === statusFilter;
    const matchesBin =
      binFilter === 'All Bins' || part.binLocation === binFilter;

    return matchesSearch && matchesMachine && matchesStatus && matchesBin;
  });

  // Low Stock / Out of Stock items for automatic warning banner
  const criticalParts = partsWithStatus.filter(
    (p) => p.stockStatus === 'Low Stock' || p.stockStatus === 'Out of Stock'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setMachineFilter('All Machines');
    setStatusFilter('All Status');
    setBinFilter('All Bins');
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setFormData({
      partCode: `SP-${500 + spareParts.length + 1}`,
      description: '',
      compatibleMachine: 'IMM-01 / IMM-04 (Toshiba Series)',
      binLocation: 'Rack B-04',
      availableStock: 12,
      minThreshold: 5,
      unit: 'pcs',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (part) => {
    setIsEditMode(true);
    setFormData({
      partCode: part.partCode,
      description: part.description,
      compatibleMachine: part.compatibleMachine,
      binLocation: part.binLocation,
      availableStock: part.availableStock,
      minThreshold: part.minThreshold,
      unit: part.unit || 'pcs',
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSaveSparePart) {
      onSaveSparePart(
        {
          ...formData,
          availableStock: Math.max(0, Number(formData.availableStock)),
          minThreshold: Math.max(1, Number(formData.minThreshold)),
        },
        isEditMode
      );
    }
    setIsFormModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Automatic Low-Stock / Reorder Threshold Alert Banner */}
      {criticalParts.length > 0 && (
        <section className="bg-[#fff4e5] border border-[#fed7aa] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#9a3412]">
                Automatic Low Stock Warning ({criticalParts.length} Item
                {criticalParts.length > 1 ? 's' : ''} Below Minimum Reorder Threshold)
              </h4>
              <p className="text-xs text-[#c2410c] mt-0.5 leading-relaxed">
                {criticalParts
                  .map(
                    (p) =>
                      `${p.partCode} (${p.description}: ${p.availableStock}/${p.minThreshold} ${p.unit})`
                  )
                  .join(' • ')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStatusFilter('Low Stock')}
            className="px-3.5 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shrink-0 cursor-pointer self-start sm:self-center"
          >
            Filter Low Stock
          </button>
        </section>
      )}

      {/* Search & Filters Section */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 flex-1">
            {/* Search by Part Code or Part Description */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Search Spare Part
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Part code or description..."
                  className="w-full h-10 pl-9 pr-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-medium text-[#0f172a] placeholder-[#64748b] focus:outline-none focus:bg-white focus:border-[#0b57d0]"
                />
              </div>
            </div>

            {/* Filter by Compatible Machine */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Compatible Machine / Tool
              </label>
              <select
                value={machineFilter}
                onChange={(e) => setMachineFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {machineOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Stock Status */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Stock Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {['All Status', 'In Stock', 'Low Stock', 'Out of Stock'].map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Bin Location */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Bin Location
              </label>
              <select
                value={binFilter}
                onChange={(e) => setBinFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {binOptions.map((bin) => (
                  <option key={bin} value={bin}>
                    {bin}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleResetFilters}
              className="h-10 px-4 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="h-10 px-4 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Spare Part</span>
            </button>
          </div>
        </div>
      </section>

      {/* Spare Parts Inventory Table */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">Spare Parts Inventory</h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Live maintenance store catalog — connected with PM Checklist for automatic stock deduction
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#eef4ff] text-[#0b57d0] text-xs font-bold self-start sm:self-auto">
            {filteredParts.length} Parts Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Part Code</th>
                <th className="py-3.5 px-5">Part Description</th>
                <th className="py-3.5 px-5">Compatible Machine / Tool</th>
                <th className="py-3.5 px-5">Bin Location</th>
                <th className="py-3.5 px-5">Available Quantity</th>
                <th className="py-3.5 px-5">Min Reorder Qty</th>
                <th className="py-3.5 px-5">Stock Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13.5px]">
              {filteredParts.map((part) => (
                <tr key={part.partCode} className="hover:bg-[#f8fafc]/80 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-[#0b57d0] whitespace-nowrap">
                    {part.partCode}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-[#0f172a] whitespace-nowrap">
                    {part.description}
                  </td>
                  <td className="py-3.5 px-5 text-[#475569] whitespace-nowrap">
                    {part.compatibleMachine}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-bold">
                      <MapPin className="w-3 h-3 text-[#0b57d0]" />
                      {part.binLocation}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-extrabold text-[#0f172a] whitespace-nowrap">
                    {part.availableStock} {part.unit}
                  </td>
                  <td className="py-3.5 px-5 text-[#64748b] font-semibold whitespace-nowrap">
                    {part.minThreshold} {part.unit}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusBadgeStyle(
                        part.stockStatus
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusDotStyle(
                          part.stockStatus
                        )}`}
                      />
                      {part.stockStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPartDetails(part)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#f3f6fb] hover:bg-[#e2e8f0] text-[#334155] text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(part)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredParts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm text-[#64748b]">
                    No spare parts match your current search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal 1: Add / Edit Spare Part Form */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_20px_50px_rgba(15,23,42,0.18)] w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#edf1f7] flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0f172a]">
                  {isEditMode ? `Edit Spare Part (${formData.partCode})` : 'Add New Spare Part'}
                </h3>
                <p className="text-xs text-[#64748b]">
                  {isEditMode
                    ? 'Update stock quantities, bin location, or minimum reorder thresholds'
                    : 'Register a new spare part SKU into plant maintenance inventory'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">Part Code</label>
                  <input
                    type="text"
                    value={formData.partCode}
                    disabled={isEditMode}
                    onChange={(e) => setFormData({ ...formData, partCode: e.target.value })}
                    placeholder="e.g. SP-501"
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] disabled:opacity-60 focus:outline-none focus:border-[#0b57d0]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">Bin Location</label>
                  <input
                    type="text"
                    value={formData.binLocation}
                    onChange={(e) => setFormData({ ...formData, binLocation: e.target.value })}
                    placeholder="e.g. Rack A-02"
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1.5">Part Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter spare part or consumable name..."
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Compatible Machine / Tool
                </label>
                <input
                  type="text"
                  value={formData.compatibleMachine}
                  onChange={(e) =>
                    setFormData({ ...formData, compatibleMachine: e.target.value })
                  }
                  placeholder="e.g. IMM-01 / IMM-04 (Toshiba Series)"
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.availableStock}
                    onChange={(e) =>
                      setFormData({ ...formData, availableStock: e.target.value })
                    }
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Minimum Reorder Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minThreshold}
                    onChange={(e) =>
                      setFormData({ ...formData, minThreshold: e.target.value })
                    }
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
                >
                  {isEditMode ? 'Update Spare Part' : 'Save Spare Part'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: View Spare Part Details */}
      {selectedPartDetails && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_20px_50px_rgba(15,23,42,0.18)] w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#edf1f7] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                  {selectedPartDetails.partCode}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadgeStyle(
                    selectedPartDetails.stockStatus
                  )}`}
                >
                  {selectedPartDetails.stockStatus}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPartDetails(null)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <p className="text-[#64748b] font-medium">Part Description</p>
                <h4 className="text-base font-extrabold text-[#0f172a] mt-0.5">
                  {selectedPartDetails.description}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                <div>
                  <p className="text-[#64748b]">Compatible Machine / Tool</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {selectedPartDetails.compatibleMachine}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Bin Location</p>
                  <p className="font-bold text-[#0b57d0] mt-0.5">
                    {selectedPartDetails.binLocation}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Available Quantity</p>
                  <p className="text-sm font-extrabold text-[#0f172a] mt-0.5">
                    {selectedPartDetails.availableStock} {selectedPartDetails.unit}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Minimum Reorder Quantity</p>
                  <p className="text-sm font-extrabold text-[#475569] mt-0.5">
                    {selectedPartDetails.minThreshold} {selectedPartDetails.unit}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const partToEdit = selectedPartDetails;
                    setSelectedPartDetails(null);
                    handleOpenEditModal(partToEdit);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#eef4ff] text-[#0b57d0] font-bold hover:bg-[#0b57d0] hover:text-white transition-colors cursor-pointer"
                >
                  Edit Part
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPartDetails(null)}
                  className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SparePartsInventory;
