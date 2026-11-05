import json
G=[]
def T(lang,id,title,level,cat,explain,formula,examples,mistakes,ex):
    G.append(dict(lang=lang,id=f'{lang}-{id}',title=title,level=level,cat=cat,explain=explain,formula=formula,
      examples=[dict(t=a,tr=b) for a,b in examples],mistakes=mistakes,exercises=[dict(q=q,o=o,a=a,why=w) for q,o,a,w in ex]))
# ---------- ENGLISH
T('en','present-simple','Present Simple vs Present Continuous','A1','Kala (tenses)',
 'Present Simple untuk kebiasaan, fakta, jadwal. Present Continuous untuk hal yang sedang terjadi sekarang atau situasi sementara.',
 'Simple: S + V1 (+s/es untuk he/she/it) · Continuous: S + am/is/are + V-ing',
 [('She works in a bank.','Dia bekerja di bank (kebiasaan/fakta).'),('She is working from home this week.','Minggu ini dia sedang bekerja dari rumah (sementara).'),('Water boils at 100 °C.','Air mendidih pada 100 °C (fakta).')],
 ['Lupa -s pada orang ke-3 tunggal: ✗ "He work" → ✓ "He works".','Memakai continuous untuk kata kerja keadaan: ✗ "I am knowing" → ✓ "I know".'],
 [('Pilih yang benar: "Listen! The baby ___."',['cries','is crying','cry'],1,'"Listen!" menandakan sedang terjadi sekarang → Present Continuous.'),
  ('"He ___ coffee every morning."',['drink','drinks','is drinking'],1,'Kebiasaan (every morning) + he → Present Simple dengan -s.'),
  ('"I ___ the answer."',['know','am knowing','knows'],0,'"know" adalah kata kerja keadaan (stative), biasanya tidak dipakai dalam bentuk -ing.')])
T('en','articles','Artikel a / an / the','A1','Artikel',
 'a/an untuk benda tunggal yang dapat dihitung dan disebut pertama kali atau tidak spesifik; the untuk benda yang sudah jelas/spesifik bagi pendengar. an dipakai sebelum BUNYI vokal, bukan huruf vokal.',
 'a + bunyi konsonan · an + bunyi vokal · the + benda spesifik',
 [('I saw a dog. The dog was huge.','Saya melihat seekor anjing. Anjing itu besar.'),('an hour','sejam (h tidak dibaca → bunyi vokal)'),('a university','sebuah universitas (u dibaca /juː/ → bunyi konsonan)')],
 ['✗ "an university" → ✓ "a university".','Memakai artikel untuk benda jamak tak spesifik: ✗ "I like the cats" (umum) → ✓ "I like cats".'],
 [('"She is ___ honest person."',['a','an','the'],1,'"honest" diawali bunyi vokal (h tidak dibaca) → an.'),
  ('"Can you close ___ door, please?" (pintu di ruangan ini)',['a','an','the'],2,'Pintu yang jelas bagi kedua pihak → the.'),
  ('"I need ___ umbrella."',['a','an','the'],1,'"umbrella" diawali bunyi vokal → an.')])
T('en','past-simple','Past Simple vs Present Perfect','A2','Kala (tenses)',
 'Past Simple untuk kejadian selesai pada waktu tertentu di masa lalu. Present Perfect menghubungkan masa lalu dengan sekarang (pengalaman, hasil, belum selesai), tanpa waktu spesifik.',
 'Past: S + V2 · Perfect: S + have/has + V3',
 [('I visited Rome in 2019.','Saya mengunjungi Roma tahun 2019.'),('I have visited Rome twice.','Saya sudah dua kali ke Roma (pengalaman).'),('She has lost her keys.','Dia kehilangan kuncinya (dan sekarang masih hilang).')],
 ['✗ "I have seen him yesterday" → ✓ "I saw him yesterday" (waktu spesifik → Past Simple).'],
 [('"I ___ that film last week."',['have watched','watched','watch'],1,'"last week" = waktu spesifik selesai → Past Simple.'),
  ('"___ you ever been to Japan?"',['Did','Have','Were'],1,'Pengalaman seumur hidup dengan "ever" → Present Perfect.'),
  ('"She ___ here since 2020."',['lives','has lived','lived'],1,'"since" + masih berlangsung → Present Perfect.')])
