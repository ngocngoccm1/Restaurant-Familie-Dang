import fitz,json,os
from PIL import Image,ImageOps,ImageDraw
os.makedirs('research/pdf-pages',exist_ok=True)
os.makedirs('research/pdf-images',exist_ok=True)
doc=fitz.open('[2026] 21(+). Familie Dang.pdf')
thumbs=[]; imgs=[]; out=[]
for i,page in enumerate(doc):
 pix=page.get_pixmap(matrix=fitz.Matrix(1.25,1.25)); pix.save(f'research/pdf-pages/page-{i+1:02}.png')
 im=Image.open(f'research/pdf-pages/page-{i+1:02}.png').convert('RGB');im.thumbnail((298,421));thumbs.append(im)
 for col,(x0,x1) in enumerate([(0,302),(302,page.rect.width)]):
  text=page.get_text('text',clip=fitz.Rect(x0,0,x1,page.rect.height),sort=True)
  out.append(f'\n=== PAGE {i+1} COLUMN {col+1} ===\n{text}')
 if i==0:continue
 for info in page.get_images(full=True):
  xref=info[0]
  if any(x['xref']==xref for x in imgs):continue
  pix=fitz.Pixmap(doc,xref)
  if pix.width<200 or pix.height<150:continue
  if pix.n>4:pix=fitz.Pixmap(fitz.csRGB,pix)
  path=f'research/pdf-images/p{i+1}-x{xref}.png';pix.save(path)
  imgs.append({'page':i+1,'xref':xref,'path':path,'width':pix.width,'height':pix.height})
open('research/menu-columns.txt','w',encoding='utf8').write('\n'.join(out))
open('research/image-index.json','w').write(json.dumps(imgs,indent=2))
sheet=Image.new('RGB',(298*4,450*3),'#ddd');d=ImageDraw.Draw(sheet)
for i,im in enumerate(thumbs):sheet.paste(im,((i%4)*298,(i//4)*450));d.text(((i%4)*298+10,(i//4)*450+423),f'Page {i+1}',fill='black')
sheet.save('research/all-pages.jpg')
w=240; h=200
sheet=Image.new('RGB',(w*4,h*((len(imgs)+3)//4)),'#eee');d=ImageDraw.Draw(sheet)
for i,x in enumerate(imgs):
 im=Image.open(x['path']).convert('RGB');im.thumbnail((w,h-25));sheet.paste(im,((i%4)*w,(i//4)*h));d.text(((i%4)*w+5,(i//4)*h+h-23),f"p{x['page']}-x{x['xref']} {x['width']}x{x['height']}",fill='black')
sheet.save('research/image-contact-sheet.jpg');print('Pages:',len(doc),'Images:',len(imgs))
