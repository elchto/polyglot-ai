import json
P=[]
def ph(lang,sound,ipa,how,ex,tip=''):
    P.append(dict(lang=lang,sound=sound,ipa=ipa,how=how,ex=[dict(w=a,ipa=b,m=c) for a,b,c in ex],tip=tip))
ph('en','th tak bersuara','/θ/','Ujung lidah di antara gigi atas dan bawah (atau di belakang gigi atas), udara dihembuskan tanpa getaran pita suara. Jangan diganti /t/ atau /s/.',
 [('thought','/θɔːt/ (UK) · /θɔt/ atau /θɑt/ (US)','pikiran'),('think','/θɪŋk/','berpikir'),('three','/θriː/','tiga')],'Bandingkan: thank vs tank, think vs sink.')
ph('en','th bersuara','/ð/','Posisi sama dengan /θ/, tetapi pita suara bergetar (rasakan getaran di leher).',
 [('this','/ðɪs/','ini'),('mother','/ˈmʌðə/ (UK) · /ˈmʌðɚ/ (US)','ibu'),('they','/ðeɪ/','mereka')])
ph('en','i pendek vs i panjang','/ɪ/ vs /iː/','/ɪ/ lebih pendek dan lidah sedikit lebih rendah/rileks; /iː/ panjang dengan bibir agak melebar.',
 [('ship','/ʃɪp/','kapal'),('sheep','/ʃiːp/','domba'),('live','/lɪv/','tinggal'),('leave','/liːv/','pergi')],'Pasangan minimal ini sering membedakan makna.')
ph('en','schwa','/ə/','Vokal netral yang sangat pendek dan rileks pada suku kata tanpa tekanan; mulut setengah terbuka, lidah di tengah.',
 [('about','/əˈbaʊt/','tentang'),('banana','/bəˈnɑːnə/ (UK)','pisang'),('teacher','/ˈtiːtʃə/ (UK)','guru')],'Bahasa Inggris berirama tekanan: suku tanpa tekanan sering menjadi /ə/.')
ph('en','v vs w','/v/ vs /w/','/v/: gigi atas menyentuh bibir bawah, bergetar. /w/: kedua bibir membulat, tanpa sentuhan gigi.',
 [('very','/ˈveri/','sangat'),('wine','/waɪn/','anggur (minuman)'),('vest','/vest/','rompi'),('west','/west/','barat')])
ph('es','r tunggal vs rr','/ɾ/ vs /r/','/ɾ/: satu sentuhan cepat ujung lidah di gusi atas. /r/: ujung lidah bergetar beberapa kali (juga untuk r di awal kata).',
 [('pero','/ˈpeɾo/','tetapi'),('perro','/ˈpero/','anjing'),('rojo','/ˈroxo/','merah')])
ph('es','ñ','/ɲ/','Bagian tengah lidah menempel ke langit-langit keras — seperti "ny" dalam bahasa Indonesia "nyanyi".',
 [('año','/ˈaɲo/','tahun'),('España','/esˈpaɲa/','Spanyol')],'Jangan diucapkan "an-o": ano berarti "anus".')
ph('es','j / g lembut','/x/','Frikatif di belakang mulut (langit-langit lunak), seperti "kh" dalam "khusus". Di banyak dialek Amerika Latin/Karibia lebih lemah, mendekati /h/.',
 [('jamón','/xaˈmon/','ham'),('gente','/ˈxente/','orang-orang')])
ph('fr','u Prancis','/y/','Ucapkan "i" lalu bulatkan bibir tanpa memindahkan lidah.',
 [('tu','/ty/','kamu'),('tout','/tu/','semua'),('rue','/ʁy/','jalan'),('roue','/ʁu/','roda')],'Membedakan /y/ dan /u/ penting untuk makna.')
ph('fr','vokal sengau','/ɑ̃/ /ɔ̃/ /ɛ̃/','Udara keluar lewat mulut DAN hidung; n/m tidak dibaca sebagai konsonan penuh.',
 [('blanc','/blɑ̃/','putih'),('bon','/bɔ̃/','baik'),('vin','/vɛ̃/','anggur (minuman)')])
ph('fr','r Prancis','/ʁ/','Dihasilkan di belakang tenggorokan (uvula), mirip bunyi berkumur halus; bukan r bergetar ujung lidah.',
 [('rouge','/ʁuʒ/','merah'),('Paris','/paʁi/','Paris')])
ph('de','ü dan ö','/yː/ /øː/','ü: ucapkan "i" dengan bibir dibulatkan. ö: ucapkan "e" dengan bibir dibulatkan.',
 [('über','/ˈyːbɐ/','di atas/tentang'),('schön','/ʃøːn/','indah'),('Tür','/tyːɐ̯/','pintu')])
