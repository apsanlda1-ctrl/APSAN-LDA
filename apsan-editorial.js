/* APSAN public editorial feed — Website Management repository */
(function(){
"use strict";
const OWNER="mateus-max", REPO="Website-Management", BRANCH="main";
const API="https://api.github.com/repos/"+OWNER+"/"+REPO+"/contents/";
const RAW="https://raw.githubusercontent.com/"+OWNER+"/"+REPO+"/"+BRANCH+"/";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function parse(text){
 const m=text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/),d={};
 if(!m)return {body:text};
 m[1].split(/\r?\n/).forEach(line=>{const x=line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);if(!x)return;let v=x[2].trim();try{v=JSON.parse(v)}catch(_){}d[x[1]]=v});
 d.body=m[2]||"";return d;
}
function asset(v){if(!v)return "";if(v.startsWith("http://")||v.startsWith("https://")||v.startsWith("//")||v.startsWith("data:"))return v;return RAW+"public/"+String(v).replace(/^\/+/, "");}
function plain(s){return String(s||"").replace(/!\[([^\]]*)\]\([^)]+\)/g,"$1").replace(/\[([^\]]+)\]\(([^)]+)\)/g,"$1").replace(/[#*_>`]/g,"").replace(/\s+/g," ").trim()}
function styles(){
 if(document.getElementById("apsanEditorialCss"))return;
 const s=document.createElement("style");s.id="apsanEditorialCss";
 s.textContent=`
#apsan-editorial{max-width:1240px;margin:36px auto 44px;padding:34px 20px 38px;background:linear-gradient(145deg,#f5faff,#fff);border-radius:24px}
#apsan-editorial .ae-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px}
#apsan-editorial .ae-title{display:flex;align-items:center;gap:13px}
#apsan-editorial .ae-icon{width:48px;height:48px;display:grid;place-items:center;border-radius:14px;background:#e8f3ff;color:#0755a4;font-size:25px}
#apsan-editorial h2{font-size:clamp(25px,3vw,36px);line-height:1.1;color:#082c60;margin:0;font-weight:850}
#apsan-editorial .ae-sub{color:#64748b;margin:7px 0 0;font-size:14px}
#apsan-editorial .ae-line{height:6px;width:130px;border-radius:9px;background:#f4bd22;margin-top:12px}
#apsan-editorial .ae-all{border:0;border-radius:30px;background:#082f69;color:#fff;padding:13px 18px;font-weight:800;cursor:pointer;white-space:nowrap}
#apsan-editorial .ae-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
#apsan-editorial .ae-card{background:#fff;border:1px solid #e3ebf5;border-radius:18px;overflow:hidden;box-shadow:0 7px 20px #0a2d5b12;display:flex;flex-direction:column;min-width:0}
#apsan-editorial .ae-cover{height:170px;background:#eaf1f8;overflow:hidden;position:relative}
#apsan-editorial .ae-cover img{width:100%;height:100%;object-fit:cover}
#apsan-editorial .ae-badge{position:absolute;top:10px;left:10px;background:#f3bd22;color:#082b60;padding:7px 12px;border-radius:20px;font-size:11px;font-weight:850}
#apsan-editorial .ae-content{padding:15px;display:flex;flex-direction:column;flex:1}
#apsan-editorial .ae-meta{font-size:12px;color:#708197;margin-bottom:9px}
#apsan-editorial .ae-content h3{font-size:17px;line-height:1.3;color:#0a2c5d;margin:0 0 9px}
#apsan-editorial .ae-content p{font-size:13px;line-height:1.55;color:#586b82;margin:0 0 15px}
#apsan-editorial .ae-more{margin-top:auto;align-self:flex-start;border:0;border-radius:10px;padding:10px 15px;background:#0871c9;color:#fff;font-weight:800;cursor:pointer}
#apsan-editorial .ae-empty{padding:24px;text-align:center;color:#6b7b90;background:#fff;border-radius:15px}
#apsan-editorial .ae-modal{position:fixed;inset:0;z-index:999999;background:#061a35d9;display:grid;place-items:center;padding:14px}
#apsan-editorial .ae-dialog{width:min(760px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:20px;padding:22px;color:#20334b}
#apsan-editorial .ae-close{float:right;border:0;border-radius:50%;width:38px;height:38px;background:#edf3fa;font-size:23px;cursor:pointer}
#apsan-editorial .ae-dialog h2{font-size:25px;margin:6px 44px 14px 0}
#apsan-editorial .ae-dialog img{max-width:100%;max-height:360px;object-fit:contain;border-radius:12px;margin:8px 0 16px}
#apsan-editorial .ae-body{white-space:pre-wrap;line-height:1.75;font-size:15px}
#apsan-editorial .ae-videos{margin-top:34px;padding-top:25px;border-top:1px solid #dbe5f1}
#apsan-editorial .ae-videos h3{font-size:23px;color:#082c60;margin:0 0 16px}
#apsan-editorial .ae-vgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}
#apsan-editorial .ae-video{border:1px solid #e0e8f2;background:#fff;border-radius:15px;overflow:hidden}
#apsan-editorial .ae-video iframe{width:100%;aspect-ratio:16/9;border:0;display:block}
#apsan-editorial .ae-video div{padding:12px;font-weight:750;color:#0a2c5d}
@media(max-width:760px){#apsan-editorial{margin:25px 12px 32px;padding:24px 13px;border-radius:18px}#apsan-editorial .ae-head{align-items:flex-start;flex-direction:column}#apsan-editorial .ae-all{width:100%}#apsan-editorial .ae-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}#apsan-editorial .ae-cover{height:135px}#apsan-editorial .ae-content{padding:11px}#apsan-editorial .ae-content h3{font-size:14px}#apsan-editorial .ae-content p{font-size:12px}#apsan-editorial .ae-vgrid{grid-template-columns:1fr}}
`;
 document.head.appendChild(s);
}
async function collection(folder){
 try{
  const r=await fetch(API+folder+"?ref="+BRANCH+"&v="+Date.now(),{cache:"no-store",headers:{"Accept":"application/vnd.github+json"}});
  if(!r.ok)throw Error("HTTP "+r.status);
  const files=await r.json();
  return await Promise.all(files.filter(f=>f.type==="file"&&/\.md$/i.test(f.name)).map(async f=>{
   const x=await fetch(RAW+folder+"/"+encodeURIComponent(f.name)+"?v="+Date.now(),{cache:"no-store"});
   if(!x.ok)return null;const d=parse(await x.text());d._file=f.name;return d;
  }));
 }catch(e){console.warn("[APSAN editorial]",folder,e);return [];}
}
function postCard(p,i){
 const cover=p.coverImage||p.image||"",title=p.title||"Publicação APSAN",body=plain(p.body),excerpt=p.excerpt||body.slice(0,150)+(body.length>150?"…":"");
 return '<article class="ae-card"><div class="ae-cover">'+(cover?'<img src="'+esc(cover)+'" alt="'+esc(title)+'" loading="lazy">':"")+'<span class="ae-badge">'+esc(p.category||"Publicação")+'</span></div><div class="ae-content"><div class="ae-meta">▣ '+esc(p.date||"APSAN, LDA")+'</div><h3>'+esc(title)+'</h3><p>'+esc(excerpt)+'</p><button class="ae-more" data-ae-open="'+i+'">Ver mais →</button></div></article>';
}
function videoId(url){
 try{const u=new URL(url);if(u.hostname.includes("youtu.be"))return u.pathname.slice(1).split("/")[0];if(u.hostname.includes("youtube.com"))return u.searchParams.get("v")||(u.pathname.match(/\/embed\/([^/]+)/)||[])[1]||(u.pathname.match(/\/shorts\/([^/]+)/)||[])[1];}catch(_){}return "";
}
function showPost(p){
 const w=document.createElement("div");w.className="ae-modal";const cover=p.coverImage||p.image||"";
 w.innerHTML='<article class="ae-dialog"><button class="ae-close" aria-label="Fechar">×</button><div class="ae-meta">'+esc(p.category||"Publicação")+' · '+esc(p.date||"")+'</div><h2>'+esc(p.title||"Publicação APSAN")+'</h2>'+(cover?'<img src="'+esc(cover)+'" alt="'+esc(p.title||"")+'">':"")+'<div class="ae-body">'+esc(p.body||"")+'</div></article>';
 document.body.appendChild(w);document.body.style.overflow="hidden";const close=()=>{w.remove();document.body.style.overflow=""};w.querySelector(".ae-close").onclick=close;w.onclick=e=>{if(e.target===w)close();};
}
async function init(){
 const services=document.getElementById("services");if(!services)return;styles();
 let host=document.getElementById("apsan-editorial");
 if(!host){host=document.createElement("section");host.id="apsan-editorial";services.insertAdjacentElement("afterend",host);}
 host.innerHTML='<div class="ae-head"><div><div class="ae-title"><span class="ae-icon">▤</span><h2>Publicações Recentes</h2></div><div class="ae-line"></div><p class="ae-sub">Acompanhe notícias, actividades e novidades da APSAN, LDA.</p></div><button class="ae-all" id="aeAll">Ver todas as publicações →</button></div><div class="ae-empty">A carregar publicações…</div>';
 const results=await Promise.all([collection("content/posts"),collection("content/videos")]);
 const live=results[0].filter(p=>p&&String(p.published).toLowerCase()==="true").sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")));
 const vids=results[1].filter(v=>v&&String(v.published).toLowerCase()==="true");
 if(!live.length){host.querySelector(".ae-empty").textContent="Ainda não existem publicações disponíveis.";host.querySelector("#aeAll").style.display="none";}
 else{
  let expanded=false;const grid=document.createElement("div");grid.className="ae-grid";
  const draw=()=>{const shown=expanded?live:live.slice(0,3);grid.innerHTML=shown.map(postCard).join("");grid.querySelectorAll("[data-ae-open]").forEach(b=>b.onclick=()=>showPost(shown[Number(b.dataset.aeOpen)]));};
  host.querySelector(".ae-empty").replaceWith(grid);draw();
  const all=host.querySelector("#aeAll");all.onclick=()=>{expanded=!expanded;draw();all.textContent=expanded?"Mostrar menos ↑":"Ver todas as publicações →";if(expanded)host.scrollIntoView({behavior:"smooth",block:"start"});};
  if(live.length<=3)all.style.display="none";
 }
 if(vids.length){
  const sec=document.createElement("div");sec.className="ae-videos";
  sec.innerHTML='<h3>Vídeos da APSAN</h3><div class="ae-vgrid">'+vids.map(v=>{const id=videoId(v.url);return id?'<article class="ae-video"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'" title="'+esc(v.title)+'" allowfullscreen></iframe><div>'+esc(v.title||"Vídeo APSAN")+'</div></article>':"";}).join("")+'</div>';
  host.appendChild(sec);
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();