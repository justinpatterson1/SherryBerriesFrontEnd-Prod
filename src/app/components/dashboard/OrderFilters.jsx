'use client';

const STATUSES = [
  { value: 'open', label: 'Open Orders' },
  { value: 'closed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'pending', label: 'Pending' }
];

export default function OrderFilters({ orderStatus, onChange }) {
  return (
    <div className='bg-white rounded-xl shadow-lg p-6 mb-8'>
      <h2 className='text-lg font-semibold text-gray-900 mb-4'>Filter Orders</h2>
      <div className='flex flex-wrap gap-3'>
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              orderStatus === value
                ? 'bg-brand text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
