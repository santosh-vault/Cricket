import React, { useState } from 'react';

export const TestModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  console.log('TestModal render - showModal:', showModal);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Modal</h1>
      
      <button 
        onClick={() => {
          console.log('Test button clicked');
          alert('Button clicked!');
          setShowModal(true);
          console.log('showModal set to true');
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Open Test Modal
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Test Modal Content</h2>
            <p className="mb-4">This is a test modal to see if modals work.</p>
            <button 
              onClick={() => setShowModal(false)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 