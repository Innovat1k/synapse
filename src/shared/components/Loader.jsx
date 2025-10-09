import React from "react";
// Vous pouvez ajouter une icône LuNetwork si vous le souhaitez,
// mais ce loader est purement basé sur des formes.

function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm">
      <div className="flex space-x-3 p-4 rounded-lg bg-gray-800 bg-opacity-90 shadow-2xl">
        {/* Premier point : Cyan */}
        <div
          className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse"
          style={{ animationDelay: "0s" }}
        ></div>

        {/* Deuxième point : Indigo (Couleur centrale) */}
        <div
          className="w-4 h-4 bg-indigo-400 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        ></div>

        {/* Troisième point : Fuchsia */}
        <div
          className="w-4 h-4 bg-fuchsia-400 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>{" "}
    </div>
  );
}

export default Loader;
