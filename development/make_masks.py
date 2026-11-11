from PIL import Image, ImageDraw,ImageFilter
import os,cv2,numpy as np,json
root=os.path.dirname(__file__)
# All coordinates use the 350 × 467 editorial layout.
# Keeping garments separate allows independent Wada colors and surface designs.
poly={
'man-tee-trousers':{
 'top':[[(127,75),(142,69),(151,77),(179,77),(190,70),(214,76),(226,89),(233,125),(210,130),(205,167),(195,177),(143,177),(135,127),(114,125),(121,89)]],
 'bottom':[[(142,168),(205,168),(215,207),(208,268),(194,362),(176,375),(160,364),(153,315),(146,325),(136,265)]],
 'shoes':[[(152,318),(182,318),(188,357),(180,366),(174,379),(181,398),(158,398),(147,364)]],
},
'man-shirt-trousers':{
 'top':[[(130,70),(147,65),(153,74),(186,74),(203,65),(219,71),(228,95),(230,183),(220,199),(207,197),(201,166),(145,169),(143,196),(130,196),(126,177),(124,101)]],
 'bottom':[[(145,165),(206,164),(212,208),(206,263),(197,369),(180,376),(168,368),(160,326),(153,323),(141,266)]],
 'shoes':[[(150,318),(178,318),(184,359),(173,368),(184,400),(157,405),(145,370)]],
},
'man-shirt-jacket-trousers':{
 'top':[[(163,68),(188,68),(199,75),(194,158),(184,163),(159,164),(157,75)]],
 'jacket':[[(129,73),(155,62),(165,80),(163,140),(155,177),(134,198),(129,190),(115,193),(114,129),(124,81)],[(188,80),(198,62),(220,76),(235,109),(230,194),(216,199),(210,184),(195,178),(185,148)]],
 'bottom':[[(140,164),(205,164),(211,211),(200,290),(190,373),(175,378),(163,369),(159,326),(146,330),(140,281)]],
 'shoes':[[(148,312),(175,312),(185,371),(185,405),(156,405)]],
},
'woman-shirt-jacket-skirt-knee':{
 'top':[[(164,71),(187,71),(194,84),(194,130),(160,130),(159,83)]],
 'jacket':[[(143,69),(166,63),(164,83),(160,136),(151,173),(135,182),(124,173),(120,125),(132,85)],[(187,66),(210,69),(226,98),(232,178),(218,187),(198,174),(193,132),(189,80)]],
 'bottom':[[(139,128),(213,128),(218,170),(212,210),(203,254),(173,260),(148,255),(140,205)]],
 'shoes':[[(154,353),(180,386),(181,396),(163,398)],[(173,373),(194,398),(192,412),(172,410)]],
},
'woman-shirt-skirt-knee':{
 'top':[[(145,64),(158,63),(164,72),(189,72),(201,63),(213,72),(225,105),(228,178),(216,183),(207,163),(198,137),(150,137),(139,163),(126,182),(115,178),(121,104)]],
 'bottom':[[(142,129),(207,129),(215,160),(211,206),(202,254),(158,258),(144,229),(139,164)]],
 'shoes':[[(155,353),(175,394),(176,416),(162,419)],[(170,364),(197,414),(196,429),(174,425)]],
},
'woman-tee-skirt-knee':{
 'top':[[(141,65),(157,62),(162,70),(191,70),(207,61),(221,68),(229,88),(210,99),(203,137),(152,139),(147,98),(122,91),(130,72)]],
 'bottom':[[(143,130),(208,130),(218,161),(212,216),(202,255),(157,257),(142,224),(134,164)]],
 'shoes':[[(153,363),(180,409),(180,425),(164,430)],[(171,380),(199,418),(195,436),(175,430)]],
},
'woman-tee-trousers':{
 'top':[[(142,64),(158,60),(164,70),(188,70),(205,61),(220,65),(227,87),(211,94),(205,137),(148,138),(142,94),(123,90),(127,73)]],
 'bottom':[[(146,135),(205,135),(214,174),(206,240),(201,334),(193,366),(179,365),(168,316),(160,357),(148,353),(139,236),(139,176)]],
 'shoes':[[(153,342),(179,368),(181,385),(160,395)],[(170,343),(196,386),(193,405),(169,395)]],
},
'woman-shirt-trousers':{
 'top':[[(145,64),(158,60),(165,72),(188,72),(201,63),(215,71),(226,107),(226,178),(213,183),(204,164),(199,137),(152,137),(140,165),(126,181),(115,177),(123,104)]],
 'bottom':[[(148,132),(202,132),(213,168),(205,252),(195,367),(181,373),(169,326),(161,348),(148,349),(140,261),(140,169)]],
 'shoes':[[(157,351),(182,382),(181,406),(157,416)],[(172,352),(202,400),(199,420),(174,415)]],
}
}