ph('de','ich-Laut vs ach-Laut','/ç/ vs /x/','ch setelah e, i, ä, ö, ü, atau konsonan → /ç/ (seperti mendesis "hy"). ch setelah a, o, u, au → /x/ (di belakang mulut).',
 [('ich','/ɪç/','saya'),('Milch','/mɪlç/','susu'),('Bach','/bax/','sungai kecil'),('Buch','/buːx/','buku')])
ph('de','pelepasan suara akhir','Auslautverhärtung','b, d, g di akhir suku kata dilafalkan p, t, k.',
 [('Hund','/hʊnt/','anjing'),('Tag','/taːk/','hari'),('gelb','/ɡɛlp/','kuning')])
ph('it','konsonan ganda','/pp/ /tt/ /ll/…','Tahan konsonan sedikit lebih lama; suku kata sebelumnya terasa lebih pendek. Ini membedakan makna.',
 [('pala','/ˈpala/','sekop'),('palla','/ˈpalla/','bola'),('nono','/ˈnɔno/','kesembilan'),('nonno','/ˈnɔnno/','kakek')])
ph('it','gli dan gn','/ʎ/ dan /ɲ/','gli: bagian tengah lidah menempel ke langit-langit, seperti "ly" yang menyatu. gn: seperti "ny".',
 [('figlio','/ˈfiʎʎo/','anak laki-laki'),('gnocchi','/ˈɲɔkki/','gnocchi'),('bagno','/ˈbaɲɲo/','kamar mandi')])
ph('it','c dan g sebelum e/i','/tʃ/ /dʒ/ vs /k/ /ɡ/','c/g + e/i = "c"/"j" Indonesia. ch/gh + e/i = "k"/"g" keras.',
 [('ciao','/ˈtʃao/','halo'),('chiesa','/ˈkjɛːza/','gereja'),('gelato','/dʒeˈlaːto/','es krim'),('spaghetti','/spaˈɡetti/','spageti')])
ph('pt','ão sengau','/ɐ̃w̃/','Diftong sengau: mulut dari "a" menuju "u" sambil udara lewat hidung.',
 [('pão','/ˈpɐ̃w̃/','roti'),('não','/ˈnɐ̃w̃/','tidak')])
ph('pt','lh dan nh','/ʎ/ dan /ɲ/','lh mirip gli Italia; nh seperti "ny".',
 [('filho','/ˈfiʎu/ (BR)','anak laki-laki'),('vinho','/ˈviɲu/ (BR)','anggur (minuman)')])
ph('ja','vokal panjang','ā ō ū (dua mora)','Vokal panjang dihitung dua ketukan. Memendekkan/memanjangkan bisa mengubah arti.',
 [('おばさん','obasan','bibi'),('おばあさん','obāsan','nenek'),('ここ','koko','di sini'),('こうこう','kōkō','SMA')])
ph('ja','konsonan ganda っ','/kk/ /tt/ /pp/','Jeda sejenak (satu ketukan) sebelum konsonan.',
 [('きて','kite','datanglah'),('きって','kitte','perangko')])
ph('ja','ら行 (r Jepang)','/ɾ/','Satu sentuhan ringan ujung lidah di belakang gigi atas, di antara r, l dan d. Bukan r bergetar.',
 [('りんご','ringo','apel'),('ありがとう','arigatō','terima kasih')])
ph('ko','tiga jenis konsonan','ㄷ /t/ · ㄸ /t͈/ · ㅌ /tʰ/','Lunak (sedikit napas), tegang (otot tenggorokan tegang, tanpa napas), beraspirasi (hembusan kuat). Sama untuk ㄱ/ㄲ/ㅋ, ㅂ/ㅃ/ㅍ, ㅈ/ㅉ/ㅊ.',
 [('달','dal','bulan'),('딸','ttal','anak perempuan'),('탈','tal','topeng')],'Letakkan tisu di depan mulut: hanya ㅌ yang membuatnya bergerak kuat.')
ph('ko','ㅓ dan ㅡ','/ʌ/ dan /ɯ/','ㅓ: "o" dengan mulut terbuka dan bibir tidak bulat. ㅡ: "u" dengan bibir rata (tidak dibulatkan).',
 [('어머니','eomeoni','ibu'),('그','geu','itu')])
ph('zh','empat nada','1 ˉ · 2 ˊ · 3 ˇ · 4 ˋ','Nada 1 tinggi datar; nada 2 naik; nada 3 rendah (turun lalu naik bila diucapkan sendiri); nada 4 turun tajam.',
 [('妈 mā','nada 1','ibu'),('麻 má','nada 2','rami'),('马 mǎ','nada 3','kuda'),('骂 mà','nada 4','memarahi')],'Dua nada 3 berurutan: yang pertama menjadi nada 2 (nǐ hǎo → ní hǎo).')
