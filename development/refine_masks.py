import cv2,numpy as np,os
root=os.path.join(os.path.dirname(__file__),'assets','editorial')
# Calibrated seeds, chosen inside *closed cloth regions* in the original editorial art.
# Using connected light regions prevents the color spilling across black ink into the page.
seeds={
 'man-tee-trousers':{'top':(225,[(150,111),(217,115)]),'bottom':(225,[(160,195)])},
 'man-shirt-trousers':{'top':(205,[(170,114)]),'bottom':(215,[(157,215),(192,200)])},
 'man-shirt-jacket-trousers':{'top':(215,[(177,115)]),'jacket':(215,[(148,160),(198,145)]),'bottom':(215,[(158,214),(192,226)])},
 'woman-shirt-jacket-skirt-knee':{'top':(205,[(170,105)]),'jacket':(205,[(147,110),(198,160)]),'bottom':(205,[(172,191)])},
 'woman-shirt-skirt-knee':{'top':(205,[(166,95),(183,100)]),'bottom':(205,[(171,190)])},
 'woman-tee-skirt-knee':{'top':(205,[(172,95)]),'bottom':(205,[(166,199)])},
 'woman-tee-trousers':{'top':(205,[(172,102)]),'bottom':(215,[(159,185),(190,204)])},
 'woman-shirt-trousers':{'top':(215,[(168,107),(213,146)]),'bottom':(225,[(155,180),(190,250)])},
}
for name,parts in seeds.items():
 src=cv2.imread(f'{root}/{name}.png')
 gray=cv2.cvtColor(cv2.resize(src,(350,467)),cv2.COLOR_BGR2GRAY)
 h,w=src.shape[:2]
 for part,(threshold,points) in parts.items():
  kernel=3 if name=='woman-shirt-skirt-knee' and part=='top' else 2
  permitted=cv2.erode((gray>threshold).astype('uint8'),np.ones((kernel,kernel),np.uint8));_,labels,stats,_=cv2.connectedComponentsWithStats(permitted)
  mask=np.zeros((467,350),dtype='uint8');count=0
  for x,y in points:
   idx=labels[y,x]
   x0,y0,bw,bh,area=stats[idx]
   # Reject the paper background and any component touching the image edges.
   if idx==0 or area>10000 or x0<25 or y0<20 or x0+bw>330 or y0+bh>420 or area<55:
    print('BAD SEED',name,part,(x,y),stats[idx].tolist());continue
   mask=np.maximum(mask,(labels==idx).astype('uint8')*255);count+=1
  if count==0:continue
  # Close small breaks around button-plackets, then approach the linework but not beyond.
  mask=cv2.morphologyEx(mask,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
  mask=cv2.dilate(mask,np.ones((3,3),np.uint8),iterations=1)
  mask=cv2.GaussianBlur(mask,(3,3),.5)
  hi=cv2.resize(mask,(w,h),interpolation=cv2.INTER_LINEAR)
  # Opaque fabric whites are strongly colored, black ink remains from the base bitmap.
  b,g,r=cv2.split(src);lum=(.114*b+.587*g+.299*r).astype('float32')
  ink=np.clip((lum-70)/130,0,1)
  chroma=np.maximum.reduce([b,g,r]).astype('float32')-np.minimum.reduce([b,g,r]).astype('float32')
  neutral=np.clip((26-chroma)/18,0,1)
  hi=(hi.astype('float32')*ink*neutral*.96).astype('uint8')
  cv2.imwrite(f'{root}/{name}-{part}-mask.png',hi)
  print('OK',name,part,round(hi.sum()/255), 'pixels')
 # Shoes: only closed light regions within the actual illustrated footwear.
 # Earlier broad polygons tinted the paper under the shoes; component tracing removes it.
 shoe=f'{root}/{name}-shoes-mask.png'
 allowed=cv2.erode((gray>225).astype('uint8'),np.ones((2,2),np.uint8));_,ids,stats,_=cv2.connectedComponentsWithStats(allowed)
 foot=np.zeros((467,350),dtype='uint8')
 for label in range(1,len(stats)):
  x0,y0,bw,bh,area=stats[label]
  if 8<=bw<=38 and 6<=bh<=55 and 22<=area<=650 and 138<x0<211 and 321<y0<419:
   foot=np.maximum(foot,(ids==label).astype('uint8')*255)
 foot=cv2.dilate(foot,np.ones((3,3),np.uint8),iterations=1)
 hi=cv2.resize(foot,(w,h),interpolation=cv2.INTER_LINEAR)
 cv2.imwrite(shoe,hi)
 if name=='man-tee-trousers':
  # Remove the raised sneaker from the right edge of the trousers mask.
  p=f'{root}/{name}-bottom-mask.png';bm=cv2.imread(p,0)
  bm[int(327*h/467):int(374*h/467),:int(165*w/350)]=0
  cv2.imwrite(p,bm)
