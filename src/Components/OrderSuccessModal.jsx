import React from 'react';

const OrderSuccessModal = ({ orderDetails, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Order Placed Successfully!</h2>
            <p className="text-gray-600 mt-2">Thank you for your purchase</p>
            <p className="text-sm text-purple-600 mt-1">Order ID: #{orderDetails.orderId}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800 mb-3 border-b pb-2">Customer Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {orderDetails.customer.name}</p>
                <p><span className="font-medium">Email:</span> {orderDetails.customer.email}</p>
                <p><span className="font-medium">Phone:</span> {orderDetails.customer.phone}</p>
                <p><span className="font-medium">Address:</span> {orderDetails.customer.address}</p>
                <p><span className="font-medium">Date:</span> {orderDetails.date}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800 mb-3 border-b pb-2">Order Summary</h3>
              <div className="space-y-3">
                {orderDetails.items.map(item => (
                  <div key={item.id} className="flex justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      )}
                    </div>
                    <p className="font-medium">Rs. {item.price * item.quantity}</p>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>Rs. {orderDetails.total}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;