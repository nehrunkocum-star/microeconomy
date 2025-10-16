import React, { useState } from "react";

// -------------------------------------------------------------
// MicroEconomy — minimal playable simulation with a start screen
// (No external animation libs required.)
// -------------------------------------------------------------

const scenarios = {
  bakery: {
    name: "Neighborhood Bakery",
    description: "Manage your bakery’s pricing, supply, and reputation.",
    metrics: { cash: 100, reputation: 50, demand: 50 },
  },
  city: {
    name: "City Economy",
    description: "Control interest rates and public spending to stabilize growth.",
    metrics: { gdp: 100, inflation: 50, happiness: 50 },
  },
};

export default function App() {
  const [scenario, setScenario] = useState("bakery");
  const [turn, setTurn] = useState(1);
  const [metrics, setMetrics] = useState(scenarios.bakery.metrics);
  const [log, setLog] = useState([]);
  const [showStart, setShowStart] = useState(true); // ← new landing screen toggle

  const handleChoice = (type) => {
    let newMetrics = { ...metrics };
    let effect = "";

    if (scenario === "bakery") {
      if (type === "priceUp") {
        newMetrics.cash += 15;
        newMetrics.demand -= 10;
        effect = "Raised prices: more cash, less demand.";
      } else if (type === "ads") {
        newMetrics.cash -= 10;
        newMetrics.demand += 15;
        effect = "Invested in ads: demand rose!";
      } else {
        newMetrics.reputation += 10;
        newMetrics.demand += 5;
        effect = "Focused on quality: reputation improved!";
      }
    } else {
      if (type === "cutRates") {
        newMetrics.gdp += 15;
        newMetrics.inflation += 10;
        effect = "Cut rates: growth up, inflation rising.";
      } else if (type === "raiseRates") {
        newMetrics.gdp -= 10;
        newMetrics.inflation -= 15;
        effect = "Raised rates: slowed inflation but hurt growth.";
      } else {
        newMetrics.happiness += 10;
        newMetrics.gdp += 5;
        effect = "Invested in welfare: happiness improved.";
      }
    }

    setMetrics(newMetrics);
    setLog((prev) => [...prev, `Turn ${turn}: ${effect}`]);
    setTurn(turn + 1);
  };

  const restart = () => {
    setTurn(1);
    setMetrics(scenarios[scenario].metrics);
    setLog([]);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 flex flex-col items-center">
      {/* Landing Screen Overlay */}
      {showStart && (
        <StartScreen
          onStart={() => setShowStart(false)}
        />
      )}

      <header className="w-full max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">MicroEconomy</h1>
        <div className="flex gap-3 mb-4">
          {Object.keys(scenarios).map((key) => (
            <button
              key={key}
              onClick={() => {
                setScenario(key);
                restart();
              }}
              className={`px-4 py-2 rounded-lg border ${
                scenario === key ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              {scenarios[key].name}
            </button>
          ))}
        </div>
        <p className="text-slate-600 mb-6">{scenarios[scenario].description}</p>
      </header>

      {/* Metrics */}
      <section className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {Object.entries(metrics).map(([key, val]) => (
          <div
            key={key}
            className="rounded-xl border p-4 text-center"
          >
            <h3 className="capitalize text-lg font-semibold mb-1">{key}</h3>
            <p className="text-2xl font-bold">{val}</p>
          </div>
        ))}
      </section>

      {/* Actions */}
      <section className="w-full max-w-3xl">
        <div className="flex flex-wrap gap-3 mb-4">
          {scenario === "bakery" ? (
            <>
              <button onClick={() => handleChoice("priceUp")} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Raise Prices</button>
              <button onClick={() => handleChoice("ads")} className="px-4 py-2 rounded-lg bg-amber-500 text-white">Advertise</button>
              <button onClick={() => handleChoice("quality")} className="px-4 py-2 rounded-lg bg-violet-600 text-white">Improve Quality</button>
            </>
          ) : (
            <>
              <button onClick={() => handleChoice("cutRates")} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Cut Rates</button>
              <button onClick={() => handleChoice("raiseRates")} className="px-4 py-2 rounded-lg bg-amber-500 text-white">Raise Rates</button>
              <button onClick={() => handleChoice("welfare")} className="px-4 py-2 rounded-lg bg-violet-600 text-white">Increase Welfare</button>
            </>
          )}
        </div>
        <button onClick={restart} className="px-5 py-2 rounded-lg border">Restart</button>
      </section>

      {/* Log */}
      <section className="w-full max-w-3xl mt-8">
        <h2 className="text-xl font-semibold mb-2">Game Log</h2>
        <div className="h-40 overflow-y-auto rounded-xl border p-3 text-sm text-slate-700 bg-slate-50">
          {log.length === 0 ? <p>No turns yet — make a move.</p> : log.map((entry, i) => (<p key={i}>{entry}</p>))}
        </div>
      </section>

      <footer className="mt-10 text-slate-500 text-sm">
        © 2025 The Logic Loom | Created by Nehrun Kocum
      </footer>
    </div>
  );
}

function StartScreen({ onStart }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/80 backdrop-blur-sm p-6">
      <div className="w-full max-w-xl rounded-2xl border bg-white p-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-2">Welcome to MicroEconomy</h2>
        <p className="text-slate-600 mb-4">A tiny simulation about how small choices create big effects.</p>
        <ul className="list-disc pl-6 text-slate-700 space-y-1 mb-6">
          <li>Pick a scenario: <span className="font-medium">Bakery</span> (micro) or <span className="font-medium">City</span> (macro).</li>
          <li>Make one decision per turn; watch metrics react.</li>
          <li>Try to keep your metrics healthy across turns.</li>
        </ul>
        <div className="flex items-center gap-3">
          <button onClick={onStart} className="px-5 py-2 rounded-lg bg-black text-white">🎮 Start Simulation</button>
          <a href="#howto" onClick={onStart} className="px-5 py-2 rounded-lg border">Read How‑to</a>
        </div>
      </div>
    </div>
  );
}
