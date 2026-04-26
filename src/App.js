import React from 'react';
// Import the Navbar from where you saved it
import Navbar from './Components/Navbar'; 

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Place the Navbar at the very top */}
      <Navbar />

      {/* The rest of your page content goes here */}
      <main className="max-w-7xl mx-auto p-4 mt-8">
        <h1 className="text-3xl font-bold text-sky-900 mb-4">
          Welcome to the Observatory
        </h1>
        <p className="text-gray-700">
          Your main application content will live down here, safely below the navigation bar.
        </p>
      </main>
    </div>
  );
}

export default App;