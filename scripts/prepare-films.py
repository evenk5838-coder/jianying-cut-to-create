#!/usr/bin/env python3
"""Build website-specific edits from separately obtained licensed originals.
Source pages, license restrictions and exact trims: docs/MEDIA_LICENSES.md.
No original stock files or private soundtrack are downloaded by this script.
"""
import argparse,pathlib,subprocess,json,hashlib,concurrent.futures
parser=argparse.ArgumentParser();parser.add_argument('--sources',type=pathlib.Path,required=True);parser.add_argument('--ffmpeg',required=True);parser.add_argument('--only',nargs='*');args=parser.parse_args()
root=pathlib.Path(__file__).resolve().parents[1];out=root/'public/media';out.mkdir(exist_ok=True);D=args.sources;F=args.ffmpeg

def run(a):subprocess.run([F,'-hide_banner','-loglevel','error',*a],check=True)
def enc(name,audio=False):return ['-c:v','libx264','-preset','medium','-crf','23','-maxrate','4200k','-bufsize','8400k','-pix_fmt','yuv420p','-movflags','+faststart','-threads','3',*(['-c:a','aac','-b:a','128k'] if audio else ['-an']),'-y',str(out/(name+'.mp4'))]
def variants(name):
 # A dedicated portrait crop saves decoding invisible parts of a landscape frame.
 src=out/(name+'.mp4')
 run(['-i',str(src),'-vf','crop=ih*9/16:ih:(iw-ow)/2:0,scale=720:1280,fps=24',*enc(name+'-mobile',name=='speech')])
 run(['-ss','0.1','-i',str(src),'-frames:v','1','-vf','scale=1600:-2','-c:v','libwebp','-quality','85','-y',str(out/(name+'-poster.webp'))])
def make(name):
 if name=='earth':
  run(['-ss','8','-t','11','-i',str(D/'earth-source.mp4'),'-vf','crop=3408:1920:216:120,hflip,vflip,scale=1920:1080,fps=24',*enc('earth')])
 elif name=='city':
  a=[]
  for file,start,duration in [('tokyo',1,5),('street',1,5),('city',1,5)]:a+=['-ss',str(start),'-t',str(duration),'-i',str(D/(file+'-source.mp4'))]
  filters=';'.join(f'[{i}:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,fps=24,setpts=PTS-STARTPTS[v{i}]' for i in range(3))+';[v0][v1][v2]concat=n=3:v=1:a=0[out]'
  run([*a,'-filter_complex',filters,'-map','[out]',*enc('city')])
 elif name=='speech':
  # The original AAC is decoded and re-encoded together with its matching picture.
  run(['-ss','0','-t','15.35','-i',str(D/'speech-source.mp4'),'-vf','crop=1608:904:0:0,scale=1608:904,setsar=1,fps=30',*enc('speech',True)])
 elif name=='finale':
  order=['earth','nature','fashion','speech','city','future'];a=[]
  for n in order:a+=['-ss','0','-t','3','-i',str(out/(n+'.mp4'))]
  filters=';'.join(f'[{i}:v]scale=1920:1080,setsar=1,fps=24,setpts=PTS-STARTPTS[v{i}]' for i in range(6))+';'+''.join(f'[v{i}]' for i in range(6))+'concat=n=6:v=1:a=0,fade=t=out:st=17:d=1[out]'
  run([*a,'-filter_complex',filters,'-map','[out]',*enc('finale')])
 else:
  duration={'nature':10,'fashion':9,'future':10}[name]
  run(['-ss','0','-t',str(duration),'-i',str(D/(name+'-source.mp4')),'-vf','scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,fps=24',*enc(name)])
 variants(name);print(name,'ready',flush=True)
selected=args.only or ['earth','nature','fashion','speech','city','future','finale']
for name in selected:make(name)
entries=[{'file':p.name,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(out.iterdir()) if p.suffix in ['.mp4','.webp']]
(root/'docs/qa/media-files.json').write_text(json.dumps(entries,indent=2))
