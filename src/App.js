import { useState, useEffect } from "react";

const API_URL = "";

// ══════════════════════════════════════════════════════════════
// DESIGN SYSTEM — Adaptoid Dark Navy + Teal
// ══════════════════════════════════════════════════════════════
const C = {
  bg:"#060b18",bgAlt:"#0b1121",surface:"#0f1629",surface2:"#141c32",surface3:"#1a2340",
  border:"#1e2a4a",borderLight:"#243052",
  accent:"#10b981",accentGlow:"#34d399",accent2:"#06b6d4",
  blue:"#3b82f6",purple:"#8b5cf6",
  green:"#10b981",greenSoft:"#10b98118",
  red:"#ef4444",redSoft:"#ef444418",
  yellow:"#f59e0b",yellowSoft:"#f59e0b18",
  text:"#e8edf5",textSec:"#8b9bc0",muted:"#5a6a8a",
  gradient:"linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-font-smoothing:antialiased;}
  html,body{background:#060b18;font-family:'Inter',system-ui,sans-serif;color:#e8edf5;line-height:1.6;overflow-x:hidden;}
  ::-webkit-scrollbar{width:8px;}::-webkit-scrollbar-track{background:#0b1121;}
  ::-webkit-scrollbar-thumb{background:#1e2a4a;border-radius:4px;}
  textarea,input,select,button{font-family:inherit;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  @keyframes spin{to{transform:rotate(360deg);}}
  @keyframes glow{0%,100%{box-shadow:0 0 30px #10b98125;}50%{box-shadow:0 0 50px #10b98140;}}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
  .playfair{font-family:'Playfair Display',serif;}
`;

const PF = ({children,style={}}) => <span className="playfair" style={style}>{children}</span>;

function GlowOrb({color=C.accent,size=400,style={}}) {
  return <div style={{position:"absolute",width:size,height:size,borderRadius:"50%",background:`radial-gradient(circle,${color}20 0%,transparent 70%)`,filter:"blur(60px)",pointerEvents:"none",...style}}/>;
}

function ScoreRing({score,size=140,sw=8}) {
  const r=(size-sw)/2,circ=2*Math.PI*r;
  const color=score>=80?C.green:score>=60?C.yellow:C.red;
  return (
    <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",width:size,height:size}}>
      <div style={{position:"absolute",inset:0,borderRadius:"50%",background:`radial-gradient(circle,${color}15 0%,transparent 60%)`,filter:"blur(15px)"}}/>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={sw}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)} strokeLinecap="round"
          style={{transition:"stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)",filter:`drop-shadow(0 0 6px ${color})`}}/>
      </svg>
      <div style={{position:"absolute",textAlign:"center"}}>
        <div style={{fontWeight:800,fontSize:size*0.28,lineHeight:1,color:C.text,letterSpacing:"-0.03em"}}>{score}</div>
        <div style={{fontSize:10,color:C.muted,marginTop:3,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>/ 100</div>
      </div>
    </div>
  );
}

function MiniBar({value,max=10,label,delay=0}) {
  const pct=(value/max)*100;const color=pct>=75?C.green:pct>=50?C.yellow:C.red;
  return (
    <div style={{marginBottom:16,animation:`fadeUp 0.4s ease ${delay}s both`}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        <span style={{fontSize:13,color:C.textSec,fontWeight:500}}>{label}</span>
        <span style={{fontSize:13,fontWeight:700,color}}>{value}/{max}</span>
      </div>
      <div style={{height:6,background:C.surface3,borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:3,transition:"width 1s ease",boxShadow:`0 0 8px ${color}50`}}/>
      </div>
    </div>
  );
}

function Tag({label,variant="have",delay=0}) {
  const colors={have:{bg:C.greenSoft,c:C.accentGlow,b:"#10b98130"},missing:{bg:C.redSoft,c:"#fca5a5",b:"#ef444430"},opp:{bg:"#3b82f618",c:"#93c5fd",b:"#3b82f630"}};
  const s=colors[variant]||colors.have;
  return <span style={{fontSize:12,padding:"5px 12px",borderRadius:6,border:`1px solid ${s.b}`,color:s.c,background:s.bg,display:"inline-block",margin:"3px 4px",fontWeight:500,animation:`fadeUp 0.3s ease ${delay}s both`}}>{label}</span>;
}

function Card({children,style={},delay=0,glow=false}) {
  return <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",animation:glow?`fadeUp 0.5s ease ${delay}s both, glow 4s ease-in-out infinite`:`fadeUp 0.5s ease ${delay}s both`,...style}}>{children}</div>;
}

function CardH({icon,title,badge,sub,action}) {
  const bc=badge?.c==="green"?C.green:badge?.c==="red"?C.red:badge?.c==="blue"?C.blue:C.yellow;
  return (
    <div style={{display:"flex",alignItems:"center",gap:14,padding:"18px 24px",borderBottom:`1px solid ${C.border}`}}>
      {icon&&<div style={{width:36,height:36,borderRadius:9,background:`${C.accent}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{icon}</div>}
      <div style={{flex:1}}>
        <div style={{fontWeight:600,fontSize:15,color:C.text}}>{title}</div>
        {sub&&<div style={{fontSize:12,color:C.muted,marginTop:2}}>{sub}</div>}
      </div>
      {badge&&<span style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:20,background:`${bc}18`,color:bc,letterSpacing:"0.05em",textTransform:"uppercase"}}>{badge.l}</span>}
      {action}
    </div>
  );
}

function Btn({children,onClick,variant="primary",disabled=false,style={},size="md"}) {
  const s={sm:"8px 16px",md:"11px 22px",lg:"15px 28px"};const f={sm:13,md:14,lg:15};
  const v={primary:{background:C.gradient,color:"white",boxShadow:"0 4px 20px #10b98130"},ghost:{background:C.surface2,color:C.text,border:`1px solid ${C.border}`},outline:{background:"transparent",color:C.textSec,border:`1px solid ${C.border}`}};
  return (
    <button onClick={onClick} disabled={disabled} style={{padding:s[size],borderRadius:10,fontWeight:600,fontSize:f[size],cursor:disabled?"not-allowed":"pointer",transition:"all 0.2s",border:"none",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.01em",whiteSpace:"nowrap",opacity:disabled?0.5:1,...v[variant],...style}}
      onMouseEnter={e=>{if(!disabled){e.currentTarget.style.transform="translateY(-1px)";}}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}>
      {children}
    </button>
  );
}

function Spinner({size=20}) {
  return <div style={{width:size,height:size,border:`2.5px solid ${C.border}`,borderTop:`2.5px solid ${C.accent}`,borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>;
}

// ══════════════════════════════════════════════════════════════
// AUTH — Now calls REAL backend API (MySQL-backed)
// ══════════════════════════════════════════════════════════════
function useAuth() {
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);

  // On load, check if we have a saved token and validate it against the server
  useEffect(() => {
    const token = localStorage.getItem("ala_token");
    if (!token) { setLoading(false); return; }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser({ ...data.user, token });
        } else {
          localStorage.removeItem("ala_token");
        }
      })
      .catch(() => localStorage.removeItem("ala_token"))
      .finally(() => setLoading(false));
  }, []);

  const signup = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    localStorage.setItem("ala_token", data.token);
    setUser({ ...data.user, token: data.token });
    return data.user;
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    localStorage.setItem("ala_token", data.token);
    setUser({ ...data.user, token: data.token });
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("ala_token");
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("ala_token");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, { headers: { "Authorization": `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setUser({ ...data.user, token });
    } catch {}
  };

  return {user,signup,login,logout,refreshUser,loading};
}

// ══════════════════════════════════════════════════════════════
// PDF EXPORT
// ══════════════════════════════════════════════════════════════
function exportPDF(report,email) {
  const sc=report.scores||[];
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Listing Audit Report</title>
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:-apple-system,'Inter',sans-serif;color:#0f172a;background:white;padding:40px;line-height:1.6;}
.cover{text-align:center;padding:60px 0;border-bottom:3px solid #10b981;margin-bottom:40px;}
.logo{width:60px;height:60px;background:linear-gradient(135deg,#10b981,#06b6d4);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:800;margin-bottom:20px;}
h1{font-size:32px;font-weight:700;margin-bottom:12px;}
.subtitle{color:#64748b;font-size:14px;margin-bottom:24px;}
.score-box{display:inline-block;padding:16px 32px;background:linear-gradient(135deg,#10b981,#06b6d4);color:white;border-radius:12px;}
.score-num{font-size:48px;font-weight:800;line-height:1;}.score-label{font-size:11px;letter-spacing:0.15em;text-transform:uppercase;opacity:0.85;margin-top:4px;}
h2{font-size:20px;font-weight:700;margin:32px 0 16px;padding-bottom:8px;border-bottom:1px solid #e2e8f0;color:#0f172a;}
.summary{background:#f0fdf4;border-left:3px solid #10b981;padding:16px;border-radius:8px;margin-bottom:24px;font-size:14px;}
.score-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:13px;gap:12px;}
.score-bar{flex:1;background:#e2e8f0;height:8px;border-radius:4px;overflow:hidden;}.score-bar div{height:100%;border-radius:4px;}
.issue{padding:14px;background:#f8fafc;border-left:3px solid #f59e0b;border-radius:8px;margin-bottom:10px;font-size:13px;}
.issue.critical{border-left-color:#ef4444;}.issue-title{font-weight:600;margin-bottom:4px;}
.fix{color:#059669;margin-top:6px;font-style:italic;}
.rewrite{background:#f0fdf4;border:1px solid #a7f3d0;padding:14px;border-radius:8px;margin-bottom:10px;font-size:14px;line-height:1.7;}
.kw{display:inline-block;font-size:11px;padding:3px 10px;border-radius:100px;margin:3px;}.kw.have{background:#ecfdf5;color:#059669;}.kw.miss{background:#fef2f2;color:#dc2626;}
.footer{text-align:center;margin-top:60px;padding-top:20px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;}
table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:20px;}th{text-align:left;padding:10px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;}td{padding:10px;border-bottom:1px solid #f1f5f9;}
@media print{body{padding:20px;}}
</style></head><body>
<div class="cover"><div class="logo">A</div><h1>Adaptoid Listing Audit Report</h1>
<div class="subtitle">Prepared for ${email||"Client"} · ${new Date().toLocaleDateString()}</div>
<div class="score-box"><div class="score-num">${report.overallScore||0}</div><div class="score-label">Overall Score / 100</div></div></div>
<h2>Executive Summary</h2><div class="summary">${report.summary||report.overallSummary||""}</div>
<h2>Category Scores</h2>${sc.map(s=>`<div class="score-row"><span style="min-width:180px">${s.label||s.l}</span><div class="score-bar"><div style="width:${((s.value||s.v)/(s.max||s.m||10))*100}%;background:${((s.value||s.v)/(s.max||s.m||10))>=0.75?"#10b981":((s.value||s.v)/(s.max||s.m||10))>=0.5?"#f59e0b":"#ef4444"}"></div></div><strong>${s.value||s.v}/${s.max||s.m||10}</strong></div>`).join("")}
<h2>Compliance & Accuracy Risks</h2>${(report.compliance||[]).map(c=>`<div class="issue ${c.sev==="critical"?"critical":""}"><div class="issue-title">[${(c.sev||"").toUpperCase()}] ${c.title}</div><div>${c.desc||c.description||""}</div><div class="fix">→ ${c.fix}</div></div>`).join("")}
<h2>Voice of Customer — What They Love</h2>${(report.voc?.love||[]).map(v=>`<div class="issue" style="border-left-color:#10b981"><div class="issue-title">${v.theme}</div><div style="font-style:italic">"${v.quote}"</div><div style="color:#64748b;margin-top:4px">Mentioned by ${v.occ} reviewers</div></div>`).join("")}
<h2>Voice of Customer — Complaints</h2>${(report.voc?.complain||[]).map(v=>`<div class="issue critical"><div class="issue-title">${v.theme}</div><div style="font-style:italic">"${v.quote}"</div><div style="color:#64748b;margin-top:4px">Mentioned by ${v.occ} reviewers</div></div>`).join("")}
<h2>Keyword Analysis</h2><h3 style="margin:16px 0 8px;font-size:14px;">Missing Keywords</h3><div>${(report.keywords?.missing||[]).map(k=>`<span class="kw miss">${k}</span>`).join("")}</div>
<h3 style="margin:16px 0 8px;font-size:14px;">Opportunity Keywords</h3><div>${(report.keywords?.opportunities||[]).map(k=>`<span class="kw have">${k}</span>`).join("")}</div>
<h2>Competitive Landscape</h2><table><thead><tr><th>Brand</th><th>Price</th><th>Key Specs</th><th>Differentiator</th></tr></thead><tbody>${(report.competitors||[]).map(c=>`<tr style="${c.isYours?"background:#f0fdf4":""}"><td style="font-weight:${c.isYours?700:400}">${c.name}${c.isYours?" ★ YOU":""}</td><td>${c.price||""}</td><td>${c.watts||c.specs||""}</td><td>${c.diff||c.differentiator||""}</td></tr>`).join("")}</tbody></table>
<h2>Optimized Title</h2>${report.rewrite?.titleA?`<div class="rewrite">${report.rewrite.titleA}</div>`:""}${report.rewrite?.titleB?`<div class="rewrite">${report.rewrite.titleB}</div>`:""}
<h2>Optimized Bullets</h2>${(report.rewrite?.bullets||[]).map((b,i)=>`<div class="rewrite"><strong>${i+1}.</strong> ${b}</div>`).join("")}
${report.rewrite?.searchTerms?`<h2>Backend Search Terms</h2><div class="rewrite" style="font-family:monospace;font-size:12px;">${report.rewrite.searchTerms}</div>`:""}
<h2>Image & A+ Content Priorities</h2>${(report.imageRecs||[]).map(r=>`<div class="issue" style="border-left-color:${r.priority==="Critical"?"#ef4444":r.priority==="High"?"#f59e0b":"#3b82f6"}"><div class="issue-title">[${r.priority}]</div><div>${r.rec}</div></div>`).join("")}
<h2>Priority Action Checklist</h2>${(report.actions||[]).map(a=>`<div class="issue" style="border-left-color:${a.p==="critical"?"#ef4444":a.p==="high"?"#f59e0b":"#10b981"}"><div class="issue-title">[${(a.p||"").toUpperCase()}] ${a.t}</div><div>${a.d}</div></div>`).join("")}
<div class="footer">Powered by Adaptoid Listing Audit · adaptoidecommerce.com · Generated ${new Date().toLocaleString()}</div>
</body></html>`;
  const w=window.open("","_blank");w.document.write(html);w.document.close();setTimeout(()=>w.print(),500);
}

// ══════════════════════════════════════════════════════════════
// LANDING PAGE
// ══════════════════════════════════════════════════════════════
function Landing({onGetStarted,onLogin}) {
  return (
    <div style={{position:"relative",overflow:"hidden"}}>
      <GlowOrb color={C.accent} size={600} style={{top:-200,right:-100}}/>
      <GlowOrb color={C.accent2} size={400} style={{top:400,left:-200}}/>
      <nav style={{background:`${C.bg}dd`,backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`,padding:"16px 40px",display:"flex",alignItems:"center",gap:20,position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>
          <div style={{width:38,height:38,borderRadius:10,background:C.gradient,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 20px #10b98140"}}><span style={{color:"white",fontWeight:800,fontSize:16}}>A</span></div>
          <div><div style={{fontWeight:700,fontSize:15,color:C.text}}>Adaptoid <span style={{color:C.accentGlow}}>Listing Audit</span></div><div style={{fontSize:10,color:C.muted,letterSpacing:"0.05em",textTransform:"uppercase"}}>by Adaptoid E-Commerce</div></div>
        </div>
        <Btn variant="outline" size="sm" onClick={onLogin}>Log In</Btn>
        <Btn size="sm" onClick={onGetStarted}>Get Started →</Btn>
      </nav>

      <section style={{padding:"120px 40px 80px",maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
        <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:80,alignItems:"center"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:11,fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",color:C.accentGlow,background:`${C.accent}15`,border:`1px solid ${C.accent}30`,padding:"6px 14px",borderRadius:100,marginBottom:28}}>✦ Agency-Grade AI Audit</div>
            <h1 style={{fontWeight:800,fontSize:"clamp(38px,6vw,64px)",lineHeight:1.05,marginBottom:24,letterSpacing:"-0.04em",color:C.text}}>
              The listing audit your <PF style={{fontStyle:"italic",fontWeight:500,color:C.accentGlow}}>competitors</PF> don't want you to have.
            </h1>
            <p style={{color:C.textSec,fontSize:18,lineHeight:1.7,marginBottom:36,maxWidth:520}}>
              11-section deep analysis covering reviews, images, A+ content, keyword gaps, compliance risks, and a fully rewritten listing.
            </p>
            <div style={{display:"flex",gap:12,marginBottom:32,flexWrap:"wrap"}}>
              <Btn size="lg" onClick={onGetStarted}>Run Your First Audit →</Btn>
              <Btn variant="ghost" size="lg" onClick={()=>document.getElementById("pricing")?.scrollIntoView({behavior:"smooth"})}>See Pricing</Btn>
            </div>
          </div>
          <Card glow style={{padding:28}}>
            <div style={{fontSize:11,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,marginBottom:20}}>Sample Audit Score</div>
            <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:24}}>
              <ScoreRing score={62} size={100}/><div><PF style={{fontWeight:600,fontSize:22,color:C.text,display:"block"}}>Needs Work</PF><div style={{fontSize:13,color:C.textSec,marginTop:4}}>11 issues · 8 actions</div></div>
            </div>
            {[{l:"Title",v:5},{l:"Keywords",v:4},{l:"Reviews",v:8},{l:"Images",v:6}].map((s,i)=><MiniBar key={i} label={s.l} value={s.v} delay={i*0.1}/>)}
          </Card>
        </div>
      </section>

      <section id="pricing" style={{padding:"100px 40px",maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <div style={{fontSize:11,color:C.accentGlow,letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,marginBottom:12}}>Pricing</div>
          <h2 style={{fontWeight:800,fontSize:"clamp(28px,4.5vw,44px)",letterSpacing:"-0.03em",marginBottom:16}}>Simple, <PF style={{fontStyle:"italic",fontWeight:500,color:C.accentGlow}}>transparent</PF> pricing.</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
          {[
            {n:"1 Audit",p:"$1",per:"one-time",href:"https://adaptoidecommerce.lemonsqueezy.com/buy/1202314"},
            {n:"3 Audits",p:"$5",per:"one-time",href:"https://adaptoidecommerce.lemonsqueezy.com/buy/1202326"},
            {n:"Starter",p:"$10",per:"/month",cr:"12 audits",href:"https://adaptoidecommerce.lemonsqueezy.com/buy/1202331"},
            {n:"Growth",p:"$15",per:"/month",cr:"20 audits",pop:true,href:"https://adaptoidecommerce.lemonsqueezy.com/buy/1202337"},
            {n:"Pro",p:"$25",per:"/month",cr:"40 audits",href:"https://adaptoidecommerce.lemonsqueezy.com/buy/1202339"},
          ].map((pl,i)=>(
            <div key={i} style={{background:pl.pop?C.accent:C.surface,border:`1px solid ${pl.pop?C.accent:C.border}`,borderRadius:14,padding:28,position:"relative",color:pl.pop?"white":C.text}}>
              {pl.pop&&<div style={{position:"absolute",top:-11,left:20,background:"white",color:C.accent,fontSize:10,fontWeight:700,padding:"4px 12px",borderRadius:20}}>Most popular</div>}
              <div style={{fontSize:11,fontWeight:700,color:pl.pop?"rgba(255,255,255,0.7)":C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:16}}>{pl.n}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}}><PF style={{fontWeight:600,fontSize:38,letterSpacing:"-0.03em"}}>{pl.p}</PF><span style={{fontSize:13,color:pl.pop?"rgba(255,255,255,0.6)":C.muted}}>{pl.per}</span></div>
              {pl.cr&&<div style={{fontSize:12,color:pl.pop?"rgba(255,255,255,0.7)":C.textSec,marginBottom:20}}>{pl.cr}</div>}
              <a href={pl.href} target="_blank" rel="noopener noreferrer" style={{display:"block",textAlign:"center",width:"100%",padding:"11px",borderRadius:8,background:pl.pop?"white":C.accent,color:pl.pop?C.accent:"white",border:"none",fontWeight:600,fontSize:14,cursor:"pointer",textDecoration:"none",marginTop:12}}>Buy Now</a>
            </div>
          ))}
        </div>
      </section>

      <footer style={{borderTop:`1px solid ${C.border}`,padding:"40px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center",marginBottom:10}}>
          <div style={{width:28,height:28,borderRadius:7,background:C.gradient,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:13}}>A</div>
          <span style={{fontWeight:700,fontSize:14}}>Adaptoid Listing Audit</span>
        </div>
        <p style={{color:C.muted,fontSize:12}}>© {new Date().getFullYear()} Adaptoid E-Commerce. All rights reserved.</p>
      </footer>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// AUTH MODAL — Now calls real backend
// ══════════════════════════════════════════════════════════════
function AuthModal({mode,onSignup,onLogin,onClose,onSwitch}) {
  const [email,setEmail]=useState("");const [password,setPassword]=useState("");
  const [error,setError]=useState("");const [loading,setLoading]=useState(false);
  const inp={width:"100%",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 14px",color:C.text,fontSize:14,outline:"none"};

  const handle=async()=>{
    if(!email||!password){setError("Please fill in all fields.");return;}
    setLoading(true);setError("");
    try{
      if(mode==="signup") await onSignup(email,password);
      else await onLogin(email,password);
      onClose();
    }catch(e){setError(e.message);}
    finally{setLoading(false);}
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(6,11,24,0.85)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:24,animation:"fadeIn 0.2s ease both"}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:18,padding:36,width:"100%",maxWidth:420,animation:"fadeUp 0.3s ease both"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <h2 style={{fontWeight:700,fontSize:24,letterSpacing:"-0.02em"}}>{mode==="signup"?"Create account":"Welcome back"}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:24,cursor:"pointer"}}>×</button>
        </div>
        <p style={{color:C.textSec,fontSize:14,marginBottom:24}}>{mode==="signup"?"Start auditing your listings today.":"Log back into your account."}</p>
        {error&&<div style={{background:C.redSoft,border:`1px solid #ef444430`,borderRadius:8,padding:"10px 14px",fontSize:13,color:"#fca5a5",marginBottom:16}}>{error}</div>}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div><label style={{fontSize:12,color:C.textSec,fontWeight:600,display:"block",marginBottom:6}}>Email</label><input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></div>
          <div><label style={{fontSize:12,color:C.textSec,fontWeight:600,display:"block",marginBottom:6}}>Password</label><input style={inp} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="•••••••• (min 6 characters)"/></div>
        </div>
        <Btn onClick={handle} disabled={loading} style={{width:"100%",marginTop:20,padding:"13px"}}>{loading?<><Spinner size={16}/> Processing…</>:mode==="signup"?"Create account →":"Log in →"}</Btn>
        <p style={{textAlign:"center",fontSize:13,color:C.textSec,marginTop:20}}>{mode==="signup"?"Already have an account? ":"Don't have an account? "}<span onClick={onSwitch} style={{color:C.accentGlow,cursor:"pointer",fontWeight:600}}>{mode==="signup"?"Log in":"Sign up"}</span></p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// AUDIT TOOL
// ══════════════════════════════════════════════════════════════
function AuditTool({user,onLogout,onRefreshUser}) {
  const [phase,setPhase]=useState("input");
  const [report,setReport]=useState(null);
  const [loadStep,setLoadStep]=useState(0);
  const [tab,setTab]=useState("summary");

  const [asin,setAsin]=useState("");const [price,setPrice]=useState("");const [bsr,setBsr]=useState("");
  const [title,setTitle]=useState("");const [bullets,setBullets]=useState("");const [description,setDescription]=useState("");
  const [reviews,setReviews]=useState("");const [imageDesc,setImageDesc]=useState("");const [aplusDesc,setAplusDesc]=useState("");
  const [keywords,setKeywords]=useState("");
  const [competitors,setCompetitors]=useState([{asin:"",price:"",title:"",specs:""},{asin:"",price:"",title:"",specs:""},{asin:"",price:"",title:"",specs:""}]);

  const STEPS=["Parsing listing structure","Analyzing competitor data","Processing reviews & sentiment","Evaluating images & A+ content","Running keyword gap analysis","Scoring 9 optimization dimensions","Generating optimized copy","Compiling full report"];

  const inp={width:"100%",background:C.surface2,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:14,outline:"none",transition:"border-color 0.2s"};
  const canRun=title.trim()&&bullets.trim()&&user.credits>=1;
  const planLabel=user.plan==="none"?"FREE":user.plan?.toUpperCase();

  const runAudit=async()=>{
    if(user.credits<1){alert("Out of credits. Please buy more from the pricing page.");return;}
    setPhase("loading");setLoadStep(0);
    const iv=setInterval(()=>setLoadStep(p=>p>=STEPS.length-2?p:p+1),2200);
    try {
      const res=await fetch(`${API_URL}/api/audit`,{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${user.token}`},
        body:JSON.stringify({title,bullets,description,asin,price,bsr,reviews,imageDesc,aplusDesc,keywords,competitors:competitors.filter(c=>c.asin.trim()||c.title.trim())})
      });
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||"Server error");
      clearInterval(iv);setLoadStep(STEPS.length-1);
      setTimeout(async()=>{
        setReport(data.report);setPhase("report");setTab("summary");
        await onRefreshUser();
      },800);
    } catch(err){clearInterval(iv);alert("Error: "+err.message);setPhase("input");}
  };

  const addComp=()=>competitors.length<10&&setCompetitors([...competitors,{asin:"",price:"",title:"",specs:""}]);
  const removeComp=(i)=>competitors.length>1&&setCompetitors(competitors.filter((_,j)=>j!==i));
  const updateComp=(i,field,val)=>setCompetitors(competitors.map((c,j)=>j===i?{...c,[field]:val}:c));

  return (
    <div style={{minHeight:"100vh",background:C.bg,position:"relative"}}>
      <GlowOrb color={C.accent} size={400} style={{top:-100,right:-100,opacity:0.3}}/>

      <nav style={{background:`${C.bg}dd`,backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`,padding:"14px 32px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:100}}>
        <div style={{width:32,height:32,borderRadius:8,background:C.gradient,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:14}}>A</div>
        <span style={{fontWeight:700,fontSize:14,flex:1}}>Adaptoid <span style={{color:C.accentGlow}}>Listing Audit</span></span>
        <a href="#pricing" onClick={(e)=>{e.preventDefault();window.location.hash="";window.location.reload();}} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:20,background:user.credits>3?C.greenSoft:C.yellowSoft,border:`1px solid ${user.credits>3?C.accent+"30":C.yellow+"30"}`,cursor:"pointer",textDecoration:"none"}}>
          <span style={{fontSize:13}}>⚡</span><span style={{fontSize:13,fontWeight:700,color:user.credits>3?C.accentGlow:C.yellow}}>{user.credits} credits</span>
        </a>
        <div style={{fontSize:10,background:`${C.blue}20`,color:C.blue,padding:"4px 10px",borderRadius:20,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase"}}>{planLabel}</div>
        <button onClick={onLogout} style={{background:"none",border:`1px solid ${C.border}`,color:C.textSec,padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:500}}>Log out</button>
      </nav>

      {/* INPUT */}
      {phase==="input"&&(
        <div style={{maxWidth:820,margin:"0 auto",padding:"48px 24px 80px",position:"relative",zIndex:2}}>
          <div style={{marginBottom:40}}>
            <div style={{fontSize:11,color:C.accentGlow,letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,marginBottom:12}}>New Audit</div>
            <h1 style={{fontWeight:800,fontSize:36,marginBottom:12,letterSpacing:"-0.025em",lineHeight:1.15}}>Let's <PF style={{fontStyle:"italic",fontWeight:500,color:C.accentGlow}}>deep-analyze</PF> your listing.</h1>
            <p style={{color:C.textSec,fontSize:15}}>Provide as much data as possible for the most comprehensive audit.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <Card>
              <CardH icon="📦" title="Your Listing" sub="ASIN, price, title, bullets, description" badge={{l:"Required",c:"yellow"}}/>
              <div style={{padding:24,display:"flex",flexDirection:"column",gap:16}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                  <div><label style={{fontSize:12,color:C.textSec,fontWeight:600,display:"block",marginBottom:6}}>ASIN</label><input style={inp} value={asin} onChange={e=>setAsin(e.target.value)} placeholder="B0G4VM5WDN"/></div>
                  <div><label style={{fontSize:12,color:C.textSec,fontWeight:600,display:"block",marginBottom:6}}>Price</label><input style={inp} value={price} onChange={e=>setPrice(e.target.value)} placeholder="$39.99"/></div>
                  <div><label style={{fontSize:12,color:C.textSec,fontWeight:600,display:"block",marginBottom:6}}>BSR / Category</label><input style={inp} value={bsr} onChange={e=>setBsr(e.target.value)} placeholder="#110 Travel Steamers"/></div>
                </div>
                <div><label style={{fontSize:12,color:C.textSec,fontWeight:600,display:"block",marginBottom:6}}>Title <span style={{color:C.red}}>*</span></label><input style={inp} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Paste your full Amazon product title…"/></div>
                <div><label style={{fontSize:12,color:C.textSec,fontWeight:600,display:"block",marginBottom:6}}>Bullet Points <span style={{color:C.red}}>*</span></label><textarea style={{...inp,minHeight:130,lineHeight:1.7,resize:"vertical"}} value={bullets} onChange={e=>setBullets(e.target.value)} placeholder={"• Bullet 1\n• Bullet 2\n• Bullet 3…"}/></div>
                <div><label style={{fontSize:12,color:C.textSec,fontWeight:600,display:"block",marginBottom:6}}>Description</label><textarea style={{...inp,minHeight:80,lineHeight:1.7,resize:"vertical"}} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Paste your product description…"/></div>
              </div>
            </Card>

            <Card>
              <CardH icon="⭐" title="Customer Reviews" sub="Paste 5-10 reviews for Voice of Customer analysis" badge={{l:"Recommended",c:"green"}}/>
              <div style={{padding:24}}>
                <textarea style={{...inp,minHeight:140,lineHeight:1.7,resize:"vertical"}} value={reviews} onChange={e=>setReviews(e.target.value)} placeholder={"★★★★★ 'Great product...'\n\n★★★☆☆ 'Works well but...'"}/>
              </div>
            </Card>

            <Card>
              <CardH icon="🖼️" title="Images & A+ Content" sub="Describe your images and A+ modules" badge={{l:"Optional",c:"blue"}}/>
              <div style={{padding:24,display:"flex",flexDirection:"column",gap:16}}>
                <div><label style={{fontSize:12,color:C.textSec,fontWeight:600,display:"block",marginBottom:6}}>Image Descriptions</label><textarea style={{...inp,minHeight:100,lineHeight:1.7,resize:"vertical"}} value={imageDesc} onChange={e=>setImageDesc(e.target.value)} placeholder={"Image 1: Product on white background\nImage 2: Steamer in use\n..."}/></div>
                <div><label style={{fontSize:12,color:C.textSec,fontWeight:600,display:"block",marginBottom:6}}>A+ Content Description</label><textarea style={{...inp,minHeight:80,lineHeight:1.7,resize:"vertical"}} value={aplusDesc} onChange={e=>setAplusDesc(e.target.value)} placeholder="Describe your A+ content modules…"/></div>
              </div>
            </Card>

            <Card>
              <CardH icon="🔍" title="Competitor Listings" sub="Add competitor details for benchmarking" badge={{l:`${competitors.length} of 10`,c:"blue"}}/>
              <div style={{padding:24}}>
                {competitors.map((comp,i)=>(
                  <div key={i} style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{fontSize:12,fontWeight:700,color:C.accentGlow,letterSpacing:"0.05em"}}>COMPETITOR {i+1}</div>
                      {competitors.length>1&&<button onClick={()=>removeComp(i)} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:14}}>×</button>}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                      <input style={inp} value={comp.asin} onChange={e=>updateComp(i,"asin",e.target.value.toUpperCase())} placeholder="ASIN" maxLength={10}/>
                      <input style={inp} value={comp.price} onChange={e=>updateComp(i,"price",e.target.value)} placeholder="Price"/>
                    </div>
                    <input style={{...inp,marginBottom:10}} value={comp.title} onChange={e=>updateComp(i,"title",e.target.value)} placeholder="Competitor title"/>
                    <textarea style={{...inp,minHeight:50,lineHeight:1.6,resize:"vertical"}} value={comp.specs} onChange={e=>updateComp(i,"specs",e.target.value)} placeholder="Key specs & bullet points"/>
                  </div>
                ))}
                {competitors.length<10&&<button onClick={addComp} style={{background:"none",border:`1.5px dashed ${C.border}`,color:C.textSec,padding:"10px",borderRadius:10,cursor:"pointer",fontSize:13,width:"100%",fontWeight:500}}>+ Add Competitor</button>}
              </div>
            </Card>

            <Card>
              <CardH icon="🔑" title="Keyword Data" sub="Paste keywords with search volume" badge={{l:"Recommended",c:"green"}}/>
              <div style={{padding:24}}>
                <textarea style={{...inp,minHeight:120,lineHeight:1.7,resize:"vertical",fontFamily:"monospace",fontSize:13}} value={keywords} onChange={e=>setKeywords(e.target.value)} placeholder={"travel steamer for clothes - 18,200\nhandheld clothes steamer - 12,400"}/>
              </div>
            </Card>

            {user.credits<1?(
              <div style={{background:C.yellowSoft,border:`1px solid ${C.yellow}30`,borderRadius:10,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                <div><div style={{fontSize:14,fontWeight:600,color:C.yellow,marginBottom:4}}>⚡ Out of credits</div><div style={{fontSize:13,color:C.textSec}}>Buy more credits from the pricing page.</div></div>
                <Btn onClick={onLogout} size="sm">View Pricing →</Btn>
              </div>
            ):(
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",background:C.surface2,borderRadius:10,border:`1px solid ${C.border}`}}>
                <span style={{fontSize:14,color:C.textSec}}>This audit uses <strong style={{color:C.text}}>1 credit</strong>. You have <strong style={{color:C.accentGlow}}>{user.credits} credits</strong> remaining.</span>
              </div>
            )}

            <Btn onClick={runAudit} disabled={!canRun} size="lg" style={{padding:18,fontSize:16,width:"100%"}}>Run Deep Listing Audit →</Btn>
          </div>
        </div>
      )}

      {/* LOADING */}
      {phase==="loading"&&(
        <div style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:40,padding:40,position:"relative"}}>
          <GlowOrb color={C.accent} size={500} style={{top:"50%",left:"50%",transform:"translate(-50%,-50%)",opacity:0.3}}/>
          <div style={{textAlign:"center",zIndex:2}}>
            <div style={{position:"relative",width:80,height:80,margin:"0 auto 28px"}}>
              <div style={{position:"absolute",inset:0,borderRadius:"50%",background:C.gradient,animation:"pulse 2s ease-in-out infinite",opacity:0.3}}/>
              <div style={{position:"absolute",inset:8,borderRadius:"50%",border:`3px solid ${C.border}`,borderTop:`3px solid ${C.accent}`,animation:"spin 0.9s linear infinite"}}/>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:20,color:C.accentGlow}}>A</div>
            </div>
            <h2 style={{fontWeight:700,fontSize:26,marginBottom:10,letterSpacing:"-0.02em"}}><PF style={{fontStyle:"italic",fontWeight:500,color:C.accentGlow}}>Deep-analyzing</PF> your listing</h2>
            <p style={{color:C.textSec,fontSize:14}}>Generating your 11-section audit report. ~30-60 seconds.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%",maxWidth:460,zIndex:2}}>
            {STEPS.map((step,i)=>{
              const done=i<loadStep,active=i===loadStep;
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",borderRadius:10,background:active?`${C.accent}12`:done?`${C.green}0d`:C.surface,border:`1px solid ${active?C.accent+"40":done?C.green+"30":C.border}`,transition:"all 0.3s"}}>
                  <div style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center"}}>{done?<span style={{color:C.accentGlow,fontWeight:700}}>✓</span>:active?<Spinner/>:<div style={{width:7,height:7,borderRadius:"50%",background:C.border}}/>}</div>
                  <span style={{fontSize:13,color:done?C.accentGlow:active?C.text:C.muted,fontWeight:active?500:400}}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REPORT */}
      {phase==="report"&&report&&(
        <div style={{maxWidth:1160,margin:"0 auto",padding:"40px 24px 80px",position:"relative",zIndex:2}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:16}}>
            <div>
              <div style={{fontSize:11,color:C.accentGlow,letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,marginBottom:10}}>✦ Audit Complete</div>
              <h1 style={{fontWeight:800,fontSize:"clamp(28px,4vw,42px)",letterSpacing:"-0.03em",marginBottom:8}}>Your <PF style={{fontStyle:"italic",fontWeight:500,color:C.accentGlow}}>optimization</PF> report</h1>
              <p style={{color:C.muted,fontSize:14}}>{asin?`ASIN ${asin} · `:""}Generated {new Date().toLocaleDateString()}</p>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <Btn variant="ghost" size="sm" onClick={()=>exportPDF(report,user.email)}>📄 Export PDF</Btn>
              <Btn variant="outline" size="sm" onClick={()=>setPhase("input")}>← New Audit</Btn>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr",gap:16,marginBottom:28}}>
            <Card glow delay={0.05} style={{padding:28}}>
              <div style={{fontSize:11,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,marginBottom:20}}>Overall Score</div>
              <div style={{display:"flex",alignItems:"center",gap:20}}>
                <ScoreRing score={report.overallScore||0} size={120}/>
                <div>
                  <PF style={{fontWeight:600,fontSize:22,color:C.text,display:"block"}}>{(report.overallScore||0)>=80?"Excellent":(report.overallScore||0)>=60?"Needs Work":"Critical"}</PF>
                  <div style={{fontSize:13,color:C.textSec,marginTop:4}}>{report.compliance?.length||0} issues found</div>
                </div>
              </div>
            </Card>
            <Card delay={0.1} style={{padding:24}}>
              <div style={{fontSize:11,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,marginBottom:12}}>Competitors</div>
              <PF style={{fontWeight:600,fontSize:48,color:C.accentGlow,display:"block",letterSpacing:"-0.03em",lineHeight:1}}>{report.competitors?.length||0}</PF>
              <div style={{fontSize:13,color:C.textSec,marginTop:8}}>Benchmarked</div>
            </Card>
            <Card delay={0.15} style={{padding:24}}>
              <div style={{fontSize:11,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,marginBottom:12}}>Actions</div>
              <PF style={{fontWeight:600,fontSize:48,color:C.yellow,display:"block",letterSpacing:"-0.03em",lineHeight:1}}>{report.actions?.length||0}</PF>
              <div style={{fontSize:13,color:C.textSec,marginTop:8}}>Prioritized fixes</div>
            </Card>
          </div>

          <Card delay={0.2} style={{padding:28,marginBottom:28,background:C.bgAlt}}>
            <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
              <div style={{width:40,height:40,borderRadius:10,background:C.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>💡</div>
              <div>
                <div style={{fontSize:11,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,marginBottom:8}}>Executive Summary</div>
                <p style={{fontSize:15,color:C.text,lineHeight:1.75}}>{report.summary||""}</p>
              </div>
            </div>
          </Card>

          <div style={{display:"flex",gap:4,marginBottom:24,background:C.surface,padding:5,borderRadius:10,border:`1px solid ${C.border}`,overflowX:"auto"}}>
            {[{id:"summary",l:"📊 Scores"},{id:"compliance",l:"⚠️ Compliance"},{id:"voc",l:"⭐ Reviews"},{id:"keywords",l:"🔑 Keywords"},{id:"competitors",l:"🔍 Competitors"},{id:"rewrite",l:"✍️ Rewrite"},{id:"images",l:"🖼️ Images"},{id:"actions",l:"🚀 Actions"}].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 14px",border:"none",borderRadius:7,background:tab===t.id?C.gradient:"transparent",color:tab===t.id?"white":C.muted,fontWeight:600,fontSize:12,cursor:"pointer",whiteSpace:"nowrap",minWidth:80,boxShadow:tab===t.id?"0 2px 8px #10b98130":"none",transition:"all 0.2s"}}>{t.l}</button>
            ))}
          </div>

          {tab==="summary"&&<Card><CardH icon="📊" title="Category Scores"/><div style={{padding:28}}>{(report.scores||[]).map((s,i)=><MiniBar key={i} label={s.l} value={s.v} max={s.m||10} delay={i*0.06}/>)}</div></Card>}

          {tab==="compliance"&&<Card><CardH icon="⚠️" title="Compliance & Accuracy Risks" badge={{l:`${(report.compliance||[]).length} risks`,c:"red"}}/>
            <div style={{padding:"0 24px"}}>{(report.compliance||[]).map((c,i)=>{
              const sc=c.sev==="critical"?C.red:c.sev==="high"?C.yellow:C.blue;
              return (<div key={i} style={{padding:"20px 0",borderBottom:i<(report.compliance||[]).length-1?`1px solid ${C.border}`:"none",display:"flex",gap:16}}>
                <div style={{fontSize:10,fontWeight:700,color:sc,background:`${sc}18`,padding:"4px 10px",borderRadius:20,height:"fit-content",letterSpacing:"0.05em",textTransform:"uppercase",flexShrink:0}}>{c.sev}</div>
                <div><div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:6}}>{c.title}</div><div style={{fontSize:14,color:C.textSec,lineHeight:1.6,marginBottom:10}}>{c.desc}</div>{c.fix&&<div style={{fontSize:13,color:C.accentGlow,fontWeight:500,background:C.greenSoft,padding:"10px 14px",borderRadius:8,borderLeft:`3px solid ${C.accent}`}}>→ {c.fix}</div>}</div>
              </div>);
            })}</div>
          </Card>}

          {tab==="voc"&&(
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <Card><CardH icon="💚" title="What Customers Love" badge={{l:"Amplify",c:"green"}}/>
                <div style={{padding:"0 24px"}}>{(report.voc?.love||[]).map((v,i)=>(
                  <div key={i} style={{padding:"18px 0",borderBottom:i<(report.voc?.love||[]).length-1?`1px solid ${C.border}`:"none",display:"flex",gap:16}}>
                    <div style={{width:40,height:40,borderRadius:10,background:C.greenSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>💚</div>
                    <div><div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:4}}>{v.theme}</div><div style={{fontSize:14,color:C.textSec,fontStyle:"italic",marginBottom:6}}>"{v.quote}"</div><div style={{fontSize:12,color:C.muted}}>Mentioned by {v.occ} reviewers</div></div>
                  </div>
                ))}</div>
              </Card>
              <Card><CardH icon="🔴" title="Complaints" badge={{l:"Fix",c:"red"}}/>
                <div style={{padding:"0 24px"}}>{(report.voc?.complain||[]).map((v,i)=>(
                  <div key={i} style={{padding:"18px 0",borderBottom:i<(report.voc?.complain||[]).length-1?`1px solid ${C.border}`:"none",display:"flex",gap:16}}>
                    <div style={{width:40,height:40,borderRadius:10,background:C.redSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>⚠️</div>
                    <div><div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:4}}>{v.theme}</div><div style={{fontSize:14,color:C.textSec,fontStyle:"italic",marginBottom:6}}>"{v.quote}"</div><div style={{fontSize:12,color:C.muted}}>Mentioned by {v.occ} reviewers</div></div>
                  </div>
                ))}</div>
              </Card>
            </div>
          )}

          {tab==="keywords"&&(
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              {report.keywords?.performing?.length>0&&<Card><CardH icon="📈" title="Top Performing Keywords"/>
                <div style={{overflow:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                  <thead><tr>{["Keyword","Click Share","Rank"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"14px 20px",background:C.surface2,color:C.muted,fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",borderBottom:`1px solid ${C.border}`,fontWeight:600}}>{h}</th>)}</tr></thead>
                  <tbody>{(report.keywords.performing||[]).map((k,i)=><tr key={i}><td style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,fontWeight:600,color:C.text}}>{k.kw}</td><td style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,color:C.accentGlow,fontWeight:600}}>{k.share}</td><td style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,color:C.textSec}}>{k.rank}</td></tr>)}</tbody>
                </table></div>
              </Card>}
              <Card><CardH icon="❌" title="Missing Keywords" badge={{l:`${(report.keywords?.missing||[]).length} gaps`,c:"red"}}/>
                <div style={{padding:24}}>{(report.keywords?.missing||[]).map((k,i)=><Tag key={i} label={k} variant="missing" delay={i*0.03}/>)}</div>
              </Card>
              <Card><CardH icon="💎" title="Opportunity Keywords" badge={{l:"Recommended",c:"blue"}}/>
                <div style={{padding:24}}>{(report.keywords?.opportunities||[]).map((k,i)=><Tag key={i} label={k} variant="opp" delay={i*0.03}/>)}</div>
              </Card>
            </div>
          )}

          {tab==="competitors"&&(
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <Card><CardH icon="🔍" title="Competitive Landscape"/>
                <div style={{overflow:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead><tr>{["Brand","Price","Key Specs","Differentiator"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"12px 16px",background:C.surface2,color:C.muted,fontSize:10,letterSpacing:"0.06em",textTransform:"uppercase",borderBottom:`1px solid ${C.border}`,fontWeight:600}}>{h}</th>)}</tr></thead>
                  <tbody>{(report.competitors||[]).map((c,i)=>(
                    <tr key={i} style={{background:c.isYours?`${C.accent}08`:"transparent"}}>
                      <td style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,fontWeight:c.isYours?700:500,color:C.text}}>{c.name}{c.isYours&&<span style={{marginLeft:8,fontSize:9,background:C.accent,color:"white",padding:"2px 8px",borderRadius:20,fontWeight:700}}>YOU</span>}</td>
                      <td style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,fontWeight:600,color:C.text}}>{c.price}</td>
                      <td style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,color:C.textSec}}>{c.watts}</td>
                      <td style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,color:C.textSec,fontSize:12}}>{c.diff}</td>
                    </tr>))}</tbody>
                </table></div>
              </Card>
              {report.pricing&&<Card style={{padding:28,background:C.bgAlt}}>
                <div style={{fontSize:11,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,marginBottom:12}}>Pricing Analysis</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  {[{l:"Segment",v:report.pricing.segment},{l:"Position",v:report.pricing.position},{l:"Issue",v:report.pricing.issue},{l:"Recommendation",v:report.pricing.rec}].map((p,i)=>(
                    <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:16}}>
                      <div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>{p.l}</div>
                      <div style={{fontSize:14,color:C.text,lineHeight:1.6}}>{p.v}</div>
                    </div>
                  ))}
                </div>
              </Card>}
            </div>
          )}

          {tab==="rewrite"&&(
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              {(report.rewrite?.titleA)&&<Card><CardH icon="✍️" title="Optimized Title" badge={{l:"AI Rewritten",c:"blue"}}/>
                <div style={{padding:24}}>
                  <div style={{background:`${C.accent}0d`,border:`1px solid ${C.accent}30`,borderRadius:10,padding:16,fontSize:14,lineHeight:1.75,color:C.text}}>{report.rewrite.titleA}</div>
                  {report.rewrite.titleB&&<><div style={{fontSize:11,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,marginTop:16,marginBottom:8}}>Option B</div><div style={{background:`${C.accent}0d`,border:`1px solid ${C.accent}30`,borderRadius:10,padding:16,fontSize:14,lineHeight:1.75,color:C.text}}>{report.rewrite.titleB}</div></>}
                </div>
              </Card>}
              <Card><CardH icon="📋" title="Optimized Bullets" badge={{l:"AI Rewritten",c:"blue"}} action={<button onClick={()=>navigator.clipboard.writeText((report.rewrite?.bullets||[]).join("\n\n"))} style={{background:C.surface2,border:`1px solid ${C.border}`,color:C.textSec,padding:"6px 14px",borderRadius:6,fontSize:12,cursor:"pointer",fontWeight:500}}>Copy all</button>}/>
                <div style={{padding:24,display:"flex",flexDirection:"column",gap:10}}>
                  {(report.rewrite?.bullets||[]).map((b,i)=>(
                    <div key={i} style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:14,fontSize:14,lineHeight:1.7,color:C.text}}>{b}</div>
                  ))}
                </div>
              </Card>
              {report.rewrite?.searchTerms&&<Card><CardH icon="🔎" title="Backend Search Terms" badge={{l:"Ready to paste",c:"green"}}/>
                <div style={{padding:24}}><div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:16,fontSize:13,lineHeight:1.7,color:C.textSec,fontFamily:"monospace"}}>{report.rewrite.searchTerms}</div></div>
              </Card>}
            </div>
          )}

          {tab==="images"&&<Card><CardH icon="🖼️" title="Image & A+ Priorities" badge={{l:`${(report.imageRecs||[]).length} items`,c:"yellow"}}/>
            <div style={{padding:"0 24px"}}>{(report.imageRecs||[]).map((r,i)=>{
              const pc=r.priority==="Critical"?C.red:r.priority==="High"?C.yellow:r.priority==="Medium"?C.blue:C.green;
              return (<div key={i} style={{padding:"18px 0",borderBottom:i<(report.imageRecs||[]).length-1?`1px solid ${C.border}`:"none",display:"flex",gap:16,alignItems:"flex-start"}}>
                <div style={{fontSize:10,fontWeight:700,color:pc,background:`${pc}18`,padding:"4px 10px",borderRadius:20,flexShrink:0,letterSpacing:"0.05em",textTransform:"uppercase"}}>{r.priority}</div>
                <div style={{fontSize:14,color:C.text,lineHeight:1.65}}>{r.rec}</div>
              </div>);
            })}</div>
          </Card>}

          {tab==="actions"&&<Card><CardH icon="🚀" title="Priority Action Checklist" badge={{l:`${(report.actions||[]).length} items`,c:"green"}}/>
            <div style={{padding:24}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
              {(report.actions||[]).map((a,i)=>{
                const pc=a.p==="critical"?C.red:a.p==="high"?C.yellow:a.p==="medium"?C.blue:C.green;
                return (<div key={i} style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:18}}>
                  <div style={{fontSize:10,fontWeight:700,color:pc,background:`${pc}18`,display:"inline-block",padding:"3px 10px",borderRadius:20,marginBottom:12,letterSpacing:"0.05em",textTransform:"uppercase"}}>{a.p}</div>
                  <div style={{fontWeight:600,fontSize:14,color:C.text,marginBottom:6}}>{a.t}</div>
                  <div style={{fontSize:13,color:C.textSec,lineHeight:1.6}}>{a.d}</div>
                </div>);
              })}
            </div></div>
          </Card>}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════
export default function App() {
  const {user,signup,login,logout,refreshUser,loading}=useAuth();
  const [authModal,setAuthModal]=useState(null);

  if (loading) {
    return (
      <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <style>{G}</style>
        <Spinner size={32}/>
      </div>
    );
  }

  return (
    <><style>{G}</style>
      {user?<AuditTool user={user} onLogout={logout} onRefreshUser={refreshUser}/>
        :<Landing onGetStarted={()=>setAuthModal("signup")} onLogin={()=>setAuthModal("login")}/>}
      {authModal&&<AuthModal mode={authModal} onSignup={signup} onLogin={login} onClose={()=>setAuthModal(null)} onSwitch={()=>setAuthModal(authModal==="signup"?"login":"signup")}/>}
    </>
  );
}