ph('zh','j q x','/tɕ/ /tɕʰ/ /ɕ/','Bunyi palatal: ujung lidah di belakang gigi bawah, bagian depan lidah naik ke langit-langit; bibir agak melebar.',
 [('谢谢 xièxie','[ɕjɛ]','terima kasih'),('去 qù','[tɕʰy]','pergi'),('鸡 jī','[tɕi]','ayam')])
ph('zh','retrofleks zh ch sh r','/ʈʂ/ /ʈʂʰ/ /ʂ/ /ʐ/','Ujung lidah ditekuk sedikit ke belakang menuju langit-langit keras.',
 [('是 shì','[ʂʐ̩] (kira-kira)','adalah'),('吃 chī','[ʈʂʰʐ̩]','makan'),('中 zhōng','[ʈʂʊŋ]','tengah')])
ph('ar','ع ʿayn','/ʕ/','Konsonan faringal bersuara: tenggorokan menyempit seperti tercekik ringan sambil bersuara.',
 [('عين','ʿayn','mata'),('عربي','ʿarabī','Arab')])
ph('ar','ح ḥāʾ vs ه hāʾ','/ħ/ vs /h/','ح: hembusan kuat dari tenggorokan yang menyempit (seperti meniup kaca berembun dengan keras). ه: h biasa.',
 [('حب','ḥubb','cinta'),('هو','huwa','dia (lk.)')])
ph('ar','emfatik ص vs س','/sˤ/ vs /s/','Konsonan emfatik: pangkal lidah ditarik ke belakang, membuat vokal di sekitarnya lebih "gelap".',
 [('صيف','ṣayf','musim panas'),('سيف','sayf','pedang')])
ph('ru','ы','/ɨ/','Ucapkan "i" sambil menarik lidah ke belakang; bibir tidak bulat.',
 [('мы','my /mɨ/','kami'),('ты','ty /tɨ/','kamu'),('сыр','syr /sɨr/','keju')])
ph('ru','konsonan lunak (palatal)','/tʲ/ /lʲ/…','Tanda lunak ь atau vokal я/е/ё/ю/и menunjukkan konsonan sebelumnya dilunakkan (bagian tengah lidah naik).',
 [('мат','mat','skakmat'),('мать','mat\' /matʲ/','ibu')])
ph('ru','reduksi vokal','о → [ɐ]/[ə]','о tanpa tekanan tidak dibaca "o", tetapi mendekati "a" atau schwa.',
 [('молоко','moloko /məlɐˈko/','susu'),('хорошо','khorosho /xərɐˈʂo/','baik')])
ph('hi','aspirasi','/k/ vs /kʰ/','Konsonan beraspirasi diucapkan dengan hembusan napas yang jelas; ini membedakan makna.',
 [('काल','kāl','waktu'),('खाल','khāl','kulit')])
ph('hi','retrofleks vs dental','ड /ɖ/ vs द /d̪/','द: ujung lidah menyentuh belakang gigi atas. ड: ujung lidah ditekuk ke belakang menyentuh langit-langit.',
 [('दाल','dāl','kacang lentil (dal)'),('डाल','ḍāl','dahan')])
ph('th','nada','5 nada','Nada ditentukan kelas konsonan, tanda nada, dan jenis suku kata — harus dihafal bersama kata.',
 [('ใกล้','klai (nada turun)','dekat'),('ไกล','klai (nada tengah)','jauh')],'Romanisasi umum (RTGS) tidak menulis nada.')
ph('vi','enam nada','ngang, huyền, sắc, hỏi, ngã, nặng','Setiap suku kata membawa nada; diakritik menunjukkan nadanya.',
 [('ma','nada datar','hantu'),('mà','nada turun','tetapi'),('má','nada naik','ibu (Selatan) / pipi'),('mả','nada hỏi','kuburan'),('mã','nada ngã','kuda'),('mạ','nada berat','bibit padi')],'Di Vietnam Selatan, hỏi dan ngã umumnya terdengar sama.')
ph('tr','ı tanpa titik','/ɯ/','Seperti "u" tetapi bibir rata (tidak bulat), atau seperti e pepet yang lebih tertutup.',
 [('kız','/kɯz/','anak perempuan'),('ışık','/ɯˈʃɯk/','cahaya')])
ph('pl','ł','/w/','Dalam bahasa Polandia modern, ł dibaca seperti "w" dalam bahasa Inggris.',
 [('łąka','/ˈwɔŋka/','padang rumput'),('mały','/ˈmawɨ/','kecil')])
