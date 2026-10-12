import json,pymupdf as fitz
from PIL import Image
from pathlib import Path
idx=json.load(open('research/image-index.json'))
assets={2089:'sushi-table',2073:'sushi-bowls',1981:'pho',2043:'maki',1953:'summer-rolls',1956:'edamame',2057:'signature-roll',2199:'sushi-selection',2092:'sushi-closeup',2125:'ginger-tea',2114:'house-drinks',2131:'vietnamese-coffee',2147:'sake',2026:'bun-nem',2023:'wok',2097:'mochi'}
manifest=[]
for x in idx:
 if x['xref'] not in assets:continue
 name=assets[x['xref']];im=Image.open(x['path']).convert('RGB');im.thumbnail((1440,1440));im.save(f'public/images/{name}.webp','WEBP',quality=86,method=6)
 if im.width>=700:
  small=im.copy();small.thumbnail((720,900));small.save(f'public/images/{name}-small.webp','WEBP',quality=82,method=6)
 manifest.append({'asset':f'/images/{name}.webp','sourceDocument':'[2026] 21(+). Familie Dang.pdf','page':x['page'],'embeddedImageXref':x['xref'],'type':'client-supplied menu illustration','licenseStatus':'supplied for this project; original photo licenses need client confirmation before publication','width':im.width,'height':im.height,'bytes':Path(f'public/images/{name}.webp').stat().st_size})
Path('research/asset-manifest.json').write_text(json.dumps(manifest,indent=2))
doc=fitz.open('[2026] 21(+). Familie Dang.pdf');doc.delete_page(0);doc.rewrite_images(dpi_threshold=160,dpi_target=140,quality=82);doc.save('public/speisekarte.pdf',garbage=4,deflate=True)
print('Images:',len(manifest),'Total webp bytes:',sum(x['bytes'] for x in manifest))
