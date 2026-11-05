# POLYGLOT AI
**Learn Every Language. Unlock Every World.**

Live: https://elchto.github.io/polyglot-ai/

POLYGLOT AI adalah aplikasi web (PWA) untuk belajar 22 bahasa. Antarmukanya berbahasa Indonesia. Aplikasi ini statis: tidak ada server, tidak ada akun, dan semua progres disimpan di perangkat (localStorage) dengan fitur ekspor/impor JSON. "Otak" AI-nya adalah bot Grok **Polyglot AI Tutor**: halaman-halaman AI menyusun prompt yang lengkap dan dipersonalisasi, Anda menyalinnya ke bot, lalu mencatat hasil sesi supaya statistik tetap nyata. Tidak ada kunci API di repositori ini dan tidak ada keluaran AI palsu.

## Bahasa (22)
Inggris, Italia, Spanyol, Prancis, Jerman, Portugis (Brasil), Belanda, Swedia, Norwegia (Bokmål), Denmark, Polandia, Rusia, Arab (MSA), Turki, Hindi, Indonesia, Melayu, Jepang, Korea, Mandarin (aksara sederhana + pinyin), Thai, Vietnam.

## Modul (urutan menu)
1. **Home Dashboard**: salam, bahasa aktif, level CEFR per keterampilan, streak, target harian yang bisa diubah, timer belajar aktif, rekomendasi dari *Adaptive Learning Brain* lengkap dengan alasannya, serta akses ke Database Bahasa dan Tes Penempatan.
2. **AI Tutor**: penyusun prompt (koreksi dalam format 6 bagian, tata bahasa, kosakata, perbandingan, formalitas, pelajaran personal, pertanyaan bebas) dengan 6 kepribadian tutor dan pencatatan sesi.
3. **Conversation Room**: *Live Voice Conversation* (dialog bercabang berskrip dengan STT dan TTS, pencocokan kata kunci/maksud; ditandai "percakapan berskrip, bukan AI bebas"; tombol "Lanjutkan dengan AI") serta prompt percakapan AI untuk 14 skenario × 4 mode.
4. **Voice & Pronunciation**: TTS dengan kecepatan yang bisa diatur, rekaman MediaRecorder (hanya di memori, unduh bila perlu), *Accent Intelligence* (kontur nada F0 dengan autokorelasi, selubung energi, durasi/tempo, kecocokan per kata lewat STT; ini perbandingan visual, bukan skor bersertifikat), dan panduan fonetik IPA.
5. **Grammar Lab**: 34 topik dan 80 latihan (penjelasan, rumus, contoh, kesalahan umum).
6. **Vocabulary Builder**: 120 konsep per bahasa, SM-2 spaced repetition, mode flashcard/pilihan ganda/isian/audio/ketik, kata buatan sendiri, koleksi, dan *Vocabulary Intelligence* (kata yang paling sering salah, pasangan yang sering tertukar, EF terendah, sesi yang ditargetkan).
7. **Listening Lab**: audio sintetis (TTS) dengan pilihan arti, kata yang terdengar, melengkapi kalimat, dan dikte; transkrip ditampilkan setelah menjawab.
8. **Writing Lab**: 8 jenis tulisan, prompt koreksi, perbandingan kata per kata (diff LCS) antara versi asli dan perbaikan, serta tren koreksi per 100 kata.
9. **Translation Studio**: *Contextual Translation* (maksud, register, audiens, wilayah, nada → literal, natural, kasual, formal, profesional, adaptasi budaya) dan pencarian idiom terverifikasi dari data lokal.
10. **Real Life Simulation**: 9 skenario (restoran, wawancara kerja, kantor, bandara, hotel, dokter, belanja, darurat, sosial). Dialog berskrip tersedia untuk en/it/es/fr/de/ja dengan daftar tujuan dan laporan performa; bahasa lain lewat prompt bot dan checklist tujuan.
11. **Culture Explorer**: 70 idiom, slang, etiket, dan peribahasa, masing-masing dengan wilayah, register, dan kapan pantas dipakai.
12. **Progress Analytics**: grafik mingguan/bulanan (waktu, ulasan, akurasi), retensi, latihan per keterampilan, kekuatan/kelemahan, riwayat CEFR, sesi tutor, dan log Brain.
13. **My Learning Memory**: melihat, mengubah, dan menghapus profil, tujuan, kepribadian tutor, level, kesalahan, dan sesi; ekspor/impor/hapus semua data.

## Verifikasi konten
- Kosakata dibangun dari `tools/vocab/*.txt` lewat `tools/build_vocab.py`. `tools/verify_wikt.py` mencocokkan setiap entri dengan tabel terjemahan Wiktionary bahasa Inggris: 2182 entri cocok, dan sisanya ditinjau manual sebagai padanan yang sah. Status per kata (`wikt`/`manual`) tersimpan di `data/vocab.json`.
- Thai berisi 117 kata (tiga konsep sengaja dihilangkan karena tidak ada padanan yang tervalidasi).
- Deskriptor CEFR adalah parafrase bahasa Indonesia dari kisi penilaian diri Dewan Eropa. Hasil penempatan ditandai sebagai **perkiraan**.

## Lapisan integrasi (masa depan)
| Endpoint | Fungsi |
|---|---|
| `POST /api/tutor/chat` | Proksi LLM sisi server (kunci API di server) |
| `POST /api/pronunciation/score` | Penilaian pelafalan tingkat fonem |
| `POST /api/stt` | STT server untuk browser tanpa Web Speech |
| `POST /api/auth/*` | Login dan sinkronisasi |
| `GET/PUT /api/sync` | Sinkronisasi state (format ekspor JSON) ke PostgreSQL |

## Dukungan browser
- **TTS**: semua browser modern; ketersediaan suara tergantung OS. Di iPhone, suara bisa ditambahkan lewat Pengaturan › Aksesibilitas › Konten Lisan.
- **Speech-to-text**: Chrome/Edge (desktop dan Android). Di Safari iOS dukungannya terbatas dan sering tidak tersedia saat aplikasi dibuka dari Layar Utama; aplikasi otomatis beralih ke mode ketik atau dikte keyboard.
- **MediaRecorder**: Safari iOS 14.3+.

## Pengembangan
```
cd tools && for f in build_vocab languages grammar content scenarios; do python3 $f.py; done && cd ..
python3 -m http.server 8000
```
