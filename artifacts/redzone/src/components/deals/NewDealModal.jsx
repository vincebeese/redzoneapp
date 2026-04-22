import { useState } from 'react';

export default function NewDealModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    zone: 'yellow',
    deal_value: '',
    close_date: '',
    notes: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onCreate({
      ...formData,
      deal_value: formData.deal_value ? parseFloat(formData.deal_value) : null,
      close_date: formData.close_date || null,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-rzs-charcoal">New Deal</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Deal Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deal Name <span className="text-rzs-red">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g., Q2 Enterprise Agreement"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="input-field"
              placeholder="e.g., Acme Corp"
            />
          </div>

          {/* Zone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deal Zone <span className="text-rzs-red">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['yellow', 'green', 'red'].map((zone) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setFormData({ ...formData, zone })}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.zone === zone
                      ? zone === 'yellow'
                        ? 'border-zone-yellow bg-yellow-50'
                        : zone === 'green'
                        ? 'border-zone-green bg-green-50'
                        : 'border-zone-red bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <span className={`inline-block w-4 h-4 rounded-full bg-zone-${zone}`} />
                    <p className="text-sm font-medium mt-1 capitalize">{zone}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formData.zone === 'yellow' && 'Qualification — validate fit and pain'}
              {formData.zone === 'green' && 'Momentum — build alignment and expand access'}
              {formData.zone === 'red' && 'Closing — eliminate friction and close'}
            </p>
          </div>

          {/* Deal Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deal Value (optional)
            </label>
            <div className="flex items-stretch border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-rzs-red focus-within:border-transparent">
              <span className="flex items-center px-3 bg-gray-50 border-r border-gray-300 text-gray-500 font-medium text-sm select-none">
                $
              </span>
              <input
                type="number"
                value={formData.deal_value}
                onChange={(e) => setFormData({ ...formData, deal_value: e.target.value })}
                className="flex-1 px-3 py-2 text-sm focus:outline-none bg-white"
                placeholder="0"
              />
            </div>
          </div>

          {/* Close Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Close Date (optional)
            </label>
            <input
              type="date"
              value={formData.close_date}
              onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Deal Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deal Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field resize-none"
              placeholder="Where is this deal right now? What's happened so far, who have you spoken to, what's the current situation?"
              rows={4}
              maxLength={2000}
            />
            <p className="text-xs text-gray-400 mt-1">
              The coach reads these notes before your first message and starts with full context.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={!formData.name.trim()}
            >
              Create Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
