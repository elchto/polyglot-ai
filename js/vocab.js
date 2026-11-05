/* POLYGLOT AI — vocabulary, SM-2 spaced repetition, review modes, Vocabulary Intelligence */
(function(){
"use strict";
const PA = window.PA, esc = PA.esc;
const DAY = 86400000;

PA.cards = (lang) => {
  lang = lang || PA.lang(); const S = PA.S, V = PA.data.vocab;
  const items = V.langs[lang] || [];
  const out = items.map(it => { const c = PA.data.conceptMap[it.k] || {};
    return { id: lang+":"+it.k, k: it.k, w: it.w, r: it.r, n: it.n, v: it.v, topic: c.topic, pos: c.pos, tr: lang==="id" ? c.en : c.id, en: c.en, idg: c.id }; });
  (S.custom[lang]||[]).forEach(c => out.push({ id: lang+":u_"+c.id, k:"u_"+c.id, w:c.w, r:c.r||"", n:c.n||"", v:"user", topic:"custom", pos:c.pos||"", tr:c.tr, en:"", custom:true }));
  return out;
};
PA.cardById = (lang, id) => PA.cards(lang).find(c => c.id === id);
PA.srsOf = (lang) => PA.S.srs[lang] || (PA.S.srs[lang] = {});

/* SM-2 (SuperMemo 2) — q: 0..5 */
PA.grade = (lang, id, q, meta) => {
  const s = PA.srsOf(lang); const now = Date.now();
  const r = s[id] || (s[id] = { ef:2.5, interval:0, reps:0, due:now, lapses:0, correct:0, wrong:0, seen:0, created:new Date().toISOString() });
  r.seen++; r.last = new Date().toISOString();
  const prevInterval = r.interval;
  if (q >= 3) {
    r.correct++;
    r.reps = r.reps + 1;
    r.interval = r.reps === 1 ? 1 : r.reps === 2 ? 6 : Math.round(r.interval * r.ef);
  } else {
    r.wrong++; if (r.reps > 0) r.lapses++;
    r.reps = 0; r.interval = 0;
  }
  r.ef = Math.max(1.3, +(r.ef + (0.1 - (5-q)*(0.08 + (5-q)*0.02))).toFixed(3));
  r.due = q >= 3 ? now + r.interval*DAY : now + 10*60*1000; // forgotten → again in 10 min
  if (meta && meta.chosen && q < 3) { const cf = PA.S.confusions[lang] || (PA.S.confusions[lang] = {}); const key = id+"|"+meta.chosen; cf[key] = (cf[key]||0) + 1; }
  PA.log({ type:"review", skill:"vocabulary", item:id, correct:q>=3, q, mode:(meta&&meta.mode)||"flash", prevInterval, lang });
  return r;
};
PA.vocabStats = (lang) => {
  const s = PA.srsOf(lang); const all = Object.values(s); const now = Date.now();
  const ev = PA.S.events.filter(e => e.lang === lang && e.type === "review");
  const mature = ev.filter(e => e.prevInterval >= 1);
  return {
    learned: all.filter(r => r.reps >= 1 || r.interval >= 1).length,
    seen: all.length,
    due: all.filter(r => r.due <= now).length,
    remembered: all.reduce((a,r)=>a+r.correct,0),
    forgotten: all.reduce((a,r)=>a+r.lapses,0),
    wrong: all.reduce((a,r)=>a+r.wrong,0),
    reviews: ev.length,
    accuracy: ev.length ? ev.filter(e=>e.correct).length/ev.length : null,
    retention: mature.length ? mature.filter(e=>e.correct).length/mature.length : null,
    avgInterval: all.length ? all.reduce((a,r)=>a+r.interval,0)/all.length : 0
  };
};
/* adaptive queue with load balancing */
PA.reviewPlan = (lang) => {
  const S = PA.S, s = PA.srsOf(lang), now = Date.now(), cards = PA.cards(lang);
  const due = cards.filter(c => s[c.id] && s[c.id].due <= now).sort((a,b)=>s[a.id].due - s[b.id].due);
  const today = PA.dayKey();
  const newToday = Object.values(s).filter(r => PA.dayKey(r.created) === today).length;
  let newLimit = Math.max(0, S.targets.vocab - newToday), reason = `Target kata baru harian ${S.targets.vocab}; sudah ${newToday} hari ini.`;
  if (due.length > 40) { newLimit = 0; reason = `Ada ${due.length} ulasan jatuh tempo (> 40) — kata baru dijeda dulu agar beban ulasan seimbang.`; }
  else if (due.length > 20) { newLimit = Math.min(newLimit, 3); reason = `Ada ${due.length} ulasan jatuh tempo (> 20) — kata baru dibatasi 3.`; }
  const newCards = cards.filter(c => !s[c.id]).slice(0, newLimit);
  return { due, newCards, newLimit, reason };
};
const MODE_LABEL = { mix:"Campuran adaptif", flash:"Flashcard", mc:"Pilihan ganda", fill:"Isi bagian kosong", listen:"Pengenalan audio", type:"Ketik terjemahan" };
PA.MODE_LABEL = MODE_LABEL;
function modeForLevel(lvl){ const pool = lvl<=1 ? ["flash","mc"] : lvl===2 ? ["flash","mc","listen"] : lvl===3 ? ["mc","listen","fill","flash"] : ["fill","listen","type","mc"]; return pool[Math.floor(Math.random()*pool.length)]; }

/* ---------- review session ---------- */
PA.startSession = (host, lang, cardIds, mode, title, onDone) => {
  const cards = cardIds.map(id => PA.cardById(lang, id)).filter(Boolean);
  if (!cards.length) { host.innerHTML = `<div class="card empty"><div class="ic">🎉</div><p>Tidak ada kartu untuk diulas sekarang.</p></div>`; return; }
  const all = PA.cards(lang); let i = 0; const res = []; const L = PA.L(lang);
  const step = () => {
    if (i >= cards.length) return summary();
    const c = cards[i]; let m = mode === "mix" ? modeForLevel(PA.brainState(lang,"vocabulary").level) : mode;
    if (m === "listen" && !PA.ttsSupported()) m = "mc";
    const head = `<div class="row between small muted" style="margin-bottom:10px"><span>${esc(title||"Sesi ulasan")} · ${MODE_LABEL[m]}</span><span>${i+1}/${cards.length}</span></div><div class="bar" style="margin-bottom:14px"><i style="width:${Math.round(i/cards.length*100)}%"></i></div>`;
    const wordBlock = `<div class="big-word">${PA.wordHTML(c.w, lang)}</div>${c.r?`<div class="muted mono">${esc(c.r)}</div>`:""}`;
    const next = (q, chosen) => { PA.grade(lang, c.id, q, { mode:m, chosen }); res.push({ c, q, m }); i++; setTimeout(step, 50); };
    const distract = (n) => { const same = all.filter(x => x.id !== c.id && x.topic === c.topic && x.tr !== c.tr); const pool = same.length >= n ? same : all.filter(x => x.id !== c.id && x.tr !== c.tr); return PA.pick(pool, n); };
    const mcUI = (prompt, opts, correctId, showAs) => {
      host.innerHTML = `<div class="card">${head}<div class="flash" style="min-height:150px">${prompt}</div><div class="opts" id="opts">${opts.map(o => `<button class="opt" data-id="${esc(o.id)}">${showAs(o)}</button>`).join("")}</div><div id="fb" style="margin-top:12px"></div></div>`;
      host.querySelectorAll(".opt").forEach(b => b.onclick = () => {
        const ok = b.dataset.id === correctId; host.querySelectorAll(".opt").forEach(x => { x.disabled = true; if (x.dataset.id === correctId) x.classList.add("right"); });
        if (!ok) b.classList.add("wrong");
        host.querySelector("#fb").innerHTML = `<div class="row between"><span>${ok?"✅ Benar":"❌ Jawaban: <b>"+esc(c.tr)+"</b>"} · ${PA.wordHTML(c.w, lang)} ${c.r?`<span class="muted mono small">${esc(c.r)}</span>`:""}</span><button class="btn primary" id="nx">Lanjut →</button></div>${c.n?`<p class="small muted">${esc(c.n)}</p>`:""}`;
        host.querySelector("#nx").onclick = () => next(ok?4:1, ok?null:b.dataset.id); host.querySelector("#nx").focus();
      });
    };
    if (m === "flash") {
      host.innerHTML = `<div class="card">${head}<div class="flash">${wordBlock}${PA.speakBtn(c.w, lang, "Dengarkan")}<div id="back" class="hide"><div style="font-size:20px;font-weight:700;margin-top:8px">${esc(c.tr)}</div>${c.n?`<p class="small muted">${esc(c.n)}</p>`:""}<span class="badge gray">${esc(PA.TOPICS[c.topic]||c.topic)}</span></div></div>
      <div id="act" class="row" style="justify-content:center"><button class="btn primary" id="show">Tampilkan arti</button></div></div>`;
      host.querySelector("#show").onclick = () => { host.querySelector("#back").classList.remove("hide");
        host.querySelector("#act").innerHTML = `<button class="btn bad" data-q="1">Lupa</button><button class="btn" data-q="3">Sulit</button><button class="btn ok" data-q="4">Ingat</button><button class="btn ok" data-q="5">Mudah</button>`;
        host.querySelectorAll("[data-q]").forEach(b => b.onclick = () => next(+b.dataset.q)); };
    } else if (m === "mc") {
      mcUI(wordBlock + PA.speakBtn(c.w, lang), PA.shuffle([c].concat(distract(3))), c.id, o => esc(o.tr));
    } else if (m === "listen") {
      mcUI(`<div style="font-size:15px" class="muted">🎧 Dengarkan, lalu pilih artinya <span class="badge gray">suara sintetis</span></div><button class="btn primary" id="play">▶ Putar lagi</button>`, PA.shuffle([c].concat(distract(3))), c.id, o => esc(o.tr));
      const p = host.querySelector("#play"); p.onclick = () => PA.speak(c.w, lang, 0.9); PA.speak(c.w, lang, 0.9);
    } else if (m === "fill") {
      const toks = c.w.split(/\s+/);
      if (c.topic === "phrases" && toks.length >= 2 && !["ja","zh","th"].includes(lang)) {
        const idxs = toks.map((t,j)=>j).filter(j => toks[j].replace(/[^\p{L}]/gu,"").length >= 2);
        const j = idxs[Math.floor(Math.random()*idxs.length)] ?? 0; const ans = toks[j].replace(/[.,!?¿¡？。]/g,"");
        const pool = []; all.filter(x => x.topic==="phrases" && x.id!==c.id).forEach(x => x.w.split(/\s+/).forEach(t => { t=t.replace(/[.,!?¿¡？。…]/g,""); if (t.length>=2 && t.toLowerCase()!==ans.toLowerCase() && !pool.includes(t)) pool.push(t); }));
        const opts = PA.shuffle([ans].concat(PA.pick(pool,3))).map(t => ({ id:t, t }));
        const shown = toks.map((t,k)=> k===j ? t.replace(ans,"_____") : t).join(" ");
        mcUI(`<div class="muted small">Lengkapi kalimat: <i>${esc(c.tr)}</i></div><div class="big-word" style="font-size:26px">${PA.wordHTML(shown, lang)}</div>`, opts, ans, o => PA.wordHTML(o.t, lang));
      } else {
        mcUI(`<div class="muted small">Pilih kata yang tepat untuk:</div><div class="big-word" style="font-size:26px">${esc(c.tr)}</div>`, PA.shuffle([c].concat(distract(3))), c.id, o => PA.wordHTML(o.w, lang)+(o.r?` <span class="muted small mono">${esc(o.r)}</span>`:""));
      }
    } else if (m === "type") {
      const nonLatin = ["ru","ar","hi","ja","ko","zh","th"].includes(lang);
      host.innerHTML = `<div class="card">${head}<div class="flash" style="min-height:140px"><div class="muted small">Tulis dalam ${esc(L.name)}${nonLatin?" (aksara asli atau romanisasi)":""}:</div><div class="big-word" style="font-size:26px">${esc(c.tr)}</div></div>
        <form id="tf" class="row"><input type="text" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Jawaban Anda…" style="flex:1"><button class="btn primary">Periksa</button></form><div id="fb" style="margin-top:12px"></div></div>`;
      const inp = host.querySelector("#ans"); inp.focus();
      host.querySelector("#tf").onsubmit = (e) => { e.preventDefault(); if (host.querySelector("#nx")) return;
        const a = PA.fold(inp.value); const strip = (x) => PA.fold(x).replace(/^(il|lo|la|l'|i|gli|le|les|el|los|las|un|une|o|a|os|as|der|die|das|de|het|een|the|to)\s+/,"").replace(/^l'/,"");
        const targets = [c.w, c.r].filter(Boolean); const ok = !!a && targets.some(t => PA.fold(t) === a || strip(t) === strip(a) || PA.fold(t).replace(/['ʼ’-]/g,"") === a.replace(/['ʼ’-]/g,""));
        inp.disabled = true;
        host.querySelector("#fb").innerHTML = `<div class="row between"><span>${ok?"✅ Benar":"❌ Jawaban yang benar:"} ${PA.wordHTML(c.w, lang, "")} ${c.r?`<span class="mono muted small">${esc(c.r)}</span>`:""}</span><span class="row">${PA.speakBtn(c.w, lang)}<button class="btn primary" id="nx">Lanjut →</button></span></div>${c.n?`<p class="small muted">${esc(c.n)}</p>`:""}`;
        host.querySelector("#nx").onclick = () => next(ok?4:1); host.querySelector("#nx").focus();
      };
    }
  };
  const summary = () => {
    const ok = res.filter(r => r.q >= 3).length;
    host.innerHTML = `<div class="card glow"><h2>Sesi selesai ✓</h2><p>${ok} dari ${res.length} benar (${Math.round(ok/res.length*100)}%). Jadwal ulasan berikutnya sudah diatur otomatis (SM-2).</p>
      <div class="list">${res.map(r => `<div class="li"><span>${r.q>=3?"✅":"❌"}</span><span class="grow">${PA.wordHTML(r.c.w, lang)} <span class="muted small">— ${esc(r.c.tr)}</span></span><span class="badge gray">${MODE_LABEL[r.m]}</span></div>`).join("")}</div>
      <div class="row" style="margin-top:14px"><button class="btn primary" id="again">Kembali</button></div></div>`;
    host.querySelector("#again").onclick = () => onDone && onDone();
  };
  step();
};

/* ---------- Vocabulary Builder page ---------- */
PA.pages.vocab = (view, param) => {
  const lang = PA.lang(), L = PA.L(), S = PA.S;
  const tab = param || "review";
  const st = PA.vocabStats(lang), plan = PA.reviewPlan(lang);
  view.innerHTML = PA.head(`Vocabulary <span class="grad-text">Builder</span>`, `${esc(L.native)} · ${PA.cards(lang).length} kata & frasa · spaced repetition SM-2`) +
    `<div class="grid g4" style="margin-bottom:14px">
      <div class="card stat"><b>${st.learned}</b><span>Kata dipelajari</span></div>
      <div class="card stat"><b>${st.due}</b><span>Jatuh tempo sekarang</span></div>
      <div class="card stat"><b>${st.accuracy==null?"–":Math.round(st.accuracy*100)+"%"}</b><span>Akurasi ingatan</span></div>
      <div class="card stat"><b>${st.forgotten}</b><span>Kali terlupa (lapse)</span></div></div>
    <div class="tabs">${[["review","Belajar & Ulas"],["browse","Daftar Kata"],["mine","Kata Saya & Koleksi"],["intel","Vocabulary Intelligence"]].map(([k,t])=>`<button class="tab ${k===tab?"on":""}" data-go="vocab|${k}">${t}</button>`).join("")}</div><div id="vbody"></div>`;
  const body = view.querySelector("#vbody");
  if (tab === "review") {
    const modes = ["mix","flash","mc","fill","listen","type"];
    const lvl = PA.brainState(lang,"vocabulary").level;
    body.innerHTML = `<div class="grid g2"><div class="card"><h2>Sesi hari ini</h2>
      <p>${plan.due.length} ulasan jatuh tempo + ${plan.newCards.length} kata baru.</p><p class="small muted">⚖️ ${esc(plan.reason)}</p>
      <div class="field"><label class="f">Mode latihan</label><div class="chips" id="modes">${modes.map(m=>`<button class="chip ${m==="mix"?"on":""}" data-m="${m}">${MODE_LABEL[m]}</button>`).join("")}</div></div>
      <p class="small muted">Campuran adaptif memilih mode menurut tingkat kesulitan kosakata Anda (saat ini: <b>${lvl}</b>/5, diatur Adaptive Brain).</p>
      <button class="btn primary" id="go" ${plan.due.length+plan.newCards.length?"":"disabled"}>Mulai sesi (${Math.min(20, plan.due.length+plan.newCards.length)} kartu)</button></div>
      <div class="card"><h2>Statistik retensi</h2><dl class="kv"><dt>Ulasan total</dt><dd>${st.reviews}</dd><dt>Diingat</dt><dd>${st.remembered}×</dd><dt>Salah/terlupa</dt><dd>${st.wrong}× (${st.forgotten} lapse)</dd><dt>Retensi (kartu ≥1 hari)</dt><dd>${st.retention==null?"belum ada data":Math.round(st.retention*100)+"%"}</dd><dt>Rata-rata interval</dt><dd>${st.avgInterval.toFixed(1)} hari</dd></dl>
      <p class="small muted">Kata yang sudah Anda kuasai (interval panjang) tidak ditampilkan sebelum jatuh tempo, sehingga Anda tidak diuji berulang-ulang untuk kata yang sudah dikenal.</p></div></div><div id="sess" style="margin-top:14px"></div>`;
    let mode = "mix";
    body.querySelectorAll("#modes .chip").forEach(b => b.onclick = () => { mode = b.dataset.m; body.querySelectorAll("#modes .chip").forEach(x=>x.classList.toggle("on", x===b)); });
    body.querySelector("#go").onclick = () => { const ids = plan.due.map(c=>c.id).concat(plan.newCards.map(c=>c.id)).slice(0,20); S.last.vocab = PA.dayKey(); const h = body.querySelector("#sess"); body.querySelector(".grid").classList.add("hide"); PA.startSession(h, lang, ids, mode, "Sesi harian", () => PA.render()); };
  } else if (tab === "browse") {
    const cards = PA.cards(lang).filter(c => !c.custom);
    const topics = [...new Set(cards.map(c=>c.topic))];
    const s = PA.srsOf(lang);
    body.innerHTML = `<div class="card"><div class="row" style="margin-bottom:12px"><input type="search" id="q" placeholder="Cari kata atau arti…" style="flex:1;min-width:180px"><select id="tp" style="width:auto"><option value="">Semua topik</option>${topics.map(t=>`<option value="${t}">${esc(PA.TOPICS[t]||t)}</option>`).join("")}</select></div>
      <p class="small muted">✓ = cocok dengan tabel terjemahan Wiktionary (dicek otomatis) · ✎ = ditinjau manual (bentuk alternatif/frasa tanpa entri Wiktionary). Romanisasi: ${lang==="zh"?"pinyin":lang==="ja"?"Hepburn":lang==="ko"?"Revised Romanization":lang==="th"?"RTGS (tanpa tanda nada)":lang==="ru"?"transliterasi praktis":lang==="ar"||lang==="hi"?"transliterasi ilmiah sederhana":"—"}.</p>
      <div id="wl" class="list"></div></div>`;
    const draw = () => { const q = PA.fold(body.querySelector("#q").value), tp = body.querySelector("#tp").value;
      const list = cards.filter(c => (!tp || c.topic === tp) && (!q || PA.fold(c.w+" "+c.r+" "+c.tr+" "+c.en).includes(q)));
      body.querySelector("#wl").innerHTML = list.length ? list.map(c => { const r = s[c.id]; return `<div class="li"><div class="grow"><div><b>${PA.wordHTML(c.w, lang)}</b> ${c.r?`<span class="mono muted small">${esc(c.r)}</span>`:""} <span title="${c.v==="wikt"?"Cocok dengan Wiktionary":"Ditinjau manual"}" class="small ${c.v==="wikt"?"":"muted"}">${c.v==="wikt"?"✓":"✎"}</span></div><div class="small">${esc(c.tr)} <span class="muted">· ${esc(PA.POS[c.pos]||c.pos)} · ${esc(PA.TOPICS[c.topic])}</span></div>${c.n?`<div class="small muted">${esc(c.n)}</div>`:""}</div>${r?`<span class="badge ${r.interval>=21?"ok":r.interval>=1?"blue":"warn"}">${r.interval>=1?r.interval+" hr":"baru"}</span>`:""}${PA.speakBtn(c.w, lang)}<button class="btn sm ghost" data-add="${esc(c.id)}" title="Tambah ke koleksi">＋</button></div>`; }).join("") : `<div class="empty">Tidak ada hasil.</div>`;
      body.querySelectorAll("[data-add]").forEach(b => b.onclick = () => addToCollection(lang, b.dataset.add)); };
    body.querySelector("#q").oninput = draw; body.querySelector("#tp").onchange = draw; draw();
  } else if (tab === "mine") {
    const mine = S.custom[lang] || [];
    const cols = S.collections.filter(c => c.lang === lang);
    body.innerHTML = `<div class="grid g2"><div class="card"><h2>Tambah kata sendiri</h2>
      <form id="cf"><div class="field"><label class="f">Kata/frasa (${esc(L.name)}) *</label><input type="text" id="cw" required maxlength="120"></div>
      <div class="field"><label class="f">Romanisasi / pelafalan (opsional)</label><input type="text" id="cr" maxlength="120"></div>
      <div class="field"><label class="f">Arti (Bahasa Indonesia) *</label><input type="text" id="ct" required maxlength="160"></div>
      <div class="field"><label class="f">Catatan / contoh kalimat (opsional)</label><input type="text" id="cn" maxlength="300"></div>
      <button class="btn primary">Simpan kata</button></form>
      <p class="small muted">Kata yang Anda tambahkan ditandai "kata saya" — keakuratannya tanggung jawab Anda. Ragu? Tanyakan ke ${PA.BOT}.</p></div>
      <div class="card"><h2>Koleksi</h2><form id="nf" class="row"><input type="text" id="nn" placeholder="Nama koleksi baru…" maxlength="60" style="flex:1" required><button class="btn">Buat</button></form>
      <div class="list" style="margin-top:12px">${cols.length ? cols.map(c => `<div class="li"><div class="grow"><b>${esc(c.name)}</b><div class="small muted">${c.cards.length} kartu</div></div><button class="btn sm" data-study="${c.id}" ${c.cards.length?"":"disabled"}>Latih</button><button class="btn sm ghost" data-delcol="${c.id}">Hapus</button></div>`).join("") : `<div class="empty small">Belum ada koleksi. Buat koleksi, lalu tambahkan kata dari tab Daftar Kata (tombol ＋).</div>`}</div></div></div>
      <div class="card" style="margin-top:14px"><h2>Kata saya (${mine.length})</h2><div class="list">${mine.length ? mine.map(c => `<div class="li"><div class="grow"><b>${PA.wordHTML(c.w, lang)}</b> ${c.r?`<span class="mono muted small">${esc(c.r)}</span>`:""}<div class="small">${esc(c.tr)}</div>${c.n?`<div class="small muted">${esc(c.n)}</div>`:""}</div>${PA.speakBtn(c.w, lang)}<button class="btn sm ghost" data-add="${esc(lang+":u_"+c.id)}">＋</button><button class="btn sm danger" data-delw="${c.id}">Hapus</button></div>`).join("") : `<div class="empty small">Belum ada kata sendiri.</div>`}</div></div><div id="sess" style="margin-top:14px"></div>`;
    body.querySelector("#cf").onsubmit = (e) => { e.preventDefault(); const w = body.querySelector("#cw").value.trim(), tr = body.querySelector("#ct").value.trim(); if (!w || !tr) return PA.toast("Kata dan arti wajib diisi.");
      (S.custom[lang] || (S.custom[lang] = [])).push({ id:PA.uid(), w, r:body.querySelector("#cr").value.trim(), tr, n:body.querySelector("#cn").value.trim(), created:new Date().toISOString() }); PA.save(); PA.toast("Kata disimpan ✓"); PA.render(); };
    body.querySelector("#nf").onsubmit = (e) => { e.preventDefault(); S.collections.push({ id:PA.uid(), name:body.querySelector("#nn").value.trim(), lang, cards:[] }); PA.save(); PA.render(); };
    body.querySelectorAll("[data-delcol]").forEach(b => b.onclick = () => { if (!confirm("Hapus koleksi ini? (kata tidak ikut terhapus)")) return; S.collections = S.collections.filter(c => c.id !== b.dataset.delcol); PA.save(); PA.render(); });
    body.querySelectorAll("[data-delw]").forEach(b => b.onclick = () => { if (!confirm("Hapus kata ini beserta riwayat ulasannya?")) return; S.custom[lang] = mine.filter(c => c.id !== b.dataset.delw); delete PA.srsOf(lang)[lang+":u_"+b.dataset.delw]; S.collections.forEach(c => c.cards = c.cards.filter(x => x !== lang+":u_"+b.dataset.delw)); PA.save(); PA.render(); });
    body.querySelectorAll("[data-add]").forEach(b => b.onclick = () => addToCollection(lang, b.dataset.add));
    body.querySelectorAll("[data-study]").forEach(b => b.onclick = () => { const c = cols.find(x => x.id === b.dataset.study); body.querySelector(".grid").classList.add("hide"); PA.startSession(body.querySelector("#sess"), lang, PA.shuffle(c.cards).slice(0,20), "mix", "Koleksi: "+c.name, () => PA.render()); });
  } else if (tab === "intel") {
    const intel = PA.vocabIntel(lang);
    const row = (c, extra) => c ? `<div class="li"><div class="grow"><b>${PA.wordHTML(c.w, lang)}</b> <span class="muted small">— ${esc(c.tr)}</span></div>${extra}</div>` : "";
    body.innerHTML = `<div class="note blue" style="margin-bottom:14px">Vocabulary Intelligence bersifat <b>berbasis aturan</b> dan hanya membaca log ulasan Anda yang nyata: jumlah salah per kata, pasangan kata yang tertukar di soal pilihan ganda, dan ease factor SM-2 terendah. Tidak ada tebakan AI.</div>
    ${intel.total ? `<div class="grid g3">
      <div class="card"><h3>Paling sering salah</h3><div class="list">${intel.wrong.length?intel.wrong.map(x => row(x.c, `<span class="badge bad">${x.wrong}× salah · ${Math.round(x.acc*100)}%</span>`)).join(""):`<p class="small muted">Belum ada kata yang salah 🎉</p>`}</div></div>
      <div class="card"><h3>Pasangan yang tertukar</h3><div class="list">${intel.conf.length?intel.conf.map(x => `<div class="li"><div class="grow small">${PA.wordHTML(x.a.w, lang)} <span class="muted">(${esc(x.a.tr)})</span><br>dikira → ${esc(x.b.tr)} <span class="muted">(${PA.wordHTML(x.b.w, lang)})</span></div><span class="badge warn">${x.n}×</span></div>`).join(""):`<p class="small muted">Belum ada data pilihan ganda yang salah.</p>`}</div></div>
      <div class="card"><h3>Ease factor terendah</h3><div class="list">${intel.lowEf.length?intel.lowEf.map(x => row(x.c, `<span class="badge gray">EF ${x.ef.toFixed(2)}</span>`)).join(""):`<p class="small muted">Semua kartu masih di EF awal (2,5).</p>`}</div></div></div>
      <div class="card glow" style="margin-top:14px"><div class="row between"><div><h2>Latihan terarah</h2><p class="small muted" style="margin:0">${intel.target.length} kartu gabungan dari tiga daftar di atas, diulang dengan mode campuran.</p></div><button class="btn primary" id="tgt" ${intel.target.length?"":"disabled"}>Mulai latihan terarah</button></div></div><div id="sess" style="margin-top:14px"></div>`
    : `<div class="card empty"><div class="ic">📊</div><p>Belum ada log ulasan untuk ${esc(L.name)}. Selesaikan satu sesi di tab <b>Belajar & Ulas</b> — analisis muncul dari data nyata Anda.</p><button class="btn primary" data-go="vocab|review">Mulai belajar</button></div>`}`;
    const t = body.querySelector("#tgt"); if (t) t.onclick = () => { body.querySelector(".grid").classList.add("hide"); PA.startSession(body.querySelector("#sess"), lang, intel.target, "mix", "Latihan terarah", () => PA.go("vocab","intel")); };
  }
};
PA.vocabIntel = (lang) => {
  const ev = PA.S.events.filter(e => e.lang === lang && e.type === "review"); const agg = {};
  ev.forEach(e => { const a = agg[e.item] || (agg[e.item] = { n:0, ok:0 }); a.n++; if (e.correct) a.ok++; });
  const byId = {}; PA.cards(lang).forEach(c => byId[c.id] = c);
  const wrong = Object.entries(agg).filter(([id,a]) => a.n - a.ok > 0 && byId[id]).map(([id,a]) => ({ c:byId[id], wrong:a.n-a.ok, acc:a.ok/a.n })).sort((x,y) => y.wrong - x.wrong || x.acc - y.acc).slice(0,8);
  const cf = PA.S.confusions[lang] || {};
  const conf = Object.entries(cf).map(([k,n]) => { const [a,b] = k.split("|"); return { a:byId[a], b:byId[b], n }; }).filter(x => x.a && x.b).sort((x,y)=>y.n-x.n).slice(0,8);
  const s = PA.srsOf(lang);
  const lowEf = Object.entries(s).filter(([id,r]) => r.ef < 2.5 && byId[id]).map(([id,r]) => ({ c:byId[id], ef:r.ef })).sort((a,b)=>a.ef-b.ef).slice(0,8);
  const target = [...new Set(wrong.map(x=>x.c.id).concat(conf.map(x=>x.a.id), conf.map(x=>x.b.id), lowEf.map(x=>x.c.id)))].slice(0,15);
  return { total: ev.length, wrong, conf, lowEf, target };
};
function addToCollection(lang, id){
  const cols = PA.S.collections.filter(c => c.lang === lang);
  if (!cols.length) { const name = prompt("Belum ada koleksi. Nama koleksi baru:", "Favorit"); if (!name) return; PA.S.collections.push({ id:PA.uid(), name:name.slice(0,60), lang, cards:[id] }); PA.save(); return PA.toast("Ditambahkan ke koleksi “"+name+"” ✓"); }
  const names = cols.map((c,i)=> (i+1)+". "+c.name).join("\n");
  const pick = prompt("Tambahkan ke koleksi nomor:\n"+names, "1"); const c = cols[(parseInt(pick,10)||0)-1]; if (!c) return;
  if (!c.cards.includes(id)) c.cards.push(id); PA.save(); PA.toast("Ditambahkan ke “"+c.name+"” ✓");
}
})();