T('en','conditionals','Kalimat Pengandaian (First & Second Conditional)','B1','Kalimat kompleks',
 'First conditional: kemungkinan nyata di masa depan. Second conditional: situasi khayalan/tidak mungkin di masa kini atau masa depan.',
 '1st: If + present, will + V1 · 2nd: If + past, would + V1',
 [('If it rains, we will stay home.','Kalau hujan, kami akan di rumah.'),('If I had more time, I would learn Japanese.','Seandainya saya punya lebih banyak waktu, saya akan belajar bahasa Jepang.'),('If I were you, I would call her.','Kalau saya jadi kamu, saya akan meneleponnya.')],
 ['✗ "If it will rain…" → ✓ "If it rains…" (tidak memakai will di anak kalimat if).'],
 [('"If I ___ rich, I would travel the world."',['am','were','will be'],1,'Second conditional (khayalan) → past: were.'),
  ('"If you heat ice, it ___."',['melts','would melt','melted'],0,'Fakta umum (zero conditional) → present + present.'),
  ('"If she calls, I ___ you."',['tell','will tell','would tell'],1,'Kemungkinan nyata → will + V1.')])
T('en','passive','Kalimat Pasif','B1','Struktur kalimat',
 'Pasif dipakai ketika pelaku tidak penting/tidak diketahui atau fokus pada objek. Bentuk be mengikuti kala.',
 'Objek + be (sesuai kala) + V3 (+ by pelaku)',
 [('The bridge was built in 1932.','Jembatan itu dibangun tahun 1932.'),('English is spoken here.','Bahasa Inggris dipakai di sini.'),('The report will be sent tomorrow.','Laporan akan dikirim besok.')],
 ['Memakai V2 bukan V3: ✗ "was wrote" → ✓ "was written".'],
 [('"The letters ___ yesterday."',['sent','were sent','was sent'],1,'Jamak (letters) + lampau → were + V3.'),
  ('"This song ___ by millions of people."',['is loved','loves','is loving'],0,'Pasif kala kini → is + V3.')])
# ---------- ITALIAN
T('it','articoli','Artikel Tentu (il, lo, la, l\', i, gli, le)','A1','Artikel',
 'Bentuk artikel tentu ditentukan oleh gender, jumlah dan bunyi awal kata berikutnya.',
 'm. tunggal: il (umum) · lo (s+konsonan, z, gn, ps, y) · l\' (vokal) · m. jamak: i / gli · f.: la / l\' · f. jamak: le',
 [('il libro → i libri','buku → buku-buku'),('lo studente → gli studenti','mahasiswa → para mahasiswa'),('l\'amica → le amiche','teman (pr.) → teman-teman (pr.)')],
 ['✗ "il studente" → ✓ "lo studente".','✗ "i amici" → ✓ "gli amici".'],
 [('___ zaino (tas ransel)',['il','lo','la'],1,'Kata maskulin diawali z → lo.'),
  ('___ amici',['i','gli','le'],1,'Maskulin jamak diawali vokal → gli.'),
  ('___ casa',['il','la','l\''],1,'Feminin tunggal diawali konsonan → la.')])
T('it','presente','Presente: kata kerja -are, -ere, -ire','A1','Konjugasi',
 'Kata kerja beraturan dibagi tiga kelompok. Subjek sering dihilangkan karena akhiran sudah menunjukkan pelaku.',
 'parlare: parlo, parli, parla, parliamo, parlate, parlano · vedere: vedo, vedi, vede, vediamo, vedete, vedono · dormire: dormo, dormi, dorme, dormiamo, dormite, dormono',
 [('Parlo italiano.','Saya berbicara bahasa Italia.'),('Vediamo un film.','Kami menonton film.'),('Dormono molto.','Mereka tidur banyak.')],
 ['Menambahkan subjek terus-menerus (io parlo) tidak salah tetapi terdengar menekankan.','Sebagian kata kerja -ire memakai -isc- (capire → capisco).'],
 [('Noi ___ (parlare) inglese.',['parliamo','parlate','parlano'],0,'noi + -are → -iamo.'),
  ('Loro ___ (vedere) il mare.',['vedete','vedono','vede'],1,'loro + -ere → -ono.'),
  ('Io ___ (capire).',['capo','capisco','capisce'],1,'capire memakai -isc-: io capisco.')])
