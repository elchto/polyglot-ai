from PIL import Image, ImageDraw, ImageFilter
import math
def make(size, maskable=False):
    S=size*4
    im=Image.new("RGBA",(S,S),(7,10,26,255))
    g=Image.new("RGBA",(S,S),(0,0,0,0)); d=ImageDraw.Draw(g)
    for i in range(60):
        r=int(S*0.55*(1-i/60)); d.ellipse([S*0.35-r,S*0.35-r,S*0.35+r,S*0.35+r],fill=(124,58,237,min(int(4+i*1.2),90)))
    for i in range(60):
        r=int(S*0.45*(1-i/60)); d.ellipse([S*0.7-r,S*0.72-r,S*0.7+r,S*0.72+r],fill=(59,130,246,min(int(3+i),70)))
    g=g.filter(ImageFilter.GaussianBlur(S//20)); im.alpha_composite(g)
    d=ImageDraw.Draw(im)
    sc=0.78 if maskable else 1.0
    cx=cy=S/2; R=S*0.30*sc; w=int(S*0.026)
    col=(196,181,253,255); col2=(147,197,253,255)
    for yy in (-0.5,0.5):
        hw=R*math.sqrt(1-yy*yy)-w*0.8; d.line([cx-hw,cy+yy*R,cx+hw,cy+yy*R],fill=col,width=w)
    d.line([cx-R+w*0.5,cy,cx+R-w*0.5,cy],fill=col2,width=w)
    for k in (0.45,0.85): d.ellipse([cx-R*k,cy-R,cx+R*k,cy+R],outline=col,width=w)
    d.line([cx,cy-R,cx,cy+R],fill=col,width=w)
    d.ellipse([cx-R,cy-R,cx+R,cy+R],outline=col,width=w)
    rr=S*0.05*sc; px,py=cx+R*0.95,cy-R*0.95
    d.ellipse([px-rr,py-rr,px+rr,py+rr],fill=(167,139,250,255))
    return im.resize((size,size),Image.LANCZOS).convert("RGB")
for n,s,m in [("icon-192",192,False),("icon-512",512,False),("maskable-512",512,True),("apple-touch-icon",180,False),("favicon-32",32,False)]:
    make(s,m).save(f"icons/{n}.png",optimize=True)
