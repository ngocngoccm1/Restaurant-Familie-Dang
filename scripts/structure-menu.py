import re,json
from pathlib import Path
text=Path('research/menu-columns.txt').read_text(encoding='utf8')
parts=re.split(r'=== PAGE (\d+) COLUMN (\d+) ===',text)
items=[]
heading=re.compile(r'^(?:VORSPEISEN|SUPPEN|SALAT|GROSSE SUPPEN|HAUPTGERICHTE|SUSHI|NIGIRI \(2 STK\.\)|MAKI \(8 STK\.\)|INSIDE-OUT SUSHI \(8 STK\.\)|FAMILY DANG \(8 STK\.\)|FRITTIERTE MAKI \(8 STK\.\)|GROßE FRITTIERTE|ROLLEN \(6 STK\.\)|SUSHI BOWLS|SASHIMI MIT|ALGENSALAT \(6 STK\.\)|MENÜ FAMILY DANG|BEIM EXTRA:|DESSERTS|SOFTDRINKS|SÄFTE|HAUSGEMACHTE|HAUSGEMACHTER TEE|GETRÄNKE|LASSI|KÄNNCHEN TEE|KAFFEE|COCKTAILS|BIER|WEIßWEINE|ROTWEINE|ROSÉWEIN|SPIRITUOSEN & SAKE|ALLERGENE UND ZUSATZSTOFFE|Bei Allergien wenden Sie|In Garnelen.*|zu 40% aus Wasser|SUSHIIn Garnelen.*)$')
start=re.compile(r'^((?:\d+\.A)|(?:[MAS]?\d+))\.\s*(.+)')
price=re.compile(r'(\d+,\d{2})\s*€')
codes=re.compile(r'\s+([a-oI](?:\s*,\s*(?:[a-oI]|\d+))*|\d+(?:\s*,\s*(?:[a-oI]|\d+))*)$')
def clean(s):return re.sub(r'\s+',' ',s).strip()
def strip_codes(s):
 m=codes.search(s)
 return (s[:m.start()].strip(), re.sub(r'\s','',m[1]).split(',')) if m else (s,[])
def cat(id):
 if id.startswith('M'):return 'Menü Family Dang'
 if id.startswith('S'):return 'Desserts'
 if id.startswith('A'):
  n=int(id[1:]);return ('Softdrinks' if n<=7 else 'Säfte' if n<=14 else 'Hausgemachte Getränke' if n<=21 else 'Lassi' if n<=23 else 'Hausgemachter Tee' if n<=27 else 'Kännchen Tee' if n<=29 else 'Kaffee' if n<=32 else 'Cocktails' if n<=39 else 'Bier' if n<=46 else 'Weißweine' if n<=50 else 'Rotweine' if n==51 else 'Roséwein' if n==54 else 'Spirituosen & Sake')
 n=int(id.split('.')[0]);return 'Vorspeisen' if n<=11 else 'Suppen' if n<=17 else 'Salat' if n<=20 else 'Große Suppen' if n==21 else 'Hauptgerichte' if n<=38 else 'Nigiri' if n<=58 else 'Maki' if n<=77 else 'Inside-out Sushi' if n<=90 else 'Family Dang' if n<=97 else 'Frittierte Maki' if n<=105 else 'Große frittierte Rollen' if n<=113 else 'Sushi Bowls' if n<=121 else 'Sashimi mit Algensalat'