T('it','passato-prossimo','Passato prossimo (avere / essere)','A2','Kala (tenses)',
 'Lampau yang selesai. Kebanyakan kata kerja memakai avere; kata kerja gerak/perubahan keadaan dan refleksif memakai essere, dan partisipnya menyesuaikan gender/jumlah subjek.',
 'avere/essere (presente) + participio passato',
 [('Ho mangiato una pizza.','Saya (sudah) makan pizza.'),('Maria è andata a Roma.','Maria pergi ke Roma.'),('Ci siamo svegliati presto.','Kami bangun pagi-pagi.')],
 ['✗ "Ho andato" → ✓ "Sono andato/a".','Lupa persesuaian dengan essere: ✗ "Lei è andato" → ✓ "Lei è andata".'],
 [('Ieri (io) ___ al cinema.',['ho andato','sono andato','ho andata'],1,'andare memakai essere; penutur pria → sono andato (penutur wanita: sono andata).'),
  ('Noi ___ la cena.',['abbiamo preparato','siamo preparati','abbiamo preparata'],0,'preparare transitif → avere; partisip tidak berubah.')])
# ---------- SPANISH
T('es','ser-estar','Ser vs Estar','A1','Kata kerja dasar',
 'Keduanya berarti "adalah". Ser untuk identitas, asal, profesi, ciri tetap, waktu. Estar untuk lokasi, keadaan sementara, emosi, hasil.',
 'ser: soy, eres, es, somos, sois, son · estar: estoy, estás, está, estamos, estáis, están',
 [('Soy de Indonesia.','Saya dari Indonesia (asal).'),('Estoy cansado.','Saya capek (keadaan).'),('Madrid está en España.','Madrid ada di Spanyol (lokasi).')],
 ['✗ "Soy en casa" → ✓ "Estoy en casa".','Arti berubah: "es aburrido" (membosankan) vs "está aburrido" (sedang bosan).'],
 [('Mi hermana ___ médica.',['es','está'],0,'Profesi → ser.'),
  ('¿Dónde ___ el baño?',['es','está'],1,'Lokasi → estar.'),
  ('Hoy ___ muy contentos.',['somos','estamos'],1,'Emosi/keadaan sementara → estar.')])
T('es','genero','Gender & Persesuaian','A1','Kata benda & sifat',
 'Setiap kata benda maskulin atau feminin. Umumnya -o maskulin dan -a feminin, tetapi ada pengecualian. Artikel dan kata sifat menyesuaikan gender dan jumlah.',
 'el/un + m. · la/una + f. · kata sifat: -o/-a/-os/-as',
 [('el libro rojo','buku merah'),('la casa blanca','rumah putih'),('el día / la mano','hari (m.) / tangan (f.) — pengecualian')],
 ['✗ "la problema" → ✓ "el problema" (kata -ma dari Yunani sering maskulin).'],
 [('___ mano',['el','la'],1,'mano adalah pengecualian: feminin.'),
  ('Las casas son ___.',['blanco','blancas','blanca'],1,'Feminin jamak → -as.')])
T('es','preterito','Pretérito indefinido vs imperfecto','B1','Kala (tenses)',
 'Indefinido untuk aksi selesai pada titik waktu tertentu. Imperfecto untuk latar, kebiasaan di masa lalu, deskripsi, atau aksi yang sedang berlangsung.',
 'hablar → hablé (indef.) / hablaba (imperf.) · comer → comí / comía',
 [('Ayer comí paella.','Kemarin saya makan paella.'),('De niño, comía mucha fruta.','Waktu kecil, saya (biasa) makan banyak buah.'),('Leía cuando sonó el teléfono.','Saya sedang membaca ketika telepon berbunyi.')],
 ['Memakai indefinido untuk kebiasaan: ✗ "Cada verano fui a la playa" (jika maksudnya kebiasaan) → ✓ "iba".'],
 [('Cuando era pequeño, ___ en Bali.',['viví','vivía'],1,'Latar/keadaan berlangsung di masa lalu → imperfecto.'),
  ('El año pasado ___ a México.',['fui','iba'],0,'Peristiwa selesai pada waktu tertentu → indefinido.')])
# ---------- FRENCH
T('fr','articles','Artikel tentu, tak tentu & partitif','A1','Artikel',
 'Bahasa Prancis hampir selalu memakai artikel. Partitif (du, de la, de l\') untuk jumlah tak tentu dari benda tak terhitung. Setelah negasi, un/une/des/du/de la menjadi de/d\'.',
 'le/la/l\'/les · un/une/des · du/de la/de l\'/des · negasi: pas de',
 [('Je bois du café.','Saya minum kopi (sejumlah).'),('J\'aime le café.','Saya suka kopi (secara umum).'),('Je n\'ai pas de voiture.','Saya tidak punya mobil.')],
 ['✗ "Je n\'ai pas une voiture" (umumnya) → ✓ "pas de voiture".','✗ "J\'aime du café" → ✓ "J\'aime le café" (preferensi umum memakai artikel tentu).'],
 [('Je mange ___ pain.',['le','du','de'],1,'Jumlah tak tentu → partitif du.'),
  ('Il n\'y a pas ___ lait.',['du','de','le'],1,'Setelah negasi → de.'),
  ('J\'adore ___ musique.',['la','de la','une'],0,'Preferensi umum → artikel tentu.')])
