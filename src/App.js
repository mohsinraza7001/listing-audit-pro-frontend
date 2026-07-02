import { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#0b0d12", surface: "#13161e", surface2: "#1a1e28",
  border: "#252b3b", accent: "#f59e0b", green: "#34d399",
  red: "#f87171", blue: "#60a5fa", muted: "#6b7280", text: "#e5e7eb",
  purple: "#a78bfa",
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0b0d12;font-family:'DM Sans',sans-serif;color:#e5e7eb;}
  ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:#13161e;}::-webkit-scrollbar-thumb{background:#252b3b;border-radius:3px;}
  textarea,input{font-family:'DM Sans',sans-serif;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  @keyframes spin{to{transform:rotate(360deg);}}
  @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(245,158,11,0.2);}50%{box-shadow:0 0 40px rgba(245,158,11,0.4);}}
`;

const Syne = ({ children, style = {} }) => <span style={{ fontFamily: "Syne, sans-serif", ...style }}>{children}</span>;

function ScoreRing({ score, size = 90 }) {
  const r = (size - 10) / 2, circ = 2 * Math.PI * r;
  const color = score >= 75 ? C.green : score >= 50 ? C.accent : C.red;
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={6}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{transition:"stroke-dashoffset 1s ease"}}/>
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em"
        style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:size*0.22,fill:color}}>{score}</text>
    </svg>
  );
}

function ScoreBar({ label, value, max = 10 }) {
  const pct = (value/max)*100, color = pct>=75?C.green:pct>=50?C.accent:C.red;
  return (
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        <span style={{fontSize:13,color:C.muted}}>{label}</span>
        <span style={{fontSize:13,fontWeight:600,color}}>{value}/{max}</span>
      </div>
      <div style={{height:6,background:C.border,borderRadius:4}}>
        <div style={{width:`${pct}%`,height:6,background:color,borderRadius:4,transition:"width 1s ease"}}/>
      </div>
    </div>
  );
}

function Tag({ label, variant }) {
  const color = variant==="have"?C.green:C.red;
  return <span style={{fontSize:12,padding:"4px 12px",borderRadius:20,border:`1px solid ${color}40`,color,background:`${color}10`,display:"inline-block",margin:"3px 4px"}}>{label}</span>;
}

function Card({ children, style={}, delay=0 }) {
  return <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",animation:`fadeUp 0.4s ease ${delay}s both`,...style}}>{children}</div>;
}

function CardHeader({ icon, title, badge }) {
  const bColor = badge?.color==="green"?C.green:badge?.color==="red"?C.red:badge?.color==="blue"?C.blue:C.accent;
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 24px",background:C.surface2,borderBottom:`1px solid ${C.border}`}}>
      <span style={{fontSize:20}}>{icon}</span>
      <span style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:15,flex:1}}>{title}</span>
      {badge&&<span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:`${bColor}18`,color:bColor,letterSpacing:"0.5px",textTransform:"uppercase"}}>{badge.label}</span>}
    </div>
  );
}

function Spinner({ size=22, color=C.accent }) {
  return <div style={{width:size,height:size,border:`3px solid ${C.border}`,borderTop:`3px solid ${color}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>;
}

function Btn({ children, onClick, variant="primary", disabled=false, style={} }) {
  const bg = variant==="primary"?C.accent:variant==="ghost"?C.surface2:"transparent";
  const fg = variant==="primary"?"#000":C.text;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background:disabled?C.border:bg, color:disabled?C.muted:fg,
      border:variant==="outline"?`1px solid ${C.border}`:"none",
      borderRadius:10, padding:"12px 24px", fontFamily:"Syne,sans-serif",
      fontWeight:700, fontSize:14, cursor:disabled?"not-allowed":"pointer",
      transition:"all 0.2s", opacity:disabled?0.6:1, ...style
    }}>{children}</button>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function useAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("alap_user")); } catch { return null; }
  });

  const signup = (email, password, plan) => {
    const u = { email, plan, token: btoa(email+":"+Date.now()), createdAt: Date.now() };
    localStorage.setItem("alap_user", JSON.stringify(u));
    setUser(u);
    return u;
  };

  const login = (email) => {
    const stored = JSON.parse(localStorage.getItem("alap_user") || "null");
    if (stored && stored.email === email) { setUser(stored); return stored; }
    throw new Error("No account found. Please sign up.");
  };

  const logout = () => { localStorage.removeItem("alap_user"); setUser(null); };

  return { user, signup, login, logout };
}