def cents(s):return int(s.replace(',',''))
def make(block,page):
 id=start.match(block[0])[1];raw='\n'.join(block)
 cleaned=[price.sub('',l).strip() for l in block];cleaned[0]=start.match(cleaned[0])[2]
 variants=[];idx=next((i for i,l in enumerate(cleaned) if re.match(r'^[A-Z]\. ',l)),len(cleaned))
 base=cleaned[:idx];head=[];desc=[]
 for l in base:
  l,c=strip_codes(l)
  (head if not desc and (l.upper()==l or not head) else desc).append(l)
 name=clean(' '.join(head));description=clean(' '.join(desc));base_codes=[]
 for l in base:base_codes+=strip_codes(l)[1]
 if idx<len(cleaned):
  groups=[]
  for i in range(idx,len(cleaned)):
   m=re.match(r'^([A-Z])\.\s*(.*)',cleaned[i])
   if m:groups.append({'id':m[1],'lines':[m[2]],'prices':price.findall(block[i])})
   elif groups:groups[-1]['lines'].append(cleaned[i]);groups[-1]['prices']+=price.findall(block[i])
  for g in groups:
   lab,co=strip_codes(clean(' '.join(g['lines'])))
   assert len(g['prices'])==1,(id,g)
   variants.append({'id':g['id'],'label':lab,'priceCents':cents(g['prices'][0]),'priceOriginal':g['prices'][0]+'€','codes':co})
 ps=price.findall(raw)
 entry={'id':id,'number':id,'name':name,'description':description,'category':cat(id),'sourcePage':page,'sourceText':raw,'codes':list(dict.fromkeys(base_codes)),'variants':variants,'priceCents':min(v['priceCents'] for v in variants) if variants else cents(ps[0]),'priceOriginal':(min(variants,key=lambda v:v['priceCents'])['priceOriginal'] if variants else ps[0]+'€'),'spicy':None,'dietary':[]}
 if 'NICHT SCHARF' in name:entry['spicy']='Nicht scharf'
 elif 'MILD SCHARF' in name:entry['spicy']='Mild scharf'
 elif 'leicht scharf' in description:entry['spicy']='Leicht scharf'
 elif '(scharf)' in description:entry['spicy']='Scharf'
 if id=='1':entry['dietary']=['vegetarisch']
 if cat(id) in ['Nigiri','Maki','Inside-out Sushi','Family Dang','Frittierte Maki']:entry['size']='2 Stk.' if cat(id)=='Nigiri' else '8 Stk.'
 if cat(id) in ['Große frittierte Rollen','Sashimi mit Algensalat']:entry['size']='6 Stk.'
 for l in cleaned:
  m=re.search(r'\((\d+) STK\.\)',l)
  if m:entry['size']=m[1]+' Stk.';break
 if id.startswith('A') and len(ps)>1:
  sizes=['0,25 l','0,75 l'] if id=='A1' else ['0,2 l','0,75 l'] if id in ['A48','A49'] else ['0,2 l','0,4 l']
  entry['variants']=[{'id':str(i),'label':s,'priceCents':cents(p),'priceOriginal':p+'€','codes':[]} for i,(s,p) in enumerate(zip(sizes,ps))]
 if id=='A1':entry['optionGroups']=[{'id':'water','label':'Wasser','options':['Still','Sprudel']}]
 if id.startswith('A') and 8<=int(id[1:])<=14:entry['optionGroups']=[{'id':'juice','label':'Serviert als','options':['Saft','Schorle']}]
 if id=='A32':entry['optionGroups']=[{'id':'temperature','label':'Temperatur','options':['Heiß','Kalt']}]
 if id=='A57':entry['optionGroups']=[{'id':'temperature','label':'Temperatur','options':['Kalt','Warm']}]
 if cat(id)=='Vorspeisen':entry['categoryNote']='Alle Speisen werden mit süß-saurer Soße, Fischsoße, Erdnussoße, Unagi-Soße oder Kikkoman-soße serviert.'
 if cat(id) in ['Frittierte Maki','Große frittierte Rollen']:entry['categoryNote']='Mit Unagi-Sauce und Cocktail-Soße.'
 if cat(id)=='Family Dang':entry['categoryNote']='Mit Topping und Saucen.'
 if cat(id)=='Sushi Bowls':entry['categoryNote']='Mit Salat, Algen, Avocado, Süßkartofel, Mango, Unagi-Sauce, Cocktail-Soße, Erdnüsse-Soße & Sushi-Reis. Kennzeichnung der Kategorie: b.'
 return entry