T('fr','passe-compose','Passé composé (avoir / être)','A2','Kala (tenses)',
 'Lampau untuk aksi selesai. Kebanyakan kata kerja memakai avoir; kata kerja gerak tertentu (aller, venir, partir, arriver, naître, mourir…) dan kata kerja refleksif memakai être dengan persesuaian partisip.',
 'avoir/être (présent) + participe passé',
 [('J\'ai fini mes devoirs.','Saya sudah menyelesaikan PR.'),('Elle est partie hier.','Dia (pr.) berangkat kemarin.'),('Nous nous sommes levés tôt.','Kami bangun pagi.')],
 ['✗ "J\'ai allé" → ✓ "Je suis allé(e)".'],
 [('Hier, ils ___ au cinéma.',['ont allé','sont allés','sont allé'],1,'aller → être; subjek maskulin jamak → allés.'),
  ('Tu ___ ton café ?',['as bu','es bu','as boire'],0,'boire transitif → avoir + bu.')])
T('fr','negation','Negasi ne … pas','A1','Negasi',
 'Negasi standar mengapit kata kerja terkonjugasi: ne (n\' sebelum vokal) + verba + pas. Dalam percakapan santai, ne sering dihilangkan.',
 'S + ne + V + pas (+ ...) · n\' sebelum vokal',
 [('Je ne parle pas allemand.','Saya tidak berbicara bahasa Jerman.'),('Il n\'aime pas le thé.','Dia tidak suka teh.'),('Je n\'ai jamais vu Paris.','Saya belum pernah melihat Paris.')],
 ['✗ "Je ne pas parle" → ✓ "Je ne parle pas".'],
 [('Nous ___ comprenons ___.',['ne … pas','pas … ne','n\' … pas'],0,'comprenons diawali konsonan → ne … pas.'),
  ('Elle ___ habite ___ ici.',['ne … pas','n\' … pas','pas … ne'],1,'habite diawali h bisu (vokal) → n\'.')])
# ---------- GERMAN
T('de','v2','Posisi kata kerja (V2 & akhir kalimat)','A1','Urutan kata',
 'Dalam kalimat utama, kata kerja terkonjugasi selalu di posisi kedua, walau yang pertama adalah keterangan. Dalam anak kalimat (weil, dass, wenn), kata kerja terkonjugasi pindah ke akhir.',
 'Pos.1 (apa saja) + VERB + … · Anak kalimat: Konjungsi + S + … + VERB',
 [('Heute gehe ich ins Kino.','Hari ini saya pergi ke bioskop.'),('Ich bleibe zu Hause, weil ich müde bin.','Saya di rumah karena saya capek.'),('Ich weiß, dass er Deutsch spricht.','Saya tahu bahwa dia berbahasa Jerman.')],
 ['✗ "Heute ich gehe…" → ✓ "Heute gehe ich…".','✗ "…weil ich bin müde" → ✓ "…weil ich müde bin".'],
 [('Morgen ___ wir nach Berlin.',['wir fahren','fahren','fahren wir nach'],1,'Kata kerja di posisi 2 setelah "Morgen": Morgen fahren wir…'),
  ('Ich lerne Deutsch, weil ich in Wien ___.',['arbeite','arbeite ich','ich arbeite'],0,'Dalam anak kalimat dengan weil, kata kerja di akhir: weil ich in Wien arbeite.')])
T('de','akkusativ','Akkusativ (objek langsung)','A1','Kasus',
 'Objek langsung memakai Akkusativ. Hanya artikel maskulin yang berubah: der → den, ein → einen. Feminin, netral dan jamak tetap.',
 'm.: den/einen · f.: die/eine · n.: das/ein · pl.: die/–',
 [('Ich habe einen Bruder.','Saya punya seorang saudara laki-laki.'),('Sie kauft den Apfel.','Dia membeli apel itu.'),('Wir sehen das Haus.','Kami melihat rumah itu.')],
 ['✗ "Ich habe ein Hund" → ✓ "Ich habe einen Hund".'],
 [('Ich trinke ___ Kaffee. (der Kaffee)',['der','den','dem'],1,'Objek langsung maskulin → den.'),
  ('Er liest ___ Buch. (das Buch)',['das','den','dem'],0,'Netral tidak berubah di Akkusativ.'),
  ('Wir brauchen ___ Tisch. (der Tisch)',['ein','einen','einem'],1,'Maskulin tak tentu Akkusativ → einen.')])
