import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://crgklwwhfzixyrduidjs.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZ2tsd3doZnppeHlyZHVpZGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MTI1ODEsImV4cCI6MjA5NjE4ODU4MX0.e5WLBedSWvBokDrqUuYW6sy6diCDpfiAWdk1fpRmVQw";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CATEGORIES = [
  { key: "bien", label: "✅ Salió bien", color: "#1a6b3c", bg: "#e6f7ee", accent: "#2ecc71" },
  { key: "mal", label: "❌ No salió bien", color: "#8b1a1a", bg: "#fdeaea", accent: "#e74c3c" },
  { key: "mejorar", label: "💡 Para mejorar", color: "#7a5c00", bg: "#fffbea", accent: "#f1c40f" },
];

export default function Retrospectiva() {
  const [view, setView] = useState("inicio");
  const [nombre, setNombre] = useState("");
  const [nombreInput, setNombreInput] = useState("");
  const [respuestas, setRespuestas] = useState({});
  const [allData, setAllData] = useState([]);
  const [guardado, setGuardado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [toast, setToast] = useState(false);

  async function iniciarFormulario() {
    const n = nombreInput.trim();
    if (!n) return;
    setNombre(n);
    const { data } = await supabase
      .from("retrospectivas")
      .select("*")
      .eq("nombre", n)
      .single();
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
    const { error } = await supabase
      .from("retrospectivas")
      .upsert(payload, { onConflict: "nombre" });
    setCargando(false);
    if (!error) {
        setGuardado(true);
        setToast(true);
        setTimeout(() => setToast(false), 3000);
      } else {
        alert("Error: " + JSON.stringify(error));
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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif",
    }}>
      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#27ae60",
          color: "white",
          padding: "14px 28px",
          borderRadius: 12,
          fontSize: 15,
          fontWeight: "bold",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          zIndex: 9999,
          animation: "fadeIn 0.3s ease",
        }}>
          ✓ Respuestas guardadas correctamente
        </div>
      )}

      {/* Header */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "18px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ color: "#f0c040", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 2 }}>
            Profes Metro
          </div>
          <div style={{ color: "white", fontSize: 22, fontWeight: "bold", letterSpacing: 1 }}>
            RETROSPECTIVA
          </div>
        </div>
        {view !== "panel" && (
          <button onClick={abrirPanel} style={{
            background: "rgba(240,192,64,0.15)",
            border: "1px solid #f0c040",
            color: "#f0c040",
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 13,
            cursor: "pointer",
          }}>
            👁 Ver panel
          </button>
        )}
        {view === "panel" && (
          <button onClick={() => setView("inicio")} style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "white",
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 13,
            cursor: "pointer",
          }}>
            ← Volver
          </button>
        )}
      </div>

      {/* VISTA: Inicio */}
      {view === "inicio" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", padding: 24 }}>
          <div style={{
            background: "rgba(255,255,255,0.07)",
            borderRadius: 20,
            padding: "40px 32px",
            maxWidth: 400,
            width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <div style={{ fontSize: 48, textAlign: "center", marginBottom: 8 }}>📋</div>
            <h2 style={{ color: "white", textAlign: "center", margin: "0 0 8px", fontSize: 24 }}>
              ¿Cómo te llamás?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", margin: "0 0 28px", fontSize: 14 }}>
              Ingresá tu nombre para completar la retrospectiva
            </p>
            <input
              type="text"
              placeholder="Tu nombre..."
              value={nombreInput}
              onChange={e => setNombreInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && iniciarFormulario()}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid rgba(240,192,64,0.4)",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                fontSize: 16,
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 16,
              }}
            />
            <button
              onClick={iniciarFormulario}
              disabled={!nombreInput.trim()}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                border: "none",
                background: nombreInput.trim() ? "linear-gradient(90deg, #f0c040, #e67e22)" : "rgba(255,255,255,0.1)",
                color: nombreInput.trim() ? "#1a1a1a" : "rgba(255,255,255,0.3)",
                fontSize: 16,
                fontWeight: "bold",
                cursor: nombreInput.trim() ? "pointer" : "not-allowed",
              }}
            >
              Comenzar →
            </button>
          </div>
        </div>
      )}

      {/* VISTA: Formulario */}
      {view === "form" && (
        <div style={{ padding: "24px 16px", maxWidth: 600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ color: "#f0c040", fontSize: 13, letterSpacing: 2 }}>Completando como</div>
            <div style={{ color: "white", fontSize: 26, fontWeight: "bold" }}>{nombre}</div>
          </div>

          {CATEGORIES.map(cat => (
            <div key={cat.key} style={{
              background: cat.bg,
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              borderLeft: `4px solid ${cat.accent}`,
            }}>
              <div style={{ color: cat.color, fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
                {cat.label}
              </div>
              <textarea
                placeholder="Escribí acá..."
                value={respuestas[cat.key] || ""}
                onChange={e => setRespuestas(prev => ({ ...prev, [cat.key]: e.target.value }))}
                rows={4}
                style={{
                  width: "100%",
                  border: `1px solid ${cat.accent}40`,
                  borderRadius: 10,
                  padding: "12px",
                  fontSize: 15,
                  background: "rgba(255,255,255,0.8)",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  color: "#222",
                  lineHeight: 1.6,
                }}
              />
            </div>
          ))}

          <button onClick={guardar} disabled={cargando} style={{
            width: "100%",
            padding: "16px",
            borderRadius: 14,
            border: "none",
            background: guardado
              ? "linear-gradient(90deg, #27ae60, #2ecc71)"
              : "linear-gradient(90deg, #f0c040, #e67e22)",
            color: guardado ? "white" : "#1a1a1a",
            fontSize: 17,
            fontWeight: "bold",
            cursor: cargando ? "wait" : "pointer",
            marginBottom: 12,
          }}>
            {cargando ? "Guardando..." : guardado ? "✓ Guardado correctamente" : "💾 Guardar respuestas"}
          </button>
        </div>
      )}

      {/* VISTA: Panel */}
      {view === "panel" && (
        <div style={{ padding: "24px 16px", maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ color: "white", textAlign: "center", marginBottom: 6 }}>Panel de respuestas</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 28, fontSize: 14 }}>
            {allData.length === 0 ? "Aún no hay respuestas." : `${allData.length} persona${allData.length > 1 ? "s" : ""} respondió`}
          </p>

          {CATEGORIES.map(cat => (
            <div key={cat.key} style={{ marginBottom: 24 }}>
              <div style={{
                background: cat.bg,
                borderRadius: "14px 14px 0 0",
                padding: "12px 18px",
                borderLeft: `4px solid ${cat.accent}`,
              }}>
                <span style={{ color: cat.color, fontWeight: "bold", fontSize: 15 }}>{cat.label}</span>
              </div>
              {allData.length === 0 ? (
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "0 0 14px 14px", padding: "14px 18px", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
                  Sin respuestas
                </div>
              ) : (
                allData.map((persona, i) => (
                  <div key={persona.nombre} style={{
                    background: i % 2 === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                    borderRadius: i === allData.length - 1 ? "0 0 14px 14px" : "0",
                    padding: "12px 18px",
                    borderBottom: i < allData.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}>
                    <div style={{ color: "#f0c040", fontSize: 11, letterSpacing: 1, marginBottom: 4, fontWeight: "bold", textTransform: "uppercase" }}>
                      {persona.nombre}
                    </div>
                    <div style={{ color: persona[cat.key] ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.2)", fontSize: 14, lineHeight: 1.6, fontStyle: persona[cat.key] ? "normal" : "italic" }}>
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