for i in range(1,len(parts),3):
 page=int(parts[i]);col=int(parts[i+1]);lines=[clean(l) for l in parts[i+2].splitlines() if clean(l)]
 if page==1:continue
 block=[]
 for l in lines:
  if start.match(l):
   if block:items.append(make(block,page))
   block=[l]
  elif heading.match(l) or l.startswith('0,') or l.startswith('alle Säfte') or l.startswith('Mit Topping') or l.startswith('mit Unagi-Sauce') or l.startswith('Bei Allergenen'):
   if block:items.append(make(block,page));block=[]
  elif block:block.append(l)
 if block:items.append(make(block,page))
extras=[{'id':'extra-rice','name':'Reis','category':'Beim Extra','priceCents':350,'priceOriginal':'3,50€','sourcePage':5,'group':'main'},{'id':'extra-peanut','name':'Erdnüsse-Soße','category':'Beim Extra','priceCents':300,'priceOriginal':'3,00€','sourcePage':5,'group':'main'},{'id':'extra-hoisin','name':'Hoisin-Soße','category':'Beim Extra','priceCents':300,'priceOriginal':'3,00€','sourcePage':5,'group':'main'},{'id':'extra-dark','name':'Dunkle Soße','category':'Beim Extra','priceCents':300,'priceOriginal':'3,00€','sourcePage':5,'group':'main'},{'id':'extra-cocktail','name':'Cocktail-Soße','category':'Beim Extra','priceCents':200,'priceOriginal':'2,00€','sourcePage':9,'group':'sushi'},{'id':'extra-unagi','name':'Unagi-Soße','category':'Beim Extra','priceCents':200,'priceOriginal':'2,00€','sourcePage':9,'group':'sushi'}]
for x in extras:x.update({'number':'','description':'','codes':[],'variants':[],'dietary':[],'spicy':None,'sourceText':x['name']+' '+x['priceOriginal']})
# A46 is supplied without volume. Preserve rather than guess. Single glass size supplied for A50.
for x in items:
 if x['id']=='A50':x['size']='0,2 l'
 if x['id'] in ['A33','A34','A35','A36','A37','A38','A39','A40','A41','A42','A45','A46','A48','A49','A50','A51','A54','A56','A57']:x['alcohol']=True
items+=extras
payload={'source':'[2026] 21(+). Familie Dang.pdf','currency':'EUR','categories':list(dict.fromkeys(x['category'] for x in items)),'items':items,'notes':['In Garnelen besteht zu 40% aus Wasser','Duftreis wird mit Sesam bestreut, auf Wunsch auch möglich ohne.','Bei Allergien wenden Sie sich bitte an das Personal.'],'allergenLegend':{'a':'Eier','b':'Fische','c':'Schalenkere (Originaltext)','d':'Milch einschließlich Laktose','e':'Sellerie','f':'Sesamsamen','g':'Sulfite','h':'Erdnüsse','i':'Gluten','j':'Lupinen','k':'Schalenfrüchte','I':'Senf','m':'Sojabohnen','n':'Weichkere (Originaltext)','o':'Pilze'},'additiveLegend':{'1':'mit Farbstoff','2':'mit Konservierungstoff','3':'mit AnkoxidakonsmiDel (Originaltext)','4':'mit Geschmacksverstärker','5':'koffeinhalkg geschwätzt (Originaltext)','7':'gewachst','8':'geschwefelt','9':'mit SüßungsmiDel (Originaltext)','10':'mit Phosphat','11':'chininhalkg (Originaltext)'}}
Path('src/data/menu.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2),encoding='utf8')
print(len(items),'items',sum(len(x['variants']) or 1 for x in items),'priced choices',len(payload['categories']),'categories')
for x in items:print(x['id'],x['name'],x['description'],x['codes'],[(v['id'],v['label'],v['priceOriginal'],v['codes']) for v in x['variants']])
