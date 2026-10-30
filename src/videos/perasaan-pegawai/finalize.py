"""Normalize AAC and shorten only the final video frame, preserving all narration."""
from fractions import Fraction
import json
from pathlib import Path
import subprocess

ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'out/videos/perasaan-pegawai'
MASTER=OUT/'render-master.mp4'
FINAL=OUT/'perasaan-pegawai.mp4'
DURATION=Fraction('94.28')
RATE=24000
FPS=30
FRAMES=-(-DURATION.numerator*FPS//DURATION.denominator)
LAST_TICKS=int((DURATION-Fraction(FRAMES-1,FPS))*RATE)


def run(args):
    p=subprocess.run([str(a) for a in args],cwd=ROOT,capture_output=True,text=True)
    if p.returncode: raise RuntimeError(p.stderr)
    return p


def measure(path):
    p=run(['ffmpeg','-hide_banner','-nostats','-i',path,'-af',
        'loudnorm=I=-14:TP=-1:LRA=11:print_format=json','-f','null','-'])
    decoder=json.JSONDecoder()
    for i,c in enumerate(p.stderr):
        if c!='{': continue
        try:
            obj,_=decoder.raw_decode(p.stderr[i:])
            if 'input_i' in obj: return float(obj['input_i']),float(obj['input_tp'])
        except json.JSONDecodeError: pass
    raise RuntimeError('No loudness summary')


def main():
    probe=json.loads(run(['ffprobe','-v','error','-select_streams','v:0','-show_entries',
        'stream=nb_frames,has_b_frames','-of','json',MASTER]).stdout)['streams'][0]
    assert int(probe['nb_frames'])==FRAMES
    assert probe['has_b_frames']==0, 'Exact last-frame timing requires non-reordered packets'
    initial_i,initial_tp=measure(MASTER)
    gain=-14-initial_i
    passes=[]
    for attempt in range(3):
        af=f'volume={gain:.3f}dB,aresample=192000,alimiter=limit=0.7943:level=false:attack=2:release=60,aresample=48000,atrim=end={float(DURATION)}'
        bsf=f"setts=time_base=1/{RATE}:prescale=1:duration='if(eq(N,{FRAMES-1}),{LAST_TICKS},DURATION)'"
        run(['ffmpeg','-y','-v','error','-i',MASTER,'-map','0:v:0','-map','0:a:0',
            '-c:v','copy','-bsf:v',bsf,'-video_track_timescale',RATE,'-movie_timescale',RATE,
            '-af',af,'-c:a','aac','-b:a','192k','-t',float(DURATION),'-movflags','+faststart',FINAL])
        measured_i,measured_tp=measure(FINAL)
        passes.append({'pass':attempt+1,'gain_db':gain,'lufs':measured_i,'true_peak_dbtp':measured_tp})
        if abs(measured_i+14)<=0.1: break
        gain+=-14-measured_i
    assert abs(measured_i+14)<=0.2
    assert measured_tp<=-1
    metadata=json.loads(run(['ffprobe','-v','error','-show_entries','stream=duration,nb_frames:format=duration',
        '-of','json',FINAL]).stdout)
    assert abs(float(metadata['format']['duration'])-float(DURATION))<0.001
    report={'master_input_lufs':initial_i,'master_input_tp':initial_tp,'normalization_passes':passes,
        'frames':FRAMES,'last_frame_ticks':LAST_TICKS,'video_timebase':f'1/{RATE}',
        'narration_retimed':False,'exact_duration_seconds':float(DURATION),'probe':metadata}
    (OUT/'normalization-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report,indent=2))


if __name__=='__main__': main()