T('de','perfekt','Perfekt (haben / sein)','A2','Kala (tenses)',
 'Lampau yang paling umum dalam percakapan. Kebanyakan kata kerja memakai haben; kata kerja gerak/perubahan keadaan (gehen, fahren, kommen, werden) memakai sein. Partisip II di akhir kalimat.',
 'haben/sein (konjugasi) + … + Partizip II (ge-…-t / ge-…-en)',
 [('Ich habe Pizza gegessen.','Saya (sudah) makan pizza.'),('Wir sind nach Hamburg gefahren.','Kami pergi (berkendara) ke Hamburg.'),('Hast du gut geschlafen?','Apakah kamu tidur nyenyak?')],
 ['✗ "Ich habe gegangen" → ✓ "Ich bin gegangen".'],
 [('Er ___ gestern spät nach Hause gekommen.',['hat','ist'],1,'kommen = gerak → sein.'),
  ('Wir ___ einen Film gesehen.',['haben','sind'],0,'sehen transitif → haben.')])
# ---------- PORTUGUESE
T('pt','ser-estar','Ser vs Estar','A1','Kata kerja dasar',
 'Mirip bahasa Spanyol: ser untuk identitas/ciri tetap/asal; estar untuk keadaan sementara dan lokasi benda yang bisa berpindah. Lokasi tetap (kota, bangunan) sering dengan ser atau ficar.',
 'ser: sou, é, somos, são · estar: estou, está, estamos, estão (bentuk você)',
 [('Eu sou brasileiro.','Saya orang Brasil.'),('Estou com fome.','Saya lapar.'),('Onde fica o hotel?','Di mana hotelnya (letaknya)?')],
 ['✗ "Sou cansado" (maksud: sedang capek) → ✓ "Estou cansado".'],
 [('Ela ___ professora.',['é','está'],0,'Profesi → ser.'),('Nós ___ muito felizes hoje.',['somos','estamos'],1,'Emosi hari ini → estar.')])
T('pt','artigos-preposicoes','Gabungan preposisi + artikel','A1','Artikel',
 'Preposisi de, em, a, por bergabung dengan artikel tentu.',
 'de+o=do, de+a=da · em+o=no, em+a=na · a+a=à · por+o=pelo',
 [('Sou do Rio.','Saya dari Rio.'),('Ela está na escola.','Dia di sekolah.'),('Vou à praia.','Saya pergi ke pantai.')],
 ['✗ "em a casa" → ✓ "na casa".'],
 [('O livro está ___ mesa.',['em a','na','no'],1,'em + a (mesa feminin) = na.'),('Ele é ___ Brasil.',['de o','do','da'],1,'de + o = do.')])
# ---------- JAPANESE
T('ja','wa-ga','Partikel は (wa) dan が (ga)','A1','Partikel',
 'は menandai topik (apa yang sedang dibicarakan); が menandai subjek gramatikal, sering untuk informasi baru, penekanan, atau dengan kata seperti 好き/ある/いる.',
 'Topik は Komentar · Subjek が Predikat',
 [('私は学生です。','Saya (topik) adalah pelajar.'),('猫がいます。','Ada kucing (informasi baru).'),('誰が来ましたか？','Siapa yang datang? (kata tanya sebagai subjek → が)')],
 ['✗ "誰は来ましたか" → ✓ "誰が来ましたか" (kata tanya sebagai subjek memakai が).'],
 [('私___日本語が好きです。',['は','が','を'],0,'"Saya" sebagai topik → は; objek kesukaan memakai が.'),
  ('あそこに犬___います。',['は','が','を'],1,'Keberadaan/info baru dengan います → が.'),
  ('何___ありますか？',['は','が','を'],1,'Kata tanya sebagai subjek → が.')])
