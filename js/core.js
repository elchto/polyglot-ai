/* POLYGLOT AI — core: store, data, router, TTS/STT, timer, events, adaptive brain. Static app, no API keys. */
(function(){
"use strict";
const PA = window.PA = { pages:{}, data:{}, VERSION:"1.0.0" };
const KEY = "polyglot_ai_v1";
const ICON = {
  home:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  tutor:'<path d="M9 4a3 3 0 0 0-3 3v.5A3 3 0 0 0 4 10.3 3 3 0 0 0 5 15a3 3 0 0 0 4 4.5V4z"/><path d="M15 4a3 3 0 0 1 3 3v.5a3 3 0 0 1 2 2.8 3 3 0 0 1-1 4.7 3 3 0 0 1-4 4.5V4z"/><path d="M9 9h2M13 13h2M9 14h1"/>',
  convo:'<path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M17 9h3a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v2l-3-2"/>',
  voice:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
  grammar:'<path d="M2 5c3-1.5 6-1.5 10 1 4-2.5 7-2.5 10-1v14c-3-1.5-6-1.5-10 1-4-2.5-7-2.5-10-1z"/><path d="M12 6v14"/>',
  vocab:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 15l3-7 3 7M10 13h4"/>',
  listen:'<path d="M3 15v-3a9 9 0 0 1 18 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
  write:'<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4M12 20h8"/>',
  translate:'<path d="M3 5h9M7.5 3v2M5 9c1.5 3 4 5 6 6M10 5c-1 4-3.5 7.5-7 9"/><path d="M13 21l4-9 4 9M14.5 18h5"/>',
  sim:'<path d="M12 3a9 9 0 1 1-7.8 13.5L3 21l4.6-1.2A9 9 0 0 1 12 3z"/>',
  culture:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
  analytics:'<path d="M3 20h18"/><path d="M6 16v-3M10 16V9M14 16v-5M18 16V6"/><path d="M5 10l5-4 4 3 6-5"/>',
  memory:'<circle cx="12" cy="12" r="9"/><path d="M9 8.5a3 3 0 0 1 6 0c0 2-3 2.2-3 4.5M12 16.5v.5"/>'
};
PA.NAV = [
  {id:"dashboard",t:"Home Dashboard",s:"Ringkasan aktivitas belajar",ic:"home"},
  {id:"tutor",t:"AI Tutor",s:"Guru pribadi berbasis AI",ic:"tutor"},
  {id:"conversation",t:"Conversation Room",s:"Percakapan interaktif",ic:"convo"},
  {id:"voice",t:"Voice & Pronunciation",s:"Latihan berbicara",ic:"voice"},
  {id:"grammar",t:"Grammar Lab",s:"Belajar tata bahasa",ic:"grammar"},
  {id:"vocab",t:"Vocabulary Builder",s:"Belajar dan mengingat kata",ic:"vocab"},
  {id:"listening",t:"Listening Lab",s:"Latihan memahami audio",ic:"listen"},
  {id:"writing",t:"Writing Lab",s:"Menulis dan koreksi",ic:"write"},
  {id:"translation",t:"Translation Studio",s:"Terjemahan berdasarkan konteks",ic:"translate"},
  {id:"simulation",t:"Real Life Simulation",s:"Simulasi kehidupan nyata",ic:"sim"},
  {id:"culture",t:"Culture Explorer",s:"Slang dan budaya bahasa",ic:"culture"},
  {id:"analytics",t:"Progress Analytics",s:"Statistik dan perkembangan",ic:"analytics"},
  {id:"memory",t:"My Learning Memory",s:"Riwayat pembelajaran",ic:"memory"}
];
PA.icon = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]||""}</svg>`;
PA.SKILLS = ["reading","writing","listening","speaking","grammar","vocabulary"];
PA.SKILL_ID = {reading:"Membaca",writing:"Menulis",listening:"Menyimak",speaking:"Berbicara",grammar:"Tata bahasa",vocabulary:"Kosakata",conversation:"Percakapan"};
PA.LEVELS = ["A1","A2","B1","B2","C1","C2"];
PA.BOT = "Polyglot AI Tutor";

/* ---------- utils ---------- */
const esc = PA.esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad = (n) => String(n).padStart(2,"0");
PA.dayKey = (d) => { d = d ? new Date(d) : new Date(); return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); };
PA.fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}); } catch(e){ return iso; } };
PA.fmtDT = (iso) => { try { return new Date(iso).toLocaleString("id-ID",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}); } catch(e){ return iso; } };
PA.fmtMin = (sec) => { const m = Math.round((sec||0)/60); return m < 60 ? m+" mnt" : Math.floor(m/60)+" j "+(m%60)+" mnt"; };
PA.uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
PA.shuffle = (a) => { a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
PA.pick = (a,n) => PA.shuffle(a).slice(0,n);
PA.toast = (msg) => { const t = document.getElementById("toast"); t.textContent = msg; t.hidden = false; clearTimeout(t._x); t._x = setTimeout(()=>{ t.hidden = true; }, 2600); };
PA.copy = async (text) => {
  try { await navigator.clipboard.writeText(text); PA.toast("Disalin ke clipboard ✓"); return true; }
  catch(e){ const ta=document.createElement("textarea"); ta.value=text; document.body.appendChild(ta); ta.select(); let ok=false; try{ ok=document.execCommand("copy"); }catch(_){} ta.remove(); PA.toast(ok?"Disalin ke clipboard ✓":"Gagal menyalin — salin manual dari kotak teks."); return ok; }
};
PA.download = (name, blob) => { const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},500); };
PA.norm = (s) => String(s||"").toLowerCase().normalize("NFKC").replace(/[.,!?¿¡;:"“”«»()\[\]…。、！？،؟]/g," ").replace(/\s+/g," ").trim();
PA.fold = (s) => PA.norm(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[’']/g,"'");

/* ---------- store ---------- */
const DEFAULT = () => ({
  v:1, createdAt:new Date().toISOString(),
  profile:{ name:"", lang:"it", goals:"", schedule:"", personality:"teacher", mode:"natural", tutorNotes:"" },
  targets:{ minutes:15, vocab:10, speaking:3, listening:5, grammar:5 },
  levels:{}, levelHistory:[], time:{}, srs:{}, custom:{}, collections:[], events:[], sessions:[], mistakes:[], confusions:{},
  brain:{}, last:{}, lessonsDone:{}, cultureSeen:{}
});
let S = null;
PA.load = () => {
  try { S = JSON.parse(localStorage.getItem(KEY)||"null"); } catch(e){ S = null; }
  const d = DEFAULT();
  if (!S || typeof S !== "object") S = d;
  for (const k in d) if (S[k] == null) S[k] = d[k];
  for (const k in d.profile) if (S.profile[k] == null) S.profile[k] = d.profile[k];
  for (const k in d.targets) if (S.targets[k] == null) S.targets[k] = d.targets[k];
  PA.S = S; return S;
};
let saveT = null;
PA.save = () => { clearTimeout(saveT); saveT = setTimeout(PA.saveNow, 150); };
PA.saveNow = () => {
  try { localStorage.setItem(KEY, JSON.stringify(S)); document.getElementById("saveState").textContent = "Tersimpan di perangkat • "+new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}); }
  catch(e){ PA.toast("Penyimpanan penuh/diblokir: ekspor data Anda lalu hapus riwayat lama."); }
};
PA.reset = () => { localStorage.removeItem(KEY); PA.load(); PA.saveNow(); };
PA.exportData = () => {
  const blob = new Blob([JSON.stringify({app:"POLYGLOT AI", exportedAt:new Date().toISOString(), data:S},null,1)],{type:"application/json"});
  PA.download("polyglot-ai-backup-"+PA.dayKey()+".json", blob); PA.toast("Backup diunduh ✓");
};
PA.importData = (file) => new Promise((res,rej)=>{
  const r = new FileReader();
  r.onload = () => { try { const j = JSON.parse(r.result); const d = j && j.data ? j.data : j; if (!d || !d.profile || !d.srs) throw new Error("Format tidak dikenal"); localStorage.setItem(KEY, JSON.stringify(d)); PA.load(); res(true); } catch(e){ rej(e); } };
  r.onerror = () => rej(r.error); r.readAsText(file);
});
PA.storageSize = () => { try { return (localStorage.getItem(KEY)||"").length; } catch(e){ return 0; } };

/* ---------- data ---------- */
PA.loadData = async () => {
  const files = ["languages","vocab","grammar","content","scenarios"];
  const out = await Promise.all(files.map(f => fetch("data/"+f+".json",{cache:"no-cache"}).then(r => { if(!r.ok) throw new Error(f+": HTTP "+r.status); return r.json(); })));
  files.forEach((f,i)=> PA.data[f] = out[i]);
  PA.data.langMap = {}; PA.data.languages.forEach(l => PA.data.langMap[l.code] = l);
  PA.data.conceptMap = {}; PA.data.vocab.concepts.forEach(c => PA.data.conceptMap[c.key] = c);
};
PA.lang = () => S.profile.lang;
PA.L = (code) => PA.data.langMap[code || S.profile.lang];
PA.TOPICS = {basics:"Salam & Dasar",numbers:"Angka",people:"Keluarga & Orang",food:"Makanan & Minuman",travel:"Perjalanan",daily:"Rumah & Sehari-hari",time:"Waktu",work:"Pekerjaan",emotions:"Emosi",adjectives:"Kata Sifat",verbs:"Kata Kerja",phrases:"Frasa Penting",custom:"Kata Saya"};
PA.POS = {interj:"interjeksi",adv:"adverbia",phrase:"frasa",num:"numeralia",noun:"nomina",adj:"adjektiva",verb:"verba"};

/* ---------- speech synthesis ---------- */
let voices = [];
const loadVoices = () => { try { voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; } catch(e){ voices = []; } };
if (window.speechSynthesis) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
PA.ttsSupported = () => !!window.speechSynthesis;
PA.voiceFor = (tag) => {
  if (!voices.length) loadVoices();
  const t = tag.toLowerCase(), base = t.split("-")[0];
  const alt = base === "nb" ? ["nb","no","nn"] : base === "zh" ? ["zh-cn","zh"] : [base];
  return voices.find(v => v.lang.toLowerCase().replace("_","-") === t) || voices.find(v => alt.some(a => v.lang.toLowerCase().replace("_","-").startsWith(a))) || null;
};
PA.speak = (text, code, rate) => new Promise((resolve) => {
  if (!window.speechSynthesis) { PA.toast("Browser ini tidak mendukung suara sintetis (TTS)."); return resolve(false); }
  const L = PA.L(code); const tag = L ? L.tts : "en-US";
  const v = PA.voiceFor(tag);
  if (!v && voices.length) PA.toast("Tidak ada suara "+(L?L.name:tag)+" terpasang di perangkat ini — hasil mungkin memakai suara lain. Tambahkan di Pengaturan › Aksesibilitas › Konten Lisan › Suara.");
  try { speechSynthesis.cancel(); } catch(e){}
  const u = new SpeechSynthesisUtterance(String(text).replace(/…/g," "));
  u.lang = tag; if (v) u.voice = v; u.rate = rate || 1;
  u.onend = () => resolve(true); u.onerror = () => resolve(false);
  speechSynthesis.speak(u);
});

/* ---------- speech recognition ---------- */
PA.sttSupported = () => !!(window.SpeechRecognition || window.webkitSpeechRecognition);
PA.listenOnce = (code, onInterim) => new Promise((resolve, reject) => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return reject(new Error("unsupported"));
  const L = PA.L(code); const r = new SR();
  r.lang = L ? L.tts : "en-US"; r.interimResults = true; r.maxAlternatives = 3; r.continuous = false;
  let final = "", alts = [];
  r.onresult = (e) => { let txt=""; for (let i=0;i<e.results.length;i++){ txt += e.results[i][0].transcript; if (e.results[i].isFinal){ alts = Array.from(e.results[i]).map(a=>a.transcript); } } final = txt; if (onInterim) onInterim(txt); };
  r.onerror = (e) => reject(new Error(e.error || "error"));
  r.onend = () => resolve({ text: final.trim(), alts });
  try { r.start(); } catch(e){ reject(e); }
  PA._sr = r;
});
PA.stopListening = () => { try { PA._sr && PA._sr.stop(); } catch(e){} };

/* ---------- active study timer ---------- */
let lastInteract = Date.now();
["pointerdown","keydown","scroll","touchstart"].forEach(ev => window.addEventListener(ev, ()=>{ lastInteract = Date.now(); }, {passive:true}));
setInterval(() => {
  if (!S || document.hidden) return;
  if (Date.now() - lastInteract > 120000) return; // idle > 2 min → not counted
  const k = PA.dayKey(); const d = S.time[k] || (S.time[k] = {total:0, byLang:{}});
  d.total += 15; d.byLang[S.profile.lang] = (d.byLang[S.profile.lang]||0) + 15; PA.save();
}, 15000);

/* ---------- events & adaptive brain ---------- */
PA.log = (ev) => {
  ev = Object.assign({ t:new Date().toISOString(), lang:S.profile.lang }, ev);
  S.events.push(ev); if (S.events.length > 8000) S.events.splice(0, S.events.length - 8000);
  if (ev.correct === true || ev.correct === false) PA.brainUpdate(ev.lang, ev.skill);
  PA.save(); return ev;
};
PA.eventsFor = (lang, filter) => S.events.filter(e => (!lang || e.lang === lang) && (!filter || filter(e)));
PA.BRAIN = { window:20, minN:10, up:0.85, down:0.60, max:5, min:1 };
PA.brainState = (lang, skill) => {
  const b = S.brain[lang] || (S.brain[lang] = {});
  return b[skill] || (b[skill] = { level:1, since:null, log:[] });
};
PA.brainUpdate = (lang, skill) => {
  if (!skill) return;
  const st = PA.brainState(lang, skill), C = PA.BRAIN;
  const evs = S.events.filter(e => e.lang === lang && e.skill === skill && typeof e.correct === "boolean" && (!st.since || e.t > st.since)).slice(-C.window);
  if (evs.length < C.minN) return;
  const acc = evs.filter(e => e.correct).length / evs.length, pct = Math.round(acc*100);
  let to = st.level, reason = "";
  if (acc >= C.up && st.level < C.max) { to = st.level + 1; reason = `Akurasi ${pct}% pada ${evs.length} soal terakhir ≥ ${C.up*100}% → tingkat kesulitan naik.`; }
  else if (acc < C.down && st.level > C.min) { to = st.level - 1; reason = `Akurasi ${pct}% pada ${evs.length} soal terakhir < ${C.down*100}% → tingkat kesulitan turun agar materi lebih terjangkau.`; }
  if (to !== st.level) {
    st.log.unshift({ t:new Date().toISOString(), from:st.level, to, reason, acc:pct, n:evs.length }); st.log = st.log.slice(0,30);
    st.level = to; st.since = new Date().toISOString();
    PA.toast(`🧠 Adaptive Brain · ${PA.SKILL_ID[skill]||skill}: tingkat ${to} (${pct}% dari ${evs.length} soal)`);
  }
};
PA.rolling = (lang, skill, n) => {
  const evs = S.events.filter(e => e.lang === lang && e.skill === skill && typeof e.correct === "boolean").slice(-(n||PA.BRAIN.window));
  if (!evs.length) return null;
  return { acc: evs.filter(e=>e.correct).length/evs.length, n: evs.length };
};

/* ---------- streak / today ---------- */
PA.activeDays = () => {
  const set = new Set(); Object.keys(S.time).forEach(k => { if (S.time[k].total >= 60) set.add(k); });
  S.events.forEach(e => set.add(PA.dayKey(e.t))); return set;
};
PA.streak = () => {
  const days = PA.activeDays(); let n = 0; const d = new Date();
  if (!days.has(PA.dayKey(d))) d.setDate(d.getDate()-1);
  while (days.has(PA.dayKey(d))) { n++; d.setDate(d.getDate()-1); }
  return n;
};
PA.todayCounts = (lang) => {
  const k = PA.dayKey(); const ev = S.events.filter(e => PA.dayKey(e.t) === k && (!lang || e.lang === lang));
  return {
    minutes: Math.round((((S.time[k]||{}).total||0) + ((S.time[k]||{}).external||0))/60),
    vocab: ev.filter(e => e.type === "review").length,
    speaking: ev.filter(e => e.skill === "speaking").length,
    listening: ev.filter(e => e.type === "listening").length,
    grammar: ev.filter(e => e.type === "grammar").length
  };
};

/* ---------- router & shell ---------- */
PA.go = (route, param) => { location.hash = "#/" + route + (param != null ? "/" + encodeURIComponent(param) : ""); };
PA.parseHash = () => { const p = location.hash.replace(/^#\/?/,"").split("/"); return { route: p[0] || "dashboard", param: p[1] ? decodeURIComponent(p.slice(1).join("/")) : null }; };
PA.cleanup = [];
PA.onLeave = (fn) => PA.cleanup.push(fn);
PA.render = () => {
  PA.cleanup.splice(0).forEach(fn => { try { fn(); } catch(e){} });
  try { window.speechSynthesis && speechSynthesis.cancel(); } catch(e){}
  const { route, param } = PA.parseHash();
  const view = document.getElementById("view");
  const fn = PA.pages[route] || PA.pages.dashboard;
  renderNav(route); closeNav();
  S.last.route = route; if (!["dashboard","memory","about","analytics","lang","placement"].includes(route) && PA.pages[route]) S.last.cont = route; PA.save();
  try { view.innerHTML = ""; view.style.animation = "none"; void view.offsetWidth; view.style.animation = ""; fn(view, param); }
  catch(e){ console.error(e); view.innerHTML = `<div class="card"><h2>Terjadi kesalahan</h2><p class="muted">${esc(e.message)}</p><button class="btn" onclick="location.hash='#/dashboard'">Kembali ke Dashboard</button></div>`; }
  window.scrollTo(0,0);
};
function renderNav(route){
  const nav = document.getElementById("nav");
  nav.innerHTML = PA.NAV.map(n => `<button class="mi ${n.id===route?"on":""}" data-go="${n.id}" aria-current="${n.id===route?"page":"false"}"><span class="tile">${PA.icon(n.ic)}</span><span class="tx"><b>${esc(n.t)}</b><small>${esc(n.s)}</small></span><span class="chev">›</span></button>`).join("");
}
function openNav(){ document.getElementById("sidebar").classList.add("open"); }
function closeNav(){ document.getElementById("sidebar").classList.remove("open"); }
PA.renderLangSelect = () => {
  const sel = document.getElementById("langSelect");
  sel.innerHTML = PA.data.languages.map(l => `<option value="${l.code}" ${l.code===S.profile.lang?"selected":""}>${esc(l.native)} · ${esc(l.name)}</option>`).join("");
  document.getElementById("langFlag").textContent = S.profile.lang.toUpperCase();
};
PA.setLang = (code) => { if (!PA.data.langMap[code]) return; S.profile.lang = code; PA.save(); PA.renderLangSelect(); PA.render(); PA.toast("Bahasa aktif: "+PA.L().name); };

/* helpers for pages */
PA.head = (title, sub, extra) => `<div class="row between" style="align-items:flex-start;margin-bottom:6px"><div><h1>${title}</h1><p class="sub">${sub||""}</p></div>${extra||""}</div>`;
PA.levelOf = (lang, skill) => ((S.levels[lang]||{})[skill]) || null;
PA.isRTL = (code) => (PA.L(code)||{}).dir === "rtl";
PA.wordHTML = (w, code, cls) => `<span class="${cls||""} ${PA.isRTL(code)?"rtl":""}" lang="${(PA.L(code)||{}).tts||""}">${esc(w)}</span>`;
PA.speakBtn = (text, code, label, rate) => `<button class="btn sm" data-speak="${esc(text)}" data-speak-lang="${code||S.profile.lang}" ${rate?`data-rate="${rate}"`:""} aria-label="Putar audio">🔊 ${label||""}</button>`;

/* global delegation */
document.addEventListener("click", (e) => {
  const g = e.target.closest("[data-go]"); if (g) { e.preventDefault(); const [r,p] = g.dataset.go.split("|"); PA.go(r, p); return; }
  const sp = e.target.closest("[data-speak]"); if (sp) { e.preventDefault(); PA.speak(sp.dataset.speak, sp.dataset.speakLang, parseFloat(sp.dataset.rate||"1")); return; }
  const cp = e.target.closest("[data-copy]"); if (cp) { const el = document.getElementById(cp.dataset.copy); if (el) PA.copy(el.value != null && el.tagName==="TEXTAREA" ? el.value : el.textContent); return; }
});

async function boot(){
  PA.load();
  document.getElementById("openNav").onclick = openNav;
  document.getElementById("closeNav").onclick = closeNav;
  try { await PA.loadData(); }
  catch(e){ document.getElementById("view").innerHTML = `<div class="card"><h2>Gagal memuat data</h2><p class="muted">${esc(e.message)}. Periksa koneksi lalu muat ulang. Jika aplikasi sudah pernah dibuka, data akan tersedia offline.</p><button class="btn" onclick="location.reload()">Muat ulang</button></div>`; return; }
  if (!PA.data.langMap[S.profile.lang]) S.profile.lang = "it";
  PA.renderLangSelect();
  document.getElementById("langSelect").onchange = (e) => PA.setLang(e.target.value);
  window.addEventListener("hashchange", PA.render);
  PA.render();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
}
document.addEventListener("DOMContentLoaded", boot);
})();
