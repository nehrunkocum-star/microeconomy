import React, { useMemo, useState, useRef } from "react";
import "./index.css";

const scenarios = {
  bakery: {
    name: "Neighborhood Bakery",
    description: "Manage pricing, demand, and reputation.",
    metrics: { cash: 100, reputation: 50, demand: 50 },
    actions: [
      { id: "priceUp", label: "Raise Prices", color: "green" },
      { id: "ads", label: "Advertise", color: "amber" },
      { id: "quality", label: "Improve Quality", color: "violet" },
    ],
  },
  city: {
    name: "City Economy",
    description: "Balance GDP, inflation, and happiness.",
    metrics: { gdp: 100, inflation: 50, happiness: 50 },
    actions: [
      { id: "cutRates", label: "Cut Rates", color: "green" },
      { id: "raiseRates", label: "Raise Rates", color: "amber" },
      { id: "welfare", label: "Increase Welfare", color: "violet" },
    ],
  },
};

export default function App() {
  const [scenario, setScenario] = useState("bakery");
  const [turn, setTurn] = useState(1);
  const [metrics, setMetrics] = useState(scenarios.bakery.metrics);
  const [log, setLog] = useState([]);
  const [showStart, setShowStart] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [score, setScore] = useState(0);
  const [goal] = useState(200);
  const sparkleRef = useRef(null);

  // simple computed list to display metrics in order
  const metricList = useMemo(() => Object.entries(metrics), [metrics]);

  const addLog = (msg) => setLog((p) => [...p.slice(-120), `Turn ${turn}: ${msg}`]);

  function handleChoice(type) {
    let m = { ...metrics };
    let effect = "";

    if (scenario === "bakery") {
      if (type === "priceUp") {
        m.cash += 15; m.demand -= 10; effect = "Raised prices: more cash, less demand.";
      } else if (type === "ads") {
        m.cash -= 10; m.demand += 15; effect = "Invested in ads: demand rose!";
      } else {
        m.reputation += 10; m.demand += 5; effect = "Quality improved: reputation up!";
      }
    } else {
      if (type === "cutRates") {
        m.gdp += 15; m.inflation += 10; effect = "Cut rates: growth up, inflation rises.";
      } else if (type === "raiseRates") {
        m.gdp -= 10; m.inflation -= 15; effect = "Raised rates: inflation cooled, growth slowed.";
      } else {
        m.happiness += 10; m.gdp += 5; effect = "Social spending: happiness improved.";
      }
    }

    // random event spice
    const rnd = Math.random();
    if (scenario === "bakery" && rnd < 0.33) {
      m.cash -= 8; effect += " (Oven maintenance cost -8 cash)";
    } else if (scenario === "bakery" && rnd < 0.5) {
      m.reputation += 4; m.demand += 6; effect += " (Nice review +demand +reputation)";
    } else if (scenario === "city" && rnd < 0.33) {
      m.inflation += 6; effect += " (Energy shock: inflation +6)";
    } else if (scenario === "city" && rnd < 0.5) {
      m.happiness -= 6; effect += " (Transit strike: happiness -6)";
    }

    setMetrics(m);
    addLog(effect);
    setTurn((t) => t + 1);

    // score update (reward balanced metrics)
    let delta = 0;
    if (scenario === "bakery") {
      delta =
        (m.cash - 100) * 0.25 +
        (m.reputation - 50) * 0.35 +
        (m.demand - 50) * 0.35;
    } else {
      // keep inflation near 50 (neutral), push GDP & happiness up
      delta =
        (m.gdp - 100) * 0.3 +
        (50 - Math.abs(m.inflation - 50)) * 0.25 +
        (m.happiness - 50) * 0.35;
    }
    setScore((s) => {
      const next = Math.max(0, Math.round(s + delta / 6));
      if (next >= goal) shootSparkles();
      return next;
    });
  }

  function shootSparkles() {
    const el = sparkleRef.current;
    if (!el) return;
    el.innerHTML = "";
    const count = 70;
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("i");
      const x = Math.random() * w;
      const y = Math.random() * (h * 0.4) + h * 0.3;
      const dx = (Math.random() - 0.5) * 240;
      const dy = -Math.random() * 280 - 60;
      p.style.setProperty("--x", `${x}px`);
      p.style.setProperty("--y", `${y}px`);
      p.style.setProperty("--dx", `${dx}px`);
      p.style.setProperty("--dy", `${dy}px`);
      el.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }

  function restart() {
    setTurn(1);
    setMetrics(scenarios[scenario].metrics);
    setLog([]);
    setScore(0);
  }

  function switchScenario(key) {
    setScenario(key);
    setMetrics(scenarios[key].metrics);
    setTurn(1);
    setLog([]);
    setScore(0);
  }

  return (
    <div className="app">
      {/* creator badge */}
      <a className="badge" href="https://github.com/nehrunkocum-star/microeconomy" target="_blank" rel="noreferrer">
        Made by Nehrun Kocum
      </a>

      {/* start overlay */}
      {showStart && (
        <StartScreen onStart={() => setShowStart(false)} />
      )}

      {/* sparkles when player reaches goal */}
      <div className="spark" ref={sparkleRef} />

      <div className="max">
        <div className="header">
          <div>
            <h1 className="title">MicroEconomy</h1>
            <p className="subtitle">Tiny economic choices → big consequences.</p>
          </div>
          <div className="row">
            <button className="btn outline" onClick={() => setShowAbout(true)}>About</button>
            <button className="btn outline" onClick={restart}>Restart</button>
          </div>
        </div>

        {/* scenario tabs */}
        <div className="tabs">
          {Object.keys(scenarios).map((k) => (
            <button
              key={k}
              className={`tab ${scenario === k ? "active" : ""}`}
              onClick={() => switchScenario(k)}
            >
              {scenarios[k].name}
            </button>
          ))}
        </div>

        <p className="subtitle">{scenarios[scenario].description}</p>

        {/* Score + progress */}
        <div className="progress" style={{ margin: "6px 0 16px" }}>
          <span style={{ width: `${Math.min(100, (score / goal) * 100)}%` }} />
        </div>
        <div className="notice">
          <span>Score: <b>{score}</b> / {goal}</span>
          {score >= goal && <span>🎉 Goal reached! Try a new run.</span>}
        </div>

        {/* metrics */}
        <div className="metrics" style={{ marginTop: 16 }}>
          {metricList.map(([key, val]) => (
            <div className="card" key={key}>
              <h3>{key}</h3>
              <div className="value">{val}</div>
            </div>
          ))}
        </div>

        {/* actions */}
        <div className="row" style={{ marginTop: 18 }}>
          {scenarios[scenario].actions.map((a) => (
            <button key={a.id} className={`btn ${a.color}`} onClick={() => handleChoice(a.id)}>
              {a.label}
            </button>
          ))}
        </div>

        {/* log */}
        <div style={{ marginTop: 22 }}>
          <h3 style={{ margin: "0 0 8px" }}>Game Log</h3>
          <div className="log">
            {log.length === 0 ? <p>No turns yet — take your first action.</p> :
              log.map((line, i) => <p key={i}>{line}</p>)}
          </div>
        </div>

        <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />
      </div>
    </div>
  );
}