T('ja','masu','Bentuk sopan ます','A1','Konjugasi',
 'Bentuk ます dipakai dalam percakapan sopan. Kata kerja grup 1 (u): ubah akhiran -u → -i + ます; grup 2 (ru): hapus る + ます; tak beraturan: する→します, 来る→来ます.',
 'Positif: ～ます · Negatif: ～ません · Lampau: ～ました · Lampau negatif: ～ませんでした',
 [('毎日コーヒーを飲みます。','Setiap hari saya minum kopi.'),('昨日は寝ませんでした。','Kemarin saya tidak tidur.'),('明日、東京に行きます。','Besok saya pergi ke Tokyo.')],
 ['✗ "食べるます" → ✓ "食べます" (grup 2: hapus る).'],
 [('書く → ?',['書きます','書くます','書けます'],0,'Grup 1: ku → ki + ます.'),
  ('見る → ? (negatif)',['見りません','見ません','見ないます'],1,'Grup 2: hapus る + ません.'),
  ('する → ? (lampau)',['しました','すました','しませんでした'],0,'Tak beraturan: します → しました.')])
T('ja','wo-ni-de','Partikel を, に, で','A1','Partikel',
 'を menandai objek langsung. に menandai tujuan, titik waktu, lokasi keberadaan (いる/ある). で menandai tempat terjadinya aksi atau alat/cara.',
 'Objek を V · Tujuan/waktu に · Tempat aksi/alat で',
 [('パンを食べます。','Saya makan roti.'),('七時に起きます。','Saya bangun jam tujuh.'),('図書館で勉強します。','Saya belajar di perpustakaan.')],
 ['✗ "図書館に勉強します" → ✓ "図書館で勉強します" (tempat aksi → で).'],
 [('レストラン___食べます。',['に','で','を'],1,'Tempat aksi → で.'),('駅___行きます。',['に','で','を'],0,'Tujuan → に (atau へ).'),('バス___来ました。',['に','で','を'],1,'Alat/cara → で.')])
# ---------- KOREAN
T('ko','particles','Partikel 은/는, 이/가, 을/를','A1','Partikel',
 'Bentuk partikel tergantung apakah kata sebelumnya berakhiran konsonan (batchim) atau vokal. 은/는 topik/kontras; 이/가 subjek; 을/를 objek.',
 'Konsonan: 은 · 이 · 을 | Vokal: 는 · 가 · 를',
 [('저는 학생이에요.','Saya pelajar.'),('책이 있어요.','Ada buku.'),('사과를 먹어요.','Saya makan apel.')],
 ['✗ "책를" → ✓ "책을" (책 berakhiran konsonan).'],
 [('물___ 마셔요.',['을','를'],0,'물 berakhiran konsonan ㄹ → 을.'),('친구___ 와요.',['이','가'],1,'친구 berakhiran vokal → 가.'),('저___ 한국 사람이 아니에요.',['은','는'],1,'저 berakhiran vokal → 는.')])
T('ko','haeyo','Akhiran sopan -아요/-어요','A1','Konjugasi',
 'Tingkat tutur sopan sehari-hari. Ambil batang kata (hapus 다). Jika vokal terakhir ㅏ/ㅗ → -아요; selain itu → -어요; 하다 → 해요.',
 'ㅏ/ㅗ + 아요 · lainnya + 어요 · 하다 → 해요',
 [('가다 → 가요','pergi (가 + 아요 → 가요, kontraksi)'),('먹다 → 먹어요','makan'),('공부하다 → 공부해요','belajar')],
 ['✗ "먹아요" → ✓ "먹어요" (vokal ㅓ → 어요).'],
 [('읽다 → ?',['읽아요','읽어요','읽해요'],1,'Vokal ㅣ → 어요.'),('살다 → ?',['살아요','살어요','사요'],0,'Vokal ㅏ → 아요.'),('일하다 → ?',['일하요','일해요','일어요'],1,'하다 → 해요.')])
T('ko','negation','Negasi 안 dan -지 않다','A1','Negasi',
 'Dua cara negasi: 안 sebelum kata kerja (lebih lisan, pendek) atau batang + 지 않아요 (lebih netral/formal). Untuk 하다-kata kerja dengan kata benda, 안 masuk sebelum 하다.',
 '안 + V · V-batang + 지 않아요 · N 안 해요',
 [('안 가요.','(Saya) tidak pergi.'),('먹지 않아요.','(Saya) tidak makan.'),('공부 안 해요.','(Saya) tidak belajar.')],
 ['✗ "안 공부해요" → ✓ "공부 안 해요".'],
 [('운동하다 (negatif dengan 안)',['안 운동해요','운동 안 해요'],1,'Kata benda + 하다 → 안 masuk sebelum 하다.'),('자다 (negatif dengan -지 않다)',['자지 않아요','안 자지요'],0,'Batang 자 + 지 않아요.')])
