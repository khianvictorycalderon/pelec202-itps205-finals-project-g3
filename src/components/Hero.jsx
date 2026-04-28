export default function Hero() {

  const handleClick = () => {
    alert("Redirecting to Global Health Data Dashboard...");
  };

  return (
    <div 
      className="h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/assets/bg-health.jpg')"
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

        <button
          onClick={handleClick}
          className="bg-teal-500 hover:bg-teal-600 px-6 py-3 rounded-full text-lg font-semibold transition duration-300"
        >
          Explore Data
        </button>
      </div>
    </div>
  );
}