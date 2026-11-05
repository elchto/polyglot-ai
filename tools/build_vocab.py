import json,os
V='vocab'
chk=json.load(open('wikt_check.json'))
concepts=[l.rstrip('\n').split('|') for l in open(f'{V}/concepts.txt') if not l.startswith('#') and l.strip()]
C={c[0]:dict(key=c[0],topic=c[1],pos=c[2],en=c[3],id=c[4]) for c in concepts}
out={'concepts':list(C.values()),'langs':{}}
for f in sorted(os.listdir(V)):
    if f=='concepts.txt': continue
    lang=f[:-4]; items=[]
    for line in open(f'{V}/{f}'):
        line=line.rstrip('\n')
        if '=' not in line: continue
        k,rest=line.split('=',1); p=(rest.split('|')+['',''])[:3]
        st=chk.get(lang,{}).get(k,'nodata')
        items.append(dict(k=k,w=p[0].strip(),r=p[1].strip(),n=p[2].strip(),v='wikt' if st=='ok' else 'manual'))
    out['langs'][lang]=items
out['langs']['en']=[dict(k=c['key'],w=c['en'],r='',n='',v='base') for c in C.values()]
idn={'goodbye':'formal: selamat tinggal (yang pergi) / selamat jalan (yang tinggal)','please':'tolong = minta bantuan; silakan = mempersilakan','p_coffeeplease':'lebih formal: Saya pesan satu kopi.','gnight':'selamat malam = salam; selamat tidur = sebelum tidur'}
out['langs']['id']=[dict(k=c['key'],w=c['id'],r='',n=idn.get(c['key'],''),v='base') for c in C.values()]
json.dump(out,open('../data/vocab.json','w'),ensure_ascii=False,separators=(',',':'))
print({k:len(v) for k,v in out['langs'].items()}, sum(1 for l in out['langs'].values() for i in l if i['v']=='wikt'))