# ---------- MANDARIN
T('zh','shi-de-ma','Kalimat dasar: 是, 吗, 不','A1','Struktur kalimat',
 '是 menghubungkan dua kata benda ("adalah"); tidak dipakai sebelum kata sifat. 吗 di akhir mengubah pernyataan menjadi pertanyaan ya/tidak. 不 untuk negasi umum.',
 'A 是 B · Pernyataan + 吗？ · S + 很 + Adj',
 [('我是学生。','Saya pelajar.'),('你是老师吗？','Apakah kamu guru?'),('她很高兴。','Dia senang (kata sifat memakai 很, bukan 是).')],
 ['✗ "我是高兴" → ✓ "我很高兴".'],
 [('他___忙。 (Dia sibuk.)',['是','很','吗'],1,'Kata sifat sebagai predikat biasanya memakai 很, bukan 是.'),('你喝咖啡___？',['吗','是','不'],0,'Pertanyaan ya/tidak → 吗 di akhir.')])
T('zh','le','Partikel 了 (aspek selesai / perubahan)','A2','Aspek',
 '了 setelah kata kerja menandai aksi sudah selesai. 了 di akhir kalimat menandai perubahan keadaan. Negasi aksi selesai memakai 没(有) tanpa 了.',
 'V + 了 (+ O) · Kalimat + 了 (perubahan) · 没 + V (negasi lampau)',
 [('我吃了饭。','Saya sudah makan.'),('下雨了。','Hujan turun (sekarang hujan).'),('我没去。','Saya tidak (jadi) pergi.')],
 ['✗ "我没去了" → ✓ "我没去".','了 bukan penanda lampau murni: kebiasaan di masa lalu tidak memakai 了.'],
 [('昨天我___去学校。 (Kemarin saya tidak pergi ke sekolah.)',['不','没','了'],1,'Negasi aksi yang tidak terjadi di masa lalu → 没.'),('我买___三本书。',['了','吗','是'],0,'Aksi selesai dengan objek bilangan → V + 了.')])
T('zh','measure','Kata penggolong (量词)','A1','Kata benda',
 'Angka atau 这/那 tidak bisa langsung diikuti kata benda; harus ada kata penggolong. 个 paling umum; ada yang khusus (本 untuk buku, 杯 untuk gelas, 张 untuk benda pipih).',
 'Angka/这/那 + Penggolong + Kata benda · 2 = 两 sebelum penggolong',
 [('一个人','satu orang'),('两本书','dua buku'),('三杯咖啡','tiga gelas kopi')],
 ['✗ "二本书" → ✓ "两本书".','✗ "一书" → ✓ "一本书".'],
 [('我有___本书。 (dua)',['二','两'],1,'Sebelum penggolong, 2 = 两.'),('一___咖啡',['本','杯','张'],1,'Minuman dalam gelas → 杯.')])
# ---------- INDONESIAN / MALAY
T('id','me-di','Aktif me- vs Pasif di-','A2','Afiks',
 'Kalimat aktif transitif memakai me- (dengan perubahan bunyi: me-, mem-, men-, meng-, meny-). Pasif orang ke-3 memakai di-; pasif orang ke-1/2 memakai pronomina + kata dasar (saya baca, kamu ambil).',
 'Aktif: S + meN-V + O · Pasif: O + di-V + (oleh) pelaku · Pasif pronomina: O + saya/kamu + V',
 [('Saya membaca buku itu.','I read the book.'),('Buku itu dibaca oleh Ani.','The book was read by Ani.'),('Buku itu sudah saya baca.','I have read the book (pasif pronomina).')],
 ['✗ "Buku itu dibaca oleh saya" (kaku) → lebih baku: "Buku itu saya baca".','✗ "mempukul" → ✓ "memukul" (p luluh).'],
 [('Ia ___ (tulis) surat.',['menulis','mentulis','ditulis'],0,'t luluh setelah men- → menulis.'),('Surat itu ___ oleh Budi.',['menulis','ditulis','tulis'],1,'Pasif dengan pelaku orang ke-3 → di-.'),('meN- + sapu → ?',['mensapu','menyapu','mesapu'],1,'s luluh menjadi meny-.')])