# Main mask shape (near-white non-skin content) is outlined with a small feather;
# the underlying hand-drawn ink is retained and reprinted after tinting.
all_boxes={}
for name,parts in poly.items():
 path=os.path.join(root,'assets','editorial',name+'.png')
 source=cv2.imread(path); h,w=source.shape[:2]
 gray=cv2.cvtColor(source,cv2.COLOR_BGR2GRAY)
 # locate the printed color boxes rather than trusting shared positions
 _,ink=cv2.threshold(gray[1150:],130,255,cv2.THRESH_BINARY_INV)
 cnt,_=cv2.findContours(ink,cv2.RETR_LIST,cv2.CHAIN_APPROX_SIMPLE)
 boxes=[]
 for c in cnt:
  x,y,bw,bh=cv2.boundingRect(c);y+=1150
  if 140<=bw<=175 and 76<=bh<=95:
   if not any(abs(x-v[0])<6 for v in boxes):boxes.append((x,y,bw,bh))
 boxes=sorted(boxes)
 keys=['top','jacket','bottom','shoes'] if 'jacket' in parts else ['top','bottom','shoes']
 assert len(boxes)==len(keys),(name,boxes)
 all_boxes[name]={k:[int(x+4),int(y+4),int(bw-8),int(bh-8)] for k,(x,y,bw,bh) in zip(keys,boxes)}
 for part,shapes in parts.items():
  m=Image.new('L',(350,467),0);d=ImageDraw.Draw(m)
  for points in shapes:d.polygon(points,fill=255)
  m=np.asarray(m.resize((w,h),Image.Resampling.LANCZOS),dtype=np.uint8)
  # Avoid skin and background color: all colored surfaces are near-neutral whites.
  # Using an interior polygon keeps ink, hair and skin untouched.
  b,g,r=cv2.split(source)
  neutral=np.minimum(np.minimum(r,g),b).astype('float32')
  chroma=np.maximum.reduce([r,g,b]).astype('float32')-neutral
  light=np.clip((neutral-85)/145,0,1)
  neutrality=np.clip((26-chroma)/18,0,1)
  alpha=(m.astype('float32')*light*neutrality*0.9).astype('uint8')
  alpha=cv2.GaussianBlur(alpha,(3,3),0.6)
  cv2.imwrite(os.path.join(root,'assets','editorial',name+'-'+part+'-mask.png'),alpha)
with open(os.path.join(root,'assets','editorial','masks.json'),'w') as f:json.dump(all_boxes,f)
print('Generated masks',sum(len(x) for x in poly.values()),'swatch maps',len(all_boxes))
for name in poly:
 p=os.path.join(root,'assets','editorial',name+'.png')
 im=cv2.imread(p)
 h,w=im.shape[:2];b,g,r=cv2.split(im)
 r,g,b=[v.astype(np.int16) for v in [r,g,b]]
 # skin: human warm hue, not the near-white cloth, and only within the figure area
 skin=((r-g>9)&(g-b>3)&(r>110)&(r<255)&(g>80)&(g<231)&(b>55)&(b<225))
 yy,xx=np.ogrid[:h,:w];skin&=(yy<1200)&(xx>270)&(xx<800)
 # soften the skin-only tint without affecting garment areas
 m=cv2.GaussianBlur((skin.astype('uint8')*255),(3,3),0.5)
 cv2.imwrite(os.path.join(root,'assets','editorial',name+'-skin-mask.png'),m)
 # black/brown hair is at the top of the image, outside the body and blouse
 woman=name.startswith('woman')
 hair=((r<165)&(g<155)&(b<150)&(r>=g-2)&(g>=b-6))
 hair &= (yy < (630 if woman else 250)) & (yy > 20)
 hair &= (xx>(340 if woman else 430))&(xx<(740 if woman else 660))
 # prevent eye/skin recoloring: apply mainly in the dark hair mass
 hair &= ((r<105) | ((r-g)>6))
 hm=cv2.GaussianBlur((hair.astype('uint8')*255),(3,3),0.5)
 cv2.imwrite(os.path.join(root,'assets','editorial',name+'-hair-mask.png'),hm)