ph('pl','sz/cz vs ś/ć','/ʂ/ /ʈʂ/ vs /ɕ/ /tɕ/','sz, cz: lidah agak ditekuk ke belakang (keras). ś, ć (atau si, ci): bagian tengah lidah naik (lunak).',
 [('szary','/ˈʂarɨ/','abu-abu'),('siwy','/ˈɕivɨ/','beruban'),('czas','/ʈʂas/','waktu')])
ph('nl','g/ch Belanda','/ɣ/ atau /x/','Frikatif di belakang mulut. Di Belanda bagian utara terdengar kasar/tak bersuara; di selatan dan Flandria lebih lembut.',
 [('goed','/ɣut/ (sering [xut])','baik'),('lachen','/ˈlɑxə(n)/','tertawa')])
ph('sv','sj-bunyi','/ɧ/','Bunyi desis khas bahasa Swedia, mirip "hw"/"sy" yang diucapkan dengan bibir sedikit membulat. Variasi regional besar.',
 [('sju','/ɧʉː/','tujuh'),('sjuk','/ɧʉːk/','sakit')])
ph('id','e pepet vs e taling','/ə/ vs /e/','Ejaan tidak membedakan; harus dihafal per kata.',
 [('apel (buah)','/ˈapəl/','apple'),('apel (upacara)','/aˈpel/','roll call'),('seri','/səˈri/ (imbang) · /ˈseri/ (urutan)','draw / series')])
CUL=[]
def cu(lang,kind,expr,meaning,region,register,when,lit=''):
    CUL.append(dict(lang=lang,kind=kind,expr=expr,lit=lit,meaning=meaning,region=region,register=register,when=when))
