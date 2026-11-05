/* POLYGLOT AI — Grammar Lab, Listening Lab, Voice & Pronunciation (recording, STT check, Accent Intelligence), dialogue engine */
(function(){
"use strict";
const PA = window.PA, esc = PA.esc;

/* =================== GRAMMAR LAB =================== */
const gLangOf = (lang) => lang === "ms" ? "id" : lang;
PA.grammarTopics = (lang) => PA.data.grammar.filter(g => g.lang === gLangOf(lang));
PA.pages.grammar = (view, param) => {
  const lang = PA.lang(), L = PA.L(), S = PA.S;
  const topics = PA.grammarTopics(lang);
  const lvl = PA.brainState(lang,"grammar").level;
  const recLevel = lvl <= 2 ? "A1" : lvl === 3 ? "A2" : "B1";
  if (param) return grammarTopic(view, lang, topics.find(t => t.id === param));
  const done = S.lessonsDone;
  view.innerHTML = PA.head(`Grammar <span class="grad-text">Lab</span>`, `Struktur ${esc(L.name)}: ${esc(L.grammar.order)}`) +
  `<div class="card" style="margin-bottom:14px"><h2>Profil tata bahasa ${esc(L.name)}</h2><dl class="kv">
    <dt>Urutan kata</dt><dd>${esc(L.grammar.order)}</dd><dt>Gender</dt><dd>${esc(L.grammar.gender)}</dd><dt>Kasus</dt><dd>${esc(L.grammar.cases)}</dd><dt>Artikel</dt><dd>${esc(L.grammar.articles)}</dd><dt>Sistem verba</dt><dd>${esc(L.grammar.verbs)}</dd><dt>Ciri khas</dt><dd>${esc(L.grammar.special)}</dd></dl>
    <p class="small muted" style="margin-bottom:0">Setiap bahasa punya struktur berbeda — profil ini tidak mengasumsikan pola bahasa Indonesia atau Inggris.</p></div>` +
  (topics.length ? `${lang==="ms"?`<div class="note warn" style="margin-bottom:12px">Topik di bawah ditulis untuk bahasa Indonesia; afiks me-/di- dan penanda waktu bekerja sama dalam bahasa Melayu, tetapi contoh kosakatanya bisa berbeda (lihat Daftar Kata).</div>`:""}
    <div class="note blue" style="margin-bottom:14px">🧠 Adaptive Brain: tingkat tata bahasa Anda <b>${lvl}</b>/5 → rekomendasi topik level <b>${recLevel}</b>. ${PA.rolling(lang,"grammar")?`Akurasi ${PA.rolling(lang,"grammar").n} soal terakhir: ${Math.round(PA.rolling(lang,"grammar").acc*100)}%.`:"Belum ada data — mulai dari A1."}</div>
    <div class="grid g2">${topics.map(t => { const ex = PA.S.events.filter(e => e.type==="grammar" && e.topic===t.id); const acc = ex.length ? Math.round(ex.filter(e=>e.correct).length/ex.length*100) : null;
      return `<button class="card hover" style="text-align:left;cursor:pointer" data-go="grammar|${t.id}"><div class="row between"><span class="badge ${t.level===recLevel?"":"gray"}">${t.level}${t.level===recLevel?" · direkomendasikan":""}</span>${done[t.id]?`<span class="badge ok">✓ selesai</span>`:""}</div><h3 style="margin-top:10px">${esc(t.title)}</h3><p class="small muted" style="margin:0">${esc(t.cat)} · ${t.exercises.length} latihan${acc!=null?` · akurasi ${acc}%`:""}</p></button>`; }).join("")}</div>`
  : `<div class="card empty"><div class="ic">📘</div><p>Belum ada topik tata bahasa terverifikasi untuk <b>${esc(L.name)}</b> di database lokal (prioritas akurasi di atas cakupan).</p><p class="small">Gunakan profil tata bahasa di atas, lalu minta penjelasan terstruktur dari ${PA.BOT}.</p><button class="btn primary" data-go="tutor|grammar">Buat prompt tata bahasa untuk AI Tutor</button></div>`);
};
function grammarTopic(view, lang, t){
  if (!t) return PA.go("grammar");
  PA.S.last.grammar = t.id; PA.save();
  view.innerHTML = `<button class="btn sm ghost" data-go="grammar">← Semua topik</button><div style="height:12px"></div>` + PA.head(esc(t.title), `<span class="badge">${t.level}</span> <span class="badge gray">${esc(t.cat)}</span>`) +
  `<div class="grid g2"><div class="card"><h3>1 · Penjelasan</h3><p>${esc(t.explain)}</p><h3>2 · Rumus / struktur</h3><div class="pre" style="max-height:none">${esc(t.formula)}</div></div>
   <div class="card"><h3>3 · Contoh</h3><div class="list">${t.examples.map(e => `<div class="li"><div class="grow"><b>${PA.wordHTML(e.t, lang)}</b><div class="small muted">${esc(e.tr)}</div></div>${PA.speakBtn(e.t.replace(/\(.*?\)/g,"").replace(/→/g,","), lang==="ms"?"id":lang)}</div>`).join("")}</div>
   <h3 style="margin-top:14px">4 · Kesalahan umum</h3><ul class="small" style="padding-left:18px;margin:0">${t.mistakes.map(m=>`<li style="margin-bottom:6px">${esc(m)}</li>`).join("")}</ul></div></div>
  <div class="card" style="margin-top:14px"><h3>5 · Latihan & 6 · Penjelasan jawaban</h3><div id="exs" class="stack"></div><div id="gdone"></div></div>
  <div class="card" style="margin-top:14px"><h3>7 · Progresi</h3><p class="small muted">Topik diurutkan A1 → B1. Setelah semua latihan dijawab, topik ditandai selesai; akurasi Anda menggerakkan Adaptive Brain untuk menyarankan level berikutnya.</p><button class="btn" data-go="tutor|grammar">Minta latihan tambahan dari AI Tutor</button></div>`;
  const host = view.querySelector("#exs"); let answered = 0, correct = 0;
  t.exercises.forEach((x, i) => {
    const d = document.createElement("div"); d.className = "li"; d.style.display = "block";
    d.innerHTML = `<div style="margin-bottom:8px"><b>${i+1}.</b> ${PA.wordHTML(x.q, lang)}</div><div class="opts">${x.o.map((o,j)=>`<button class="opt" data-j="${j}">${PA.wordHTML(o, lang)}</button>`).join("")}</div><div class="fb small" style="margin-top:8px"></div>`;
    host.appendChild(d);
    d.querySelectorAll(".opt").forEach(b => b.onclick = () => {
      const j = +b.dataset.j, ok = j === x.a; d.querySelectorAll(".opt").forEach(o => { o.disabled = true; if (+o.dataset.j === x.a) o.classList.add("right"); }); if (!ok) b.classList.add("wrong");
      d.querySelector(".fb").innerHTML = `${ok?"✅ Benar.":"❌ Belum tepat."} ${esc(x.why)}`;
      answered++; if (ok) correct++;
      PA.log({ type:"grammar", skill:"grammar", topic:t.id, item:t.id+"#"+i, correct:ok, lang });
      if (answered === t.exercises.length) { PA.S.lessonsDone[t.id] = new Date().toISOString(); PA.log({ type:"lesson", topic:t.id, lang, score:correct/answered });
        view.querySelector("#gdone").innerHTML = `<div class="note" style="margin-top:12px">Topik selesai: ${correct}/${answered} benar. ${correct===answered?"Luar biasa!":"Ulangi nanti untuk memperkuat."}</div>`; }
    });
  });
}

/* =================== LISTENING LAB =================== */
const LTYPES = { select:"Dengar & pilih arti", complete:"Dengar & lengkapi", dictation:"Dikte", keyword:"Identifikasi kata kunci" };
PA.pages.listening = (view, param) => {
  const lang = PA.lang(), L = PA.L();
  const lvl = PA.brainState(lang,"listening").level;
  const auto = { 1:["select"], 2:["select","keyword"], 3:["select","complete","keyword"], 4:["complete","dictation","keyword"], 5:["dictation","complete"] }[lvl];
  const autoRate = lvl <= 2 ? 0.75 : 1;
  const r = PA.rolling(lang,"listening");
  view.innerHTML = PA.head(`Listening <span class="grad-text">Lab</span>`, `Latihan menyimak ${esc(L.name)} · audio = <b>suara sintetis perangkat (TTS)</b>, bukan rekaman penutur asli`) +
  (!PA.ttsSupported() ? `<div class="note warn">Browser ini tidak mendukung speechSynthesis, jadi latihan audio tidak tersedia. Coba Safari/Chrome terbaru.</div>` : "") +
  `<div class="grid g2" style="margin-bottom:14px"><div class="card"><h3>Pengaturan</h3>
     <div class="field"><label class="f">Jenis latihan</label><div class="chips" id="lt"><button class="chip on" data-t="auto">Otomatis (adaptif)</button>${Object.entries(LTYPES).map(([k,v])=>`<button class="chip" data-t="${k}">${v}</button>`).join("")}</div></div>
     <div class="field"><label class="f">Kecepatan</label><div class="chips" id="ls"><button class="chip on" data-r="auto">Otomatis (${autoRate<1?"pelan":"normal"})</button><button class="chip" data-r="0.7">Pelan pemula</button><button class="chip" data-r="1">Normal</button><button class="chip" data-r="1.15">Cepat</button></div></div>
     <button class="btn primary" id="startL">Mulai 8 soal</button></div>
   <div class="card"><h3>🧠 Adaptive Brain</h3><p class="small">Tingkat menyimak: <b>${lvl}</b>/5 → jenis: ${auto.map(a=>LTYPES[a]).join(", ")}; kecepatan ${autoRate<1?"pelan":"normal"}.</p><p class="small muted">${r?`Akurasi ${r.n} soal terakhir: ${Math.round(r.acc*100)}%.`:"Belum ada data menyimak."} Naik jika ≥85% dari ≥10 soal terakhir, turun jika <60%.</p>
   <p class="small muted">Catatan jujur: aksen regional dan dialog native-speed antarpenutur belum tersedia karena aplikasi tidak memiliki rekaman berlisensi; gunakan podcast/radio asli sebagai pelengkap.</p></div></div><div id="lh"></div>`;
  let type = "auto", rate = "auto";
  view.querySelectorAll("#lt .chip").forEach(b => b.onclick = () => { type = b.dataset.t; view.querySelectorAll("#lt .chip").forEach(x=>x.classList.toggle("on",x===b)); });
  view.querySelectorAll("#ls .chip").forEach(b => b.onclick = () => { rate = b.dataset.r; view.querySelectorAll("#ls .chip").forEach(x=>x.classList.toggle("on",x===b)); });
  view.querySelector("#startL").onclick = () => runListening(view.querySelector("#lh"), lang, type==="auto"?auto:[type], rate==="auto"?autoRate:+rate, lvl);
};
function runListening(host, lang, types, rate, lvl){
  const cards = PA.cards(lang).filter(c => !c.custom); const phrases = cards.filter(c => c.topic === "phrases");
  const noSpace = ["ja","zh","th"].includes(lang);
  let i = 0, ok = 0; const N = 8;
  const next = () => {
    if (i >= N) { host.innerHTML = `<div class="card glow"><h2>Selesai: ${ok}/${N} benar</h2><p class="small muted">Hasil tercatat di Progress Analytics.</p><button class="btn primary" onclick="location.reload()">Latihan lagi</button></div>`; return; }
    const type = types[Math.floor(Math.random()*types.length)];
    const pool = (type === "select" && lvl <= 1) ? cards.filter(c => c.topic !== "phrases") : phrases;
    const c = pool[Math.floor(Math.random()*pool.length)];
    const play = () => PA.speak(c.w, lang, rate);
    let body = "", check = null;
    const toks = c.w.replace(/[.,!?¿¡？。！]/g,"").split(/\s+/).filter(Boolean);
    if (type === "select") {
      const opts = PA.shuffle([c].concat(PA.pick(pool.filter(x=>x.id!==c.id && x.tr!==c.tr),3)));
      body = `<p>Dengarkan, lalu pilih artinya.</p><div class="opts">${opts.map(o=>`<button class="opt" data-v="${esc(o.id)}">${esc(o.tr)}</button>`).join("")}</div>`;
      check = (v) => v === c.id;
    } else if (type === "keyword" && toks.length >= 2 && !noSpace) {
      const kw = toks[Math.floor(Math.random()*toks.length)];
      const others = []; phrases.forEach(p => p.w.replace(/[.,!?¿¡？。！]/g,"").split(/\s+/).forEach(t => { if (t && !toks.map(x=>x.toLowerCase()).includes(t.toLowerCase()) && !others.includes(t)) others.push(t); }));
      const opts = PA.shuffle([kw].concat(PA.pick(others,3)));
      body = `<p>Kata mana yang <b>terdengar</b> dalam kalimat?</p><div class="opts">${opts.map(o=>`<button class="opt" data-v="${esc(o)}">${PA.wordHTML(o, lang)}</button>`).join("")}</div>`;
      check = (v) => v === kw;
    } else if ((type === "complete" || type === "keyword") && toks.length >= 2 && !noSpace) {
      const j = Math.floor(Math.random()*toks.length), ans = toks[j];
      const others = []; phrases.forEach(p => p.w.replace(/[.,!?¿¡？。！]/g,"").split(/\s+/).forEach(t => { if (t && t.toLowerCase() !== ans.toLowerCase() && !others.includes(t)) others.push(t); }));
      const shown = toks.map((t,k)=> k===j ? "_____" : t).join(" ");
      const opts = PA.shuffle([ans].concat(PA.pick(others,3)));
      body = `<p>Lengkapi yang Anda dengar:</p><div class="big-word" style="font-size:24px">${PA.wordHTML(shown, lang)}</div><div class="opts" style="margin-top:10px">${opts.map(o=>`<button class="opt" data-v="${esc(o)}">${PA.wordHTML(o, lang)}</button>`).join("")}</div>`;
      check = (v) => v === ans;
    } else {
      body = `<p>Dikte: ketik persis yang Anda dengar${noSpace||["ru","ar","hi","ko"].includes(lang)?" (aksara asli atau romanisasi)":""}. Huruf besar, tanda baca & diakritik diabaikan.</p><form id="df" class="row"><input type="text" id="dv" autocomplete="off" autocapitalize="off" spellcheck="false" style="flex:1"><button class="btn primary">Periksa</button></form>`;
      check = (v) => { const a = PA.fold(v).replace(/\s/g, noSpace?"":" "), b = PA.fold(c.w).replace(/\s/g, noSpace?"":" "), r = PA.fold(c.r||"").replace(/\s/g, noSpace?"":" "); return !!a && (a === b || (r && a === r)); };
    }
    host.innerHTML = `<div class="card"><div class="row between small muted"><span>${LTYPES[type]||LTYPES.complete} · ${rate<1?"pelan":rate>1?"cepat":"normal"} · <span class="badge gray">suara sintetis</span></span><span>${i+1}/${N}</span></div>
      <div class="flash" style="min-height:120px"><button class="btn primary" id="pl">▶ Putar audio</button><button class="btn sm ghost" id="pl2">🐢 Putar lebih pelan</button></div>${body}<div id="lfb" style="margin-top:12px"></div></div>`;
    host.querySelector("#pl").onclick = play; host.querySelector("#pl2").onclick = () => PA.speak(c.w, lang, Math.max(0.5, rate-0.3)); play();
    const finish = (good, given) => {
      if (good) ok++;
      PA.log({ type:"listening", skill:"listening", item:c.id, correct:good, mode:type, rate, lang });
      host.querySelector("#lfb").innerHTML = `<div class="note">${good?"✅ Benar":"❌ Belum tepat"}${given!=null&&type==="dictation"?` — Anda menulis: <i>${esc(given)}</i>`:""}<br><b>Transkrip:</b> ${PA.wordHTML(c.w, lang)} ${c.r?`<span class="mono small muted">${esc(c.r)}</span>`:""}<br><b>Arti:</b> ${esc(c.tr)}${c.n?`<br><span class="small muted">${esc(c.n)}</span>`:""}</div><div class="row" style="margin-top:10px"><button class="btn primary" id="ln">Lanjut →</button></div>`;
      host.querySelector("#ln").onclick = () => { i++; next(); };
    };
    host.querySelectorAll(".opt").forEach(b => b.onclick = () => { const good = check(b.dataset.v); host.querySelectorAll(".opt").forEach(o=>{ o.disabled = true; if (check(o.dataset.v)) o.classList.add("right"); }); if (!good) b.classList.add("wrong"); finish(good); });
    const df = host.querySelector("#df"); if (df) { host.querySelector("#dv").focus(); df.onsubmit = (e) => { e.preventDefault(); if (host.querySelector("#ln")) return; const v = host.querySelector("#dv").value; finish(check(v), v); }; }
  };
  next();
}

/* =================== AUDIO ANALYSIS (Accent Intelligence) =================== */
PA.audio = {
  async record(opts){
    if (!navigator.mediaDevices || !window.MediaRecorder) throw new Error("Perekaman audio tidak didukung browser ini.");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: opts && opts.raw ? { echoCancellation:false, noiseSuppression:false, autoGainControl:false } : true });
    const mime = ["audio/webm;codecs=opus","audio/webm","audio/mp4","audio/aac"].find(m => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) || "";
    const rec = new MediaRecorder(stream, mime ? { mimeType:mime } : undefined); const chunks = [];
    rec.ondataavailable = (e) => e.data && e.data.size && chunks.push(e.data);
    const done = new Promise(res => { rec.onstop = () => { stream.getTracks().forEach(t=>t.stop()); res(new Blob(chunks, { type: rec.mimeType || mime || "audio/webm" })); }; });
    rec.start(); return { stop: () => { try { rec.state !== "inactive" && rec.stop(); } catch(e){} return done; }, done };
  },
  async analyze(blob){
    const AC = window.AudioContext || window.webkitAudioContext; const ac = new AC();
    const buf = await new Promise((res, rej) => { blob.arrayBuffer().then(ab => { const p = ac.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); }); });
    const sr = buf.sampleRate, x = buf.getChannelData(0); try { ac.close(); } catch(e){}
    const win = Math.round(sr*0.04), hop = Math.round(sr*0.01); const f0 = [], rms = [];
    const minLag = Math.floor(sr/500), maxLag = Math.floor(sr/70);
    for (let s = 0; s + win < x.length; s += hop) {
      let e = 0; for (let i=0;i<win;i++) e += x[s+i]*x[s+i]; const r = Math.sqrt(e/win); rms.push(r);
      // autocorrelation pitch (normalized), voiced only if periodicity > 0.5
      let best = 0, bestLag = 0; const r0 = e || 1e-9;
      for (let lag = minLag; lag <= maxLag; lag++) { let c = 0; for (let i=0;i<win-lag;i++) c += x[s+i]*x[s+i+lag]; c /= r0; if (c > best) { best = c; bestLag = lag; } }
      f0.push(best > 0.5 && r > 0.01 ? sr/bestLag : null);
    }
    const maxR = Math.max(...rms, 1e-6), thr = maxR * 0.06; // ≈ -24 dB from peak
    let a = rms.findIndex(v => v > thr), b = rms.length - 1 - [...rms].reverse().findIndex(v => v > thr);
    if (a < 0) { a = 0; b = rms.length-1; }
    const F = f0.slice(a, b+1).map((v,i) => (rms[a+i] > thr ? v : null)), R = rms.slice(a, b+1).map(v => v/maxR);
    const voiced = F.filter(v => v); const med = voiced.length ? voiced.slice().sort((p,q)=>p-q)[Math.floor(voiced.length/2)] : null;
    const st = F.map(v => v && med ? 12*Math.log2(v/med) : null);
    const stv = st.filter(v => v != null);
    return { dur: (b-a+1)*0.01, totalDur: buf.duration, f0:F, st, energy:R, medianHz: med, rangeSt: stv.length ? Math.max(...stv) - Math.min(...stv) : 0, voicedRatio: F.length ? voiced.length/F.length : 0 };
  },
  resample(arr, n){ const out = []; for (let i=0;i<n;i++){ const p = i*(arr.length-1)/(n-1); const lo = Math.floor(p), hi = Math.ceil(p); const A = arr[lo], B = arr[hi]; out.push(A==null||B==null ? (A ?? B ?? null) : A + (B-A)*(p-lo)); } return out; },
  corr(a, b){ const P = []; for (let i=0;i<a.length;i++) if (a[i]!=null && b[i]!=null) P.push([a[i],b[i]]); if (P.length < 8) return null;
    const ma = P.reduce((s,p)=>s+p[0],0)/P.length, mb = P.reduce((s,p)=>s+p[1],0)/P.length; let n=0,da=0,db=0; P.forEach(([x,y])=>{ n+=(x-ma)*(y-mb); da+=(x-ma)**2; db+=(y-mb)**2; }); return da&&db ? n/Math.sqrt(da*db) : null; },
  svg(series, opts){ // series: [{data, color, label}], data normalized arrays
    const W = 640, H = 170, P = 26, lo = opts.min, hi = opts.max;
    const y = (v) => H - P - (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * (H - 2*P);
    const paths = series.map(s => { let d = "", pen = false; s.data.forEach((v,i) => { if (v == null) { pen = false; return; } const X = P + i*(W-2*P)/(s.data.length-1); d += (pen ? "L" : "M") + X.toFixed(1) + " " + y(v).toFixed(1) + " "; pen = true; }); return `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" opacity=".95"/>`; }).join("");
    const grid = (opts.ticks||[]).map(t => `<line x1="${P}" x2="${W-P}" y1="${y(t)}" y2="${y(t)}" stroke="rgba(255,255,255,.08)"/><text x="4" y="${y(t)+4}" font-size="10" fill="#8a8cb5">${t}${opts.unit||""}</text>`).join("");
    const legend = series.map((s,i) => `<rect x="${W-170}" y="${8+i*16}" width="10" height="10" rx="2" fill="${s.color}"/><text x="${W-154}" y="${17+i*16}" font-size="11" fill="#cfd0f0">${esc(s.label)}</text>`).join("");
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.title||"grafik")}">${grid}${paths}${legend}<text x="${P}" y="${H-6}" font-size="10" fill="#8a8cb5">awal ucapan → akhir (waktu dinormalisasi)</text></svg>`;
  }
};

