"""Read-only final media QA, plus sampled frames and a machine-readable report."""
import hashlib
import json
from pathlib import Path
import subprocess
import numpy as np

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'out/videos/perasaan-pegawai'
MOVIE = OUT / 'perasaan-pegawai.mp4'
DURATION = 94.28


def command(args):
    result = subprocess.run([str(a) for a in args], cwd=ROOT, capture_output=True)
    if result.returncode:
        raise RuntimeError(result.stderr.decode(errors='replace'))
    return result


def decode_audio(path):
    result = command(['ffmpeg','-v','error','-i',path,'-vn','-ac','1','-ar','48000','-f','f32le','-'])
    return np.frombuffer(result.stdout,dtype='<f4').astype(np.float64)


def main():
    probe = json.loads(command(['ffprobe','-v','error','-count_frames','-show_entries',
        'stream=codec_name,width,height,r_frame_rate,avg_frame_rate,duration,nb_read_frames,time_base:format=duration,size',
        '-of','json',MOVIE]).stdout)
    command(['ffmpeg','-v','error','-i',MOVIE,'-f','null','-'])
    loud = command(['ffmpeg','-hide_banner','-nostats','-i',MOVIE,'-af',
        'loudnorm=I=-14:TP=-1:LRA=11:print_format=json','-f','null','-']).stderr.decode(errors='replace')
    decoder = json.JSONDecoder()
    metrics = None
    for i,c in enumerate(loud):
        if c != '{': continue
        try:
            obj,_ = decoder.raw_decode(loud[i:])
            if 'input_i' in obj: metrics=obj
        except json.JSONDecodeError: pass
    if metrics is None: raise RuntimeError('No loudness measurement')
    source = ROOT / 'perasaan-pegawai.wav'
    copied = ROOT / 'public/videos/perasaan-pegawai/narration.wav'
    same_narration = hashlib.sha256(source.read_bytes()).digest() == hashlib.sha256(copied.read_bytes()).digest()
    reference = decode_audio(copied)
    exported = decode_audio(MOVIE)
    correlations=[]
    for start,end in [(0,5),(40,45),(89,DURATION)]:
        a,b=round(start*48000),round(end*48000)
        x,y=reference[a:b],exported[a:b]
        assert len(x)==len(y), 'Narration tail missing'
        correlations.append({'start':start,'end':end,'correlation':float(np.corrcoef(x,y)[0,1])})
    times=[0.1,15.5,28.5,53.5,67.2,74.2,91.3,93.9]
    images=[]
    for i,t in enumerate(times):
        image=OUT / f'final-{i:02d}.png'
        command(['ffmpeg','-y','-v','error','-ss',t,'-i',MOVIE,'-frames:v','1','-vf','scale=360:640',image])
        images.append(image)
    listing=OUT / 'final-frames.txt'
    listing.write_text('\n'.join(f"file '{str(f).replace(chr(92),'/')}'" for f in images),encoding='utf-8')
    command(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',listing,'-vf','tile=4x2:padding=6:color=0x111827',
        '-frames:v','1',OUT/'final-contact.png'])
    listing.unlink()
    report={'movie':str(MOVIE),'probe':probe,'loudnorm_input':metrics,'full_decode':True,
        'source_narration_byte_identical':same_narration,'narration_correlations':correlations,
        'sampled_frame_times':times,'sampled_frames_reviewed':False,'audio_listened':False,
        'size_mib':MOVIE.stat().st_size/1024**2,'duration_error_seconds':float(probe['format']['duration'])-DURATION}
    (OUT/'final-qa.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report,indent=2))
    video=next(s for s in probe['streams'] if s['codec_name']=='h264')
    assert video['width']==1080 and video['height']==1920
    assert any(s['codec_name']=='aac' for s in probe['streams'])
    assert abs(report['duration_error_seconds']) < 0.001, 'Final duration must match narration exactly'
    assert abs(float(metrics['input_i'])+14)<=0.2
    assert float(metrics['input_tp'])<=-1
    assert same_narration and min(c['correlation'] for c in correlations)>0.96


if __name__=='__main__': main()