cu('en','idiom','break the ice','mencairkan suasana; memulai percakapan dengan orang yang belum dikenal','umum (semua ragam)','netral','Aman di situasi kerja maupun santai.','memecah es')
cu('en','idiom','It\'s raining cats and dogs','hujan sangat deras','terutama Inggris (UK)','informal','Dikenal luas tetapi terdengar klise/kuno; penutur asli jarang memakainya sehari-hari.')
cu('en','ungkapan','Cheers!','bersulang; di Inggris (UK) juga "terima kasih" atau "dah" secara santai','UK, Australia (makna "terima kasih")','informal','Di AS umumnya hanya untuk bersulang.')
cu('en','etiket','Antre (queueing)','Menyerobot antrean dianggap sangat tidak sopan.','UK (sangat kuat), umum di negara berbahasa Inggris','—','Selalu ikuti antrean di halte, toko, loket.')
cu('it','idiom','In bocca al lupo! — Crepi!','semoga berhasil; dijawab "Crepi (il lupo)!"','seluruh Italia','informal–netral','Sebelum ujian, wawancara, pertunjukan. Menjawab "grazie" dianggap kurang lazim oleh sebagian orang.','di mulut serigala')
cu('it','ungkapan','Non vedo l\'ora!','tidak sabar menunggu','seluruh Italia','netral','Untuk acara yang dinantikan.','aku tidak melihat jamnya')
cu('it','etiket','Cappuccino di pagi hari','Banyak orang Italia minum cappuccino terutama saat sarapan, bukan setelah makan siang/malam.','Italia','—','Kebiasaan, bukan aturan; memesan setelah makan tidak salah, hanya menandai turis.')
cu('es','idiom','Estar en las nubes','melamun, tidak fokus','umum','informal','Untuk menegur halus atau bercanda.','berada di awan')
cu('es','slang','¡Qué guay!','keren!','Spanyol','informal','Tidak umum di Amerika Latin (Meksiko: ¡Qué padre!, Argentina: ¡Qué copado!). Jangan anggap universal.')
cu('es','idiom','Tomar el pelo','menggoda/mempermainkan seseorang','umum','informal','"¿Me estás tomando el pelo?" = "Kamu bercanda/mempermainkanku?"','mengambil rambut')
cu('fr','idiom','Avoir le cafard','merasa sedih/murung','Prancis & negara francophone','informal','Percakapan santai.','memiliki kecoak')
cu('fr','idiom','Poser un lapin','tidak datang ke janji temu tanpa kabar','Prancis','informal','"Il m\'a posé un lapin" = dia tidak datang.','menaruh kelinci')
cu('fr','ungkapan','Ça marche','oke, setuju, beres','Prancis','informal–netral','Sangat umum di kafe/restoran dan antar rekan.','itu berjalan')
cu('fr','etiket','La bise','Cium pipi sebagai salam di antara kenalan/teman; jumlah ciuman bervariasi menurut daerah.','Prancis (bervariasi)','—','Dengan orang yang baru dikenal di konteks bisnis, jabat tangan lebih aman.')
cu('de','idiom','Daumen drücken','semoga berhasil (saya mendoakanmu)','Jerman, Austria','netral','"Ich drücke dir die Daumen!"','menekan ibu jari')
cu('de','idiom','Ich verstehe nur Bahnhof','saya sama sekali tidak paham','Jerman','informal','Lelucon saat bingung.','saya hanya mengerti "stasiun"')
cu('de','ungkapan','Feierabend','waktu selesai kerja / waktu santai setelah kerja','Jerman, Austria, Swiss','netral','"Schönen Feierabend!" diucapkan ke rekan saat pulang.')
cu('pt','ungkapan','Saudade','rindu mendalam akan seseorang/sesuatu yang jauh atau telah berlalu','Brasil & Portugal','netral','Dipakai dalam percakapan dan lagu; sering disebut sulit diterjemahkan satu kata.')
cu('pt','idiom','Pagar o pato','menanggung kesalahan/akibat perbuatan orang lain','Brasil & Portugal','informal','"Eu é que paguei o pato."','membayar bebeknya')
cu('pt','slang','Fazer uma vaquinha','patungan uang','Brasil','informal','Di antara teman/kolega.','membuat sapi kecil')
cu('nl','ungkapan','Gezellig','suasana nyaman, akrab, menyenangkan','Belanda & Flandria','netral','Untuk tempat, acara, atau kebersamaan.')
cu('nl','ungkapan','Lekker!','enak/menyenangkan — tidak hanya untuk makanan','Belanda','informal','"Lekker weer" = cuaca enak; "Lekker geslapen?" = tidur nyenyak?')
cu('nl','idiom','Dat is andere koek','itu hal yang sangat berbeda (biasanya lebih sulit)','Belanda','informal','Membandingkan dua situasi.','itu kue lain')
cu('sv','ungkapan','Fika','rehat kopi bersama, biasanya dengan kue','Swedia','netral','Kebiasaan sosial di rumah dan kantor.')
cu('sv','ungkapan','Lagom','secukupnya, tidak terlalu banyak atau sedikit','Swedia','netral','"Lagom är bäst" = secukupnya paling baik.')
cu('sv','idiom','Det är ingen ko på isen','tidak ada masalah/tak perlu terburu-buru','Swedia','informal','Menenangkan orang lain.','tidak ada sapi di atas es')
cu('nb','ungkapan','Takk for sist','"terima kasih untuk pertemuan terakhir" — salam saat bertemu kembali','Norwegia','netral','Diucapkan saat bertemu lagi dengan orang yang sebelumnya menjamu/bertemu Anda.')
cu('nb','ungkapan','Ut på tur, aldri sur','"keluar berjalan-jalan, tidak pernah cemberut"','Norwegia','informal','Pepatah populer tentang kegiatan di alam terbuka (friluftsliv).')
cu('nb','etiket','Matpakke','Banyak orang membawa bekal roti isi dari rumah untuk makan siang.','Norwegia','—','Kebiasaan umum di sekolah dan kantor.')
cu('da','ungkapan','Hygge','suasana nyaman, hangat dan akrab','Denmark','netral','Untuk momen santai bersama, lilin, makanan.')
cu('da','etiket','Tak for mad','"terima kasih untuk makanannya" diucapkan setelah makan kepada tuan rumah','Denmark','netral','Hampir wajib setelah dijamu makan.')
cu('da','etiket','Skål!','bersulang — biasanya sambil menatap mata orang lain','Denmark (dan Skandinavia)','informal–netral','Saat minum bersama.')
cu('pl','idiom','Nie mój cyrk, nie moje małpy','bukan urusanku','Polandia','informal','Bercanda di antara teman.','bukan sirkus saya, bukan monyet saya')
cu('pl','etiket','Smacznego!','selamat makan','Polandia','netral','Sebelum makan bersama.')
cu('pl','etiket','Imieniny','perayaan "hari nama" (hari santo yang namanya sama) — sering dirayakan seperti ulang tahun','Polandia','—','Mengucapkan selamat pada hari nama kolega adalah hal biasa.')
cu('ru','idiom','Ни пуха ни пера! — К чёрту!','semoga berhasil; dijawab "k chyortu!"','Rusia','informal','Sebelum ujian. Jangan menjawab "spasibo".','tanpa bulu halus, tanpa bulu')
cu('ru','etiket','Bunga berjumlah ganjil','Buket hadiah biasanya berjumlah ganjil; jumlah genap untuk pemakaman.','Rusia (dan beberapa negara Eropa Timur)','—','Saat memberi bunga.')
cu('ru','ungkapan','Приятного аппетита!','selamat makan','Rusia','netral','Sebelum/saat makan.')
cu('ar','ungkapan','إن شاء الله (in shāʾ allāh)','"jika Allah menghendaki" — dipakai untuk rencana masa depan','seluruh dunia Arab','netral','Sangat umum; konteks kadang membuatnya terdengar sebagai jawaban yang tidak pasti.')
cu('ar','ungkapan','الحمد لله (al-ḥamdu lillāh)','"segala puji bagi Allah" — jawaban umum atas "apa kabar?"','seluruh dunia Arab','netral','Kayfa ḥāluk? — Al-ḥamdu lillāh, bikhayr.')
cu('ar','ungkapan','يعطيك العافية (yaʿṭīk al-ʿāfiya)','ungkapan apresiasi kepada orang yang sedang/baru bekerja','terutama Levant & Teluk (dialek)','informal–netral','Kepada pelayan, rekan kerja, pekerja.')
cu('ar','etiket','Tangan kanan','Makan dan memberi/menerima barang dengan tangan kanan.','umum di dunia Arab','—','Terutama saat makan bersama.')
cu('tr','ungkapan','Kolay gelsin','"semoga mudah" — kepada orang yang sedang bekerja','Turki','netral','Saat masuk toko atau melihat orang bekerja.')
cu('tr','ungkapan','Afiyet olsun','selamat makan','Turki','netral','Sebelum/saat makan.')
cu('tr','ungkapan','Geçmiş olsun','"semoga cepat berlalu" — simpati untuk orang sakit atau sedang kesulitan','Turki','netral','Saat seseorang sakit atau mengalami masalah.')
cu('hi','ungkapan','जी (jī)','akhiran hormat setelah nama/sebutan (Sharma-ji, Mā-ji) atau sebagai "ya" sopan','India Utara','sopan','Kepada orang lebih tua atau yang dihormati.')
cu('hi','slang','जुगाड़ (jugāṛ)','solusi kreatif/improvisasi dengan sumber daya terbatas','India Utara','informal','Bisa positif (kreatif) atau berkonotasi akal-akalan.')
cu('hi','slang','अरे यार (are yār)','"aduh, kawan" — ekspresi akrab/kesal','India Utara','sangat informal','Hanya dengan teman dekat.')
cu('id','ungkapan','Sudah makan?','basa-basi untuk menunjukkan perhatian, bukan selalu ajakan makan','Indonesia','informal–netral','Antar kenalan/rekan.')
cu('id','slang','gue / lo','saya / kamu','Jakarta & media nasional','sangat informal','Hanya dengan teman sebaya; tidak sopan kepada orang lebih tua. Bukan bahasa Indonesia umum.')
cu('id','ungkapan','jam karet','kebiasaan tidak tepat waktu','Indonesia','informal','Dipakai bercanda atau mengkritik.','jam (dari) karet')
cu('ms','slang','…lah','partikel penegas lisan ("jomlah!" = ayo!, "okaylah")','Malaysia, Singapura','informal','Percakapan santai; jarang dalam tulisan formal.')
cu('ms','slang','tapau','membungkus makanan untuk dibawa pulang','Malaysia (dari Kantonis)','informal','"Nak makan sini atau tapau?"')
cu('ms','ungkapan','boleh tahan','lumayan, cukup bagus','Malaysia','informal','Menilai sesuatu secara positif tapi sedang.')
cu('ja','etiket','いただきます / ごちそうさまでした','diucapkan sebelum dan sesudah makan','Jepang','netral','Hampir selalu, termasuk saat makan sendiri di depan orang lain.')
cu('ja','ungkapan','よろしくお願いします','"mohon kerja samanya/mohon bantuannya" — sangat serbaguna','Jepang','sopan','Saat berkenalan, meminta sesuatu, memulai kerja sama.')
cu('ja','ungkapan','お疲れ様です','"terima kasih atas kerja kerasnya" — salam antar rekan kerja','Jepang','sopan','Di kantor, saat bertemu atau pulang. Jangan dipakai kepada pelanggan.')
cu('ja','ungkapan','空気を読む (kūki o yomu)','"membaca suasana" — memahami hal yang tak terucap','Jepang','netral','Nilai sosial penting dalam komunikasi.')
cu('ko','ungkapan','수고하셨습니다','"terima kasih atas kerja kerasnya"','Korea','sopan','Di akhir kerja atau kepada staf/penjual saat pergi.')
cu('ko','slang','화이팅! / 파이팅!','semangat!','Korea','informal','Menyemangati teman atau tim.')
cu('ko','etiket','Minum di depan orang lebih tua','Menuang dengan dua tangan; saat minum, sering memalingkan wajah sedikit dari orang yang lebih tua.','Korea','—','Acara makan/minum dengan atasan atau orang lebih tua.')
cu('zh','ungkapan','加油 (jiāyóu)','semangat!','Tiongkok, Taiwan','informal','Menyemangati seseorang.','tambah minyak')
cu('zh','ungkapan','马马虎虎 (mǎmǎhūhū)','biasa saja, lumayan','umum','informal','Menjawab "bagaimana?" dengan rendah hati.','kuda kuda harimau harimau')
cu('zh','ungkapan','面子 (miànzi)','"muka" — reputasi/harga diri sosial','umum','—','Hindari mempermalukan orang di depan umum.')
cu('th','ungkapan','ไม่เป็นไร (mai pen rai)','tidak apa-apa / sama-sama / jangan khawatir','Thailand','netral','Sangat umum; mencerminkan sikap santai.')
cu('th','ungkapan','เกรงใจ (kreng chai)','sungkan — enggan merepotkan orang lain','Thailand','—','Menjelaskan mengapa orang menghindari permintaan langsung.')
cu('th','etiket','Kepala dan kaki','Jangan menyentuh kepala orang lain; jangan menunjuk dengan kaki.','Thailand','—','Selalu.')
cu('vi','ungkapan','Ăn cơm chưa?','"sudah makan nasi?" — sapaan menunjukkan perhatian','Vietnam','informal','Antar kenalan dan keluarga.')
cu('vi','peribahasa','Một con ngựa đau, cả tàu bỏ cỏ','"satu kuda sakit, seluruh kandang tidak makan rumput" — solidaritas','Vietnam','netral','Tentang kebersamaan dalam kelompok.')
cu('vi','etiket','Kata ganti menurut usia','Memakai anh/chị/em/cô/chú sesuai usia & hubungan menunjukkan hormat.','Vietnam','—','Tanyakan cara memanggil jika ragu.')
CEFR={'listening':{'A1':'Saya bisa mengenali kata-kata yang sangat umum dan frasa dasar tentang diri sendiri, keluarga, dan lingkungan terdekat jika orang berbicara pelan dan jelas.',
 'A2':'Saya bisa memahami frasa dan kosakata umum tentang hal-hal yang sangat relevan (info pribadi dan keluarga, belanja, lingkungan, pekerjaan). Saya bisa menangkap inti pesan dan pengumuman singkat yang jelas.',
 'B1':'Saya bisa memahami poin utama dari ucapan yang jelas dan standar tentang hal-hal akrab di tempat kerja, sekolah, waktu luang. Saya bisa memahami inti banyak program radio/TV tentang topik terkini jika pengucapannya relatif pelan dan jelas.',
 'B2':'Saya bisa memahami ceramah dan pidato yang cukup panjang, dan mengikuti argumen yang kompleks jika topiknya cukup akrab. Saya bisa memahami sebagian besar berita TV dan film dalam bahasa standar.',
 'C1':'Saya bisa memahami ucapan panjang meskipun tidak terstruktur dengan jelas dan hubungan antargagasan hanya tersirat. Saya bisa memahami program TV dan film tanpa banyak usaha.',
 'C2':'Saya tidak kesulitan memahami bahasa lisan apa pun, langsung maupun siaran, bahkan dengan kecepatan penutur asli, asalkan ada waktu untuk membiasakan diri dengan aksennya.'},
 'reading':{'A1':'Saya bisa memahami nama, kata, dan kalimat yang sangat sederhana, misalnya di papan pengumuman, poster, atau katalog.',
 'A2':'Saya bisa membaca teks pendek yang sangat sederhana dan menemukan informasi spesifik dalam materi sehari-hari (iklan, menu, jadwal). Saya bisa memahami surat pribadi pendek.',
 'B1':'Saya bisa memahami teks yang sebagian besar berisi bahasa sehari-hari atau terkait pekerjaan. Saya bisa memahami deskripsi peristiwa, perasaan, dan harapan dalam surat pribadi.',
 'B2':'Saya bisa membaca artikel dan laporan tentang masalah kontemporer di mana penulis mengambil sikap tertentu. Saya bisa memahami prosa sastra kontemporer.',
 'C1':'Saya bisa memahami teks faktual dan sastra yang panjang dan kompleks serta menghargai perbedaan gaya. Saya bisa memahami artikel khusus dan instruksi teknis panjang, bahkan di luar bidang saya.',
 'C2':'Saya bisa dengan mudah membaca hampir semua bentuk bahasa tertulis, termasuk teks abstrak atau kompleks secara struktur/bahasa seperti manual, artikel khusus, dan karya sastra.'},
 'speaking':{'A1':'Saya bisa berinteraksi secara sederhana jika lawan bicara mau mengulang atau berbicara lebih pelan dan membantu saya. Saya bisa mengajukan dan menjawab pertanyaan sederhana tentang kebutuhan langsung, dan memakai frasa sederhana untuk menggambarkan tempat tinggal dan orang yang saya kenal.',
 'A2':'Saya bisa berkomunikasi dalam tugas rutin sederhana yang membutuhkan pertukaran informasi langsung tentang topik akrab. Saya bisa melakukan percakapan sosial yang sangat singkat, dan menjelaskan keluarga, kondisi hidup, latar pendidikan, dan pekerjaan saat ini dengan kalimat sederhana.',
 'B1':'Saya bisa menangani sebagian besar situasi saat bepergian di wilayah penutur bahasa tersebut. Saya bisa ikut percakapan tanpa persiapan tentang topik akrab, dan menceritakan pengalaman, peristiwa, mimpi, harapan, serta memberi alasan singkat untuk pendapat dan rencana.',
 'B2':'Saya bisa berinteraksi dengan cukup lancar dan spontan sehingga interaksi rutin dengan penutur asli cukup mungkin. Saya bisa memberi deskripsi jelas dan rinci tentang beragam topik, menjelaskan sudut pandang dan pro-kontra berbagai pilihan.',
 'C1':'Saya bisa mengekspresikan diri dengan lancar dan spontan tanpa terlalu jelas mencari kata. Saya bisa memakai bahasa secara fleksibel dan efektif untuk keperluan sosial dan profesional, serta menyajikan deskripsi jelas dan terstruktur tentang topik kompleks.',
 'C2':'Saya bisa ikut serta dalam percakapan atau diskusi apa pun dengan mudah dan akrab dengan idiom serta ungkapan sehari-hari. Saya bisa menyampaikan nuansa makna dengan tepat dan menyajikan argumen yang mengalir lancar dengan gaya yang sesuai konteks.'},
 'writing':{'A1':'Saya bisa menulis kartu pos pendek sederhana dan mengisi formulir dengan data pribadi (nama, kebangsaan, alamat).',
 'A2':'Saya bisa menulis catatan dan pesan pendek sederhana terkait kebutuhan langsung, serta surat pribadi yang sangat sederhana (misalnya berterima kasih).',
 'B1':'Saya bisa menulis teks sederhana yang tersambung tentang topik akrab, serta surat pribadi yang menggambarkan pengalaman dan kesan.',
 'B2':'Saya bisa menulis teks jelas dan rinci tentang beragam topik, esai atau laporan yang menyampaikan informasi atau argumen, dan surat yang menonjolkan makna pribadi dari peristiwa dan pengalaman.',
 'C1':'Saya bisa menulis teks yang jelas dan terstruktur baik, mengungkapkan sudut pandang secara panjang, menulis tentang topik kompleks dengan menonjolkan poin penting, dan memilih gaya yang sesuai pembaca.',
 'C2':'Saya bisa menulis teks yang jelas, mengalir lancar, dengan gaya yang tepat; menulis surat, laporan, atau artikel kompleks dengan struktur logis yang efektif, serta ringkasan dan ulasan karya profesional atau sastra.'}}