/* =================== VOICE & PRONUNCIATION =================== */
PA.pages.voice = (view, param) => {
  const lang = PA.lang(), L = PA.L(); const tab = param || "practice";
  view.innerHTML = PA.head(`Voice & <span class="grad-text">Pronunciation</span>`, `Dengar, rekam, bandingkan · ${esc(L.native)}`) +
    `<div class="tabs">${[["practice","Latihan ucap + Accent Intelligence"],["phonetics","Panduan fonetik"],["live","Live Voice Conversation"]].map(([k,t])=>`<button class="tab ${k===tab?"on":""}" data-go="voice|${k}">${t}</button>`).join("")}</div><div id="vb"></div>`;
  const body = view.querySelector("#vb");
  if (tab === "live") return PA.go("conversation","live");
  if (tab === "phonetics") return phonetics(body, lang);
  practice(body, lang);
};
const spk = (w, lang) => { w = w.replace(/\s*\(.*\)/,""); return lang === "zh" ? w.split(" ")[0] : w; };
function phonetics(body, lang){
  const items = PA.data.content.phonetics.filter(p => p.lang === lang); const L = PA.L(lang);
  body.innerHTML = `<div class="card" style="margin-bottom:14px"><h3>Catatan pelafalan ${esc(L.name)}</h3><p style="margin:0">${esc(L.pron)}</p></div>` +
   (items.length ? `<div class="grid g2">${items.map(p => `<div class="card"><div class="row between"><h3 style="margin:0">${esc(p.sound)}</h3><span class="badge mono">${esc(p.ipa)}</span></div><p class="small"><b>Posisi mulut/lidah:</b> ${esc(p.how)}</p>
     <div class="list">${p.ex.map(e => `<div class="li"><div class="grow"><b>${PA.wordHTML(e.w, lang)}</b> <span class="mono small muted">${esc(e.ipa)}</span><div class="small muted">${esc(e.m)}</div></div>${PA.speakBtn(spk(e.w, lang), lang)}<button class="btn sm ghost" data-go="voice|practice" data-w="${esc(e.w)}">🎙</button></div>`).join("")}</div>${p.tip?`<p class="small muted">💡 ${esc(p.tip)}</p>`:""}</div>`).join("")}</div>
     <p class="small muted">IPA untuk bahasa Inggris: bentuk UK dan US ditunjukkan jika berbeda. Contoh dipilih dari pasangan minimal yang umum dipakai dalam pengajaran fonetik.</p>`
   : `<div class="card empty">Belum ada panduan fonetik terverifikasi untuk ${esc(L.name)}. Lihat catatan pelafalan di atas.</div>`);
  body.querySelectorAll("[data-w]").forEach(b => b.addEventListener("click", () => { PA.S.last.pronWord = b.dataset.w.replace(/\s*\(.*\)/,"").split(" ")[0]; PA.save(); }, true));
}
function practice(body, lang){
  const L = PA.L(lang); const cards = PA.cards(lang);
  const items = cards.filter(c => c.topic === "phrases").concat(cards.filter(c => c.topic !== "phrases"));
  const phon = PA.data.content.phonetics.filter(p => p.lang === lang).flatMap(p => p.ex.map(e => ({ id:"ph:"+e.w, w:e.w.replace(/\s*\(.*\)/,"").split(" ")[0], r:e.ipa, tr:e.m })));
  const all = phon.concat(items.map(c => ({ id:c.id, w:c.w, r:c.r, tr:c.tr })));
  let cur = all.find(x => x.w === PA.S.last.pronWord) || all[0];
  let rate = 1, mine = null, ref = null, prev = null, mineBlob = null;
  const stt = PA.sttSupported();
  body.innerHTML = `<div class="note" style="margin-bottom:14px">🔒 <b>Privasi:</b> rekaman Anda hanya disimpan di memori halaman ini dan hilang saat Anda pindah halaman. Tidak ada yang diunggah. Tombol "Simpan rekaman" hanya mengunduh file ke perangkat Anda sendiri, atas pilihan Anda. Dengan menekan 🎙 Rekam, Anda mengizinkan browser memakai mikrofon untuk sesi ini.</div>
  <div class="grid g2"><div class="card"><h3>1 · Pilih kata/kalimat</h3><select id="pick">${all.map(x=>`<option value="${esc(x.id)}" ${x===cur?"selected":""}>${esc(x.w)} — ${esc(x.tr)}</option>`).join("")}</select>
     <div class="flash" style="min-height:150px"><div class="big-word" id="tw"></div><div class="mono muted" id="tr"></div><div class="muted small" id="tm"></div></div>
     <h3>2 · Dengarkan model (TTS)</h3><div class="row"><button class="btn primary" id="play">🔊 Putar</button><label class="small muted">Kecepatan <input type="range" id="rate" min="0.5" max="1.2" step="0.1" value="1" style="vertical-align:middle"> <span id="rv">1.0×</span></label></div>
     <p class="tiny muted">Model = suara sintetis perangkat, bukan penutur asli. Gunakan sebagai acuan umum.</p></div>
   <div class="card"><h3>3 · Rekam suara Anda</h3><div class="row"><button class="btn primary" id="rec">🎙 Rekam</button><button class="btn" id="stop" disabled>■ Stop</button><span id="recst" class="small muted"></span></div>
     <div id="players" class="stack" style="margin-top:12px"></div>
     <h3 style="margin-top:14px">4 · Cek transkrip (speech-to-text)</h3>
     ${stt ? `<button class="btn" id="sttb">🗣 Ucapkan untuk dicek</button><div id="sttr" class="small" style="margin-top:8px"></div><p class="tiny muted">Ini hanya membandingkan <b>kata yang dikenali</b> mesin speech-to-text browser dengan teks target — bukan skor fonem/pelafalan.</p>`
       : `<div class="note warn small">Speech-to-text (webkitSpeechRecognition) tidak tersedia di browser ini. Di iPhone, fitur ini sering tidak tersedia, terutama saat aplikasi dibuka dari Layar Utama. Rekaman & analisis visual tetap berfungsi.</div>`}</div></div>
  <div class="card" style="margin-top:14px"><div class="row between"><h2 style="margin:0">Accent Intelligence <span class="badge blue">perbandingan visual</span></h2><span class="tiny muted">bukan skor pelafalan tersertifikasi</span></div>
   <p class="small muted">Analisis nyata dari audio Anda di perangkat (Web Audio): kontur nada F0 (autokorelasi, dalam semiton relatif terhadap median suara Anda), selubung energi (tekanan & ritme), durasi dan laju bicara. Pembanding: <b>referensi TTS yang direkam lewat mikrofon</b> (browser tidak mengizinkan merekam TTS secara langsung) atau <b>percobaan Anda sebelumnya</b>.</p>
   <div class="row"><button class="btn" id="refb">🎚 Rekam referensi TTS lewat mikrofon</button><span class="tiny muted">Gunakan speaker (bukan headphone), di ruangan tenang.</span></div>
   <div id="ana" style="margin-top:12px"><div class="empty small">Rekam suara Anda untuk melihat grafik.</div></div>
   <div class="note blue small" style="margin-top:12px"><b>Lapisan integrasi (belum dikonfigurasi):</b> skor tingkat fonem membutuhkan layanan analisis pelafalan di server (mis. API penilaian pelafalan pihak ketiga) dengan kunci API rahasia. Endpoint yang disiapkan: <span class="kbd">POST /api/pronunciation/score {audio, text, lang}</span> → {phonemes[], accuracy, fluency}. Tanpa server itu, aplikasi tidak menampilkan skor fonem.</div></div>`;
  const $ = (s) => body.querySelector(s);
  const show = () => { $("#tw").innerHTML = PA.wordHTML(cur.w, lang); $("#tr").textContent = cur.r || ""; $("#tm").textContent = cur.tr || ""; };
  show();
  $("#pick").onchange = (e) => { cur = all.find(x => x.id === e.target.value); prev = null; mine = null; ref = null; mineBlob = null; $("#players").innerHTML = ""; $("#ana").innerHTML = `<div class="empty small">Rekam suara Anda untuk melihat grafik.</div>`; show(); };
  $("#rate").oninput = (e) => { rate = +e.target.value; $("#rv").textContent = rate.toFixed(1)+"×"; };
  $("#play").onclick = () => PA.speak(cur.w, lang, rate);
  let recH = null; const urls = []; PA.onLeave(() => { try { recH && recH.stop(); } catch(e){} urls.forEach(u => URL.revokeObjectURL(u)); });
  $("#rec").onclick = async () => {
    try { recH = await PA.audio.record(); } catch(e){ $("#recst").textContent = "Mikrofon tidak bisa dipakai: " + (e.message||e.name); return; }
    $("#rec").disabled = true; $("#stop").disabled = false; $("#recst").innerHTML = `<span class="mic-dot"></span> merekam… ucapkan “${esc(cur.w)}”`;
    setTimeout(() => { if (!$("#stop").disabled) $("#stop").click(); }, 12000);
  };
  $("#stop").onclick = async () => {
    $("#stop").disabled = true; const blob = await recH.stop(); $("#rec").disabled = false; $("#recst").textContent = "Menganalisis…";
    const url = URL.createObjectURL(blob); urls.push(url); mineBlob = blob;
    $("#players").innerHTML = `<div class="li"><span class="small" style="width:90px">Anda</span><audio controls src="${url}" style="flex:1;min-width:0"></audio></div>
      <div class="li"><span class="small" style="width:90px">Model (TTS)</span><button class="btn sm" id="pm">🔊 Putar model</button><button class="btn sm ghost" id="sv">💾 Simpan rekaman</button></div>`;
    $("#pm").onclick = () => PA.speak(cur.w, lang, rate);
    $("#sv").onclick = () => { const ext = (blob.type.includes("mp4")||blob.type.includes("aac")) ? "m4a" : "webm"; PA.download(`polyglot-${lang}-${PA.dayKey()}.${ext}`, blob); };
    try { if (mine) prev = mine; mine = await PA.audio.analyze(blob); $("#recst").textContent = `Durasi ucapan ${mine.dur.toFixed(2)} dtk`; drawAnalysis(); }
    catch(e){ $("#recst").textContent = "Rekaman tersimpan, tetapi analisis gagal (" + (e.message||"format tidak didukung") + ")."; }
    PA.log({ type:"pron", skill:"speaking", item:cur.id, lang, dur: mine ? +mine.dur.toFixed(2) : null });
  };
  $("#refb").onclick = async () => {
    let h; try { h = await PA.audio.record({ raw:true }); } catch(e){ return PA.toast("Mikrofon tidak bisa dipakai."); }
    $("#refb").disabled = true; $("#refb").textContent = "Merekam referensi…";
    await new Promise(r => setTimeout(r, 300)); await PA.speak(cur.w, lang, rate); await new Promise(r => setTimeout(r, 400));
    const blob = await h.stop(); $("#refb").disabled = false; $("#refb").textContent = "🎚 Rekam referensi TTS lewat mikrofon";
    try { const a = await PA.audio.analyze(blob); if (a.dur < 0.2 || a.voicedRatio < 0.05) { PA.toast("Referensi terlalu pelan/tidak terdengar — naikkan volume speaker."); return; } ref = a; drawAnalysis(); }
    catch(e){ PA.toast("Analisis referensi gagal di browser ini."); }
  };
  function drawAnalysis(){
    if (!mine) { $("#ana").innerHTML = `<div class="empty small">Referensi siap. Sekarang rekam suara Anda.</div>`; return; }
    const N = 120, cmp = ref || prev, cmpLabel = ref ? "Referensi TTS" : "Percobaan sebelumnya";
    const ms = PA.audio.resample(mine.st, N), me = PA.audio.resample(mine.energy, N);
    const series = [{ data:ms, color:"#a78bfa", label:"Anda" }], eser = [{ data:me, color:"#a78bfa", label:"Anda" }];
    let corrTxt = "", eCorr = null, cmpRow = "";
    if (cmp) { const cs = PA.audio.resample(cmp.st, N), ce = PA.audio.resample(cmp.energy, N); series.push({ data:cs, color:"#60a5fa", label:cmpLabel }); eser.push({ data:ce, color:"#60a5fa", label:cmpLabel });
      const c = PA.audio.corr(ms, cs); eCorr = PA.audio.corr(me, ce);
      corrTxt = c == null ? "Terlalu sedikit bagian bersuara untuk dibandingkan." : `Kemiripan bentuk kontur nada (korelasi Pearson): <b>${c.toFixed(2)}</b> (−1…1). ${c > 0.6 ? "Pola naik-turun mirip." : c > 0.2 ? "Sebagian pola mirip — perhatikan bagian yang menyimpang di grafik." : "Pola intonasi berbeda — dengarkan model lagi dan tiru naik-turunnya."}`;
      cmpRow = `<tr><td>${cmpLabel}</td><td>${cmp.dur.toFixed(2)} dtk</td><td>${cmp.rangeSt.toFixed(1)} st</td><td>${rateOf(cmp)}</td></tr>`; }
    $("#ana").innerHTML = `<h3>Kontur intonasi (F0, semiton)</h3>${PA.audio.svg(series, { min:-10, max:10, ticks:[-8,-4,0,4,8], unit:" st", title:"Kontur nada" })}
      <p class="small">${corrTxt || "Rekam referensi TTS atau rekam sekali lagi untuk membandingkan."}</p>
      <h3>Selubung energi (tekanan & ritme)</h3>${PA.audio.svg(eser, { min:0, max:1, ticks:[0,0.5,1], title:"Energi" })}
      ${eCorr!=null?`<p class="small">Kemiripan pola energi: <b>${eCorr.toFixed(2)}</b>. Puncak energi biasanya menandai suku kata bertekanan.</p>`:""}
      <table class="t" style="margin-top:8px"><tr><th></th><th>Durasi ucapan</th><th>Rentang nada</th><th>Laju</th></tr><tr><td>Anda</td><td>${mine.dur.toFixed(2)} dtk</td><td>${mine.rangeSt.toFixed(1)} st</td><td>${rateOf(mine)}</td></tr>${cmpRow}</table>
      <p class="tiny muted">Nada median Anda ≈ ${mine.medianHz?Math.round(mine.medianHz)+" Hz":"–"}. Kontur dinormalisasi ke median masing-masing suara, sehingga perbedaan suara tinggi/rendah tidak memengaruhi bentuk kurva. Grafik ini membantu melihat intonasi, tekanan, dan tempo — bukan penilaian ketepatan bunyi.</p>`;
    function rateOf(a){ const units = ["ja","zh","th"].includes(lang) ? [...cur.w.replace(/[\s。、？！?!.,…]/g,"")].length : cur.w.split(/\s+/).filter(Boolean).length; const u = ["ja","zh","th"].includes(lang) ? "karakter/dtk" : "kata/dtk"; return a.dur > 0 ? (units/a.dur).toFixed(2)+" "+u : "–"; }
  }
  if (stt) $("#sttb").onclick = async () => {
    $("#sttb").disabled = true; $("#sttr").innerHTML = `<span class="mic-dot"></span> mendengarkan…`;
    try { const r = await PA.listenOnce(lang, (t) => { $("#sttr").textContent = "… " + t; });
      const m = PA.matchWords(cur.w, r.text, lang);
      $("#sttr").innerHTML = `Dikenali: <b>${esc(r.text || "(tidak ada)")}</b><br>Kata target: ${m.html} · <b>${m.hit}/${m.total}</b> cocok`;
      PA.log({ type:"stt", skill:"speaking", item:cur.id, lang, match: m.total ? +(m.hit/m.total).toFixed(2) : 0, heard:r.text });
    } catch(e){ $("#sttr").textContent = "Speech-to-text gagal: " + (e.message === "not-allowed" ? "izin mikrofon ditolak" : e.message); }
    $("#sttb").disabled = false;
  };
}
PA.matchWords = (target, heard, lang) => {
  const noSpace = ["ja","zh","th"].includes(lang);
  const T = noSpace ? [...PA.fold(target).replace(/\s/g,"")] : PA.fold(target).split(" ").filter(Boolean);
  const H = noSpace ? PA.fold(heard).replace(/\s/g,"") : " " + PA.fold(heard) + " ";
  let hit = 0; const html = T.map(w => { const ok = noSpace ? H.includes(w) : H.includes(" "+w+" "); if (ok) hit++; return `<span style="color:${ok?"#34d399":"#f87171"}">${esc(w)}</span>`; }).join(noSpace ? "" : " ");
  return { hit, total: T.length, html };
};

