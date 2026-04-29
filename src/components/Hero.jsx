import { Link } from 'react-router-dom';
import { slideToID } from '../utils';

export default function Hero() {
  return (
    <div 
      className="h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage: "url('assets/bg-health.jpg')"
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Global Health Observatory System
        </h1>

        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Access real-time health data, monitor global trends, and make informed decisions 
          to improve public health worldwide.
        </p>

        <div className="flex flex-col lg:flex-row gap-2 justify-center items-center">

          <Link
            to="/browse"
            className="cursor-pointer bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-full text-lg font-semibold transition duration-300"
          >Browse Data</Link>

          <button
            onClick={() => slideToID("statistics-section")}
            className="cursor-pointer bg-teal-600 hover:bg-teal-500 px-6 py-3 rounded-full text-lg font-semibold transition duration-300"
          >
            Explore Statistics
          </button>

        </div>
      </div>
    </div>
  );
}