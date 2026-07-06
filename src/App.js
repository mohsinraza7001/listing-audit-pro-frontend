import { useState, useEffect } from "react";

const API_URL = "";

// ══════════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM — Clean Corporate SaaS
// ══════════════════════════════════════════════════════════════════════════════
const C = {
  bg: "#ffffff",
  bgAlt: "#f8fafc",
  surface: "#ffffff",
  surface2: "#f1f5f9",
  border: "#e2e8f0",
  borderLight: "#f1f5f9",
  primary: "#0f172a",
  primaryHover: "#1e293b",
  accent: "#2563eb",
  accentSoft: "#eff6ff",
  green: "#059669",
  greenSoft: "#ecfdf5",
  red: "#dc2626",
  redSoft: "#fef2f2",
  yellow: "#d97706",
  yellowSoft: "#fffbeb",
  text: "#0f172a",
  textSecondary: "#475569",
  muted: "#64748b",
  mutedLight: "#94a3b8",
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-font-smoothing:antialiased;}
  html,body{background:#ffffff;font-family:'Inter',system-ui,sans-serif;color:#0f172a;line-height:1.55;}
  ::-webkit-scrollbar{width:10px;height:10px;}
  ::-webkit-scrollbar-track{background:#f1f5f9;}
  ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:5px;border:2px solid #f1f5f9;}
  ::-webkit-scrollbar-thumb:hover{background:#94a3b8;}
  textarea,input,select,button{font-family:inherit;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  @keyframes spin{to{transform:rotate(360deg);}}
  .serif{font-family:'Fraunces',serif;font-optical-sizing:auto;}
`;

const Serif = ({ children, style = {} }) => <span style={{ fontFamily: "Fraunces, serif", ...style }}>{children}</span>;

function ScoreRing({ score, size = 140, strokeWidth = 8 }) {
  const r = (size - strokeWidth) / 2, circ = 2 * Math.PI * r;
  const color = score >= 80 ? C.green : score >= 60 ? C.yellow : C.red;
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.borderLight} strokeWidth={strokeWidth}/>
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)" }}/>
      </svg>
      <div style={{ position: "absolute", textAlign: "center" }}>
        <div className="serif" style={{ fontWeight: 600, fontSize: size * 0.3, lineHeight: 1, color: C.primary, letterSpacing: "-0.03em" }}>{score}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>/ 100</div>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, max = 10, delay = 0 }) {
  const pct = (value/max)*100;
  const color = pct>=75?C.green:pct>=50?C.yellow:C.red;
  return (
    <div style={{ marginBottom: 20, animation: `fadeUp 0.5s ease ${delay}s both` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 14, color: C.textSecondary, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>
          {value}<span style={{color: C.mutedLight, fontSize: 12, fontWeight: 500}}>/{max}</span>
        </span>
      </div>
      <div style={{ position: "relative", height: 8, background: C.surface2, borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: 0, left: 0, height: "100%", width: `${pct}%`,
          background: color, borderRadius: 4,
          transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
        }}/>
      </div>
    </div>
  );
}

function Tag({ label, variant, delay = 0 }) {
  const styles = {
    have: { bg: C.greenSoft, color: C.green, border: "#a7f3d0" },
    missing: { bg: C.redSoft, color: C.red, border: "#fecaca" },
    opportunity: { bg: C.accentSoft, color: C.accent, border: "#bfdbfe" },
  };
  const s = styles[variant];
  return <span style={{ fontSize: 13, padding: "5px 12px", borderRadius: 6, border: `1px solid ${s.border}`, color: s.color, background: s.bg, display: "inline-block", margin: "3px 4px", fontWeight: 500, animation: `fadeUp 0.3s ease ${delay}s both` }}>{label}</span>;
}

function Card({ children, style = {}, delay = 0, elevated = false }) {
  return (
    <div style={{
      borderRadius: 12, overflow: "hidden", position: "relative",
      animation: `fadeUp 0.5s ease ${delay}s both`,
      background: C.surface,
      border: `1px solid ${C.border}`,
      boxShadow: elevated ? "0 4px 24px rgba(15,23,42,0.06)" : "0 1px 3px rgba(15,23,42,0.04)",
      ...style
    }}>{children}</div>
  );
}

function CardHeader({ icon, title, badge, action }) {
  const bColor = badge?.color === "green" ? C.green : badge?.color === "red" ? C.red : badge?.color === "blue" ? C.accent : C.yellow;
  const bBg = badge?.color === "green" ? C.greenSoft : badge?.color === "red" ? C.redSoft : badge?.color === "blue" ? C.accentSoft : C.yellowSoft;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 28px", borderBottom: `1px solid ${C.border}` }}>
      {icon && <div style={{ width: 36, height: 36, borderRadius: 8, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{icon}</div>}
      <span style={{ fontWeight: 600, fontSize: 16, flex: 1, letterSpacing: "-0.01em", color: C.primary }}>{title}</span>
      {badge && <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: bBg, color: bColor, letterSpacing: "0.02em" }}>{badge.label}</span>}
      {action}
    </div>
  );
}

function Spinner({ size = 22, color = C.accent }) {
  return <div style={{ width: size, height: size, border: `2.5px solid ${C.borderLight}`, borderTop: `2.5px solid ${color}`, borderRadius: "50%", animation: "spin 0.7s linear infinite" }}/>;
}

function Btn({ children, onClick, variant = "primary", disabled = false, style = {}, size = "md" }) {
  const sizes = { sm: "8px 16px", md: "11px 22px", lg: "15px 28px" };
  const fs = { sm: 13, md: 14, lg: 15 };
  const base = { padding: sizes[size], borderRadius: 8, fontWeight: 600, fontSize: fs[size], cursor: disabled?"not-allowed":"pointer", transition: "all 0.15s ease", border: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: "0.01em", whiteSpace: "nowrap" };
  const variants = {
    primary: { background: C.primary, color: "white" },
    accent: { background: C.accent, color: "white" },
    outline: { background: "transparent", color: C.primary, border: `1px solid ${C.border}` },
    ghost: { background: C.surface2, color: C.primary },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], opacity: disabled?0.5:1, ...style }}
      onMouseEnter={e=>{ if(disabled) return; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(15,23,42,0.12)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
      {children}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════════════════════════
function useAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("alap_user")); } catch { return null; }
  });
  const signup = (email, plan) => {
    const credits = plan === "payg" ? 1 : plan==="starter"?12:plan==="growth"?20:40;
    const u = { email, plan, credits, token: btoa(email+":"+Date.now()), createdAt: Date.now() };
    localStorage.setItem("alap_user", JSON.stringify(u));
    setUser(u);
  };
  const login = (email) => {
    const stored = JSON.parse(localStorage.getItem("alap_user") || "null");
    if (stored && stored.email === email) { setUser(stored); return stored; }
    throw new Error("No account found with this email. Please sign up.");
  };
  const logout = () => { localStorage.removeItem("alap_user"); setUser(null); };
  const deductCredit = () => {
    setUser(prev => {
      const u = { ...prev, credits: Math.max(0, (prev.credits||0)-1) };
      localStorage.setItem("alap_user", JSON.stringify(u));
      return u;
    });
  };
  const addCredits = (n) => {
    setUser(prev => {
      const u = { ...prev, credits: (prev.credits||0)+n };
      localStorage.setItem("alap_user", JSON.stringify(u));
      return u;
    });
  };
  return { user, signup, login, logout, deductCredit, addCredits };
}

// ══════════════════════════════════════════════════════════════════════════════
// PDF EXPORT
// ══════════════════════════════════════════════════════════════════════════════
function exportToPDF(report, userEmail) {
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"><title>Listing Audit Report</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:-apple-system,'Inter',sans-serif;color:#0f172a;background:white;padding:40px;line-height:1.6;}
  .cover{text-align:center;padding:60px 0;border-bottom:3px solid #0f172a;margin-bottom:40px;}
  .logo{width:60px;height:60px;background:#0f172a;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:700;margin-bottom:20px;}
  h1{font-size:36px;font-weight:700;margin-bottom:12px;letter-spacing:-0.02em;}
  .subtitle{color:#64748b;font-size:15px;margin-bottom:24px;}
  .score-box{display:inline-block;padding:16px 32px;background:#0f172a;color:white;border-radius:12px;}
  .score-num{font-size:48px;font-weight:800;line-height:1;}
  .score-label{font-size:12px;letter-spacing:0.15em;text-transform:uppercase;opacity:0.85;margin-top:4px;}
  h2{font-size:22px;font-weight:700;margin:32px 0 16px;padding-bottom:8px;border-bottom:1px solid #e2e8f0;}
  .summary{background:#f8fafc;padding:20px;border-radius:12px;margin-bottom:24px;font-size:14px;}
  .score-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;gap:16px;}
  .score-bar{flex:1;background:#e2e8f0;height:8px;border-radius:4px;overflow:hidden;}
  .score-bar div{height:100%;background:#2563eb;border-radius:4px;}
  .issue{padding:14px;background:#f8fafc;border-left:3px solid #2563eb;border-radius:8px;margin-bottom:12px;font-size:13px;}
  .issue-title{font-weight:600;margin-bottom:4px;}
  .issue-fix{color:#059669;margin-top:6px;font-style:italic;}
  .rewrite-block{background:#eff6ff;border:1px solid #bfdbfe;padding:16px;border-radius:10px;margin-bottom:12px;font-size:14px;line-height:1.7;}
  .kw{display:inline-block;font-size:12px;padding:4px 10px;border-radius:100px;background:#eff6ff;color:#2563eb;margin:3px;}
  .kw.miss{background:#fef2f2;color:#dc2626;}
  .footer{text-align:center;margin-top:60px;padding-top:20px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;}
  @media print{body{padding:20px;}}
</style>
</head><body>
  <div class="cover">
    <div class="logo">A</div>
    <h1>Amazon Listing Audit Report</h1>
    <div class="subtitle">Prepared for ${userEmail || "you"} · ${new Date().toLocaleDateString()}</div>
    <div class="score-box">
      <div class="score-num">${report.overallScore}</div>
      <div class="score-label">Overall Score / 100</div>
    </div>
  </div>
  <h2>Executive Summary</h2>
  <div class="summary">${report.overallSummary || ""}</div>
  <h2>Category Scores</h2>
  ${(report.scores||[]).map(s=>`
    <div class="score-row">
      <span style="min-width:180px">${s.label}</span>
      <div class="score-bar"><div style="width:${(s.value/s.max)*100}%"></div></div>
      <strong>${s.value}/${s.max}</strong>
    </div>`).join("")}
  <h2>Key Issues & Fixes</h2>
  ${(report.issues||[]).map(i=>`
    <div class="issue">
      <div class="issue-title">${i.title}</div>
      <div>${i.description}</div>
      ${i.fix?`<div class="issue-fix">→ ${i.fix}</div>`:""}
    </div>`).join("")}
  <h2>Optimized Title (AI Rewritten)</h2>
  <div class="rewrite-block">${report.rewrite?.optimizedTitle || ""}</div>
  <h2>Optimized Bullet Points</h2>
  ${(report.rewrite?.optimizedBullets||[]).map((b,i)=>`<div class="rewrite-block"><strong>${i+1}.</strong> ${b}</div>`).join("")}
  <h2>Missing Keywords</h2>
  <div>${(report.keywords?.missing||[]).map(k=>`<span class="kw miss">${k}</span>`).join("")}</div>
  <h2>Opportunity Keywords</h2>
  <div>${(report.keywords?.opportunities||[]).map(k=>`<span class="kw">${k}</span>`).join("")}</div>
  <div class="footer">Powered by Amazon Listing Audit Pro · Generated ${new Date().toLocaleString()}</div>
</body></html>`;
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
  setTimeout(()=>w.print(), 500);
}

// ══════════════════════════════════════════════════════════════════════════════
// LANDING
// ══════════════════════════════════════════════════════════════════════════════
function Landing({ onGetStarted, onLogin, onSelectPlan }) {
  return (
    <div>
      <nav style={{ background: "white", borderBottom: `1px solid ${C.border}`, padding: "18px 40px", display: "flex", alignItems: "center", gap: 20, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 16 }}>A</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.primary, letterSpacing: "-0.01em" }}>Amazon Listing Audit Pro</div>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="#features" style={{ fontSize: 14, color: C.textSecondary, textDecoration: "none", fontWeight: 500 }}>Features</a>
          <a href="#pricing" style={{ fontSize: 14, color: C.textSecondary, textDecoration: "none", fontWeight: 500 }}>Pricing</a>
          <Btn variant="outline" size="sm" onClick={onLogin}>Log In</Btn>
          <Btn onClick={onGetStarted} size="sm">Start free trial</Btn>
        </div>
      </nav>

      <section style={{ padding: "100px 40px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-block", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", color: C.accent, background: C.accentSoft, padding: "6px 14px", borderRadius: 20, marginBottom: 28 }}>
              ✦ AI-Powered Amazon SEO
            </div>
            <h1 style={{ fontWeight: 700, fontSize: 60, lineHeight: 1.05, marginBottom: 24, letterSpacing: "-0.035em", color: C.primary }}>
              <Serif style={{ fontStyle: "italic", fontWeight: 500 }}>Outrank</Serif> every Amazon competitor.
            </h1>
            <p style={{ color: C.textSecondary, fontSize: 18, lineHeight: 1.65, marginBottom: 36, maxWidth: 520 }}>
              Get a full AI-powered audit of your Amazon listing with keyword gaps, competitor benchmarks, and a fully rewritten listing — ready to paste into Seller Central in under 60 seconds.
            </p>
            <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
              <Btn onClick={onGetStarted} size="lg">Start free trial →</Btn>
              <Btn variant="outline" size="lg" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>See pricing</Btn>
            </div>
            <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
              {[
                "7-day money-back",
                "Cancel anytime",
                "No credit card to start",
              ].map((t,i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.muted }}>
                  <span style={{ color: C.green, fontSize: 15 }}>✓</span> {t}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Card elevated style={{ padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>Optimization Score</div>
                <div style={{ fontSize: 12, background: C.greenSoft, color: C.green, padding: "3px 10px", borderRadius: 12, fontWeight: 600 }}>+8 this week</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
                <ScoreRing score={73} size={110}/>
                <div>
                  <Serif style={{ fontWeight: 600, fontSize: 24, letterSpacing: "-0.02em", color: C.primary, display: "block" }}>Needs Work</Serif>
                  <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 4 }}>7 improvements found</div>
                </div>
              </div>
              <div>
                {[
                  { l: "Title Optimization", v: 7 },
                  { l: "Keyword Coverage", v: 5 },
                  { l: "Bullet Points", v: 6 },
                ].map((s,i) => <ScoreBar key={i} label={s.l} value={s.v} delay={i*0.1}/>)}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section style={{ background: C.bgAlt, padding: "48px 40px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, textAlign: "center" }}>
          {[
            { n: "12,400+", l: "Listings audited" },
            { n: "35%", l: "Average sales lift" },
            { n: "60s", l: "Average audit time" },
            { n: "4.9/5", l: "Customer rating" },
          ].map((s,i) => (
            <div key={i}>
              <Serif style={{ fontWeight: 600, fontSize: 36, color: C.primary, display: "block", letterSpacing: "-0.02em" }}>{s.n}</Serif>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 6, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ maxWidth: 640, marginBottom: 64 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>Features</div>
          <h2 style={{ fontWeight: 700, fontSize: 42, letterSpacing: "-0.025em", color: C.primary, marginBottom: 20, lineHeight: 1.15 }}>
            Everything you need to <Serif style={{ fontStyle: "italic", fontWeight: 500 }}>win</Serif> on Amazon.
          </h2>
          <p style={{ color: C.textSecondary, fontSize: 17, lineHeight: 1.65 }}>
            Built by former Amazon Brand Managers. Powered by AI trained on thousands of top-ranking listings.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {[
            {icon:"🔍",title:"Competitor Research",desc:"Benchmark up to 10 competitor ASINs. AI analyzes their specs, keywords, and positioning against your listing."},
            {icon:"📊",title:"7-Dimension Scoring",desc:"Detailed scoring on title, keywords, bullets, specs, description, differentiation, and trust signals."},
            {icon:"🔑",title:"Keyword Gap Analysis",desc:"Exactly which high-value keywords your competitors rank for that you're missing entirely."},
            {icon:"✍️",title:"AI Listing Rewrite",desc:"Fully optimized title, 5 bullets, and description — copy-paste ready for Seller Central."},
            {icon:"⚠️",title:"Issue Detection",desc:"Typos, weak claims, missing safety signals, spec disadvantages — all flagged with fixes."},
            {icon:"📄",title:"PDF Export",desc:"Professional branded reports to share with clients or your team. White-label on Pro plan."},
          ].map((f,i) => (
            <div key={i} style={{ animation: `fadeUp 0.5s ease ${i*0.05}s both` }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 20 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 10, letterSpacing: "-0.01em", color: C.primary }}>{f.title}</h3>
              <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: C.bgAlt, padding: "100px 40px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ maxWidth: 640, marginBottom: 56, textAlign: "center", margin: "0 auto 56px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>How it works</div>
            <h2 style={{ fontWeight: 700, fontSize: 42, letterSpacing: "-0.025em", color: C.primary, marginBottom: 20, lineHeight: 1.15 }}>Three steps to a <Serif style={{ fontStyle: "italic", fontWeight: 500 }}>winning</Serif> listing.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              { n: "01", title: "Paste your listing", desc: "Copy your title, bullets, and description from Seller Central." },
              { n: "02", title: "Add competitors", desc: "Enter up to 10 competitor ASINs to benchmark against." },
              { n: "03", title: "Get your report", desc: "In 60 seconds, receive a full audit with an AI-rewritten listing." },
            ].map((s,i) => (
              <Card key={i} style={{ padding: 32 }}>
                <Serif style={{ fontWeight: 500, fontSize: 36, color: C.accent, display: "block", marginBottom: 20, letterSpacing: "-0.02em" }}>{s.n}</Serif>
                <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 10, color: C.primary, letterSpacing: "-0.01em" }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.65 }}>{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ maxWidth: 640, marginBottom: 56, textAlign: "center", margin: "0 auto 56px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>Pricing</div>
          <h2 style={{ fontWeight: 700, fontSize: 42, letterSpacing: "-0.025em", color: C.primary, marginBottom: 20, lineHeight: 1.15 }}>Simple, <Serif style={{ fontStyle: "italic", fontWeight: 500 }}>transparent</Serif> pricing.</h2>
          <p style={{ color: C.textSecondary, fontSize: 17, lineHeight: 1.65 }}>Every plan includes AI-rewritten listings, keyword gap analysis, and PDF exports.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {[
            {name:"Pay as you go",price:"$1",period:"/ audit",credits:"1 audit",features:["AI-rewritten listing","Up to 4 competitor ASINs","PDF export","Email support"],cta:"Buy 1 credit",plan:"payg"},
            {name:"Starter",price:"$10",period:"/ month",credits:"12 audits",features:["12 audits per month","Up to 4 competitor ASINs","AI-rewritten listing","PDF export","Email support"],cta:"Start Starter",plan:"starter"},
            {name:"Growth",price:"$15",period:"/ month",credits:"20 audits",popular:true,features:["20 audits per month","Up to 8 competitor ASINs","Everything in Starter","Priority support","Advanced insights"],cta:"Start Growth",plan:"growth"},
            {name:"Pro",price:"$25",period:"/ month",credits:"40 audits",features:["40 audits per month","Up to 10 competitor ASINs","White-label reports","API access","Dedicated support"],cta:"Start Pro",plan:"pro"},
          ].map((p,i) => (
            <div key={i} style={{
              background: p.popular?C.primary:"white",
              border: `1px solid ${p.popular?C.primary:C.border}`,
              borderRadius: 12, padding: 28, position: "relative",
              animation: `fadeUp 0.5s ease ${i*0.08}s both`,
              color: p.popular?"white":C.primary,
            }}>
              {p.popular && <div style={{ position: "absolute", top: -11, left: 24, background: C.accent, color: "white", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20, letterSpacing: "0.03em" }}>Most popular</div>}
              <div style={{ fontSize: 12, fontWeight: 600, color: p.popular?"rgba(255,255,255,0.7)":C.muted, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 16 }}>{p.name}</div>
              <div style={{ marginBottom: 8, display: "flex", alignItems: "baseline", gap: 4 }}>
                <Serif style={{ fontWeight: 600, fontSize: 44, letterSpacing: "-0.03em" }}>{p.price}</Serif>
                <span style={{ color: p.popular?"rgba(255,255,255,0.6)":C.muted, fontSize: 14 }}>{p.period}</span>
              </div>
              <div style={{ fontSize: 13, color: p.popular?"rgba(255,255,255,0.7)":C.textSecondary, marginBottom: 24 }}>{p.credits}</div>
              <ul style={{ listStyle: "none", marginBottom: 28 }}>
                {p.features.map((f,j) => (
                  <li key={j} style={{ fontSize: 14, padding: "6px 0", display: "flex", gap: 10, color: p.popular?"rgba(255,255,255,0.9)":C.textSecondary }}>
                    <span style={{ color: p.popular?"white":C.green, fontWeight: 600, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => onSelectPlan(p.plan)} style={{
                width: "100%", padding: "11px", borderRadius: 8,
                background: p.popular?"white":C.primary,
                color: p.popular?C.primary:"white",
                border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer"
              }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "48px 40px", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13 }}>A</div>
            <span style={{ fontWeight: 600, fontSize: 14, color: C.primary }}>Amazon Listing Audit Pro</span>
          </div>
          <div style={{ fontSize: 13, color: C.muted }}>© {new Date().getFullYear()} Amazon Listing Audit Pro. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AUTH MODAL
// ══════════════════════════════════════════════════════════════════════════════
function AuthModal({ mode, initialPlan, onAuth, onClose, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState(initialPlan || "starter");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inp = { width: "100%", background: "white", border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 14px", color: C.primary, fontSize: 14, outline: "none", transition: "border-color 0.15s" };

  const handle = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try { await new Promise(r => setTimeout(r, 500)); onAuth(email, password, plan); }
    catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24, animation: "fadeIn 0.2s ease both" }}>
      <div style={{ background: "white", borderRadius: 16, padding: 36, width: "100%", maxWidth: 440, animation: "fadeUp 0.3s ease both", boxShadow: "0 20px 60px rgba(15,23,42,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ fontWeight: 700, fontSize: 26, letterSpacing: "-0.02em", color: C.primary }}>{mode==="signup"?"Create account":"Welcome back"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: 24, cursor: "pointer", padding: 4 }}>×</button>
        </div>
        <p style={{ color: C.textSecondary, fontSize: 14, marginBottom: 24 }}>
          {mode==="signup" ? "Get started with your first listing audit today." : "Log back in to your account."}
        </p>
        {error && <div style={{ background: C.redSoft, border: `1px solid #fecaca`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.red, marginBottom: 16 }}>{error}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: C.textSecondary, fontWeight: 500, display: "block", marginBottom: 6 }}>Email</label>
            <input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
          </div>
          <div>
            <label style={{ fontSize: 13, color: C.textSecondary, fontWeight: 500, display: "block", marginBottom: 6 }}>Password</label>
            <input style={inp} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
          </div>
          {mode==="signup" && (
            <div>
              <label style={{ fontSize: 13, color: C.textSecondary, fontWeight: 500, display: "block", marginBottom: 8 }}>Select plan</label>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  {id:"payg",name:"Pay as you go",price:"$1",credits:"1"},
                  {id:"starter",name:"Starter",price:"$10/mo",credits:"12"},
                  {id:"growth",name:"Growth",price:"$15/mo",credits:"20",popular:true},
                  {id:"pro",name:"Pro",price:"$25/mo",credits:"40"},
                ].map(p => (
                  <div key={p.id} onClick={()=>setPlan(p.id)} style={{
                    padding: "11px 14px", borderRadius: 8, cursor: "pointer",
                    border: `1.5px solid ${plan===p.id?C.accent:C.border}`,
                    background: plan===p.id?C.accentSoft:"white",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: "all 0.15s",
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>{p.name} {p.popular&&<span style={{fontSize:10, background:C.accent, color:"white", padding:"2px 6px", borderRadius:4, marginLeft:8, fontWeight:700, letterSpacing:"0.05em"}}>POPULAR</span>}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{p.credits} {p.id==="payg"?"audit":"audits"}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: plan===p.id?C.accent:C.primary }}>{p.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Btn onClick={handle} disabled={loading} style={{ width: "100%", marginTop: 20, padding: "13px" }}>
          {loading ? <><Spinner size={16} color="white"/> Processing…</> : mode==="signup" ? "Create account →" : "Log in →"}
        </Btn>
        <p style={{ textAlign: "center", fontSize: 13, color: C.textSecondary, marginTop: 20 }}>
          {mode==="signup" ? "Already have an account? " : "Don't have an account? "}
          <span onClick={onSwitch} style={{ color: C.accent, cursor: "pointer", fontWeight: 600 }}>
            {mode==="signup" ? "Log in" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AUDIT TOOL
// ══════════════════════════════════════════════════════════════════════════════
function AuditTool({ user, onLogout, onDeductCredit, onBuyCredits }) {
  const [phase, setPhase] = useState("input");
  const [report, setReport] = useState(null);
  const [loadStep, setLoadStep] = useState(0);
  const [activeTab, setActiveTab] = useState("audit");
  const [asins, setAsins] = useState(["","",""]);
  const [title, setTitle] = useState("");
  const [bullets, setBullets] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const STEPS = [
    "Parsing your listing structure",
    "Researching competitor ASINs",
    "Analyzing keyword landscape",
    "Scoring 7 optimization dimensions",
    "Generating AI-rewritten listing",
    "Compiling your report"
  ];

  const inp = { width: "100%", background: "white", border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 14px", color: C.primary, fontSize: 14, outline: "none", transition: "border-color 0.15s" };

  const runAudit = async () => {
    if (user.credits < 1) { alert("You're out of credits. Please buy more or upgrade your plan."); return; }
    setPhase("loading"); setLoadStep(0);
    const iv = setInterval(() => setLoadStep(p => p >= STEPS.length - 2 ? p : p + 1), 1800);
    try {
      const res = await fetch(`${API_URL}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-token": user.token },
        body: JSON.stringify({ title, bullets, description, category, asins: asins.filter(a=>a.trim()) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      clearInterval(iv); setLoadStep(STEPS.length - 1);
      setTimeout(() => {
        setReport(data.report);
        setPhase("report");
        setActiveTab("audit");
        onDeductCredit();
      }, 800);
    } catch(err) {
      clearInterval(iv);
      alert("Error: " + err.message);
      setPhase("input");
    }
  };

  const canRun = title.trim() && bullets.trim() && user.credits >= 1;
  const planLabel = user.plan === "payg" ? "PAYG" : user.plan?.toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <nav style={{ background: "white", borderBottom: `1px solid ${C.border}`, padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14 }}>A</div>
          <span style={{ fontWeight: 600, fontSize: 14, color: C.primary }}>Amazon Listing Audit Pro</span>
        </div>
        <div onClick={onBuyCredits} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: user.credits > 3 ? C.greenSoft : C.yellowSoft, border: `1px solid ${user.credits > 3 ? "#a7f3d0" : "#fde68a"}`, cursor: "pointer", transition: "all 0.15s" }}>
          <span style={{ fontSize: 13 }}>⚡</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: user.credits > 3 ? C.green : C.yellow }}>{user.credits} credits</span>
        </div>
        <div style={{ fontSize: 11, background: C.accentSoft, color: C.accent, padding: "4px 10px", borderRadius: 20, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{planLabel}</div>
        <button onClick={onLogout} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textSecondary, padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Log out</button>
      </nav>

      {phase === "input" && (
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 32px 80px" }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 12, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>New Audit</div>
            <h1 style={{ fontWeight: 700, fontSize: 38, marginBottom: 12, letterSpacing: "-0.025em", color: C.primary, lineHeight: 1.15 }}>
              Let's <Serif style={{ fontStyle: "italic", fontWeight: 500 }}>analyze</Serif> your listing.
            </h1>
            <p style={{ color: C.textSecondary, fontSize: 16 }}>Paste your listing and up to 10 competitor ASINs. AI will generate your full optimization report.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card>
              <CardHeader title="Product category"/>
              <div style={{ padding: 24 }}>
                <input style={inp} value={category} placeholder="e.g. Handheld Clothes Steamers, Yoga Mats, Kitchen Knives…" onChange={e=>setCategory(e.target.value)} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
              </div>
            </Card>

            <Card>
              <CardHeader title="Your Amazon listing" badge={{label:"Required",color:"yellow"}}/>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ fontSize: 13, color: C.textSecondary, fontWeight: 500, display: "block", marginBottom: 8 }}>Title <span style={{color:C.red}}>*</span></label>
                  <input style={inp} value={title} placeholder="Paste your full Amazon product title…" onChange={e=>setTitle(e.target.value)} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
                </div>
                <div>
                  <label style={{ fontSize: 13, color: C.textSecondary, fontWeight: 500, display: "block", marginBottom: 8 }}>Bullet points <span style={{color:C.red}}>*</span></label>
                  <textarea style={{...inp, resize: "vertical", minHeight: 150, lineHeight: 1.7}} value={bullets} placeholder={"• Bullet 1\n• Bullet 2\n• Bullet 3…"} onChange={e=>setBullets(e.target.value)} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
                </div>
                <div>
                  <label style={{ fontSize: 13, color: C.textSecondary, fontWeight: 500, display: "block", marginBottom: 8 }}>Description <span style={{color:C.muted, fontWeight: 400}}>(recommended)</span></label>
                  <textarea style={{...inp, resize: "vertical", minHeight: 100, lineHeight: 1.7}} value={description} placeholder="Paste your product description…" onChange={e=>setDescription(e.target.value)} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Competitor ASINs" badge={{label:`${asins.length} of 10`,color:"blue"}}/>
              <div style={{ padding: 24 }}>
                <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 18 }}>Each ASIN is a 10-character code like <span style={{ fontFamily: "monospace", background: C.surface2, padding: "2px 6px", borderRadius: 4, color: C.primary }}>B0GKM8MJSJ</span></p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {asins.map((a,i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: C.muted, width: 20, fontWeight: 500 }}>{i+1}</span>
                      <input style={{...inp, fontFamily: "monospace"}} value={a} placeholder={`Competitor ASIN #${i+1}`} onChange={e=>setAsins(asins.map((x,j)=>j===i?e.target.value.toUpperCase():x))} maxLength={10} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
                      {asins.length > 1 && <button onClick={()=>setAsins(asins.filter((_,j)=>j!==i))} style={{ background: "none", border: `1px solid ${C.border}`, color: C.muted, width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 18, flexShrink: 0 }}>×</button>}
                    </div>
                  ))}
                </div>
                {asins.length < 10 && (
                  <button onClick={()=>setAsins([...asins,""])} style={{ marginTop: 12, background: "transparent", border: `1px dashed ${C.border}`, color: C.textSecondary, padding: "10px", borderRadius: 8, cursor: "pointer", fontSize: 13, width: "100%", fontWeight: 500 }}>+ Add competitor ASIN</button>
                )}
              </div>
            </Card>

            {user.credits < 1 ? (
              <div style={{ background: C.yellowSoft, border: `1px solid #fde68a`, borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.yellow, marginBottom: 4 }}>⚡ You're out of credits</div>
                  <div style={{ fontSize: 13, color: C.textSecondary }}>Buy more credits or upgrade your plan to continue.</div>
                </div>
                <Btn onClick={onBuyCredits} size="sm">Get credits →</Btn>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: C.surface2, borderRadius: 10, fontSize: 14 }}>
                <span style={{ color: C.textSecondary }}>This audit will use <strong style={{ color: C.primary }}>1 credit</strong>. You have {user.credits} credits remaining.</span>
              </div>
            )}

            <Btn onClick={runAudit} disabled={!canRun} size="lg" style={{ padding: 16, fontSize: 15, width: "100%" }}>
              Run listing audit →
            </Btn>
          </div>
        </div>
      )}

      {phase === "loading" && (
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 48, padding: 40 }}>
          <div style={{ textAlign: "center", maxWidth: 460 }}>
            <div style={{ width: 56, height: 56, margin: "0 auto 28px", border: `3px solid ${C.borderLight}`, borderTop: `3px solid ${C.primary}`, borderRadius: "50%", animation: "spin 0.9s linear infinite" }}/>
            <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 12, letterSpacing: "-0.02em", color: C.primary }}>
              <Serif style={{ fontStyle: "italic", fontWeight: 500 }}>Analyzing</Serif> your listing
            </h2>
            <p style={{ color: C.textSecondary, fontSize: 15 }}>Researching competitors and generating your report. This usually takes 30–60 seconds.</p>
          </div>
          <div style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", gap: 8 }}>
            {STEPS.map((step,i) => {
              const done = i < loadStep, active = i === loadStep;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 10, background: active ? C.accentSoft : done ? C.greenSoft : "white", border: `1px solid ${active ? "#bfdbfe" : done ? "#a7f3d0" : C.border}`, transition: "all 0.3s" }}>
                  <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {done ? <span style={{ color: C.green, fontWeight: 700, fontSize: 15 }}>✓</span> : active ? <Spinner size={16}/> : <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.border }}/>}
                  </div>
                  <span style={{ fontSize: 14, color: done ? C.green : active ? C.primary : C.mutedLight, fontWeight: active || done ? 500 : 400 }}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {phase === "report" && report && (
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "48px 32px 80px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ fontSize: 12, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Audit Complete</div>
              <h1 style={{ fontWeight: 700, fontSize: 40, letterSpacing: "-0.025em", color: C.primary, lineHeight: 1.15, marginBottom: 8 }}>
                Your <Serif style={{ fontStyle: "italic", fontWeight: 500 }}>optimization</Serif> report
              </h1>
              <p style={{ color: C.muted, fontSize: 14 }}>Generated {category ? `for ${category} · ` : ""}{new Date().toLocaleDateString()}</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn variant="outline" size="sm" onClick={()=>exportToPDF(report, user.email)}>Export PDF</Btn>
              <Btn variant="ghost" size="sm" onClick={()=>setPhase("input")}>← New audit</Btn>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 20, marginBottom: 32 }}>
            <Card elevated delay={0.05} style={{ padding: 32 }}>
              <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 24 }}>Overall Score</div>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <ScoreRing score={report.overallScore} size={130}/>
                <div>
                  <Serif style={{ fontWeight: 600, fontSize: 26, letterSpacing: "-0.02em", color: C.primary, display: "block" }}>
                    {report.overallScore >= 80 ? "Excellent" : report.overallScore >= 60 ? "Needs Work" : "Critical"}
                  </Serif>
                  <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 6, lineHeight: 1.5 }}>
                    {report.overallScore >= 80 ? "Well-optimized" : report.overallScore >= 60 ? "Room to grow." : "Major fixes needed."}
                  </div>
                </div>
              </div>
            </Card>
            <Card delay={0.1} style={{ padding: 28 }}>
              <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>Competitors Analyzed</div>
              <Serif style={{ fontWeight: 600, fontSize: 56, color: C.primary, display: "block", letterSpacing: "-0.03em", lineHeight: 1 }}>{report.competitorsResearched || 0}</Serif>
              <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 10 }}>ASINs benchmarked</div>
            </Card>
            <Card delay={0.15} style={{ padding: 28 }}>
              <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>Issues Found</div>
              <Serif style={{ fontWeight: 600, fontSize: 56, color: (report.issues?.length||0) > 4 ? C.yellow : C.green, display: "block", letterSpacing: "-0.03em", lineHeight: 1 }}>{report.issues?.length || 0}</Serif>
              <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 10 }}>With prioritized fixes</div>
            </Card>
          </div>

          <Card delay={0.2} style={{ padding: 32, marginBottom: 32, background: C.bgAlt }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, color: "white" }}>💡</div>
              <div>
                <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Executive Summary</div>
                <p style={{ color: C.primary, fontSize: 16, lineHeight: 1.7, fontWeight: 400 }}>{report.overallSummary}</p>
              </div>
            </div>
          </Card>

          <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${C.border}` }}>
            {[{id:"audit",label:"Audit"},{id:"keywords",label:"Keywords"},{id:"rewrite",label:"AI Rewrite"},{id:"competitor",label:"Competitors"}].map(t => (
              <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
                padding: "12px 20px", border: "none",
                background: "transparent",
                color: activeTab === t.id ? C.primary : C.muted,
                fontWeight: activeTab === t.id ? 600 : 500, fontSize: 14,
                cursor: "pointer", position: "relative",
                borderBottom: `2px solid ${activeTab === t.id ? C.primary : "transparent"}`,
                marginBottom: -1, transition: "all 0.15s"
              }}>{t.label}</button>
            ))}
          </div>

          {activeTab === "audit" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Card delay={0.05}>
                <CardHeader title="Category scores"/>
                <div style={{ padding: 28 }}>
                  {report.scores?.map((s,i) => <ScoreBar key={i} label={s.label} value={s.value} max={s.max||10} delay={i*0.08}/>)}
                </div>
              </Card>
              <Card delay={0.1}>
                <CardHeader title="Issues & recommendations" badge={{label:`${report.issues?.length||0} found`,color:"yellow"}}/>
                <div style={{ padding: "0 28px" }}>
                  {report.issues?.map((iss,i) => (
                    <div key={i} style={{ padding: "20px 0", borderBottom: i < report.issues.length - 1 ? `1px solid ${C.borderLight}` : "none", display: "flex", gap: 16 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, background: iss.type === "error" ? C.redSoft : iss.type === "warning" ? C.yellowSoft : C.greenSoft, flexShrink: 0 }}>
                        {iss.type === "error" ? "❌" : iss.type === "warning" ? "⚠️" : "💡"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 15, color: C.primary, marginBottom: 6 }}>{iss.title}</div>
                        <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>{iss.description}</div>
                        {iss.fix && <div style={{ fontSize: 14, color: C.green, marginTop: 10, fontWeight: 500, background: C.greenSoft, padding: "10px 14px", borderRadius: 8, borderLeft: `3px solid ${C.green}` }}>→ {iss.fix}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card delay={0.15}>
                <CardHeader title="Prioritized action plan"/>
                <div style={{ padding: 28 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
                    {report.actions?.map((a,i) => {
                      const pc = a.priority === "high" ? C.red : a.priority === "medium" ? C.yellow : C.green;
                      const pbg = a.priority === "high" ? C.redSoft : a.priority === "medium" ? C.yellowSoft : C.greenSoft;
                      const pl = a.priority === "high" ? "High" : a.priority === "medium" ? "Medium" : "Low";
                      return (
                        <div key={i} style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 10, padding: 18 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: pc, background: pbg, display: "inline-block", padding: "3px 10px", borderRadius: 20, marginBottom: 12, letterSpacing: "0.03em", textTransform: "uppercase" }}>{pl} priority</div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: C.primary, marginBottom: 6 }}>{a.title}</div>
                          <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6 }}>{a.description}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "keywords" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Card delay={0.05}>
                <CardHeader title="Keywords you have" badge={{label:`${report.keywords?.have?.length||0} present`,color:"green"}}/>
                <div style={{ padding: 24 }}>{report.keywords?.have?.map((k,i) => <Tag key={i} label={k} variant="have" delay={i*0.02}/>)}</div>
              </Card>
              <Card delay={0.1}>
                <CardHeader title="Missing keywords" badge={{label:`${report.keywords?.missing?.length||0} gaps`,color:"red"}}/>
                <div style={{ padding: 24 }}>
                  <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 16 }}>High-value keywords in competitor listings that you're missing. Add these to your title, bullets, or backend search terms.</p>
                  <div>{report.keywords?.missing?.map((k,i) => <Tag key={i} label={k} variant="missing" delay={i*0.02}/>)}</div>
                </div>
              </Card>
              <Card delay={0.15}>
                <CardHeader title="Opportunity keywords" badge={{label:"Recommended",color:"blue"}}/>
                <div style={{ padding: 24 }}>
                  <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 16 }}>Strategic keywords to add for maximum discoverability.</p>
                  <div>{report.keywords?.opportunities?.map((k,i) => <Tag key={i} label={k} variant="opportunity" delay={i*0.02}/>)}</div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "rewrite" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Card delay={0.05}>
                <CardHeader title="Optimized title" badge={{label:"AI rewritten",color:"blue"}}/>
                <div style={{ padding: 28 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 10, fontWeight: 600 }}>Original</div>
                  <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, fontSize: 14, color: C.textSecondary, marginBottom: 20, lineHeight: 1.7 }}>{report.rewrite?.originalTitle}</div>
                  <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.accent, marginBottom: 10, fontWeight: 600 }}>Optimized</div>
                  <div style={{ background: C.accentSoft, border: `1px solid #bfdbfe`, borderRadius: 8, padding: 16, fontSize: 14, lineHeight: 1.7, color: C.primary, fontWeight: 500 }}>{report.rewrite?.optimizedTitle}</div>
                </div>
              </Card>
              <Card delay={0.1}>
                <CardHeader title="Optimized bullet points" badge={{label:"AI rewritten",color:"blue"}} action={<button onClick={()=>navigator.clipboard.writeText(report.rewrite?.optimizedBullets?.join("\n\n") || "")} style={{background:"white", border:`1px solid ${C.border}`, color:C.primary, padding:"6px 14px", borderRadius:6, fontSize:12, cursor:"pointer", fontWeight:500}}>Copy all</button>}/>
                <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 12 }}>
                  {report.rewrite?.optimizedBullets?.map((b,i) => (
                    <div key={i} style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, fontSize: 14, lineHeight: 1.7, display: "flex", gap: 14, animation: `fadeUp 0.4s ease ${i*0.05}s both` }}>
                      <div style={{ background: C.primary, color: "white", width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{i+1}</div>
                      <span style={{ color: C.primary }}>{b}</span>
                    </div>
                  ))}
                </div>
              </Card>
              {report.rewrite?.optimizedDescription && (
                <Card delay={0.15}>
                  <CardHeader title="Optimized description" badge={{label:"AI rewritten",color:"blue"}}/>
                  <div style={{ padding: 28 }}>
                    <div style={{ background: C.accentSoft, border: `1px solid #bfdbfe`, borderRadius: 8, padding: 18, fontSize: 14, lineHeight: 1.85, whiteSpace: "pre-wrap", color: C.primary }}>{report.rewrite.optimizedDescription}</div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === "competitor" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Card delay={0.05}>
                <CardHeader title="Competitor comparison"/>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                      <tr>{["Listing","Key Specs","Differentiator","Strength","Gap"].map((h,i) => (
                        <th key={i} style={{ textAlign: "left", padding: "14px 20px", background: C.bgAlt, color: C.muted, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {report.competitors?.map((c,i) => (
                        <tr key={i} style={{ background: c.isYours ? C.accentSoft : "transparent" }}>
                          <td style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}`, fontWeight: c.isYours ? 600 : 500, color: C.primary }}>
                            {c.name}{c.isYours && <span style={{ marginLeft: 8, fontSize: 10, background: C.accent, color: "white", padding: "2px 8px", borderRadius: 20, fontWeight: 600, letterSpacing: "0.05em" }}>YOU</span>}
                          </td>
                          <td style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}`, color: C.textSecondary }}>{c.specs}</td>
                          <td style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}`, color: C.textSecondary }}>{c.differentiator}</td>
                          <td style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}`, color: C.green, fontWeight: 500 }}>{c.strength}</td>
                          <td style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}`, color: c.gap === "—" ? C.muted : C.red, fontWeight: c.gap === "—" ? 400 : 500 }}>{c.gap}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
              <Card delay={0.1}>
                <CardHeader title="Competitive insights"/>
                <div style={{ padding: "0 28px" }}>
                  {report.insights?.map((ins,i) => (
                    <div key={i} style={{ padding: "20px 0", borderBottom: i < report.insights.length - 1 ? `1px solid ${C.borderLight}` : "none", display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 24 }}>{ins.emoji || "📌"}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: C.primary, marginBottom: 6 }}>{ins.title}</div>
                        <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.65 }}>{ins.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BUY CREDITS MODAL
// ══════════════════════════════════════════════════════════════════════════════
function BuyCreditsModal({ onClose, onPurchase }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24, animation: "fadeIn 0.2s ease both" }}>
      <div style={{ background: "white", borderRadius: 16, padding: 36, width: "100%", maxWidth: 460, animation: "fadeUp 0.3s ease both", boxShadow: "0 20px 60px rgba(15,23,42,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontWeight: 700, fontSize: 24, letterSpacing: "-0.02em", color: C.primary }}>Get more credits</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: 24, cursor: "pointer" }}>×</button>
        </div>
        <p style={{ color: C.textSecondary, fontSize: 14, marginBottom: 20 }}>Choose how many credits you'd like to add to your account.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            {credits:1, price:"$1", tag:"Single audit"},
            {credits:5, price:"$4", tag:"Save 20%"},
            {credits:15, price:"$10", tag:"Save 33%", popular:true},
          ].map((p,i) => (
            <div key={i} onClick={()=>onPurchase(p.credits)} style={{
              padding: "16px 20px", borderRadius: 10, cursor: "pointer",
              border: `1.5px solid ${p.popular?C.accent:C.border}`,
              background: p.popular?C.accentSoft:"white",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              transition: "all 0.15s",
            }}>
              <div>
                <Serif style={{ fontWeight: 600, fontSize: 18, color: C.primary, display: "block" }}>{p.credits} {p.credits===1?"credit":"credits"}</Serif>
                <div style={{ fontSize: 12, color: p.popular?C.accent:C.muted, marginTop: 4, fontWeight: 500 }}>{p.tag}</div>
              </div>
              <Serif style={{ fontWeight: 600, fontSize: 22, color: C.primary }}>{p.price}</Serif>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, padding: 14, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.textSecondary, textAlign: "center" }}>
          💳 Secure checkout via Stripe · Coming soon
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const { user, signup, login, logout, deductCredit, addCredits } = useAuth();
  const [authModal, setAuthModal] = useState(null);
  const [initialPlan, setInitialPlan] = useState("starter");
  const [creditsModal, setCreditsModal] = useState(false);

  const handleAuth = (email, password, plan) => {
    try {
      if (authModal === "signup") signup(email, plan);
      else login(email);
      setAuthModal(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSelectPlan = (plan) => {
    setInitialPlan(plan);
    setAuthModal("signup");
  };

  const handlePurchase = (credits) => {
    addCredits(credits);
    setCreditsModal(false);
    alert(`✅ ${credits} credits added! (Note: In production, Stripe checkout will run here.)`);
  };

  return (
    <>
      <style>{G}</style>
      {user
        ? <AuditTool user={user} onLogout={logout} onDeductCredit={deductCredit} onBuyCredits={()=>setCreditsModal(true)}/>
        : <Landing onGetStarted={()=>{setInitialPlan("starter"); setAuthModal("signup");}} onLogin={()=>setAuthModal("login")} onSelectPlan={handleSelectPlan}/>
      }
      {authModal && (
        <AuthModal
          mode={authModal}
          initialPlan={initialPlan}
          onAuth={handleAuth}
          onClose={()=>setAuthModal(null)}
          onSwitch={()=>setAuthModal(authModal === "signup" ? "login" : "signup")}
        />
      )}
      {creditsModal && user && (
        <BuyCreditsModal onClose={()=>setCreditsModal(false)} onPurchase={handlePurchase}/>
      )}
    </>
  );
}