/* =================== DIALOGUE ENGINE (scripted, not free AI) =================== */
PA.kwMatch = (text, kws, lang) => {
  const noSpace = ["ja","zh","th"].includes(lang); const t = PA.fold(text); if (!t) return false;
  const pad = " " + t + " ";
  return kws.some(k => { const f = PA.fold(k); if (!f) return false; if (noSpace) return t.includes(f); return f.length <= 2 ? pad.includes(" "+f+" ") : (pad.includes(" "+f) || t.includes(f)); });
};
PA.scriptFor = (lang, sid) => { const l = PA.data.scenarios.langs[lang]; return l && l.s[sid] ? { meta: PA.data.scenarios.scenarios.find(s => s.id === sid), script: l.s[sid], clarify: l.clarify } : null; };
PA.dialogue = (host, lang, sid, opts) => {
  opts = opts || {}; const sc = PA.scriptFor(lang, sid); if (!sc) { host.innerHTML = `<div class="empty">Skrip belum tersedia.</div>`; return; }
  const { meta, script, clarify } = sc; const steps = script.steps; const voice = !!opts.voice; const stt = PA.sttSupported();
  let i = 0; const log = []; const stat = steps.map(() => ({ tries:0, hint:false, skipped:false, ok:false }));
  const rate = opts.rate || 1;
  host.innerHTML = `<div class="card"><div class="row between"><h3 style="margin:0">${esc(meta.name)} <span class="badge gray">${esc(meta.level)}</span></h3><span class="badge warn">percakapan berskrip, bukan AI bebas</span></div>
    <div class="grid g2" style="margin-top:12px"><div><div class="chat" id="chat"></div>
      <form id="say" class="row" style="margin-top:10px">${stt?`<button type="button" class="btn" id="mic" title="Bicara">🎙</button>`:""}<input type="text" id="inp" placeholder="${stt?"Bicara (🎙) atau ketik jawaban…":"Ketik jawaban Anda…"}" autocomplete="off" style="flex:1"><button class="btn primary">Kirim</button></form>
      ${!stt&&voice?`<p class="tiny muted">Speech-to-text tidak tersedia di browser ini (umum di iPhone/mode Layar Utama) — gunakan keyboard; mikrofon keyboard iOS (dikte) juga bisa dipakai.</p>`:""}
      <div class="row" style="margin-top:8px"><button class="btn sm ghost" id="hint">💡 Petunjuk</button><button class="btn sm ghost" id="rep">🔊 Ulangi</button><button class="btn sm ghost" id="skip">Lewati langkah</button></div></div>
    <div><h3>Tujuan</h3><div class="list" id="goals">${steps.map((s,k)=>`<div class="li small" data-g="${k}"><span>⬜</span><span class="grow">${esc(meta.steps[k].goal)}</span></div>`).join("")}</div><div id="hintbox" class="small" style="margin-top:10px"></div></div></div></div>`;
  const chat = host.querySelector("#chat");
  const add = (who, text, tr) => { log.push({ who, text }); const d = document.createElement("div"); d.className = "bubble " + (who === "me" ? "me" : "them"); d.innerHTML = PA.wordHTML(text, lang) + (tr ? `<div class="tiny muted" style="margin-top:4px">${esc(tr)}</div>` : ""); chat.appendChild(d); chat.scrollTop = chat.scrollHeight; };
  const partner = (text, tr) => { add("them", text, tr); if (voice) PA.speak(text, lang, rate); };
  const markGoal = (k, sym) => { const g = host.querySelector(`[data-g="${k}"] span`); if (g) g.textContent = sym; };
  const ask = () => { host.querySelector("#hintbox").innerHTML = ""; partner(steps[i].say, opts.showTr === false ? "" : meta.steps[i].tr); };
  const end = () => {
    partner(script.end, meta.endTr); host.querySelector("#say").classList.add("hide"); host.querySelector(".row:not(#say)") && host.querySelectorAll("#hint,#rep,#skip").forEach(b => b.disabled = true);
    const first = stat.filter(s => s.ok && s.tries === 1 && !s.hint).length, withHelp = stat.filter(s => s.ok && (s.tries > 1 || s.hint)).length, skipped = stat.filter(s => s.skipped).length;
    stat.forEach((s,k) => PA.log({ type:"scenario", skill:"conversation", item:sid+"#"+k, correct: s.ok && s.tries === 1 && !s.hint, lang, voice }));
    PA.log({ type:"scenario_done", skill: voice ? "speaking" : null, item:sid, lang, voice, first, withHelp, skipped });
    PA.S.last.scenario = sid; PA.save();
    const rep = document.createElement("div"); rep.className = "card glow"; rep.style.marginTop = "14px";
    rep.innerHTML = `<h2>Laporan performa</h2><div class="grid g3"><div class="stat"><b>${first}/${steps.length}</b><span>Tujuan tercapai tanpa bantuan</span></div><div class="stat"><b>${withHelp}</b><span>Dengan pengulangan/petunjuk</span></div><div class="stat"><b>${skipped}</b><span>Dilewati</span></div></div>
      <p class="small muted">Penilaian berbasis aturan: jawaban dianggap mencapai tujuan bila memuat kata kunci yang diharapkan. Ini tidak menilai tata bahasa secara penuh — untuk koreksi detail, lanjutkan dengan AI.</p>
      <div class="row"><button class="btn primary" id="ai">🤖 Lanjutkan dengan AI</button><button class="btn" id="again">Ulangi skenario</button></div><div id="aip" style="margin-top:12px"></div>`;
    host.appendChild(rep);
    rep.querySelector("#again").onclick = () => PA.dialogue(host, lang, sid, opts);
    rep.querySelector("#ai").onclick = () => { const p = PA.prompts.continueDialogue(lang, meta, log, stat, voice); rep.querySelector("#aip").innerHTML = PA.promptBox(p, "dlgp"); };
    if (opts.onEnd) opts.onEnd({ first, withHelp, skipped });
  };
  const submit = (text) => {
    text = (text || "").trim(); if (!text) return; add("me", text); stat[i].tries++;
    if (PA.kwMatch(text, steps[i].kw, lang)) { stat[i].ok = true; markGoal(i, stat[i].tries === 1 && !stat[i].hint ? "✅" : "☑️"); i++; if (i >= steps.length) return setTimeout(end, 500); setTimeout(ask, 500); }
    else { setTimeout(() => partner(clarify, "Maaf, bisa diulang?"), 300); if (stat[i].tries >= 2) host.querySelector("#hintbox").innerHTML = `<div class="note small">Contoh jawaban: <b>${PA.wordHTML(steps[i].hint, lang)}</b> ${PA.speakBtn(steps[i].hint, lang)}</div>`; }
  };
  host.querySelector("#say").onsubmit = (e) => { e.preventDefault(); const inp = host.querySelector("#inp"); submit(inp.value); inp.value = ""; };
  host.querySelector("#hint").onclick = () => { if (i >= steps.length) return; stat[i].hint = true; host.querySelector("#hintbox").innerHTML = `<div class="note small">Tujuan: ${esc(meta.steps[i].goal)}<br>Contoh: <b>${PA.wordHTML(steps[i].hint, lang)}</b> ${PA.speakBtn(steps[i].hint, lang)}</div>`; };
  host.querySelector("#rep").onclick = () => { if (i < steps.length) PA.speak(steps[i].say, lang, rate); };
  host.querySelector("#skip").onclick = () => { if (i >= steps.length) return; stat[i].skipped = true; markGoal(i, "⏭"); add("me", "(dilewati)"); i++; if (i >= steps.length) end(); else ask(); };
  const mic = host.querySelector("#mic");
  if (mic) mic.onclick = async () => { mic.disabled = true; mic.innerHTML = `<span class="mic-dot"></span>`; const inp = host.querySelector("#inp");
    try { const r = await PA.listenOnce(lang, t => { inp.value = t; }); if (r.text) { submit(r.text); inp.value = ""; } else PA.toast("Tidak ada suara yang dikenali."); }
    catch(e){ PA.toast("Speech-to-text gagal: " + (e.message === "not-allowed" ? "izin mikrofon ditolak" : e.message) + ". Silakan ketik."); }
    mic.disabled = false; mic.textContent = "🎙"; };
  ask();
};
})();
