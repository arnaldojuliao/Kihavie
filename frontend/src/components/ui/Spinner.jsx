function Spinner() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex items-baseline justify-center animate-pulse">
        <h1 className="text-8xl sm:text-[200px] md:text-[500px] font-bold text-blue-800 leading-none animate-bounce">K</h1>
        <span className="text-4xl sm:text-7xl md:text-9xl font-bold leading-none animate-bounce">i</span>
      </div>
    </div>
  );
}

export default Spinner;