'use client';
const OrderItem = ({ order, setOrders }) => {
  const [updating, setUpdating] = useState(false);

  const updateStatus = async() => {
    setUpdating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders/${order.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: { status: 'Completed' }
          })
        }
      );

      if (!response.ok) throw new Error('Failed to update order');

      const updatedOrder = await response.json();

      // Update state to reflect new status
      setOrders(prevOrders =>
        prevOrders.map(o => (o.id === order.id ? updatedOrder : o))
      );
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className='p-4 bg-gray-100 rounded-md shadow'>
      <p className='font-semibold'>Order ID: {order.id}</p>
      <p>
        Status:{' '}
        <span
          className={
            order.status === 'Completed' ? 'text-green-600' : 'text-red-600'
          }
        >
          {order.status}
        </span>
      </p>
      <button
        className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400'
        onClick={updateStatus}
        disabled={order.status === 'Completed' || updating}
      >
        {updating ? 'Updating...' : 'Mark as Completed'}
      </button>
    </div>
  );
};
