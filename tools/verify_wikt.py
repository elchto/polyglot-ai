import re, json, os, sys, urllib.request, urllib.parse, concurrent.futures as cf, unicodedata
V='vocab'
concepts=[l.split('|') for l in open(f'{V}/concepts.txt') if not l.startswith('#') and l.strip()]
TITLE={c[0]:c[3] for c in concepts}
TITLE.update({'rice':'rice','chicken':'chicken','station':'train station','old':'old','phone':'telephone','go':'go','come':'come','eat':'eat','drink':'drink','see':'see','speak':'speak','understand':'understand','buy':'buy','sleep':'sleep','read':'read','write':'write','learn':'learn','help':'help','love':'love',
 'p_howareyou':'how are you','p_myname':'my name is','p_nicemeet':'nice to meet you','p_dontunderstand':"I don't understand",'p_slowly':'please speak more slowly','p_speakenglish':'do you speak English','p_toilet':'where is the toilet','p_howmuch':'how much','p_bill':'check, please','p_coffeeplease':'','p_wherestation':'','p_help':'help','p_dontknow':"I don't know",'p_seeyoutomorrow':'see you tomorrow','p_whatisthis':'what is this','p_welcome':"you're welcome"})
for i,w in enumerate('one two three four five six seven eight nine ten'.split()): TITLE[f'n{i+1}']=w
CODES={'it':['it'],'es':['es'],'fr':['fr'],'de':['de'],'pt':['pt'],'nl':['nl'],'sv':['sv'],'nb':['nb','no'],'da':['da'],'pl':['pl'],'ru':['ru'],'ar':['ar'],'tr':['tr'],'hi':['hi'],'ms':['ms'],'vi':['vi'],'ja':['ja'],'ko':['ko'],'zh':['cmn'],'th':['th']}
os.makedirs('wikt',exist_ok=True)
def fetch(title):
    out=''
    for t in [title+'/translations', title]:
        fn='wikt/'+urllib.parse.quote(t,safe='')+'.txt'
        if os.path.exists(fn): out+=open(fn).read(); continue
        u='https://en.wiktionary.org/w/index.php?'+urllib.parse.urlencode({'title':t,'action':'raw'})
        try:
            r=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'polyglot-ai-verifier/1.0 (personal study app)'}),timeout=30).read().decode()
        except Exception as e: r=''
        open(fn,'w').write(r); out+=r
    return out
titles=sorted(set(t for t in TITLE.values() if t))
with cf.ThreadPoolExecutor(6) as ex: pages=dict(zip(titles, ex.map(fetch,titles)))
tre=re.compile(r'\{\{tt?\+?\|([a-z-]+)\|([^|}]+)')
def trans(page):
    d={}
    for code,w in tre.findall(page): d.setdefault(code,set()).add(w.strip())
    return d
TR={t:trans(p) for t,p in pages.items()}
ART=r"^(il |lo |la |l'|i |gli |le |les |el |los |las |un |une |o |a |os |as |der |die |das |de |het |een )"
from opencc import OpenCC
_cc=OpenCC('t2s')
def norm(s,lang=''):
    s=s.replace('[[','').replace(']]','')
    if lang in ('ar','ru'):
        s=''.join(ch for ch in unicodedata.normalize('NFD',s) if unicodedata.category(ch)!='Mn' or ch in '\u0306\u0308')
        s=s.replace('ٱ','ا').replace('أ','ا').replace('إ','ا').replace('آ','ا')
    if lang=='zh': s=_cc.convert(s)
    s=unicodedata.normalize('NFC',s).lower().strip()
    s=re.sub(r'[\[\]]','',s); s=re.sub(ART,'',s); s=re.sub(r"[.!?¿¡？！。,、…]+",'',s).strip()
    return s
res={}
for f in sorted(os.listdir(V)):
    if f=='concepts.txt': continue
    lang=f[:-4]; ok=miss=nodata=0; bad=[]
    for line in open(f'{V}/{f}'):
        if '=' not in line: continue
        k,rest=line.rstrip('\n').split('=',1); word=rest.split('|')[0]
        t=TITLE.get(k)
        cands=set()
        for c in CODES[lang]: cands|=TR.get(t,{}).get(c,set()) if t else set()
        if not cands: nodata+=1; res.setdefault(lang,{})[k]='nodata'; continue
        nw=norm(word,lang); nc={norm(c,lang) for c in cands}
        hit = nw in nc or any(nw and (nw in c or c in nw) for c in nc if len(c)>1)
        if hit: ok+=1; res.setdefault(lang,{})[k]='ok'
        else: miss+=1; res.setdefault(lang,{})[k]='mismatch'; bad.append((k,word,sorted(cands)[:8]))
    print(f'== {lang}: ok {ok}, mismatch {miss}, no-wikt-data {nodata}')
    for b in bad: print('   ',b)
json.dump(res,open('wikt_check.json','w'),ensure_ascii=False,indent=0)