T('id','aspek','Penanda waktu: sudah, sedang, akan, belum','A1','Waktu & aspek',
 'Kata kerja tidak berubah bentuk; waktu dan aspek ditandai kata keterangan.',
 'sudah/telah (selesai) · sedang (berlangsung) · akan (masa depan) · belum (belum terjadi)',
 [('Saya sudah makan.','I have eaten.'),('Dia sedang tidur.','She is sleeping.'),('Kami belum pernah ke Bali.','We have never been to Bali.')],
 ['Menjawab "Sudah makan?" dengan "Tidak" terdengar janggal; jawaban wajar: "Belum."'],
 [('"Apakah kamu sudah makan?" (belum) → "___."',['Tidak','Belum','Bukan'],1,'Untuk sesuatu yang belum terjadi → belum.')])
# ---------- ARABIC
T('ar','al','Artikel ال dan huruf matahari/bulan','A1','Artikel',
 'ال menjadikan kata benda tentu. Sebelum "huruf matahari" (t, th, d, dh, r, z, s, sh, ṣ, ḍ, ṭ, ẓ, l, n), bunyi l melebur ke konsonan berikutnya yang menjadi ganda; sebelum "huruf bulan", l tetap dibaca.',
 'al- + huruf bulan: al-qamar · al- + huruf matahari: ash-shams',
 [('الكتاب (al-kitāb)','buku itu (k = huruf bulan)'),('الشمس (ash-shams)','matahari (sh = huruf matahari)'),('الرجل (ar-rajul)','laki-laki itu (r = huruf matahari)')],
 ['✗ "al-shams" → ✓ "ash-shams".'],
 [('ال + نور (nūr, cahaya) → ?',['al-nūr','an-nūr'],1,'n adalah huruf matahari → an-nūr.'),('ال + باب (bāb, pintu) → ?',['al-bāb','ab-bāb'],0,'b adalah huruf bulan → al-bāb.')])
T('ar','nominal','Kalimat nominal (tanpa "adalah")','A1','Struktur kalimat',
 'Dalam kala kini, Bahasa Arab tidak memakai kata kerja "adalah". Subjek tentu + predikat tak tentu membentuk kalimat lengkap.',
 'Mubtada\' (tentu) + Khabar (tak tentu)',
 [('البيت كبير. (al-baytu kabīr)','Rumah itu besar.'),('أنا طالب. (anā ṭālib)','Saya pelajar.'),('الجو حار. (al-jawwu ḥārr)','Cuacanya panas.')],
 ['"البيت الكبير" (al-bayt al-kabīr) = "rumah yang besar" (frasa), bukan kalimat "rumah itu besar".'],
 [('"Rumah itu besar" = ?',['البيت كبير','البيت الكبير'],0,'Predikat tak tentu (tanpa ال) membentuk kalimat.')])
# ---------- RUSSIAN
T('ru','gender','Gender kata benda','A1','Kata benda',
 'Gender umumnya bisa ditebak dari akhiran: konsonan → maskulin, -а/-я → feminin, -о/-е → netral. Akhiran -ь bisa maskulin atau feminin (harus dihafal). Kata seperti папа tetap maskulin karena maknanya.',
 'm.: стол · f.: книга · n.: окно · -ь: день (m.), ночь (f.)',
 [('мой дом','rumahku (m.)'),('моя книга','bukuku (f.)'),('моё окно','jendelaku (n.)')],
 ['✗ "моя папа" → ✓ "мой папа".'],
 [('___ машина (milikku)',['мой','моя','моё'],1,'машина berakhiran -а → feminin → моя.'),('___ письмо (milikku)',['мой','моя','моё'],2,'письмо berakhiran -о → netral → моё.')])
T('ru','byt','Kalimat tanpa "adalah" di kala kini','A1','Struktur kalimat',
 'Kata kerja быть ("adalah/ada") dihilangkan di kala kini. Dalam tulisan, tanda pisah (—) dipakai di antara dua kata benda.',
 'S + (∅) + Predikat · N — N',
 [('Я студент.','Saya mahasiswa.'),('Москва — столица России.','Moskow adalah ibu kota Rusia.'),('Он дома.','Dia di rumah.')],
 ['✗ "Я есть студент" → ✓ "Я студент".'],
 [('"Dia dokter." = ?',['Он есть врач.','Он врач.'],1,'Kala kini tanpa быть.')])
json.dump(G,open('../data/grammar.json','w'),ensure_ascii=False,indent=0)
from collections import Counter; print(len(G),Counter(g['lang'] for g in G), sum(len(g['exercises']) for g in G))