// ── LANDING PAGE ──────────────────────────────────────────────────────────────
function Landing({ onGetStarted, onLogin }) {
  return (
    <div>
      <nav style={{position:"sticky",top:0,zIndex:100,background:`${C.bg}ee`,backdropFilter:"blur(12px)",borderBottom:`1px solid ${C.border}`,padding:"14px 32px",display:"flex",alignItems:"center",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
          <div style={{width:34,height:34,borderRadius:9,background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>✦</div>
          <Syne style={{fontWeight:800,fontSize:16}}>Listing Audit Pro</Syne>
        </div>
        <Btn variant="ghost" onClick={onLogin} style={{padding:"9px 18px",fontSize:13}}>Log In</Btn>
        <Btn onClick={onGetStarted} style={{padding:"9px 18px",fontSize:13}}>Get Started →</Btn>
      </nav>

      <div style={{textAlign:"center",padding:"100px 24px 80px",maxWidth:760,margin:"0 auto"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:11,fontWeight:600,letterSpacing:"2px",textTransform:"uppercase",color:C.accent,background:`${C.accent}15`,padding:"5px 16px",borderRadius:20,marginBottom:28}}>
          ✦ AI-Powered · Amazon SEO
        </div>
        <h1 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(32px,6vw,60px)",lineHeight:1.1,marginBottom:24}}>
          Outrank Every<br/><span style={{color:C.accent}}>Amazon Competitor</span>
        </h1>
        <p style={{color:C.muted,fontSize:18,lineHeight:1.7,marginBottom:40,maxWidth:540,margin:"0 auto 40px"}}>
          Paste your listing + competitor ASINs. Get an instant AI audit with keyword gaps, score breakdown, and a fully rewritten listing ready to copy.
        </p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <Btn onClick={onGetStarted} style={{padding:"16px 36px",fontSize:16,animation:"glow 3s ease infinite"}}>Start Free Audit →</Btn>
          <Btn variant="ghost" onClick={onGetStarted} style={{padding:"16px 28px",fontSize:16}}>See Pricing</Btn>
        </div>
        <p style={{color:C.muted,fontSize:13,marginTop:16}}>No credit card required to start</p>
      </div>

      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 24px 100px"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <Syne style={{fontWeight:800,fontSize:"clamp(24px,4vw,36px)"}}>Everything you need to dominate</Syne>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
          {[
            {icon:"🔍",title:"Competitor ASIN Research",desc:"Add up to 10 competitor ASINs. AI benchmarks specs, keywords, and positioning against your listing."},
            {icon:"📊",title:"7-Dimension Score Audit",desc:"Get scored on title, keywords, bullets, specs, description, differentiation, and trust signals."},
            {icon:"🔑",title:"Keyword Gap Analysis",desc:"See exactly which high-value keywords your competitors rank for that you're missing."},
            {icon:"✍️",title:"AI-Rewritten Listing",desc:"Get a fully optimized title, 5 bullets, and description — ready to copy-paste into Seller Central."},
            {icon:"⚠️",title:"Issue Detection",desc:"Typos, weak claims, missing safety signals, spec disadvantages — flagged with specific fixes."},
            {icon:"🚀",title:"Prioritized Action Plan",desc:"High/medium/low priority actions so you know exactly what to fix first for maximum impact."},
          ].map((f,i) => (
            <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:24,animation:`fadeUp 0.4s ease ${i*0.08}s both`}}>
              <div style={{fontSize:32,marginBottom:14}}>{f.icon}</div>
              <Syne style={{fontWeight:700,fontSize:16,display:"block",marginBottom:8}}>{f.title}</Syne>
              <p style={{fontSize:14,color:C.muted,lineHeight:1.6}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="pricing" style={{maxWidth:860,margin:"0 auto",padding:"0 24px 100px"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <Syne style={{fontWeight:800,fontSize:"clamp(24px,4vw,36px)"}}>Simple Pricing</Syne>
          <p style={{color:C.muted,marginTop:12,fontSize:16}}>Start free. Upgrade when you're ready.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:20}}>
          {[
            {name:"Starter",price:"Free",period:"forever",color:C.green,features:["3 audits / month","Up to 4 competitor ASINs","Full score breakdown","Keyword gap analysis"],cta:"Start Free"},
            {name:"Pro",price:"$29",period:"/month",color:C.accent,popular:true,features:["Unlimited audits","Up to 10 competitor ASINs","AI-rewritten listing","Priority support","Export to PDF"],cta:"Get Pro"},
            {name:"Agency",price:"$79",period:"/month",color:C.purple,features:["Everything in Pro","Team seats (5 users)","White-label reports","API access","Dedicated support"],cta:"Get Agency"},
          ].map((p,i) => (
            <div key={i} style={{
              background:p.popular?`${C.accent}08`:C.surface,
              border:`2px solid ${p.popular?C.accent:C.border}`,
              borderRadius:16, padding:28,
              position:"relative", animation:`fadeUp 0.4s ease ${i*0.1}s both`
            }}>
              {p.popular&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:C.accent,color:"#000",fontSize:11,fontWeight:700,padding:"3px 14px",borderRadius:20,whiteSpace:"nowrap"}}>MOST POPULAR</div>}
              <Syne style={{fontWeight:700,fontSize:13,color:p.color,letterSpacing:"1px",textTransform:"uppercase",display:"block",marginBottom:12}}>{p.name}</Syne>
              <div style={{marginBottom:20}}>
                <Syne style={{fontWeight:800,fontSize:36,color:C.text}}>{p.price}</Syne>
                <span style={{color:C.muted,fontSize:14}}>{p.period}</span>
              </div>
              <ul style={{listStyle:"none",marginBottom:28}}>
                {p.features.map((f,j) => (
                  <li key={j} style={{fontSize:14,color:C.muted,padding:"6px 0",display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{color:p.color,flexShrink:0}}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Btn onClick={onGetStarted} variant={p.popular?"primary":"ghost"} style={{width:"100%",padding:"12px"}}>{p.cta}</Btn>
            </div>
          ))}
        </div>
      </div>

      <div style={{borderTop:`1px solid ${C.border}`,padding:"32px 24px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center",marginBottom:12}}>
          <div style={{width:28,height:28,borderRadius:7,background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>✦</div>
          <Syne style={{fontWeight:700,fontSize:14}}>Listing Audit Pro</Syne>
        </div>
        <p style={{color:C.muted,fontSize:13}}>© {new Date().getFullYear()} Listing Audit Pro. All rights reserved.</p>
      </div>
    </div>
  );
}

// ── AUTH MODAL ────────────────────────────────────────────────────────────────
function AuthModal({ mode, onAuth, onClose, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState("free");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inp = { width:"100%",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:9,padding:"11px 14px",color:C.text,fontSize:14,outline:"none" };

  const handle = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try { await new Promise(r => setTimeout(r, 600)); onAuth(email, password, plan); }
    catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:24}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:36,width:"100%",maxWidth:420,animation:"fadeUp 0.3s ease both"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <Syne style={{fontWeight:800,fontSize:22}}>{mode==="signup"?"Create Account":"Welcome Back"}</Syne>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:22,cursor:"pointer"}}>×</button>
        </div>

        {error&&<div style={{background:`${C.red}15`,border:`1px solid ${C.red}40`,borderRadius:8,padding:"10px 14px",fontSize:13,color:C.red,marginBottom:16}}>{error}</div>}

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={{fontSize:12,color:C.muted,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",display:"block",marginBottom:7}}>Email</label>
            <input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
          </div>
          <div>
            <label style={{fontSize:12,color:C.muted,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",display:"block",marginBottom:7}}>Password</label>
            <input style={inp} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>
          </div>
          {mode==="signup"&&(
            <div>
              <label style={{fontSize:12,color:C.muted,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",display:"block",marginBottom:7}}>Plan</label>
              <select style={{...inp,cursor:"pointer"}} value={plan} onChange={e=>setPlan(e.target.value)}>
                <option value="free">Starter — Free (3 audits/month)</option>
                <option value="pro">Pro — $29/month (Unlimited)</option>
                <option value="agency">Agency — $79/month (Team)</option>
              </select>
            </div>
          )}
        </div>

        <Btn onClick={handle} disabled={loading} style={{width:"100%",marginTop:24,padding:"14px"}}>
          {loading?<span style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><Spinner size={18} color="#000"/> Processing…</span>:mode==="signup"?"Create Account →":"Log In →"}
        </Btn>

        <p style={{textAlign:"center",fontSize:13,color:C.muted,marginTop:20}}>
          {mode==="signup"?"Already have an account? ":"Don't have an account? "}
          <span onClick={onSwitch} style={{color:C.accent,cursor:"pointer",fontWeight:600}}>
            {mode==="signup"?"Log In":"Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ── AUDIT TOOL ────────────────────────────────────────────────────────────────
function AuditTool({ user, onLogout }) {
  const [phase, setPhase] = useState("input");
  const [report, setReport] = useState(null);
  const [loadStep, setLoadStep] = useState(0);
  const [activeTab, setActiveTab] = useState("audit");

  const [asins, setAsins] = useState(["","",""]);
  const [title, setTitle] = useState("");
  const [bullets, setBullets] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const STEPS = ["Parsing your listing","Researching competitor ASINs","Running keyword gap analysis","Scoring performance","Generating AI rewrite","Compiling report"];

  const inp = { width:"100%",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:14,outline:"none",transition:"border-color 0.2s" };

  const runAudit = async () => {
    setPhase("loading"); setLoadStep(0);
    const iv = setInterval(()=>setLoadStep(p=>p>=STEPS.length-2?p:p+1), 1800);

    try {
      const res = await fetch(`${API_URL}/api/audit`, {
        method:"POST",
        headers:{"Content-Type":"application/json","x-user-token":user.token},
        body: JSON.stringify({title,bullets,description,category,asins:asins.filter(a=>a.trim())})
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error||"Server error");
      clearInterval(iv); setLoadStep(STEPS.length-1);
      setTimeout(()=>{ setReport(data.report); setPhase("report"); setActiveTab("audit"); },600);
    } catch(err) {
      clearInterval(iv);
      alert("Error: "+err.message); setPhase("input");
    }
  };

  const canRun = title.trim() && bullets.trim();

  return (
    <div style={{minHeight:"100vh"}}>
      <nav style={{background:`${C.bg}ee`,backdropFilter:"blur(12px)",borderBottom:`1px solid ${C.border}`,padding:"14px 24px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:100}}>
        <div style={{width:32,height:32,borderRadius:8,background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✦</div>
        <Syne style={{fontWeight:800,fontSize:15,flex:1}}>Listing Audit Pro</Syne>
        <span style={{fontSize:12,background:user.plan==="pro"?`${C.accent}20`:user.plan==="agency"?`${C.purple}20`:`${C.green}20`,color:user.plan==="pro"?C.accent:user.plan==="agency"?C.purple:C.green,padding:"3px 10px",borderRadius:20,fontWeight:600,textTransform:"uppercase"}}>{user.plan}</span>
        <span style={{fontSize:13,color:C.muted}}>{user.email}</span>
        <button onClick={onLogout} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:13}}>Log Out</button>
      </nav>

      {phase==="input"&&(
        <div style={{maxWidth:820,margin:"0 auto",padding:"40px 24px 80px"}}>
          <div style={{marginBottom:40}}>
            <Syne style={{fontWeight:800,fontSize:"clamp(22px,4vw,34px)",display:"block",marginBottom:8}}>New Listing Audit</Syne>
            <p style={{color:C.muted,fontSize:15}}>Paste your listing and competitor ASINs to get your full optimization report.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:22}}>

            <Card>
              <CardHeader icon="🏷️" title="Product Category (optional)"/>
              <div style={{padding:24}}>
                <input style={inp} value={category} placeholder="e.g. Handheld Clothes Steamers, Yoga Mats…" onChange={e=>setCategory(e.target.value)} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
              </div>
            </Card>

            <Card>
              <CardHeader icon="📦" title="Your Listing" badge={{label:"Required",color:"yellow"}}/>
              <div style={{padding:24,display:"flex",flexDirection:"column",gap:18}}>
                <div>
                  <label style={{fontSize:12,color:C.muted,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",display:"block",marginBottom:7}}>Title *</label>
                  <input style={inp} value={title} placeholder="Paste your full Amazon product title…" onChange={e=>setTitle(e.target.value)} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
                </div>
                <div>
                  <label style={{fontSize:12,color:C.muted,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",display:"block",marginBottom:7}}>Bullet Points *</label>
                  <textarea style={{...inp,resize:"vertical",minHeight:150,lineHeight:1.6}} value={bullets} placeholder={"• Bullet 1\n• Bullet 2\n• Bullet 3…"} onChange={e=>setBullets(e.target.value)} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
                </div>
                <div>
                  <label style={{fontSize:12,color:C.muted,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",display:"block",marginBottom:7}}>Description <span style={{color:C.muted,fontWeight:400,textTransform:"none"}}>(recommended)</span></label>
                  <textarea style={{...inp,resize:"vertical",minHeight:110,lineHeight:1.6}} value={description} placeholder="Paste your product description…" onChange={e=>setDescription(e.target.value)} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader icon="🔍" title="Competitor ASINs" badge={{label:`${asins.length}/10`,color:"blue"}}/>
              <div style={{padding:24}}>
                <p style={{fontSize:13,color:C.muted,marginBottom:16}}>Add up to 10 competitor ASINs. AI will benchmark each one against your listing.</p>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {asins.map((a,i)=>(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:12,color:C.muted,width:22,flexShrink:0}}>{i+1}.</span>
                      <input style={{...inp,fontFamily:"monospace",letterSpacing:"0.5px"}} value={a} placeholder={`ASIN ${i+1} — e.g. B0GKM8MJSJ`} onChange={e=>setAsins(asins.map((x,j)=>j===i?e.target.value.toUpperCase():x))} maxLength={10} onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.border}/>
                      {asins.length>1&&<button onClick={()=>setAsins(asins.filter((_,j)=>j!==i))} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,width:34,height:34,borderRadius:8,cursor:"pointer",fontSize:18,flexShrink:0}}>×</button>}
                    </div>
                  ))}
                </div>
                {asins.length<10&&(
                  <button onClick={()=>setAsins([...asins,""])} style={{marginTop:12,background:"none",border:`1px dashed ${C.border}`,color:C.muted,padding:"9px",borderRadius:8,cursor:"pointer",fontSize:13,width:"100%"}}>+ Add Competitor ASIN</button>
                )}
              </div>
            </Card>

            <Btn onClick={runAudit} disabled={!canRun} style={{padding:"16px",fontSize:16,width:"100%"}}>✦ Run Listing Audit</Btn>
          </div>
        </div>
      )}

      {phase==="loading"&&(
        <div style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:32,padding:40}}>
          <div style={{textAlign:"center"}}>
            <div style={{width:64,height:64,border:`4px solid ${C.border}`,borderTop:`4px solid ${C.accent}`,borderRadius:"50%",animation:"spin 0.9s linear infinite",margin:"0 auto 24px"}}/>
            <Syne style={{fontWeight:700,fontSize:22,display:"block",marginBottom:8}}>Analyzing Your Listing</Syne>
            <p style={{color:C.muted,fontSize:14}}>Researching competitors and generating your audit…</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:380}}>
            {STEPS.map((step,i)=>{
              const done=i<loadStep, active=i===loadStep;
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",borderRadius:10,background:active?`${C.accent}12`:done?`${C.green}08`:C.surface,border:`1px solid ${active?C.accent+"40":done?C.green+"30":C.border}`,transition:"all 0.3s"}}>
                  <div style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {done?<span style={{color:C.green}}>✓</span>:active?<Spinner size={18}/>:<div style={{width:8,height:8,borderRadius:"50%",background:C.border}}/>}
                  </div>
                  <span style={{fontSize:13,color:done?C.green:active?C.text:C.muted,transition:"color 0.3s"}}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {phase==="report"&&report&&(
        <div style={{maxWidth:900,margin:"0 auto",padding:"40px 24px 80px"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28,flexWrap:"wrap",gap:14}}>
            <div>
              <div style={{fontSize:11,color:C.accent,letterSpacing:"2px",textTransform:"uppercase",fontWeight:600,marginBottom:8}}>✦ Audit Complete</div>
              <Syne style={{fontWeight:800,fontSize:"clamp(22px,4vw,32px)",display:"block"}}>Optimization Report</Syne>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setPhase("input")} style={{background:C.surface2,border:`1px solid ${C.border}`,color:C.muted,padding:"9px 16px",borderRadius:8,cursor:"pointer",fontSize:13}}>← New Audit</button>
            </div>
          </div>

          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:"26px 30px",marginBottom:24,display:"flex",gap:24,alignItems:"center",flexWrap:"wrap",animation:"fadeUp 0.4s ease both"}}>
            <ScoreRing score={report.overallScore} size={100}/>
            <div style={{flex:1,minWidth:200}}>
              <Syne style={{fontWeight:700,fontSize:20,display:"block",marginBottom:6}}>
                {report.overallScore>=80?"Well Optimized 🎉":report.overallScore>=60?"Needs Improvement ⚠️":"Critical Gaps Found 🚨"}
              </Syne>
              <p style={{color:C.muted,fontSize:14}}>{report.overallSummary}</p>
              {report.competitorsResearched>0&&<div style={{marginTop:10,fontSize:12,color:C.blue}}>📊 Benchmarked against {report.competitorsResearched} competitor{report.competitorsResearched>1?"s":""}</div>}
            </div>
          </div>

          <div style={{display:"flex",gap:6,marginBottom:24,background:C.surface,padding:6,borderRadius:12,border:`1px solid ${C.border}`,overflowX:"auto"}}>
            {[{id:"audit",label:"📊 Audit"},{id:"keywords",label:"🔑 Keywords"},{id:"rewrite",label:"✍️ Rewrite"},{id:"competitor",label:"🔍 Competitors"}].map(t=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{flex:1,padding:"9px 12px",border:"none",borderRadius:8,background:activeTab===t.id?C.accent:"transparent",color:activeTab===t.id?"#000":C.muted,fontFamily:"Syne,sans-serif",fontWeight:600,fontSize:12,cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap",minWidth:80}}>{t.label}</button>
            ))}
          </div>

          {activeTab==="audit"&&(
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <Card delay={0.05}>
                <CardHeader icon="📊" title="Category Scores"/>
                <div style={{padding:24}}>{report.scores?.map((s,i)=><ScoreBar key={i} label={s.label} value={s.value} max={s.max||10}/>)}</div>
              </Card>
              <Card delay={0.1}>
                <CardHeader icon="⚠️" title="Issues & Recommendations" badge={{label:`${report.issues?.length||0} found`,color:"yellow"}}/>
                <div style={{padding:"0 24px"}}>
                  {report.issues?.map((iss,i)=>(
                    <div key={i} style={{padding:"16px 0",borderBottom:i<report.issues.length-1?`1px solid ${C.border}`:"none",display:"flex",gap:14}}>
                      <div style={{width:30,height:30,borderRadius:7,flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,background:iss.type==="error"?`${C.red}18`:iss.type==="warning"?`${C.accent}18`:`${C.green}18`}}>
                        {iss.type==="error"?"❌":iss.type==="warning"?"⚠️":"💡"}
                      </div>
                      <div>
                        <div style={{fontWeight:500,fontSize:14,marginBottom:4}}>{iss.title}</div>
                        <div style={{fontSize:13,color:C.muted}}>{iss.description}</div>
                        {iss.fix&&<div style={{fontSize:13,color:C.green,marginTop:6,fontStyle:"italic"}}>→ {iss.fix}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card delay={0.15}>
                <CardHeader icon="🚀" title="Prioritized Action Plan"/>
                <div style={{padding:24}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14}}>
                    {report.actions?.map((a,i)=>{
                      const pc=a.priority==="high"?C.red:a.priority==="medium"?C.accent:C.green;
                      const pl=a.priority==="high"?"🔴 High":a.priority==="medium"?"🟡 Medium":"🟢 Low";
                      return (
                        <div key={i} style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:16}}>
                          <div style={{fontSize:11,fontWeight:700,color:pc,marginBottom:8,letterSpacing:"0.5px"}}>{pl}</div>
                          <div style={{fontSize:14,fontWeight:500,marginBottom:4}}>{a.title}</div>
                          <div style={{fontSize:12,color:C.muted}}>{a.description}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab==="keywords"&&(
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <Card delay={0.05}>
                <CardHeader icon="✅" title="Keywords You Have" badge={{label:`${report.keywords?.have?.length||0}`,color:"green"}}/>
                <div style={{padding:24}}>{report.keywords?.have?.map((k,i)=><Tag key={i} label={k} variant="have"/>)}</div>
              </Card>
              <Card delay={0.1}>
                <CardHeader icon="❌" title="Missing Keywords" badge={{label:`${report.keywords?.missing?.length||0} gaps`,color:"red"}}/>
                <div style={{padding:24}}>
                  <p style={{fontSize:13,color:C.muted,marginBottom:14}}>High-value keywords in competitor listings that you're missing. Add these to your title, bullets, or backend search terms.</p>
                  <div>{report.keywords?.missing?.map((k,i)=><Tag key={i} label={k} variant="missing"/>)}</div>
                </div>
              </Card>
              <Card delay={0.15}>
                <CardHeader icon="💎" title="Opportunity Keywords" badge={{label:"Recommended",color:"blue"}}/>
                <div style={{padding:24}}>
                  <p style={{fontSize:13,color:C.muted,marginBottom:14}}>Strategic keywords to add for maximum discoverability.</p>
                  <div>{report.keywords?.opportunities?.map((k,i)=><Tag key={i} label={k} variant="have"/>)}</div>
                </div>
              </Card>
            </div>
          )}

          {activeTab==="rewrite"&&(
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <Card delay={0.05}>
                <CardHeader icon="✍️" title="Optimized Title" badge={{label:"AI Rewritten",color:"blue"}}/>
                <div style={{padding:24}}>
                  <div style={{fontSize:11,fontFamily:"Syne,sans-serif",letterSpacing:"2px",textTransform:"uppercase",color:C.muted,marginBottom:8}}>Original</div>
                  <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:9,padding:16,fontSize:14,color:C.muted,marginBottom:16,lineHeight:1.7}}>{report.rewrite?.originalTitle}</div>
                  <div style={{fontSize:11,fontFamily:"Syne,sans-serif",letterSpacing:"2px",textTransform:"uppercase",color:C.muted,marginBottom:8}}>Optimized ✦</div>
                  <div style={{background:`${C.accent}0d`,border:`1px solid ${C.accent}40`,borderRadius:9,padding:16,fontSize:14,lineHeight:1.7}}>{report.rewrite?.optimizedTitle}</div>
                </div>
              </Card>
              <Card delay={0.1}>
                <CardHeader icon="📋" title="Optimized Bullets" badge={{label:"AI Rewritten",color:"blue"}}/>
                <div style={{padding:24,display:"flex",flexDirection:"column",gap:12}}>
                  {report.rewrite?.optimizedBullets?.map((b,i)=>(
                    <div key={i} style={{background:`${C.accent}0d`,border:`1px solid ${C.accent}30`,borderRadius:9,padding:14,fontSize:14,lineHeight:1.7,display:"flex",gap:12}}>
                      <span style={{color:C.accent,fontWeight:700,flexShrink:0}}>{i+1}.</span><span>{b}</span>
                    </div>
                  ))}
                </div>
              </Card>
              {report.rewrite?.optimizedDescription&&(
                <Card delay={0.15}>
                  <CardHeader icon="📝" title="Optimized Description" badge={{label:"AI Rewritten",color:"blue"}}/>
                  <div style={{padding:24}}>
                    <div style={{background:`${C.accent}0d`,border:`1px solid ${C.accent}30`,borderRadius:9,padding:16,fontSize:14,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{report.rewrite.optimizedDescription}</div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab==="competitor"&&(
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <Card delay={0.05}>
                <CardHeader icon="📊" title="Competitor Comparison"/>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                    <thead>
                      <tr>{["Listing","Key Specs","Differentiator","Strength","Gap vs You"].map((h,i)=>(
                        <th key={i} style={{textAlign:"left",padding:"12px 16px",background:C.surface2,color:C.muted,fontFamily:"Syne,sans-serif",fontSize:11,letterSpacing:"1px",textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {report.competitors?.map((c,i)=>(
                        <tr key={i} style={{background:c.isYours?`${C.accent}08`:"transparent"}}>
                          <td style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,fontWeight:c.isYours?600:400}}>
                            {c.name}{c.isYours&&<span style={{marginLeft:6,fontSize:10,background:`${C.accent}25`,color:C.accent,padding:"2px 7px",borderRadius:10,fontWeight:600}}>YOU</span>}
                          </td>
                          <td style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,color:C.muted}}>{c.specs}</td>
                          <td style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>{c.differentiator}</td>
                          <td style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,color:C.green}}>{c.strength}</td>
                          <td style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,color:C.red}}>{c.gap}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
              <Card delay={0.1}>
                <CardHeader icon="💡" title="Competitive Insights"/>
                <div style={{padding:"0 24px"}}>
                  {report.insights?.map((ins,i)=>(
                    <div key={i} style={{padding:"16px 0",borderBottom:i<report.insights.length-1?`1px solid ${C.border}`:"none",display:"flex",gap:14,alignItems:"flex-start"}}>
                      <span style={{fontSize:20,flexShrink:0}}>{ins.emoji||"📌"}</span>
                      <div>
                        <div style={{fontWeight:500,fontSize:14,marginBottom:3}}>{ins.title}</div>
                        <div style={{fontSize:13,color:C.muted}}>{ins.description}</div>
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

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const { user, signup, login, logout } = useAuth();
  const [authModal, setAuthModal] = useState(null);

  const handleAuth = (email, password, plan) => {
    if (authModal==="signup") signup(email, password, plan);
    else login(email);
    setAuthModal(null);
  };

  return (
    <>
      <style>{G}</style>
      {user
        ? <AuditTool user={user} onLogout={logout}/>
        : <Landing onGetStarted={()=>setAuthModal("signup")} onLogin={()=>setAuthModal("login")}/>
      }
      {authModal&&(
        <AuthModal
          mode={authModal}
          onAuth={handleAuth}
          onClose={()=>setAuthModal(null)}
          onSwitch={()=>setAuthModal(authModal==="signup"?"login":"signup")}
        />
      )}
    </>
  );
}
