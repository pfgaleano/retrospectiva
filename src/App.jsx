import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://crgklwwhfzixyrduidjs.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZ2tsd3doZnppeHlyZHVpZGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MTI1ODEsImV4cCI6MjA5NjE4ODU4MX0.e5WLBedSWvBokDrqUuYW6sy6diCDpfiAWdk1fpRmVQw";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const RED = "#c50000";
const BLUE = "#1a2a6b";
const BORDER = "#e0e0e0";

const CATEGORIES = [
  { key: "bien", label: "✅ Salió bien", color: "#2e7d32", bg: "#f0f7f0", border: "#2e7d32" },
  { key: "mal", label: "❌ No salió bien", color: "#c62828", bg: "#fdf2f2", border: "#c62828" },
  { key: "mejorar", label: "💡 Para mejorar", color: "#f59f00", bg: "#fffbea", border: "#f59f00" },
];

export default function Retrospectiva() {
  const [view, setView] = useState("inicio");
  const [nombreInput, setNombreInput] = useState("");
  const [nombre, setNombre] = useState("");
  const [respuestas, setRespuestas] = useState({});
  const [allData, setAllData] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  async function iniciarFormulario() {
    const n = nombreInput.trim();
    if (!n) return;
    setNombre(n);
    const { data } = await supabase.from("retrospectivas").select("*").eq("nombre", n).single();
    if (data) setRespuestas(data);
    setView("form");
    setGuardado(false);
  }

  async function guardar() {
    setCargando(true);
    const payload = {
      nombre,
      bien: respuestas.bien || "",
      mal: respuestas.mal || "",
      mejorar: respuestas.mejorar || "",
    };
    const { error } = await supabase.from("retrospectivas").upsert(payload, { onConflict: "nombre" });
    setCargando(false);
    if (!error) {
      setGuardado(true);
      setView("exito");
    } else {
      alert("Hubo un error al guardar. Intentá de nuevo.");
    }
  }

  async function abrirPanel() {
    const clave = prompt("Ingresá la contraseña para ver el panel:");
    if (clave !== "Bruno2026Gabi") {
      alert("Contraseña incorrecta.");
      return;
    }
    const { data } = await supabase.from("retrospectivas").select("*");
    setAllData(data || []);
    setView("panel");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4f1ee", fontFamily: "'Arial', sans-serif", color: "#1a1a1a" }}>

      {/* Header */}
      <div style={{ background: RED, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.png" alt="Argentinos Juniors" style={{ height: 44, width: "auto" }} />
          <div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Profes Metro</div>
            <div style={{ color: "white", fontSize: 17, fontWeight: "bold", letterSpacing: 1, lineHeight: 1.2 }}>RETROSPECTIVA</div>
          </div>
        </div>
        {view !== "panel" && (
          <button onClick={abrirPanel} style={{
            background: "white", border: "none", color: RED,
            padding: "7px 14px", borderRadius: 4, fontSize: 12, fontWeight: "bold", cursor: "pointer",
          }}>👁 Ver panel</button>
        )}
        {view === "panel" && (
          <button onClick={() => setView("inicio")} style={{
            background: "transparent", border: "2px solid white", color: "white",
            padding: "6px 14px", borderRadius: 4, fontSize: 12, fontWeight: "bold", cursor: "pointer",
          }}>← Volver</button>
        )}
      </div>

      {/* Franja azul */}
      <div style={{ background: BLUE, height: 4 }} />

      {/* INICIO */}
      {view === "inicio" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 68px)", padding: 24 }}>
          <div style={{ maxWidth: 400, width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, background: RED, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 16px" }}>📋</div>
              <h2 style={{ color: RED, margin: "0 0 6px", fontSize: 22, fontWeight: "bold", letterSpacing: 1 }}>RETROSPECTIVA</h2>
              <p style={{ color: "#666", margin: 0, fontSize: 14 }}>Completá el formulario antes del encuentro presencial</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", color: BLUE, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                Tu nombre
              </label>
              <input
                type="text"
                value={nombreInput}
                onChange={e => setNombreInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && iniciarFormulario()}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: 4,
                  border: `2px solid ${BORDER}`, background: "white",
                  color: "#1a1a1a", fontSize: 15, outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            <button onClick={iniciarFormulario} disabled={!nombreInput.trim()} style={{
              width: "100%", padding: "13px", borderRadius: 4, border: "none",
              background: nombreInput.trim() ? RED : "#ddd",
              color: nombreInput.trim() ? "white" : "#999",
              fontSize: 15, fontWeight: "bold", cursor: nombreInput.trim() ? "pointer" : "not-allowed", letterSpacing: 1,
            }}>
              COMENZAR →
            </button>
          </div>
        </div>
      )}

      {/* FORMULARIO */}
      {view === "form" && (
        <div style={{ padding: "32px 16px", maxWidth: 560, margin: "0 auto" }}>
          <div style={{ borderLeft: `4px solid ${RED}`, paddingLeft: 14, marginBottom: 28 }}>
            <div style={{ color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Completando como</div>
            <div style={{ color: BLUE, fontSize: 22, fontWeight: "bold" }}>{nombre}</div>
          </div>

          {CATEGORIES.map(cat => (
            <div key={cat.key} style={{ marginBottom: 20 }}>
              <label style={{
                display: "block", fontWeight: "bold", fontSize: 14,
                color: cat.color, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5,
              }}>
                {cat.label}
              </label>
              <textarea
                value={respuestas[cat.key] || ""}
                onChange={e => setRespuestas(p => ({ ...p, [cat.key]: e.target.value }))}
                rows={4}
                style={{
                  width: "100%", border: `2px solid ${BORDER}`, borderRadius: 4,
                  padding: "12px", fontSize: 14, background: "white",
                  outline: "none", resize: "vertical", boxSizing: "border-box",
                  color: "#222", lineHeight: 1.6,
                }}
              />
            </div>
          ))}

          <div style={{ borderTop: `2px solid ${BORDER}`, paddingTop: 20, marginTop: 8 }}>
            <button onClick={guardar} disabled={cargando} style={{
              width: "100%", padding: "14px", borderRadius: 4, border: "none",
              background: RED, color: "white", fontSize: 15, fontWeight: "bold",
              cursor: cargando ? "wait" : "pointer", letterSpacing: 1,
            }}>
              {cargando ? "GUARDANDO..." : "GUARDAR RESPUESTAS"}
            </button>
          </div>
        </div>
      )}

      {/* ÉXITO */}
      {view === "exito" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 68px)", padding: 24 }}>
          <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, background: "#e8f5e9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 24px" }}>✅</div>
            <h2 style={{ color: BLUE, fontSize: 24, fontWeight: "bold", margin: "0 0 12px" }}>¡Gracias, {nombre}!</h2>
            <p style={{ color: "#666", fontSize: 15, lineHeight: 1.7, margin: "0 0 32px" }}>
              Tus respuestas se guardaron correctamente.<br />Nos vemos en la retro presencial 🙌
            </p>
            <div style={{ width: 40, height: 4, background: RED, margin: "0 auto 32px", borderRadius: 2 }} />
            <button onClick={() => { setView("inicio"); setNombreInput(""); setRespuestas({}); setGuardado(false); }} style={{
              background: "white", border: `2px solid ${RED}`, borderRadius: 4,
              padding: "12px 28px", color: RED, fontSize: 14, fontWeight: "bold", cursor: "pointer", letterSpacing: 1,
            }}>
              VOLVER AL INICIO
            </button>
          </div>
        </div>
      )}

      {/* PANEL */}
      {view === "panel" && (
        <div style={{ padding: "32px 16px", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ borderLeft: `4px solid ${BLUE}`, paddingLeft: 14, marginBottom: 28 }}>
            <div style={{ color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Administración</div>
            <div style={{ color: BLUE, fontSize: 22, fontWeight: "bold" }}>Panel de respuestas</div>
            <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
              {allData.length === 0 ? "Sin respuestas aún" : `${allData.length} persona${allData.length > 1 ? "s" : ""} respondió`}
            </div>
          </div>

          {CATEGORIES.map(cat => (
            <div key={cat.key} style={{ marginBottom: 24, border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ background: cat.bg, padding: "12px 18px", borderLeft: `4px solid ${cat.border}` }}>
                <span style={{ color: cat.color, fontWeight: "bold", fontSize: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>{cat.label}</span>
              </div>
              {allData.length === 0 ? (
                <div style={{ background: "white", padding: "14px 18px", color: "#bbb", fontSize: 13, fontStyle: "italic" }}>
                  Sin respuestas aún
                </div>
              ) : (
                allData.map((persona, i) => (
                  <div key={persona.nombre} style={{
                    background: i % 2 === 0 ? "white" : "#fafafa",
                    padding: "12px 18px",
                    borderTop: `1px solid ${BORDER}`,
                  }}>
                    <div style={{ color: BLUE, fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                      {persona.nombre}
                    </div>
                    <div style={{ color: persona[cat.key] ? "#333" : "#bbb", fontSize: 14, lineHeight: 1.6, fontStyle: persona[cat.key] ? "normal" : "italic" }}>
                      {persona[cat.key] || "Sin respuesta"}
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