/* ------------ UI Pieces ------------- */
function StartScreen({ onStart }) {
  return (
    <div className="modal">
      <div className="sheet">
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Welcome to MicroEconomy</h2>
        <p style={{ color: "var(--muted)" }}>
          Choose actions each turn and try to reach the goal score. Keep your metrics healthy!
        </p>
        <ul style={{ marginTop: 10, lineHeight: 1.5 }}>
          <li>💸 <b>Bakery</b>: cash, demand, reputation</li>
          <li>🏙️ <b>City</b>: GDP, inflation, happiness</li>
          <li>⚡ Random events will challenge your plan</li>
        </ul>
        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn green" onClick={onStart}>🎮 Start Simulation</button>
          <a className="btn outline" href="https://github.com/nehrunkocum-star/microeconomy" target="_blank" rel="noreferrer">Source</a>
        </div>
      </div>
    </div>
  );
}

function AboutModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="modal" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>About</h3>
        <p style={{ color: "var(--muted)" }}>
          <b>MicroEconomy</b> is a tiny economics simulation built by <b>Nehrun Kocum</b> for The Logic Loom.
          It’s a single-page React app deployed on GitHub Pages.
        </p>
        <div className="row">
          <a className="btn outline" href="https://github.com/nehrunkocum-star/microeconomy" target="_blank" rel="noreferrer">View on GitHub</a>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
