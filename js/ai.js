/* POLYGLOT AI — AI layer: prompt builders for the Grok bot "Polyglot AI Tutor" + honest session logging.
   No API keys and no generated AI output inside this app. */
(function(){
"use strict";
const PA = window.PA, esc = PA.esc;

PA.memorySummary = (lang) => {
  const S = PA.S, L = PA.L(lang), lv = S.levels[lang] || {};
  const pers = PA.data.content.personalities.find(p => p.id === S.profile.personality) || PA.data.content.personalities[0];
  const lvTxt = PA.SKILLS.map(k => `${PA.SKILL_ID[k]} ${lv[k]||"?"}`).join(", ");
  const mistakes = S.mistakes.filter(m => m.lang === lang).slice(-6).map(m => "- " + m.text).join("\n");
  const weak = PA.weakSkills(lang).slice(0,2).map(w => `${PA.SKILL_ID[w.skill]||w.skill} (${Math.round(w.acc*100)}% dari ${w.n} soal)`).join(", ");
  return `KONTEKS BELAJAR SAYA (dari aplikasi POLYGLOT AI):
- Bahasa target: ${L.name} (${L.native})${L.code==="pt"?" — ragam Brasil":""}${L.code==="nb"?" — Bokmål":""}${L.code==="ar"?" — Bahasa Arab Standar Modern":""}
- Bahasa ibu/penjelasan: Bahasa Indonesia
- Perkiraan level CEFR (penilaian diri + kuis, bukan sertifikat): ${lv.date ? lvTxt : "belum tes penempatan"}
- Gaya tutor yang saya pilih: ${pers.name} — ${pers.prompt}
${S.profile.goals ? "- Tujuan saya: " + S.profile.goals + "\n" : ""}${weak ? "- Area lemah (data latihan): " + weak + "\n" : ""}${mistakes ? "- Kesalahan berulang yang saya catat:\n" + mistakes + "\n" : ""}`;
};
PA.weakSkills = (lang) => ["vocabulary","grammar","listening","conversation"].map(sk => { const r = PA.rolling(lang, sk, 30); return r && r.n >= 5 ? { skill:sk, acc:r.acc, n:r.n } : null; }).filter(Boolean).sort((a,b)=>a.acc-b.acc);

const RULES = `ATURAN JAWABAN:
- Jelaskan dalam Bahasa Indonesia, contoh dalam bahasa target (sertakan romanisasi jika aksaranya non-Latin).
- Sesuaikan kosakata & tata bahasa dengan level saya. Jangan hanya menerjemahkan bila penjelasan lebih berguna.
- Saat mengoreksi, gunakan format: 1) Kalimat asli 2) Kalimat yang benar 3) Penjelasan 4) Aturan tata bahasa 5) Alternatif alami penutur asli 6) Contoh tambahan.
- Bedakan ragam formal/informal dan sebutkan jika sebuah ungkapan bersifat regional. Jangan pernah merendahkan saya.
- Jika tidak yakin, katakan tidak yakin.`;
PA.prompts = {
  continueDialogue(lang, meta, log, stat, voice){
    const L = PA.L(lang);
    return `Halo ${PA.BOT}! Saya baru latihan skenario "${meta.name}" (${L.name}) di aplikasi POLYGLOT AI — itu dialog berskrip. Lanjutkan sebagai lawan bicara yang natural.

${PA.memorySummary(lang)}
TRANSKRIP:
${log.map(l => (l.who === "me" ? "SAYA: " : "LAWAN BICARA: ") + l.text).join("\n")}

TUGAS:
1. Koreksi kesalahan penting di jawaban saya (format 6 bagian), singkat.
2. Lanjutkan percakapan dalam ${L.name} sesuai situasi, satu giliran per pesan, tunggu jawaban saya.
3. Perkenalkan 2–3 kosakata baru secara alami dan dorong saya menjawab lebih panjang.
${voice ? "4. Jika bisa, balas juga dengan memo suara agar saya bisa latihan mendengar.\n" : ""}
${RULES}`;
  }
};
PA.promptBox = (text, id) => `<div class="card" style="background:rgba(10,12,30,.7)"><div class="row between" style="margin-bottom:8px"><b>Prompt untuk @${PA.BOT}</b><button class="btn sm primary" data-copy="${id}">📋 Salin</button></div>
  <textarea id="${id}" class="pre" style="width:100%;min-height:220px" readonly>${esc(text)}</textarea>
  <p class="tiny muted" style="margin:8px 0 0">Salin, lalu tempel di chat <b>@${PA.BOT}</b> di Grok. Aplikasi ini tidak memanggil AI sendiri dan tidak menampilkan jawaban AI palsu; setelah selesai, catat hasil sesi di bawah agar statistik tetap nyata.</p></div>`;

/* --- session logging form --- */
PA.sessionForm = (host, kind, extra) => {
  extra = extra || {};
  const id = "sf" + PA.uid();
  host.innerHTML = `<div class="card"><h3>📝 Catat hasil sesi dengan tutor</h3><form id="${id}">
    <div class="grid g3"><div class="field"><label class="f">Durasi (menit)</label><input type="number" min="0" max="600" name="min" value="10"></div>
    <div class="field"><label class="f">Jumlah koreksi dari tutor</label><input type="number" min="0" max="500" name="corr" value="0"></div>
    <div class="field"><label class="f">Penilaian diri (1–5)</label><select name="rate">${[1,2,3,4,5].map(n=>`<option ${n===3?"selected":""}>${n}</option>`).join("")}</select></div></div>
    ${extra.objectives ? `<div class="field"><label class="f">Tujuan yang tercapai</label>${extra.objectives.map((o,k)=>`<label class="small" style="display:block;margin:4px 0"><input type="checkbox" name="obj" value="${k}"> ${esc(o)}</label>`).join("")}</div>` : ""}
    ${extra.words ? `<div class="field"><label class="f">Jumlah kata teks Anda</label><input type="number" min="0" name="words" value="${extra.words}"></div>` : ""}
    <div class="field"><label class="f">Kesalahan yang ingin diingat (satu per baris, opsional)</label><textarea name="mist" placeholder="mis. lupa artikel 'den' untuk objek maskulin" style="min-height:70px"></textarea></div>
    <div class="field"><label class="f">Catatan (opsional)</label><input type="text" name="note" maxlength="300"></div>
    <button class="btn primary">Simpan sesi</button></form></div>`;
  host.querySelector("#"+id).onsubmit = (e) => {
    e.preventDefault(); const f = e.target, S = PA.S, lang = PA.lang();
    const min = Math.max(0, Math.min(600, parseInt(f.min.value,10)||0)), corr = Math.max(0, parseInt(f.corr.value,10)||0), rate = parseInt(f.rate.value,10);
    const objs = f.obj ? Array.from(f.querySelectorAll("[name=obj]:checked")).map(x => +x.value) : null;
    const sess = { id:PA.uid(), t:new Date().toISOString(), lang, kind, minutes:min, corrections:corr, rating:rate, note:f.note.value.trim().slice(0,300) };
    if (extra.words) sess.words = parseInt(f.words.value,10)||0;
    if (extra.meta) Object.assign(sess, extra.meta);
    if (objs) { sess.objectives = objs.length; sess.objectivesTotal = extra.objectives.length; }
    S.sessions.push(sess);
    f.mist.value.split("\n").map(x => x.trim()).filter(Boolean).slice(0,20).forEach(m => S.mistakes.push({ id:PA.uid(), t:sess.t, lang, text:m.slice(0,200), kind }));
    const k = PA.dayKey(); const d = S.time[k] || (S.time[k] = { total:0, byLang:{} }); d.external = (d.external||0) + min*60;
    const skill = { conversation:"speaking", scenario:"speaking", writing:"writing", translation:"writing", tutor:null, culture:null }[kind];
    PA.log({ type:"session", kind, skill, lang, minutes:min, corrections:corr, rating:rate });
    PA.save(); PA.toast("Sesi tercatat ✓"); host.innerHTML = `<div class="note">✓ Sesi ${esc(kind)} tercatat: ${min} menit, ${corr} koreksi, penilaian diri ${rate}/5${objs?`, ${objs.length}/${extra.objectives.length} tujuan`:""}.</div>`;
  };
};
const persSelect = (id) => `<select id="${id}">${PA.data.content.personalities.map(p => `<option value="${p.id}" ${p.id===PA.S.profile.personality?"selected":""}>${esc(p.name)} — ${esc(p.idn)}</option>`).join("")}</select>`;
const persPrompt = (id) => (PA.data.content.personalities.find(p => p.id === id) || {}).prompt || "";

/* =================== AI TUTOR =================== */
const TMODES = {
  correct:{ t:"Koreksi kalimat saya", f:[["text","Kalimat Anda (bahasa target)","ta"]] },
  grammar:{ t:"Jelaskan tata bahasa", f:[["text","Topik/pertanyaan tata bahasa","in","mis. kapan memakai subjuntivo?"]] },
  vocab:{ t:"Kosakata dalam konteks", f:[["text","Kata atau topik","in","mis. kosakata di kantor"]] },
  compare:{ t:"Bedakan ungkapan mirip", f:[["a","Ungkapan A","in"],["b","Ungkapan B","in"]] },
  formality:{ t:"Formal vs informal", f:[["text","Situasi","in","mis. mengirim pesan ke atasan vs teman"]] },
  lesson:{ t:"Pelajaran personal dari data saya", f:[] },
  free:{ t:"Pertanyaan bebas", f:[["text","Pertanyaan Anda","ta"]] }
};
PA.pages.tutor = (view, param) => {
  const lang = PA.lang(), L = PA.L(); let mode = TMODES[param] ? param : "correct";
  view.innerHTML = PA.head(`AI <span class="grad-text">Tutor</span>`, `Guru pribadi berbasis AI — otaknya adalah bot Grok <b>@${PA.BOT}</b>`) +
  `<div class="note blue" style="margin-bottom:14px">Cara kerja: pilih jenis bantuan → aplikasi menyusun prompt lengkap dengan level, gaya tutor, tujuan, dan kesalahan berulang Anda → salin ke @${PA.BOT} → catat hasilnya di sini. Kunci API tidak pernah disimpan di aplikasi publik ini.</div>
  <div class="grid g2"><div class="card"><div class="field"><label class="f">Jenis bantuan</label><div class="chips" id="tm">${Object.entries(TMODES).map(([k,v])=>`<button class="chip ${k===mode?"on":""}" data-m="${k}">${v.t}</button>`).join("")}</div></div>
    <div class="field"><label class="f">Gaya tutor</label>${persSelect("pers")}</div><div id="tf"></div><button class="btn primary" id="mk">Buat prompt</button></div>
    <div id="out"><div class="card empty"><div class="ic">🤖</div><p>Prompt akan muncul di sini.</p></div></div></div><div id="log" style="margin-top:14px"></div>`;
  const fields = () => { view.querySelector("#tf").innerHTML = TMODES[mode].f.map(([n,l,t,ph]) => `<div class="field"><label class="f">${l}</label>${t==="ta"?`<textarea id="f_${n}" placeholder="${esc(ph||"")}"></textarea>`:`<input type="text" id="f_${n}" placeholder="${esc(ph||"")}">`}</div>`).join("") || `<p class="small muted">Prompt dibuat dari data Anda: rekomendasi Adaptive Brain, area lemah, kesalahan berulang, ulasan jatuh tempo.</p>`; };
  fields();
  view.querySelectorAll("#tm .chip").forEach(b => b.onclick = () => { mode = b.dataset.m; view.querySelectorAll("#tm .chip").forEach(x=>x.classList.toggle("on",x===b)); fields(); });
  view.querySelector("#mk").onclick = () => {
    const v = (n) => { const el = view.querySelector("#f_"+n); return el ? el.value.trim() : ""; };
    const need = TMODES[mode].f.find(([n]) => !v(n)); if (need) return PA.toast("Isi kolom: " + need[1]);
    const pers = view.querySelector("#pers").value; PA.S.profile.personality = pers; PA.save();
    let task = "";
    if (mode === "correct") task = `Koreksi kalimat ${L.name} saya berikut, dengan format 6 bagian. Jika kalimatnya sudah benar, katakan dan beri versi yang lebih alami:\n"${v("text")}"`;
    if (mode === "grammar") task = `Jelaskan topik tata bahasa ${L.name} ini: ${v("text")}. Sertakan: penjelasan, rumus/struktur, 3 contoh, kesalahan umum, lalu 3 latihan (jangan beri jawabannya sampai saya menjawab).`;
    if (mode === "vocab") task = `Ajarkan 8 kosakata ${L.name} tentang: ${v("text")}. Untuk tiap kata: arti, ${["ru","ar","hi","ja","ko","zh","th"].includes(lang)?"romanisasi, ":""}kelas kata, contoh kalimat, kolokasi umum, formalitas. Lalu uji saya.`;
    if (mode === "compare") task = `Jelaskan perbedaan "${v("a")}" dan "${v("b")}" dalam ${L.name}: makna, nuansa, formalitas, konteks pemakaian, dan contoh untuk masing-masing.`;
    if (mode === "formality") task = `Tunjukkan cara mengatakan hal yang sama dalam ragam formal dan informal ${L.name} untuk situasi: ${v("text")}. Jelaskan kapan masing-masing pantas.`;
    if (mode === "lesson") { const rec = PA.recommendations(lang).map(r => "- " + r.title + ": " + r.why).join("\n"); task = `Buat pelajaran 15 menit yang dipersonalisasi berdasarkan data latihan saya:\n${rec || "- belum ada data, mulai dari dasar"}\nStrukturnya: pemanasan, materi inti, latihan interaktif (satu per satu), ringkasan.`; }
    if (mode === "free") task = v("text");
    const text = `Halo ${PA.BOT}!\n\n${PA.memorySummary(lang).replace(/Gaya tutor yang saya pilih: .*\n/, `Gaya tutor yang saya pilih: ${persPrompt(pers)}\n`)}\nPERMINTAAN (${TMODES[mode].t}):\n${task}\n\n${RULES}`;
    view.querySelector("#out").innerHTML = PA.promptBox(text, "tp"); PA.S.last.tutor = mode; PA.save();
    PA.sessionForm(view.querySelector("#log"), "tutor", { meta:{ mode } });
  };
};

/* =================== WRITING LAB =================== */
const WTYPES = ["Pesan singkat","Email","Esai","Komunikasi profesional","Cerita pribadi","Deskripsi","Laporan","Tulisan sehari-hari"];
PA.diffWords = (a, b) => { // LCS word diff
  const A = a.split(/(\s+)/).filter(x => x.trim()), B = b.split(/(\s+)/).filter(x => x.trim());
  const n = A.length, m = B.length; if (n*m > 250000) return esc(b);
  const dp = Array.from({length:n+1}, () => new Uint16Array(m+1));
  for (let i=n-1;i>=0;i--) for (let j=m-1;j>=0;j--) dp[i][j] = A[i] === B[j] ? dp[i+1][j+1]+1 : Math.max(dp[i+1][j], dp[i][j+1]);
  const out = []; let i=0,j=0; while (i<n && j<m) { if (A[i]===B[j]) { out.push(esc(A[i])); i++; j++; } else if (dp[i+1][j] >= dp[i][j+1]) { out.push(`<del>${esc(A[i])}</del>`); i++; } else { out.push(`<ins>${esc(B[j])}</ins>`); j++; } }
  while (i<n) out.push(`<del>${esc(A[i++])}</del>`); while (j<m) out.push(`<ins>${esc(B[j++])}</ins>`);
  return out.join(" ");
};
PA.pages.writing = (view) => {
  const lang = PA.lang(), L = PA.L(); const draft = PA.S.last.writingDraft || "";
  const hist = PA.S.sessions.filter(s => s.kind === "writing" && s.lang === lang).slice(-5).reverse();
  view.innerHTML = PA.head(`Writing <span class="grad-text">Lab</span>`, `Menulis dalam ${esc(L.name)} → koreksi oleh @${PA.BOT} → bandingkan versi asli & perbaikan`) +
  `<div class="grid g2"><div class="card"><div class="grid g2"><div class="field"><label class="f">Jenis tulisan</label><select id="wt">${WTYPES.map(t=>`<option>${t}</option>`).join("")}</select></div>
    <div class="field"><label class="f">Formalitas</label><select id="wf"><option>Informal</option><option selected>Netral</option><option>Formal</option></select></div></div>
    <div class="field"><label class="f">Tugas/konteks (opsional)</label><input type="text" id="wc" placeholder="mis. email ke hotel untuk mengubah tanggal menginap"></div>
    <div class="field"><label class="f">Tulisan Anda (${esc(L.name)})</label><textarea id="wx" style="min-height:180px" class="${PA.isRTL(lang)?"rtl":""}">${esc(draft)}</textarea><div class="tiny muted" id="wn"></div></div>
    <button class="btn primary" id="wp">Buat prompt koreksi</button></div><div id="wout"><div class="card empty"><div class="ic">✍️</div><p>Tulis sesuatu, lalu buat prompt untuk tutor.</p></div></div></div>
    <div class="card" style="margin-top:14px"><h3>Bandingkan dengan versi perbaikan</h3><p class="small muted">Tempel versi yang diperbaiki tutor. Perbandingan kata-per-kata dihitung di perangkat (hijau = ditambah, merah = dihapus).</p>
    <textarea id="wi" placeholder="Tempel versi perbaikan di sini…" class="${PA.isRTL(lang)?"rtl":""}"></textarea><button class="btn" id="wd" style="margin-top:8px">Bandingkan</button><div id="wdiff" class="diff" style="margin-top:12px;line-height:1.9"></div></div>
    <div id="wlog" style="margin-top:14px"></div>
    ${hist.length?`<div class="card" style="margin-top:14px"><h3>Riwayat menulis</h3><table class="t"><tr><th>Tanggal</th><th>Jenis</th><th>Kata</th><th>Koreksi</th><th>Koreksi/100 kata</th></tr>${hist.map(s=>`<tr><td>${PA.fmtDate(s.t)}</td><td>${esc(s.wtype||"")}</td><td>${s.words||"–"}</td><td>${s.corrections}</td><td>${s.words?(s.corrections/s.words*100).toFixed(1):"–"}</td></tr>`).join("")}</table></div>`:""}`;
  const wx = view.querySelector("#wx"); const count = () => { const n = wx.value.trim() ? wx.value.trim().split(/\s+/).length : 0; view.querySelector("#wn").textContent = n + " kata"; PA.S.last.writingDraft = wx.value.slice(0,5000); PA.save(); return n; };
  wx.oninput = count; count();
  view.querySelector("#wp").onclick = () => { const txt = wx.value.trim(); if (!txt) return PA.toast("Tulis teks terlebih dahulu.");
    const p = `Halo ${PA.BOT}!\n\n${PA.memorySummary(lang)}\nTUGAS: Koreksi tulisan ${L.name} saya.\nJenis: ${view.querySelector("#wt").value} · Formalitas yang diinginkan: ${view.querySelector("#wf").value}${view.querySelector("#wc").value.trim()?" · Konteks: "+view.querySelector("#wc").value.trim():""}\n\nTEKS SAYA:\n"""\n${txt}\n"""\n\nAnalisis: tata bahasa, ejaan, kosakata, struktur kalimat, kejelasan, kealamian, formalitas.\nBerikan:\n1. Daftar koreksi (asli → perbaikan → alasan & aturan), hitung jumlahnya.\n2. Versi perbaikan lengkap (pertahankan maksud saya) dalam satu blok agar mudah saya salin.\n3. 2–3 saran agar terdengar lebih alami.\n\n${RULES}`;
    view.querySelector("#wout").innerHTML = PA.promptBox(p, "wpp");
    PA.sessionForm(view.querySelector("#wlog"), "writing", { words: count(), meta:{ wtype: view.querySelector("#wt").value } });
  };
  view.querySelector("#wd").onclick = () => { const a = wx.value.trim(), b = view.querySelector("#wi").value.trim(); if (!a || !b) return PA.toast("Isi kedua teks untuk dibandingkan.");
    view.querySelector("#wdiff").innerHTML = `<div class="grid g2"><div><div class="small muted">Asli</div><div class="card ${PA.isRTL(lang)?"rtl":""}" style="padding:12px">${esc(a)}</div></div><div><div class="small muted">Perbaikan</div><div class="card ${PA.isRTL(lang)?"rtl":""}" style="padding:12px">${esc(b)}</div></div></div><div class="small muted" style="margin-top:10px">Perubahan:</div><div class="card ${PA.isRTL(lang)?"rtl":""}" style="padding:12px">${PA.diffWords(a,b)}</div>`; };
};

/* =================== TRANSLATION STUDIO =================== */
PA.pages.translation = (view) => {
  const lang = PA.lang(), L = PA.L();
  const opts = (sel) => PA.data.languages.map(l => `<option value="${l.code}" ${l.code===sel?"selected":""}>${esc(l.name)}</option>`).join("");
  view.innerHTML = PA.head(`Translation <span class="grad-text">Studio</span>`, "Terjemahan berdasarkan konteks — bukan kata per kata") +
  `<div class="grid g2"><div class="card"><div class="grid g2"><div class="field"><label class="f">Dari</label><select id="tfrom">${opts("id")}</select></div><div class="field"><label class="f">Ke</label><select id="tto">${opts(lang)}</select></div></div>
   <div class="field"><label class="f">Teks</label><textarea id="ttx" placeholder="Tulis teks yang ingin diterjemahkan…"></textarea></div>
   <div class="grid g2"><div class="field"><label class="f">Maksud / tujuan</label><input type="text" id="tin" placeholder="mis. menolak undangan dengan sopan"></div>
   <div class="field"><label class="f">Register</label><select id="treg"><option>Formal</option><option selected>Netral</option><option>Informal</option></select></div>
   <div class="field"><label class="f">Audiens</label><input type="text" id="taud" placeholder="mis. rekan kerja senior, teman sebaya"></div>
   <div class="field"><label class="f">Wilayah/ragam</label><input type="text" id="treg2" placeholder="mis. Meksiko, Brasil, Kansai"></div>
   <div class="field"><label class="f">Nada</label><select id="ttone"><option>Netral</option><option>Hangat</option><option>Tegas</option><option>Lucu</option><option>Sopan sekali</option></select></div></div>
   <button class="btn primary" id="tgo">Buat prompt terjemahan</button></div><div id="tout"><div class="card empty"><div class="ic">🌐</div><p>Prompt muncul di sini.</p></div></div></div>
   <div class="card" style="margin-top:14px"><h2>Cari idiom & ungkapan terverifikasi</h2><p class="small muted">Data lokal yang dikurasi (${PA.data.content.culture.length} entri, 22 bahasa) — dengan wilayah dan kepantasan pemakaian.</p>
   <input type="search" id="iq" placeholder="mis. semoga berhasil, makan, bersulang, rindu…"><div id="ires" class="list" style="margin-top:10px"></div></div><div id="tlog" style="margin-top:14px"></div>`;
  view.querySelector("#tgo").onclick = () => { const v = (id) => view.querySelector("#"+id).value.trim(); if (!v("ttx")) return PA.toast("Tulis teksnya dulu.");
    const F = PA.L(v("tfrom")), T = PA.L(v("tto"));
    const p = `Halo ${PA.BOT}!\n\nTerjemahkan dari ${F.name} ke ${T.name} secara kontekstual, bukan mekanis.\n\nTEKS:\n"""\n${v("ttx")}\n"""\n\nKONTEKS:\n- Maksud: ${v("tin")||"(tidak disebut)"}\n- Register: ${v("treg")}\n- Audiens: ${v("taud")||"(umum)"}\n- Wilayah/ragam: ${v("treg2")||"(standar)"}\n- Nada: ${v("ttone")}\n\nBERIKAN:\n1. Terjemahan literal (kata per kata) — tandai bagian yang terdengar tidak alami dan jelaskan mengapa.\n2. Terjemahan natural.\n3. Versi kasual, versi formal, dan versi profesional.\n4. Adaptasi budaya (jika ada idiom/norma kesopanan yang perlu diubah).\n5. Rekomendasi terbaik untuk konteks di atas + alasannya.\n${["ru","ar","hi","ja","ko","zh","th"].includes(T.code)?"Sertakan romanisasi.\n":""}Tandai ungkapan yang bersifat regional/slang. Jika ragu, katakan.`;
    view.querySelector("#tout").innerHTML = PA.promptBox(p, "trp"); PA.sessionForm(view.querySelector("#tlog"), "translation"); };
  const draw = () => { const q = PA.fold(view.querySelector("#iq").value); const items = PA.data.content.culture.filter(c => !q || PA.fold(c.expr+" "+c.meaning+" "+c.lit+" "+PA.L(c.lang).name).includes(q)).sort((a,b) => (b.lang===lang) - (a.lang===lang)).slice(0, q ? 30 : 6);
    view.querySelector("#ires").innerHTML = items.length ? items.map(c => cultureRow(c)).join("") : `<div class="empty small">Tidak ditemukan di data lokal. Tanyakan ke tutor dengan prompt di atas.</div>`; };
  view.querySelector("#iq").oninput = draw; draw();
};
function cultureRow(c){ const L = PA.L(c.lang); return `<div class="li" style="align-items:flex-start"><div class="grow"><div class="row"><span class="badge blue">${esc(L.name)}</span><span class="badge gray">${esc(c.kind)}</span><span class="badge ${/sangat informal/.test(c.register)?"warn":"gray"}">${esc(c.register)}</span></div>
  <div style="margin-top:6px"><b>${PA.wordHTML(c.expr, c.lang)}</b>${c.lit?` <span class="small muted">(harfiah: “${esc(c.lit)}”)</span>`:""}</div><div class="small">${esc(c.meaning)}</div><div class="small muted">📍 ${esc(c.region)} · 🕒 ${esc(c.when)}</div></div>${c.kind!=="etiket"?PA.speakBtn(c.expr.split(" — ")[0].replace(/\(.*?\)/g,""), c.lang):""}</div>`; }
PA.cultureRow = cultureRow;

/* =================== CONVERSATION ROOM =================== */
const SPEC_SCEN = ["Percakapan sehari-hari","Restoran","Belanja","Hotel","Bandara","Transportasi umum","Wawancara kerja","Komunikasi di kantor","Mencari teman","Percakapan telepon","Layanan pelanggan","Janji temu medis","Situasi perjalanan","Diskusi profesional"];
const CMODES = { beginner:"BEGINNER — kalimat sederhana, progres pelan", natural:"NATURAL — percakapan sehari-hari realistis", native:"NATIVE — ungkapan alami, idiom, kosakata lanjut", professional:"PROFESSIONAL — komunikasi kerja & formal" };
PA.pages.conversation = (view, param) => {
  const lang = PA.lang(), L = PA.L(); const tab = param || "live";
  const has = !!PA.data.scenarios.langs[lang];
  view.innerHTML = PA.head(`Conversation <span class="grad-text">Room</span>`, `Percakapan interaktif dalam ${esc(L.name)}`) +
   `<div class="tabs"><button class="tab ${tab==="live"?"on":""}" data-go="conversation|live">🎙 Live Voice Conversation</button><button class="tab ${tab==="ai"?"on":""}" data-go="conversation|ai">🤖 Percakapan bebas dengan AI</button></div><div id="cb"></div>`;
  const body = view.querySelector("#cb");
  if (tab === "live") {
    if (!has) { body.innerHTML = `<div class="card empty"><div class="ic">🗣</div><p>Dialog suara berskrip saat ini tersedia untuk bahasa yang kontennya sudah diverifikasi: ${Object.keys(PA.data.scenarios.langs).map(c=>PA.L(c).name).join(", ")}.</p><p class="small">Untuk ${esc(L.name)}, gunakan percakapan bebas dengan AI (bot bisa membalas dengan memo suara).</p><button class="btn primary" data-go="conversation|ai">Buka percakapan AI</button></div>`; return; }
    const scen = PA.data.scenarios.scenarios;
    body.innerHTML = `<div class="note warn" style="margin-bottom:14px"><b>Percakapan berskrip, bukan AI bebas.</b> Lawan bicara mengikuti dialog bercabang yang ditulis sebelumnya; jawaban Anda dicocokkan dengan kata kunci untuk tiap tujuan. Suara: speech-to-text browser (jika didukung) untuk Anda, suara sintetis (TTS) untuk lawan bicara. ${PA.sttSupported()?"":"<br>⚠️ Speech-to-text tidak tersedia di browser ini — ketik jawaban Anda (atau pakai dikte keyboard)."}</div>
     <div class="card" style="margin-bottom:14px"><div class="grid g3"><div class="field"><label class="f">Skenario</label><select id="cs">${scen.map(s=>`<option value="${s.id}">${esc(s.name)} (${s.level})</option>`).join("")}</select></div>
     <div class="field"><label class="f">Mode</label><select id="cm"><option value="0.8">Beginner — suara pelan, terjemahan tampil</option><option value="1" selected>Natural — kecepatan normal</option><option value="1.1">Native — lebih cepat, tanpa terjemahan</option></select></div>
     <div class="field"><label class="f">&nbsp;</label><button class="btn primary" id="cgo" style="width:100%">▶ Mulai percakapan suara</button></div></div></div><div id="dlg"></div>`;
    body.querySelector("#cgo").onclick = () => { const r = +body.querySelector("#cm").value; PA.dialogue(body.querySelector("#dlg"), lang, body.querySelector("#cs").value, { voice:true, rate:r, showTr: r < 1.1 }); };
  } else {
    body.innerHTML = `<div class="grid g2"><div class="card"><div class="field"><label class="f">Skenario</label><select id="as">${SPEC_SCEN.map(s=>`<option>${s}</option>`).join("")}</select></div>
     <div class="field"><label class="f">Mode percakapan</label><select id="am">${Object.entries(CMODES).map(([k,v])=>`<option value="${k}" ${k===PA.S.profile.mode?"selected":""}>${v}</option>`).join("")}</select></div>
     <div class="field"><label class="f">Gaya tutor</label>${persSelect("ap")}</div>
     <label class="small"><input type="checkbox" id="av" checked> Minta bot membalas dengan memo suara</label><div style="height:10px"></div>
     <button class="btn primary" id="ago">Buat prompt percakapan</button></div><div id="aout"><div class="card empty"><div class="ic">💬</div><p>Pilih skenario & mode.</p></div></div></div><div id="alog" style="margin-top:14px"></div>`;
    body.querySelector("#ago").onclick = () => { const m = body.querySelector("#am").value; PA.S.profile.mode = m; PA.save();
      const p = `Halo ${PA.BOT}!\n\n${PA.memorySummary(lang).replace(/Gaya tutor yang saya pilih: .*\n/, `Gaya tutor yang saya pilih: ${persPrompt(body.querySelector("#ap").value)}\n`)}\nMARI BERCAKAP (role-play) dalam ${L.name}.\nSkenario: ${body.querySelector("#as").value}\nMode: ${CMODES[m]}\n\nATURAN PERCAKAPAN:\n- Balas hanya dalam ${L.name}${m==="beginner"?" dengan kalimat pendek dan sederhana (beri terjemahan Indonesia di baris terpisah)":""}.\n- Sesuaikan kosakata & tata bahasa dengan level saya; hindari ungkapan yang terlalu rumit${m==="native"?" (kecuali idiom alami, jelaskan singkat)":""}.\n- Satu giliran per pesan, lalu tunggu jawaban saya. Jaga konteks percakapan.\n- Koreksi hanya kesalahan penting, singkat, di akhir pesan dalam tanda [Koreksi: …].\n- Perkenalkan kosakata baru secara alami dan dorong saya menjawab lebih panjang.\n${body.querySelector("#av").checked?"- Kirim balasan juga sebagai memo suara agar saya latihan mendengar.\n":""}- Setelah ±10 giliran atau jika saya menulis "selesai", berikan laporan: kekuatan, 3 kesalahan utama (format 6 bagian), kosakata baru.\n\nMulai dengan menyapa saya sesuai skenario.`;
      body.querySelector("#aout").innerHTML = PA.promptBox(p, "cpp"); PA.sessionForm(body.querySelector("#alog"), "conversation", { meta:{ scenario: body.querySelector("#as").value, mode:m } }); };
  }
};

/* =================== REAL LIFE SIMULATION =================== */
PA.pages.simulation = (view, param) => {
  const lang = PA.lang(), L = PA.L(); const scen = PA.data.scenarios.scenarios; const has = !!PA.data.scenarios.langs[lang];
  const done = PA.S.events.filter(e => e.type === "scenario_done" && e.lang === lang);
  if (param) {
    const meta = scen.find(s => s.id === param); if (!meta) return PA.go("simulation");
    view.innerHTML = `<button class="btn sm ghost" data-go="simulation">← Semua skenario</button><div style="height:12px"></div>` + PA.head(esc(meta.name), `Tingkat ${esc(meta.level)} · ${esc(L.name)}`) + `<div id="sim"></div><div id="slog" style="margin-top:14px"></div>`;
    const host = view.querySelector("#sim");
    if (has) PA.dialogue(host, lang, param, { voice:false });
    else {
      const objectives = meta.steps.map(s => s.goal);
      const p = `Halo ${PA.BOT}!\n\n${PA.memorySummary(lang)}\nSIMULASI KEHIDUPAN NYATA dalam ${L.name}: "${meta.name}" (tingkat ${meta.level}).\nKamu memerankan lawan bicara (mis. pelayan/pewawancara/petugas). Respons secara dinamis terhadap pilihan saya.\n\nTUJUAN SAYA:\n${objectives.map((o,k)=>`${k+1}. ${o}`).join("\n")}\n\nATURAN: satu giliran per pesan; sesuaikan dengan level saya; koreksi singkat di akhir dalam [Koreksi: …]. Setelah semua tujuan selesai, beri LAPORAN PERFORMA: tujuan tercapai (ya/tidak), kesalahan utama, kosakata kunci, saran.\n\nMulai sekarang.`;
      host.innerHTML = `<div class="note warn" style="margin-bottom:12px">Dialog berskrip terverifikasi untuk ${esc(L.name)} belum tersedia, jadi simulasi dijalankan oleh @${PA.BOT}. Catat tujuan yang tercapai setelah selesai.</div>${PA.promptBox(p, "spp")}`;
      PA.sessionForm(view.querySelector("#slog"), "scenario", { objectives, meta:{ scenario: meta.id } });
    }
    return;
  }
  view.innerHTML = PA.head(`Real Life <span class="grad-text">Simulation</span>`, `Simulasi kehidupan nyata · ${has?"dialog berskrip terverifikasi + laporan performa":"dijalankan lewat AI Tutor"}`) +
   `<div class="grid g3">${scen.map(s => { const n = done.filter(e => e.item === s.id); const best = n.length ? Math.max(...n.map(e => e.first)) : null;
     return `<button class="card hover" style="text-align:left;cursor:pointer" data-go="simulation|${s.id}"><div class="row between"><span class="badge gray">${esc(s.level)}</span>${best!=null?`<span class="badge ok">terbaik ${best}/${s.steps.length}</span>`:""}</div><h3 style="margin-top:10px">${esc(s.name)}</h3><ul class="small muted" style="padding-left:16px;margin:0">${s.steps.map(t=>`<li>${esc(t.goal)}</li>`).join("")}</ul></button>`; }).join("")}</div>
   ${has?"":`<p class="small muted" style="margin-top:12px">Dialog berskrip tersedia untuk: ${Object.keys(PA.data.scenarios.langs).map(c=>PA.L(c).name).join(", ")}.</p>`}
   <div class="note warn small" style="margin-top:14px">Skenario "Darurat" adalah latihan bahasa. Dalam keadaan darurat nyata, hubungi nomor resmi setempat (mis. 112 di Uni Eropa, 911 di AS, 110/119 di Jepang, 112 di Indonesia).</div>`;
};

/* =================== CULTURE EXPLORER =================== */
PA.pages.culture = (view) => {
  const lang = PA.lang(), L = PA.L(); let sel = lang, kind = "";
  view.innerHTML = PA.head(`Culture <span class="grad-text">Explorer</span>`, "Idiom, slang, etiket & ekspresi penutur asli — dengan wilayah dan kepantasan") +
   `<div class="card" style="margin-bottom:14px"><h3>Konteks budaya ${esc(L.name)}</h3><dl class="kv"><dt>Formal/informal</dt><dd>${esc(L.formal)}</dd><dt>Variasi regional</dt><dd>${esc(L.regions)}</dd><dt>Catatan budaya</dt><dd>${esc(L.culture)}</dd></dl></div>
   <div class="row" style="margin-bottom:12px"><select id="cl" style="width:auto"><option value="">Semua bahasa</option>${PA.data.languages.map(l=>`<option value="${l.code}" ${l.code===lang?"selected":""}>${esc(l.name)}</option>`).join("")}</select>
   <div class="chips" id="ck">${["","idiom","ungkapan","slang","etiket","peribahasa"].map(k=>`<button class="chip ${k===""?"on":""}" data-k="${k}">${k||"Semua"}</button>`).join("")}</div></div>
   <div class="note small" style="margin-bottom:12px">Slang regional ditandai wilayahnya — jangan dianggap universal. Daftar ini sengaja kecil dan dikurasi; minta tutor untuk lebih banyak contoh.</div>
   <div id="cr" class="list"></div><div class="row" style="margin-top:14px"><button class="btn" id="cask">🤖 Minta lebih banyak slang/ungkapan dari tutor</button></div><div id="cout" style="margin-top:12px"></div>`;
  const draw = () => { const items = PA.data.content.culture.filter(c => (!sel || c.lang === sel) && (!kind || c.kind === kind));
    view.querySelector("#cr").innerHTML = items.length ? items.map(c => { const key = c.lang+":"+c.expr; const seen = PA.S.cultureSeen[key]; return PA.cultureRow(c).replace(/<\/div>$/, `<button class="btn sm ${seen?"ok":"ghost"}" data-seen="${esc(key)}">${seen?"✓ dipelajari":"Tandai dipelajari"}</button></div>`); }).join("") : `<div class="empty">Tidak ada entri.</div>`;
    view.querySelectorAll("[data-seen]").forEach(b => b.onclick = () => { const k = b.dataset.seen; if (PA.S.cultureSeen[k]) delete PA.S.cultureSeen[k]; else { PA.S.cultureSeen[k] = new Date().toISOString(); PA.log({ type:"culture", item:k, lang:k.split(":")[0] }); } PA.save(); draw(); }); };
  view.querySelector("#cl").onchange = (e) => { sel = e.target.value; draw(); };
  view.querySelectorAll("#ck .chip").forEach(b => b.onclick = () => { kind = b.dataset.k; view.querySelectorAll("#ck .chip").forEach(x=>x.classList.toggle("on",x===b)); draw(); });
  view.querySelector("#cask").onclick = () => { const T = PA.L(sel || lang);
    view.querySelector("#cout").innerHTML = PA.promptBox(`Halo ${PA.BOT}!\n\n${PA.memorySummary(T.code)}\nAjarkan 8 ungkapan/slang ${T.name} yang benar-benar dipakai penutur asli saat ini. Untuk tiap ungkapan: arti, terjemahan harfiah, WILAYAH tempat dipakai, tingkat formalitas, kapan pantas dan kapan TIDAK pantas, contoh dialog singkat. Jangan menyajikan slang regional sebagai bahasa universal. Lalu jelaskan 2 norma etiket komunikasi penting.`, "cup"); };
  draw();
};
})();
