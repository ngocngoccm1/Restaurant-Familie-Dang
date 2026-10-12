from PIL import Image,ImageDraw
from pathlib import Path

def board(pairs,name,width):
 panels=[]
 for left,right,label in pairs:
  imgs=[]
  for path in [left,right]:
   im=Image.open(path).convert('RGB');im=im.resize((width,round(im.height*width/im.width)));imgs.append(im)
  h=max(im.height for im in imgs);panel=Image.new('RGB',(width*2,h+42),'#efdab1');d=ImageDraw.Draw(panel)
  d.text((12,14),label+' | CAY TRE - reference',fill='#352d28');d.text((width+12,14),'FAMILIE DANG - implementation',fill='#352d28')
  panel.paste(imgs[0],(0,42));panel.paste(imgs[1],(width,42));panels.append(panel)
 final=Image.new('RGB',(width*2,sum(im.height for im in panels)),'#efdab1');y=0
 for p in panels:final.paste(p,(0,y));y+=p.height
 final.save('qa/'+name,quality=88)
board([('research/caytre-hero.png','qa/desktop-hero.png','Hero'),('research/caytre-story.png','qa/desktop-story.png','Story / discovery')],'comparison-desktop.jpg',720)
board([('research/caytre-mobile-hero.png','qa/mobile-hero.png','Mobile hero')],'comparison-mobile.jpg',390)
print('Comparison boards saved')