PERS=[dict(id='teacher',name='Professional Teacher',idn='Guru Profesional',desc='Sabar, terstruktur, detail. Menjelaskan langkah demi langkah.',prompt='Act as a patient, structured, detailed professional language teacher.'),
 dict(id='friend',name='Friendly Conversation Partner',idn='Teman Ngobrol',desc='Santai dan natural; koreksi ringan agar percakapan tetap mengalir.',prompt='Act as a friendly, relaxed, natural conversation partner; correct only important mistakes, gently.'),
 dict(id='strict',name='Strict Grammar Coach',idn='Pelatih Tata Bahasa Ketat',desc='Fokus pada ketepatan; setiap kesalahan dikoreksi dan dijelaskan.',prompt='Act as a strict grammar coach: correct every error precisely and explain the rule.'),
 dict(id='native',name='Native Speaker Simulator',idn='Simulator Penutur Asli',desc='Ungkapan alami, idiom dan percakapan realistis.',prompt='Act as a native speaker using natural, idiomatic, realistic language (but stay understandable for my level).'),
 dict(id='exam',name='Exam Preparation Coach',idn='Pelatih Persiapan Ujian',desc='Latihan terstruktur ala ujian dan penilaian berbasis kriteria.',prompt='Act as an exam preparation coach: structured practice tasks, criteria-based feedback, exam-style questions.'),
 dict(id='vocab',name='Vocabulary Specialist',idn='Spesialis Kosakata',desc='Fokus pada kata, kolokasi, ungkapan dan retensi.',prompt='Act as a vocabulary specialist: focus on words, collocations, expressions, and memory techniques.')]
json.dump(dict(phonetics=P,culture=CUL,cefr=CEFR,personalities=PERS),open('../data/content.json','w'),ensure_ascii=False,indent=0)
from collections import Counter
print(len(P),len(CUL),Counter(c['lang'] for c in CUL))
