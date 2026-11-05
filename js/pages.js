/* POLYGLOT AI — Dashboard, Language DB, Placement, Analytics, Memory, About */
(function(){
"use strict";
const PA = window.PA, esc = PA.esc;
const DAY = 86400000;
const SCRIPTED = () => Object.keys(PA.data.scenarios.langs);

/* ---------- recommendations (Adaptive Learning Brain) ---------- */
PA.recommendations = (lang) => {
  const S = PA.S, out = [], plan = PA.reviewPlan(lang), tc = PA.todayCounts(lang);
  if (!(S.levels[lang]||{}).date) out.push({ title:"Ikuti Tes Penempatan", why:"Belum ada perkiraan level CEFR untuk bahasa ini; materi belum bisa disesuaikan.", go:"placement" });
  if (plan.due.length) out.push({ title:`Ulas ${plan.due.length} kata yang jatuh tempo`, why:"Jadwal SM-2: kata ini akan terlupa jika tidak diulas sekarang. " + plan.reason, go:"vocab|review" });
  else if (plan.newCards.length) out.push({ title:`Pelajari ${plan.newCards.length} kata baru`, why:plan.reason, go:"vocab|review" });
  PA.weakSkills(lang).filter(w => w.acc < 0.7).slice(0,2).forEach(w => {
    const go = { vocabulary:"vocab|intel", grammar:"grammar", listening:"listening", conversation:"simulation" }[w.skill];
    out.push({ title:`Perkuat ${PA.SKILL_ID[w.skill]}`, why:`Akurasi ${Math.round(w.acc*100)}% pada ${w.n} soal terakhir (< 70%).`, go });
  });
  const topics = PA.grammarTopics(lang); if (topics.length) {
    const lvl = PA.brainState(lang,"grammar").level; const want = PA.LEVELS[Math.min(5, lvl-1)];
    const t = topics.find(t => !S.lessonsDone[t.id] && t.level <= want) || topics.find(t => !S.lessonsDone[t.id]);
    if (t) out.push({ title:`Pelajaran berikutnya: ${t.title}`, why:`Topik ${t.level} yang belum selesai; tingkat Adaptive Brain tata bahasa = ${lvl}.`, go:"grammar|"+t.id });
  }
  if (tc.listening < S.targets.listening) out.push({ title:"Latihan menyimak", why:`Hari ini ${tc.listening}/${S.targets.listening} soal menyimak.`, go:"listening" });
  if (tc.speaking < S.targets.speaking) out.push({ title:"Latihan berbicara", why:`Hari ini ${tc.speaking}/${S.targets.speaking} latihan berbicara.`, go: SCRIPTED().includes(lang) ? "conversation|live" : "voice" });
  if (!S.events.some(e => e.type === "scenario_done" && e.lang === lang) && SCRIPTED().includes(lang)) out.push({ title:"Coba simulasi kehidupan nyata", why:"Belum ada skenario yang diselesaikan dalam bahasa ini.", go:"simulation" });
  return out.slice(0,6);
};

/* ---------- DASHBOARD ---------- */
const bar = (v, max) => `<div class="bar"><i style="width:${Math.min(100, max ? v/max*100 : 0)}%"></i></div>`;
PA.pages.dashboard = (view) => {
  const S = PA.S, lang = PA.lang(), L = PA.L(), tc = PA.todayCounts(lang), st = PA.vocabStats(lang), streak = PA.streak();
  const h = new Date().getHours(); const greet = h < 11 ? "Selamat pagi" : h < 15 ? "Selamat siang" : h < 18 ? "Selamat sore" : "Selamat malam";
  const lv = S.levels[lang] || {};
  const totalSec = Object.values(S.time).reduce((a,d) => a + (d.total||0) + (d.external||0), 0);
  const langSec = Object.values(S.time).reduce((a,d) => a + ((d.byLang||{})[lang]||0), 0);
  const ev = PA.eventsFor(lang);
  const per = { vocabulary: ev.filter(e=>e.type==="review").length, grammar: ev.filter(e=>e.type==="grammar").length, listening: ev.filter(e=>e.type==="listening").length,
    speaking: ev.filter(e=>e.skill==="speaking").length, conversation: ev.filter(e=>e.type==="scenario").length, writing: S.sessions.filter(s=>s.lang===lang&&(s.kind==="writing"||s.kind==="translation")).length };
  const lessons = PA.grammarTopics(lang).filter(t => S.lessonsDone[t.id]).length;
  const recs = PA.recommendations(lang);
  const T = [["minutes","Menit belajar"],["vocab","Ulasan kosakata"],["speaking","Latihan berbicara"],["listening","Soal menyimak"],["grammar","Soal tata bahasa"]];
  const last = S.last.cont ? PA.NAV.find(n => n.id === S.last.cont) : null;
  const brainSk = ["vocabulary","grammar","listening","conversation"];
  view.innerHTML = PA.head(`${greet}${S.profile.name?", "+esc(S.profile.name):""} 👋`, `Belajar <b>${esc(L.name)}</b> (${esc(L.native)}) · ${new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long"})}`,
    `<div class="row"><button class="btn" data-go="lang">🌍 Ganti bahasa</button><button class="btn primary" data-go="placement">🎯 Tes Penempatan</button></div>`) +
  `<div class="grid g4" style="margin:14px 0">
    <div class="stat"><b>🔥 ${streak}</b><span>hari beruntun</span></div>
    <div class="stat"><b>${PA.fmtMin(totalSec)}</b><span>total waktu belajar</span></div>
    <div class="stat"><b>${st.learned}</b><span>kata dipelajari (${esc(L.name)})</span></div>
    <div class="stat"><b>${lessons}</b><span>pelajaran tata bahasa selesai</span></div></div>
  <div class="grid g2">
   <div class="card"><div class="row between"><h2>Target hari ini</h2><button class="btn sm ghost" id="edT">✏️ Ubah target</button></div>
     <div id="tgt">${T.map(([k,l]) => `<div style="margin:10px 0"><div class="row between small"><span>${l}</span><b>${tc[k]} / ${S.targets[k]}</b></div>${bar(tc[k], S.targets[k])}</div>`).join("")}</div>
     <p class="tiny muted">Waktu belajar dihitung otomatis hanya saat aplikasi aktif (jeda > 2 menit tidak dihitung), ditambah menit sesi tutor yang Anda catat. Sesi ini: ${PA.fmtMin(((S.time[PA.dayKey()]||{}).total)||0)} di aplikasi hari ini.</p></div>
   <div class="card"><div class="row between"><h2>Level CEFR (perkiraan)</h2>${lv.date?`<span class="tiny muted">${PA.fmtDate(lv.date)}</span>`:""}</div>
     ${lv.date ? `<div class="grid g3 stats3">${PA.SKILLS.map(k => `<div class="stat"><b>${lv[k]||"–"}</b><span>${PA.SKILL_ID[k]}</span></div>`).join("")}</div><p class="tiny muted">Perkiraan dari penilaian diri CEFR + kuis singkat, bukan sertifikat resmi.</p>`
       : `<div class="empty"><div class="ic">🎯</div><p>Belum ada level untuk ${esc(L.name)}.</p><button class="btn primary" data-go="placement">Mulai tes penempatan (±5 menit)</button></div>`}</div>
  </div>
  <div class="grid g2" style="margin-top:14px">
   <div class="card"><h2>🧠 Rekomendasi Adaptive Learning Brain</h2>${recs.length ? `<div class="list">${recs.map(r => `<button class="li hover" data-go="${r.go}" style="text-align:left;width:100%"><div class="grow"><b>${esc(r.title)}</b><div class="small muted">Alasan: ${esc(r.why)}</div></div><span class="chev">›</span></button>`).join("")}</div>` : `<div class="empty small">Semua target hari ini tercapai. 🎉</div>`}
     <div class="row" style="margin-top:12px">${brainSk.map(k => { const b = PA.brainState(lang,k); return `<span class="badge ${b.level>=4?"ok":b.level<=1?"gray":"blue"}">${PA.SKILL_ID[k]}: tingkat ${b.level}/5</span>`; }).join("")}</div>
     <p class="tiny muted">Aturan: ≥ 85% benar pada 20 soal terakhir (min. 10) → naik; &lt; 60% → turun. Ulasan > 20 jatuh tempo → kata baru dibatasi.</p></div>
   <div class="card"><h2>Lanjutkan belajar</h2>
     ${last ? `<button class="li hover" data-go="${last.id}" style="width:100%;text-align:left"><span class="tile">${PA.icon(last.ic)}</span><div class="grow"><b>${esc(last.t)}</b><div class="small muted">Terakhir dibuka</div></div><span class="chev">›</span></button>` : `<p class="small muted">Belum ada aktivitas. Mulai dari Vocabulary Builder atau Tes Penempatan.</p>`}
     <h3 style="margin-top:14px">Latihan per keterampilan (${esc(L.name)})</h3>
     ${Object.entries(per).map(([k,v]) => `<div class="row between small" style="margin:6px 0"><span>${PA.SKILL_ID[k]}</span><b>${v}</b></div>`).join("")}
     <p class="tiny muted">Waktu di aplikasi untuk ${esc(L.name)}: ${PA.fmtMin(langSec)} · ulasan jatuh tempo: ${st.due}</p></div>
  </div>`;
  view.querySelector("#edT").onclick = () => {
    view.querySelector("#tgt").innerHTML = `<form id="tf">${T.map(([k,l]) => `<div class="field"><label class="f">${l}</label><input type="number" min="0" max="500" name="${k}" value="${S.targets[k]}"></div>`).join("")}<button class="btn primary">Simpan target</button></form>`;
    view.querySelector("#tf").onsubmit = (e) => { e.preventDefault(); T.forEach(([k]) => S.targets[k] = Math.max(0, Math.min(500, parseInt(e.target[k].value,10)||0))); PA.save(); PA.toast("Target disimpan ✓"); PA.render(); };
  };
};

/* ---------- LANGUAGE DATABASE ---------- */
PA.pages.lang = (view, code) => {
  const V = PA.data.vocab.langs;
  if (code && PA.data.langMap[code]) {
    const L = PA.L(code), G = L.grammar, voice = PA.voiceFor(L.tts);
    const nWikt = (V[code]||[]).filter(x => x.v === "wikt").length;
    view.innerHTML = `<button class="btn sm ghost" data-go="lang">← Semua bahasa</button><div style="height:12px"></div>` + PA.head(`${esc(L.name)} <span class="muted" style="font-weight:500">· ${PA.wordHTML(L.native, code)}</span>`, esc(L.family),
      code === PA.lang() ? `<span class="badge ok">Bahasa aktif</span>` : `<button class="btn primary" id="use">Jadikan bahasa aktif</button>`) +
    `<div class="grid g2"><div class="card"><dl class="kv"><dt>Rumpun</dt><dd>${esc(L.family)}</dd><dt>Aksara</dt><dd>${esc(L.script)}</dd><dt>Arah tulisan</dt><dd>${L.dir==="rtl"?"Kanan ke kiri":"Kiri ke kanan"}</dd>
      <dt>Pengucapan</dt><dd>${esc(L.pron)}</dd><dt>Formal/informal</dt><dd>${esc(L.formal)}</dd><dt>Variasi regional</dt><dd>${esc(L.regions)}</dd><dt>Konteks budaya</dt><dd>${esc(L.culture)}</dd></dl></div>
     <div class="card"><h3>Struktur tata bahasa</h3><dl class="kv"><dt>Urutan kata</dt><dd>${esc(G.order)}</dd><dt>Gender</dt><dd>${esc(G.gender)}</dd><dt>Kasus</dt><dd>${esc(G.cases)}</dd><dt>Artikel</dt><dd>${esc(G.articles)}</dd><dt>Kata kerja</dt><dd>${esc(G.verbs)}</dd><dt>Khas</dt><dd>${esc(G.special)}</dd></dl>
     <h3 style="margin-top:14px">Konten di aplikasi</h3><dl class="kv"><dt>Kosakata</dt><dd>${(V[code]||[]).length} kata${code!=="en"&&code!=="id"?` (${nWikt} dicocokkan dengan tabel terjemahan Wiktionary)`:" (bahasa dasar)"}</dd>
      <dt>Tata bahasa</dt><dd>${PA.grammarTopics(code).length} topik${code==="ms"?" (memakai topik Bahasa Indonesia, dengan catatan perbedaan)":""}</dd>
      <dt>Fonetik</dt><dd>${PA.data.content.phonetics.filter(p=>p.lang===code).length} bunyi</dd><dt>Budaya</dt><dd>${PA.data.content.culture.filter(c=>c.lang===code).length} ungkapan</dd>
      <dt>Dialog berskrip</dt><dd>${SCRIPTED().includes(code)?"9 skenario":"— (lewat AI Tutor)"}</dd><dt>Suara TTS (${esc(L.tts)})</dt><dd>${voice?esc(voice.name)+" ✓":PA.ttsSupported()?"Tidak ditemukan di perangkat ini":"TTS tidak didukung"}</dd></dl>
      <div class="row" style="margin-top:10px">${PA.speakBtn((V[code]||[])[0] ? V[code][0].w : L.native, code, "Uji suara")}</div></div></div>`;
    const u = view.querySelector("#use"); if (u) u.onclick = () => PA.setLang(code);
    return;
  }
  view.innerHTML = PA.head(`Database <span class="grad-text">Bahasa</span>`, `${PA.data.languages.length} bahasa · pilih untuk melihat detail atau menjadikannya bahasa aktif`) +
   `<input type="search" id="lq" placeholder="Cari bahasa…" style="margin:10px 0 14px"><div class="grid g3" id="lg"></div>`;
  const draw = () => { const q = PA.fold(view.querySelector("#lq").value);
    view.querySelector("#lg").innerHTML = PA.data.languages.filter(l => !q || PA.fold(l.name+" "+l.native+" "+l.family).includes(q)).map(l => { const lv = PA.S.levels[l.code]; const n = (PA.S.srs[l.code] ? Object.keys(PA.S.srs[l.code]).length : 0);
      return `<button class="card hover" style="text-align:left;cursor:pointer" data-go="lang|${l.code}"><div class="row between"><b style="font-size:17px">${esc(l.name)}</b>${l.code===PA.lang()?`<span class="badge ok">aktif</span>`:""}</div><div class="${l.dir==="rtl"?"rtl":""}" style="font-size:18px;margin:4px 0">${esc(l.native)}</div><div class="tiny muted">${esc(l.family)}</div><div class="tiny muted">${esc(l.script)}</div><div class="row" style="margin-top:8px">${lv&&lv.date?`<span class="badge blue">${lv.speaking||""}/${lv.reading||""}</span>`:""}${n?`<span class="badge gray">${n} kata dilatih</span>`:""}</div></button>`; }).join(""); };
  view.querySelector("#lq").oninput = draw; draw();
};

/* ---------- PLACEMENT ---------- */
PA.pages.placement = (view) => {
  const lang = PA.lang(), L = PA.L(), C = PA.data.content.cefr; const four = ["listening","reading","speaking","writing"];
  const self = {};
  view.innerHTML = PA.head(`Tes <span class="grad-text">Penempatan</span>`, `${esc(L.name)} · hasil berupa <b>perkiraan</b> level CEFR`) +
   `<div class="note blue" style="margin-bottom:14px">Bagian 1: penilaian diri memakai deskriptor “saya bisa…” (diparafrasekan dari kisi penilaian diri CEFR Dewan Eropa). Bagian 2: kuis singkat dari kosakata & latihan tata bahasa yang sudah diverifikasi untuk memeriksa dasar Anda. Ini bukan ujian resmi.</div><div id="pl"></div>`;
  const host = view.querySelector("#pl");
  const part1 = (i) => {
    if (i >= four.length) return part2();
    const sk = four[i];
    host.innerHTML = `<div class="card"><div class="row between"><h2>${i+1}/4 · ${PA.SKILL_ID[sk]}</h2><span class="tiny muted">Pilih deskripsi TERTINGGI yang benar-benar sesuai dengan Anda dalam ${esc(L.name)}</span></div>
      <div class="opts">${["none"].concat(PA.LEVELS).map(lv => `<button class="opt" data-l="${lv}" style="text-align:left">${lv==="none"?"<b>Belum bisa</b> — saya baru mulai / hampir tidak mengerti":`<b>${lv}</b> — ${esc(C[sk][lv])}`}</button>`).join("")}</div></div>`;
    host.querySelectorAll(".opt").forEach(b => b.onclick = () => { self[sk] = b.dataset.l === "none" ? "A1" : b.dataset.l; self[sk+"_none"] = b.dataset.l === "none"; part1(i+1); });
  };
  const part2 = () => {
    const cards = PA.cards(lang).filter(c => !c.custom && c.v !== "user");
    const pool = cards.filter(c => c.v === "wikt").length >= 10 ? cards.filter(c => c.v === "wikt") : cards;
    const vq = PA.shuffle(pool.slice()).slice(0,10).map(c => ({ kind:"vocab", q:`Pilih kata ${L.name} untuk: “${c.tr}”`, o:PA.shuffle([c.w].concat(PA.shuffle(cards.filter(x => x.w !== c.w && x.topic === c.topic)).slice(0,3).map(x=>x.w))), a:c.w }));
    const gq = PA.shuffle(PA.grammarTopics(lang).flatMap(t => t.exercises.map(e => ({ kind:"grammar", q:e.q, o:PA.shuffle(e.o.slice()), a:e.o[e.a] !== undefined && typeof e.a === "number" ? e.o[e.a] : e.a, lvl:t.level })))).slice(0,6);
    const qs = vq.concat(gq); let k = 0; const res = { vocab:[0,0], grammar:[0,0] };
    const show = () => {
      if (k >= qs.length) return finish(res);
      const q = qs[k];
      host.innerHTML = `<div class="card"><div class="row between"><h2>Kuis singkat ${k+1}/${qs.length}</h2><span class="badge gray">${q.kind==="vocab"?"kosakata":"tata bahasa "+(q.lvl||"")}</span></div><p style="font-size:17px">${esc(q.q)}</p>
       <div class="opts">${q.o.map(o => `<button class="opt" data-o="${esc(o)}">${PA.wordHTML(o, lang)}</button>`).join("")}<button class="opt" data-o="__skip" style="opacity:.7">Saya tidak tahu</button></div></div>`;
      host.querySelectorAll(".opt").forEach(b => b.onclick = () => { const ok = b.dataset.o === q.a; res[q.kind][1]++; if (ok) res[q.kind][0]++; k++; show(); });
    };
    if (!qs.length) return finish(res); show();
  };
  const idx = (l) => PA.LEVELS.indexOf(l);
  const finish = (res) => {
    const vr = res.vocab[1] ? res.vocab[0]/res.vocab[1] : null, gr = res.grammar[1] ? res.grammar[0]/res.grammar[1] : null;
    const notes = [];
    const capBy = (lvl, r, what) => { if (r == null) return lvl; if (r < 0.5 && idx(lvl) > 1) { notes.push(`Skor kuis ${what} ${Math.round(r*100)}% — level dibatasi A2 sampai dasar ${what} lebih kuat.`); return "A2"; } return lvl; };
    let vocab = vr == null ? self.reading : vr < 0.5 ? "A1" : vr < 0.8 ? (idx(self.reading) >= 1 ? "A2" : "A1") : (idx(self.reading) >= 1 ? self.reading : "A2");
    let grammar = gr == null ? self.writing : gr < 0.5 ? "A1" : gr < 0.8 ? (idx(self.writing) >= 2 ? "B1" : self.writing) : self.writing;
    const lv = { listening:self.listening, reading:capBy(self.reading, vr, "kosakata"), speaking:self.speaking, writing:capBy(self.writing, gr, "tata bahasa"), vocabulary:vocab, grammar, date:new Date().toISOString(), quiz:{ vocab:res.vocab, grammar:res.grammar } };
    PA.S.levels[lang] = lv; PA.S.levelHistory.push(Object.assign({ lang }, lv));
    PA.log({ type:"placement", lang, levels: PA.SKILLS.map(s=>lv[s]).join(",") }); PA.saveNow();
    host.innerHTML = `<div class="card"><h2>Hasil perkiraan · ${esc(L.name)}</h2><div class="grid g3 stats3">${PA.SKILLS.map(k => `<div class="stat"><b>${lv[k]}</b><span>${PA.SKILL_ID[k]}</span></div>`).join("")}</div>
     <dl class="kv" style="margin-top:14px"><dt>Kuis kosakata</dt><dd>${res.vocab[1] ? `${res.vocab[0]}/${res.vocab[1]}` : "—"}</dd><dt>Kuis tata bahasa</dt><dd>${res.grammar[1] ? `${res.grammar[0]}/${res.grammar[1]}` : "— (belum ada latihan terverifikasi untuk bahasa ini; memakai penilaian diri menulis)"}</dd></dl>
     ${notes.map(n => `<div class="note warn small">${esc(n)}</div>`).join("")}
     <p class="small muted">Metode: menyimak, membaca, berbicara, menulis = penilaian diri CEFR Anda (dibatasi bila kuis dasar rendah). Kosakata & tata bahasa = gabungan kuis dan penilaian diri. Kuis hanya mencakup materi A1–B1, jadi tidak bisa membuktikan level tinggi — gunakan ini sebagai titik awal, bukan sertifikat. Anda bisa mengubahnya di My Learning Memory.</p>
     <div class="row"><button class="btn primary" data-go="dashboard">Ke Dashboard</button><button class="btn" data-go="placement">Ulangi tes</button></div></div>`;
  };
  part1(0);
};

/* ---------- SVG charts ---------- */
const barChart = (vals, labels, opts) => {
  opts = opts || {}; const W = 640, H = 200, pad = 28, n = vals.length; const max = Math.max(1, ...vals.map(v => Array.isArray(v) ? v.reduce((a,b)=>a+b,0) : v||0));
  const bw = (W - pad*2) / n; const cols = opts.colors || ["#8b5cf6","#3b82f6"];
  let g = "";
  vals.forEach((v,i) => { const parts = Array.isArray(v) ? v : [v||0]; let y = H - pad;
    parts.forEach((p,j) => { const h = p / max * (H - pad*2); y -= h; if (h > 0) g += `<rect x="${pad + i*bw + bw*0.15}" y="${y}" width="${bw*0.7}" height="${h}" rx="3" fill="${cols[j%cols.length]}"><title>${labels[i]}: ${opts.fmt?opts.fmt(p):p}</title></rect>`; });
    if (n <= 14 || i % Math.ceil(n/10) === 0) g += `<text x="${pad + i*bw + bw/2}" y="${H-8}" font-size="10" fill="#8a8aa0" text-anchor="middle">${labels[i]}</text>`; });
  g += `<text x="4" y="${pad-6}" font-size="10" fill="#8a8aa0">${opts.fmt?opts.fmt(max):max}</text><line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" stroke="#2a2b3d"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img">${g}</svg>`;
};
const lineChart = (vals, labels) => {
  const W = 640, H = 200, pad = 28, n = vals.length, x = (i) => pad + i*(W-pad*2)/Math.max(1,n-1), y = (v) => H - pad - v*(H-pad*2);
  let d = "", g = ""; vals.forEach((v,i) => { if (v == null) return; d += (d ? " L" : "M") + x(i) + " " + y(v); g += `<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="#a78bfa"><title>${labels[i]}: ${Math.round(v*100)}%</title></circle>`; });
  [0,0.6,0.85,1].forEach(t => g += `<line x1="${pad}" x2="${W-pad}" y1="${y(t)}" y2="${y(t)}" stroke="${t===0.85?"#22c55e33":t===0.6?"#f59e0b33":"#2a2b3d"}"/><text x="2" y="${y(t)+3}" font-size="10" fill="#8a8aa0">${t*100}%</text>`);
  labels.forEach((l,i) => { if (n <= 14 || i % Math.ceil(n/10) === 0) g += `<text x="${x(i)}" y="${H-8}" font-size="10" fill="#8a8aa0" text-anchor="middle">${l}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img">${g}<path d="${d}" fill="none" stroke="#8b5cf6" stroke-width="2.5"/></svg>`;
};
PA.charts = { barChart, lineChart };

/* ---------- ANALYTICS ---------- */
PA.pages.analytics = (view, param) => {
  const S = PA.S, lang = PA.lang(), L = PA.L(); const range = param === "30" ? 30 : 7;
  const days = []; for (let i = range-1; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate()-i); days.push(PA.dayKey(d)); }
  const lab = days.map(k => k.slice(8) + "/" + k.slice(5,7));
  const ev = S.events.filter(e => e.lang === lang && days.includes(PA.dayKey(e.t)));
  const mins = days.map(k => { const t = S.time[k] || {}; return [Math.round(((t.byLang||{})[lang]||0)/60), Math.round((t.external||0)/60)]; });
  const reviews = days.map(k => ev.filter(e => e.type === "review" && PA.dayKey(e.t) === k).length);
  const acc = days.map(k => { const x = ev.filter(e => typeof e.correct === "boolean" && PA.dayKey(e.t) === k); return x.length ? x.filter(e=>e.correct).length/x.length : null; });
  const st = PA.vocabStats(lang);
  const skills = ["vocabulary","grammar","listening","conversation","speaking"];
  const bySkill = skills.map(sk => { const x = ev.filter(e => e.skill === sk); const b = x.filter(e => typeof e.correct === "boolean"); return { sk, n:x.length, acc: b.length ? b.filter(e=>e.correct).length/b.length : null, nb:b.length }; });
  const ranked = bySkill.filter(s => s.nb >= 5).sort((a,b) => b.acc - a.acc);
  const intel = PA.vocabIntel ? PA.vocabIntel(lang) : null;
  const hist = S.levelHistory.filter(h => h.lang === lang);
  const writ = S.sessions.filter(s => s.lang === lang && s.kind === "writing" && s.words);
  const sess = S.sessions.filter(s => s.lang === lang && days.includes(PA.dayKey(s.t)));
  const empty = (t) => `<div class="empty small">${t}</div>`;
  view.innerHTML = PA.head(`Progress <span class="grad-text">Analytics</span>`, `${esc(L.name)} · semua angka dihitung dari aktivitas nyata yang tersimpan di perangkat ini`,
    `<div class="tabs"><button class="tab ${range===7?"on":""}" data-go="analytics|7">Mingguan</button><button class="tab ${range===30?"on":""}" data-go="analytics|30">Bulanan</button></div>`) +
  `<div class="grid g4" style="margin:14px 0"><div class="stat"><b>${PA.fmtMin(mins.reduce((a,m)=>a+(m[0]+m[1])*60,0))}</b><span>waktu belajar (${range} hari)</span></div>
    <div class="stat"><b>${reviews.reduce((a,b)=>a+b,0)}</b><span>ulasan kosakata</span></div>
    <div class="stat"><b>${st.accuracy==null?"–":Math.round(st.accuracy*100)+"%"}</b><span>akurasi kosakata (semua)</span></div>
    <div class="stat"><b>${st.retention==null?"–":Math.round(st.retention*100)+"%"}</b><span>retensi (kartu interval ≥ 1 hari)</span></div></div>
  <div class="grid g2">
   <div class="card"><h3>Waktu belajar per hari (menit)</h3>${mins.some(m=>m[0]+m[1])?barChart(mins, lab):empty("Belum ada waktu belajar tercatat.")}<div class="tiny muted"><span style="color:#8b5cf6">■</span> di aplikasi (${esc(L.name)}) <span style="color:#3b82f6">■</span> sesi tutor dicatat manual (semua bahasa)</div></div>
   <div class="card"><h3>Ulasan kosakata per hari</h3>${reviews.some(Boolean)?barChart(reviews, lab):empty("Belum ada ulasan pada periode ini.")}</div>
   <div class="card"><h3>Akurasi harian (semua soal bernilai benar/salah)</h3>${acc.some(a=>a!=null)?lineChart(acc, lab):empty("Belum ada soal yang dijawab.")}<div class="tiny muted">Garis hijau 85% (naik tingkat), oranye 60% (turun tingkat).</div></div>
   <div class="card"><h3>Latihan per keterampilan</h3>${bySkill.some(s=>s.n)?bySkill.map(s => `<div style="margin:8px 0"><div class="row between small"><span>${PA.SKILL_ID[s.sk]}</span><span>${s.n} aktivitas${s.acc!=null?` · ${Math.round(s.acc*100)}% benar`:""}</span></div>${bar(s.n, Math.max(...bySkill.map(x=>x.n)))}</div>`).join(""):empty("Belum ada latihan.")}</div>
  </div>
  <div class="grid g2" style="margin-top:14px">
   <div class="card"><h3>💪 Kekuatan & ⚠️ kelemahan</h3>${ranked.length ? `<div class="list">${ranked.map((s,i) => `<div class="li"><span>${i===0?"💪":i===ranked.length-1&&ranked.length>1?"⚠️":"•"}</span><div class="grow">${PA.SKILL_ID[s.sk]}</div><b>${Math.round(s.acc*100)}%</b><span class="tiny muted">(${s.nb})</span></div>`).join("")}</div>` : empty("Butuh minimal 5 soal per keterampilan untuk dibandingkan.")}
    ${intel && intel.wrong.length ? `<h3 style="margin-top:12px">Kata paling sering salah</h3><div class="row">${intel.wrong.slice(0,8).map(x => `<span class="badge warn">${esc(x.c.w)} ×${x.wrong}</span>`).join("")}</div><button class="btn sm" data-go="vocab|intel" style="margin-top:8px">Buka Vocabulary Intelligence</button>` : ""}</div>
   <div class="card"><h3>Riwayat level CEFR (perkiraan)</h3>${hist.length ? `<table class="t"><tr><th>Tanggal</th>${PA.SKILLS.map(k=>`<th>${PA.SKILL_ID[k].slice(0,6)}</th>`).join("")}</tr>${hist.slice(-8).reverse().map(h => `<tr><td>${PA.fmtDate(h.date)}</td>${PA.SKILLS.map(k=>`<td>${h[k]||"–"}</td>`).join("")}</tr>`).join("")}</table>` : empty("Belum ada tes penempatan.")}
    <h3 style="margin-top:12px">Sesi dengan tutor (${range} hari)</h3>${sess.length ? `<p class="small">${sess.length} sesi · ${sess.reduce((a,s)=>a+s.minutes,0)} menit · rata-rata penilaian diri ${(sess.reduce((a,s)=>a+s.rating,0)/sess.length).toFixed(1)}/5 · ${sess.reduce((a,s)=>a+s.corrections,0)} koreksi</p>` : empty("Belum ada sesi tercatat.")}
    ${writ.length >= 2 ? `<h3>Perkembangan menulis (koreksi per 100 kata)</h3>${barChart(writ.slice(-12).map(s => +(s.corrections/s.words*100).toFixed(1)), writ.slice(-12).map(s => PA.fmtDate(s.t).slice(0,5)), { colors:["#f59e0b"] })}<p class="tiny muted">Makin rendah makin baik. Berdasarkan jumlah koreksi yang Anda catat.</p>` : ""}</div>
  </div>
  <div class="card" style="margin-top:14px"><h3>🧠 Log Adaptive Learning Brain</h3>${(() => { const logs = Object.entries(S.brain[lang]||{}).flatMap(([sk,b]) => (b.log||[]).map(l => Object.assign({ sk }, l))).sort((a,b)=>a.t<b.t?1:-1);
     return logs.length ? `<div class="list">${logs.slice(0,15).map(l => `<div class="li small"><span class="badge ${l.to>l.from?"ok":"warn"}">${PA.SKILL_ID[l.sk]||l.sk} ${l.from}→${l.to}</span><div class="grow">${esc(l.reason)}</div><span class="tiny muted">${PA.fmtDT(l.t)}</span></div>`).join("")}</div>` : empty("Belum ada perubahan tingkat. Brain menilai setelah minimal 10 soal per keterampilan."); })()}</div>`;
};

/* ---------- MEMORY & DATA ---------- */
PA.pages.memory = (view) => {
  const S = PA.S, lang = PA.lang(), L = PA.L(), P = S.profile; const lv = S.levels[lang] || {};
  const mist = S.mistakes.slice().reverse(), sess = S.sessions.slice().reverse();
  view.innerHTML = PA.head(`My Learning <span class="grad-text">Memory</span>`, "Semua yang diingat aplikasi tentang Anda — lihat, ubah, ekspor, atau hapus. Data hanya di perangkat ini (localStorage).") +
  `<div class="grid g2"><div class="card"><h2>Profil & preferensi</h2><form id="pf">
     <div class="field"><label class="f">Nama panggilan</label><input type="text" name="name" maxlength="40" value="${esc(P.name)}"></div>
     <div class="field"><label class="f">Tujuan belajar</label><textarea name="goals" maxlength="500" placeholder="mis. kerja di Milan tahun depan, ngobrol dengan keluarga pasangan">${esc(P.goals)}</textarea></div>
     <div class="field"><label class="f">Jadwal belajar</label><input type="text" name="schedule" maxlength="120" value="${esc(P.schedule)}" placeholder="mis. 20 menit tiap pagi"></div>
     <div class="field"><label class="f">Kepribadian tutor</label><select name="personality">${PA.data.content.personalities.map(p => `<option value="${p.id}" ${p.id===P.personality?"selected":""}>${esc(p.name)} — ${esc(p.idn)}</option>`).join("")}</select><div class="tiny muted" id="pdesc"></div></div>
     <div class="field"><label class="f">Mode percakapan default</label><select name="mode">${["beginner","natural","native","professional"].map(m=>`<option ${m===P.mode?"selected":""}>${m}</option>`).join("")}</select></div>
     <div class="field"><label class="f">Catatan untuk tutor</label><textarea name="tutorNotes" maxlength="500">${esc(P.tutorNotes)}</textarea></div>
     <button class="btn primary">Simpan profil</button></form></div>
   <div class="card"><h2>Level ${esc(L.name)} (bisa diubah manual)</h2><form id="lf"><div class="grid g2">${PA.SKILLS.map(k => `<div class="field"><label class="f">${PA.SKILL_ID[k]}</label><select name="${k}"><option value="">–</option>${PA.LEVELS.map(l=>`<option ${lv[k]===l?"selected":""}>${l}</option>`).join("")}</select></div>`).join("")}</div><button class="btn">Simpan level</button></form>
     <h2 style="margin-top:18px">Ringkasan memori untuk tutor</h2><p class="small muted">Kirim ke @${PA.BOT} agar ia mengingat konteks Anda.</p>${PA.promptBox(PA.memorySummary(lang) + (P.tutorNotes ? "- Catatan: " + P.tutorNotes + "\n" : "") + (P.schedule ? "- Jadwal: " + P.schedule + "\n" : "") + "\nTolong ingat konteks ini untuk sesi-sesi berikutnya.", "mem")}</div></div>
  <div class="grid g2" style="margin-top:14px">
   <div class="card"><h2>Kesalahan berulang (${mist.length})</h2>${mist.length ? `<div class="list">${mist.slice(0,60).map(m => `<div class="li small"><span class="badge gray">${esc(m.lang)}</span><div class="grow">${esc(m.text)}<div class="tiny muted">${PA.fmtDate(m.t)} · ${esc(m.kind)}</div></div><button class="btn sm ghost" data-dm="${m.id}">🗑</button></div>`).join("")}</div>` : `<div class="empty small">Kosong. Kesalahan dicatat dari form sesi tutor.</div>`}
     <form id="mf" class="row" style="margin-top:10px"><input type="text" name="t" maxlength="200" placeholder="Tambah kesalahan untuk diingat…" style="flex:1"><button class="btn">Tambah</button></form></div>
   <div class="card"><h2>Riwayat sesi (${sess.length})</h2>${sess.length ? `<div class="list">${sess.slice(0,60).map(s => `<div class="li small"><span class="badge blue">${esc(s.kind)}</span><div class="grow">${esc(PA.L(s.lang)?PA.L(s.lang).name:s.lang)} · ${s.minutes} mnt · ${s.corrections} koreksi · ${s.rating}/5${s.objectives!=null?` · ${s.objectives}/${s.objectivesTotal} tujuan`:""}${s.note?`<div class="tiny muted">${esc(s.note)}</div>`:""}</div><span class="tiny muted">${PA.fmtDT(s.t)}</span><button class="btn sm ghost" data-ds="${s.id}">🗑</button></div>`).join("")}</div>` : `<div class="empty small">Belum ada sesi tercatat.</div>`}</div></div>
  <div class="card" style="margin-top:14px"><h2>Data Anda</h2>
   <dl class="kv"><dt>Ukuran penyimpanan</dt><dd>${(PA.storageSize()/1024).toFixed(1)} KB (localStorage)</dd><dt>Aktivitas tercatat</dt><dd>${S.events.length} (maks. 8000 terbaru)</dd><dt>Kartu SRS</dt><dd>${Object.values(S.srs).reduce((a,s)=>a+Object.keys(s).length,0)} di ${Object.keys(S.srs).length} bahasa</dd><dt>Kata buatan sendiri</dt><dd>${Object.values(S.custom).reduce((a,c)=>a+c.length,0)}</dd><dt>Koleksi</dt><dd>${S.collections.length}</dd><dt>Dibuat</dt><dd>${PA.fmtDT(S.createdAt)}</dd></dl>
   <div class="row" style="margin-top:12px"><button class="btn primary" id="exp">⬇️ Ekspor JSON</button><button class="btn" id="imp">⬆️ Impor JSON</button><button class="btn" id="clrLang">Hapus progres ${esc(L.name)}</button><button class="btn danger" id="wipe">🗑 Hapus semua data</button></div>
   <p class="tiny muted">Rekaman suara tidak pernah disimpan di sini — hanya diunduh jika Anda memilih menyimpannya. Tidak ada data yang dikirim ke server.</p></div>`;
  const pd = () => { const p = PA.data.content.personalities.find(x => x.id === view.querySelector("[name=personality]").value); view.querySelector("#pdesc").textContent = p ? p.desc : ""; };
  view.querySelector("[name=personality]").onchange = pd; pd();
  view.querySelector("#pf").onsubmit = (e) => { e.preventDefault(); const f = e.target; ["name","goals","schedule","personality","mode","tutorNotes"].forEach(k => P[k] = f[k].value.trim()); PA.save(); PA.toast("Profil disimpan ✓"); PA.render(); };
  view.querySelector("#lf").onsubmit = (e) => { e.preventDefault(); const n = Object.assign({}, lv); PA.SKILLS.forEach(k => { const v = e.target[k].value; if (v) n[k] = v; else delete n[k]; }); n.date = new Date().toISOString(); n.manual = true; S.levels[lang] = n; S.levelHistory.push(Object.assign({ lang }, n)); PA.save(); PA.toast("Level disimpan ✓"); PA.render(); };
  view.querySelector("#mf").onsubmit = (e) => { e.preventDefault(); const t = e.target.t.value.trim(); if (!t) return; S.mistakes.push({ id:PA.uid(), t:new Date().toISOString(), lang, text:t, kind:"manual" }); PA.save(); PA.render(); };
  view.querySelectorAll("[data-dm]").forEach(b => b.onclick = () => { S.mistakes = S.mistakes.filter(m => m.id !== b.dataset.dm); PA.save(); PA.render(); });
  view.querySelectorAll("[data-ds]").forEach(b => b.onclick = () => { S.sessions = S.sessions.filter(m => m.id !== b.dataset.ds); PA.save(); PA.render(); });
  view.querySelector("#exp").onclick = () => PA.exportData();
  view.querySelector("#imp").onclick = () => { const inp = document.getElementById("importFile"); inp.value = ""; inp.onchange = () => { const f = inp.files[0]; if (!f) return; if (!confirm("Impor akan MENGGANTI semua data di perangkat ini. Lanjutkan?")) return; PA.importData(f).then(() => { PA.saveNow(); PA.renderLangSelect(); PA.toast("Data diimpor ✓"); PA.render(); }).catch(err => PA.toast("Gagal impor: " + err.message)); }; inp.click(); };
  view.querySelector("#clrLang").onclick = () => { if (!confirm(`Hapus SRS, level, aktivitas, dan sesi untuk ${L.name}?`)) return; delete S.srs[lang]; delete S.levels[lang]; delete S.brain[lang]; delete S.custom[lang]; delete S.confusions[lang]; S.events = S.events.filter(e => e.lang !== lang); S.sessions = S.sessions.filter(s => s.lang !== lang); S.mistakes = S.mistakes.filter(m => m.lang !== lang); S.levelHistory = S.levelHistory.filter(h => h.lang !== lang); PA.saveNow(); PA.toast("Progres " + L.name + " dihapus"); PA.render(); };
  view.querySelector("#wipe").onclick = () => { if (!confirm("Hapus SEMUA data POLYGLOT AI di perangkat ini? Tindakan ini tidak bisa dibatalkan. Ekspor dulu jika perlu.")) return; PA.reset(); PA.renderLangSelect(); PA.toast("Semua data dihapus"); PA.go("dashboard"); PA.render(); };
};

/* ---------- ABOUT & INTEGRATION ---------- */
PA.pages.about = (view) => {
  const V = PA.data.vocab.langs; const tot = Object.values(V).reduce((a,l)=>a+l.length,0), wk = Object.values(V).reduce((a,l)=>a+l.filter(x=>x.v==="wikt").length,0);
  view.innerHTML = PA.head(`Tentang & <span class="grad-text">Integrasi</span>`, "POLYGLOT AI — Learn Every Language. Unlock Every World.") +
  `<div class="grid g2"><div class="card"><h2>Arsitektur saat ini</h2><ul class="small" style="line-height:1.7;padding-left:18px">
    <li>Aplikasi web statis (HTML/CSS/JavaScript tanpa framework) di GitHub Pages; PWA bisa dipasang ke Layar Utama iPhone dan berjalan offline.</li>
    <li>Semua progres disimpan di <b>localStorage</b> perangkat; ekspor/impor JSON untuk backup & pindah perangkat. Tidak ada akun, server, atau pelacakan.</li>
    <li><b>Otak AI</b> = bot Grok <b>@${PA.BOT}</b>. Halaman AI Tutor, Conversation Room, Writing Lab, Translation Studio, Real Life Simulation, dan Culture Explorer menyusun prompt berisi level, gaya tutor, tujuan, dan kesalahan berulang Anda. Anda menyalinnya ke bot, lalu mencatat hasil sesi agar statistik tetap nyata. Tidak ada kunci API di kode publik ini dan tidak ada jawaban AI palsu.</li>
    <li>Suara: Web Speech API (speechSynthesis untuk TTS, webkitSpeechRecognition untuk speech-to-text jika tersedia), MediaRecorder untuk rekaman (tetap di memori kecuali Anda mengunduhnya), Web Audio API untuk analisis nada/energi.</li>
    <li>Adaptive Learning Brain & Vocabulary Intelligence berbasis aturan transparan (SM-2, ambang akurasi 85%/60%), bukan model AI.</li></ul></div>
   <div class="card"><h2>Lapisan integrasi (rencana server)</h2><p class="small muted">Antarmuka di aplikasi sudah dipisahkan agar layanan ini bisa dipasang tanpa mengubah UI:</p><table class="t small">
    <tr><th>Endpoint</th><th>Fungsi</th></tr>
    <tr><td class="mono">POST /api/tutor/chat</td><td>Proksi LLM sisi server (kunci API di server) — menggantikan salin-tempel prompt; menerima prompt yang sama dari PA.prompts.</td></tr>
    <tr><td class="mono">POST /api/pronunciation/score</td><td>Penilaian pengucapan tingkat fonem (mis. layanan Pronunciation Assessment) dari audio + teks referensi.</td></tr>
    <tr><td class="mono">POST /api/stt</td><td>Speech-to-text server untuk browser tanpa webkitSpeechRecognition (iPhone mode Layar Utama).</td></tr>
    <tr><td class="mono">POST /api/auth/*</td><td>Login (passkey/OAuth) agar data tersinkron antar perangkat.</td></tr>
    <tr><td class="mono">GET/PUT /api/sync</td><td>Sinkronisasi state JSON yang sama (format ekspor) ke PostgreSQL.</td></tr></table>
    <p class="small muted">Skema PostgreSQL yang disarankan: users, languages, vocab_items, srs_cards, events, sessions, mistakes, level_history — memetakan langsung ke kunci di file ekspor.</p></div></div>
  <div class="grid g2" style="margin-top:14px"><div class="card"><h2>Konten & verifikasi</h2><ul class="small" style="line-height:1.7;padding-left:18px">
    <li>${PA.data.languages.length} bahasa dengan profil lengkap (rumpun, aksara, pengucapan, tata bahasa, formalitas, variasi regional, budaya).</li>
    <li>${tot} entri kosakata (120 konsep × bahasa; Thai 117). ${wk} entri cocok dengan tabel terjemahan Wiktionary bahasa Inggris; sisanya ditinjau manual sebagai padanan yang valid.</li>
    <li>${PA.data.grammar.length} topik tata bahasa dengan ${PA.data.grammar.reduce((a,t)=>a+t.exercises.length,0)} latihan; ${PA.data.content.phonetics.length} entri panduan fonetik; ${PA.data.content.culture.length} ungkapan budaya dengan wilayah & kepantasan.</li>
    <li>9 skenario dialog berskrip untuk ${SCRIPTED().map(c=>PA.L(c).name).join(", ")}; bahasa lain lewat AI Tutor.</li>
    <li>Audio menyimak adalah suara sintetis (TTS) perangkat, bukan rekaman penutur asli.</li></ul></div>
   <div class="card"><h2>Dukungan browser</h2><table class="t small"><tr><th>Fitur</th><th>Perangkat ini</th><th>Catatan</th></tr>
    <tr><td>Suara (TTS)</td><td>${PA.ttsSupported()?"✓":"✗"}</td><td>Kualitas & ketersediaan suara tergantung perangkat. iPhone: tambah suara di Pengaturan › Aksesibilitas › Konten Lisan.</td></tr>
    <tr><td>Speech-to-text</td><td>${PA.sttSupported()?"✓":"✗"}</td><td>Chrome/Edge desktop & Android: ya. Safari iOS: terbatas dan sering tidak tersedia saat dibuka dari Layar Utama — gunakan dikte keyboard.</td></tr>
    <tr><td>Rekam suara</td><td>${window.MediaRecorder?"✓":"✗"}</td><td>Safari iOS 14.3+.</td></tr>
    <tr><td>Offline (PWA)</td><td>${"serviceWorker" in navigator?"✓":"✗"}</td><td>Setelah kunjungan pertama.</td></tr></table>
    <p class="small muted" style="margin-top:10px">Pasang di iPhone: buka di Safari → Bagikan → “Tambahkan ke Layar Utama”.</p></div></div>`;
};
})();
