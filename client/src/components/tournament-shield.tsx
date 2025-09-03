export default function TournamentShield() {
  return (
    <div className="relative">
      <div className="w-80 h-96 bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center">
        {/* Tournament Shield */}
        <div className="w-48 h-56 bg-gradient-to-b from-gray-300 via-white to-gray-300 rounded-t-3xl rounded-b-lg relative overflow-hidden border-4 border-gray-400">
          {/* Shield Header */}
          <div className="bg-primary text-white text-center py-3 text-sm font-bold">
            <div>7° Edição</div>
            <div className="text-xs">Futebol Campo</div>
          </div>
          <div className="bg-primary text-white text-center py-2 text-xs">
            Organização Gonzaga / Celim, Vitor
          </div>
          
          {/* Red Banner */}
          <div className="bg-accent text-white text-center py-4">
            <div className="font-bold text-lg">COPA NORDESTE</div>
            <div className="text-xs">REGIONAL/FRUTAL MG</div>
            <div className="font-bold text-xl">2025</div>
          </div>
          
          {/* Shield Body with stripes */}
          <div className="flex-1 relative">
            <div className="shield-pattern h-full opacity-80"></div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 bg-white rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-6 h-6 bg-primary rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-white" style={{clipPath: "polygon(0 0, 50% 50%, 0 100%)"}}></div>
                  <div className="absolute inset-0 bg-white" style={{clipPath: "polygon(50% 50%, 100% 0, 100% 100%)"}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
