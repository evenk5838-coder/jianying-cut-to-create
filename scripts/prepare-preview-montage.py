"""Build only the unapproved review montage; never replaces public/media/finale*."""
import argparse, subprocess
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--ffmpeg',default='ffmpeg');a=p.parse_args()
root=Path(__file__).resolve().parents[1]/'public/review-media'
cmd=[a.ffmpeg,'-y','-v','error','-filter_complex_threads','1']
for name in ['human','coast','montage-city','architecture']:cmd+=['-i',str(root/(name+'.mp4'))]
filters=';'.join(f'[{i}:v]trim=start=1:duration=4.8,setpts=PTS-STARTPTS,setsar=1,fps=25,format=yuv420p[v{i}]' for i in range(4))
filters+=';[v0][v1]xfade=transition=fade:duration=0.32:offset=4.48[a];[a][v2]xfade=transition=fade:duration=0.32:offset=8.96[b];[b][v3]xfade=transition=fade:duration=0.32:offset=13.44,fade=t=in:st=0:d=0.32,fade=t=out:st=17.69:d=0.55[out]'
cmd+=['-filter_complex',filters,'-map','[out]','-an','-map_metadata','-1','-c:v','libx264','-preset','fast','-crf','20','-threads','2','-movflags','+faststart',str(root/'montage.mp4')]
subprocess.run(cmd,check=True)
subprocess.run([a.ffmpeg,'-y','-v','error','-ss','1.4','-i',str(root/'montage.mp4'),'-frames:v','1','-vf','scale=960:-2',str(root/'montage.jpg')],check=True)
print('Review montage ready. Await user approval before changing the main experience.')
