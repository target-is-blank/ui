const GlassCard = () => {
  return (
    <div className="relative flex items-center justify-center w-80 h-96 bg-gradient-to-br from-gray-500 via-gray-800 to-gray-50">
      {/* Carte principale avec effet glassmorphism */}
      <div className="relative w-64 h-80 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
        {/* Contenu interne (exemple de widget de charge) */}
        <div className="flex flex-col items-center justify-center h-full text-white">
          <span className="text-4xl font-bold">40%</span>
          <span className="text-sm">Charging... 56 min left</span>
          <div className="w-24 h-2 bg-gray-300 rounded-full mt-4">
            <div className="w-1/2 h-full bg-blue-400 rounded-full"></div>
          </div>
        </div>

        {/* Effet de lueur brillante dans les coins avec pseudo-éléments */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-white/20 rounded-full blur-md"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 rounded-full blur-md"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white/20 rounded-full blur-md"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white/20 rounded-full blur-md"></div>
        </div>
      </div>
    </div>
  );
};

export default GlassCard;
