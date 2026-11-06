/*
Adapted from michxlai/stickman (vendor/stickman), MIT.
MIT License

Copyright (c) 2026 michxlai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
// Only static set painters are ported; no 2D engine state or DOM canvas lookup.
import {rng} from './lib3d.js';
const W=1920;
export const DOOR={L:2170,R:2470,T:130,B:640,C:2320};
const XA=-900,XB=3700;
export function cafeOutside(x){let g=x.createLinearGradient(0,-300,0,640);g.addColorStop(0,'#3F3480');g.addColorStop(.5,'#7A56A0');g.addColorStop(.8,'#C96BB0');g.addColorStop(1,'#FF8F7A');x.fillStyle=g;x.fillRect(-1600,-1200,7000,1900);const r=rng(3);let px=-1600;x.fillStyle='#7D4C93';while(px<5400){const bw=70+r()*120,bh=140+r()*240;x.fillRect(px,640-bh,bw,bh);px+=bw}x.fillStyle='rgba(255,226,160,.8)';for(let i=0;i<300;i++)x.fillRect(-1600+r()*7000,300+r()*320,6,8);x.fillStyle='#2C2346';x.fillRect(-1600,600,7000,1500)}
export function cafeWall(x){const D=DOOR;let g=x.createLinearGradient(0,-300,0,640);g.addColorStop(0,'#3F2860');g.addColorStop(1,'#62407F');x.fillStyle=g;x.fillRect(XA,-900,XB-XA,1560);x.fillStyle='#2F9A98';x.fillRect(XA,440,XB-XA,210);x.fillStyle='#237F80';x.fillRect(XA,440,XB-XA,14);x.strokeStyle='rgba(15,60,62,.45)';x.lineWidth=5;for(let i=-5;i<20;i++)x.strokeRect(-60+i*196,476,160,140);
 x.save();x.globalCompositeOperation='destination-out';x.fillRect(120,130,900,270);x.fillRect(1180,130,800,270);x.fillRect(D.L,D.T,D.R-D.L,D.B-D.T);x.restore();
 x.strokeStyle='#3B2352';x.lineWidth=18;x.strokeRect(120,130,900,270);x.strokeRect(1180,130,800,270);x.lineWidth=11;for(const lx of [420,720,1447,1713]){x.beginPath();x.moveTo(lx,130);x.lineTo(lx,400);x.stroke()}x.fillStyle='#3B2352';x.fillRect(100,400,940,16);x.fillRect(1160,400,840,16);
 x.strokeStyle='#2A1838';x.lineWidth=26;x.beginPath();x.moveTo(D.L-13,D.B);x.lineTo(D.L-13,D.T-13);x.lineTo(D.R+13,D.T-13);x.lineTo(D.R+13,D.B);x.stroke();
 for(const p of [[2600,190,170,210,'#F6B73C'],[2800,190,170,210,'#E4493F'],[-240,190,170,210,'#2DB2AE']]){x.fillStyle='#2A1838';x.fillRect(p[0]-10,p[1]-10,p[2]+20,p[3]+20);x.fillStyle=p[4];x.fillRect(p[0],p[1],p[2],p[3]);x.fillStyle='rgba(50,24,60,.5)';x.fillRect(p[0],p[1]+p[3]*.62,p[2],p[3]*.38)}}
export function streetSky(x,sun=0){let g=x.createLinearGradient(0,-300,0,680);g.addColorStop(0,'#3F3480');g.addColorStop(.42,'#7A56A0');g.addColorStop(.72,'#C96BB0');g.addColorStop(.9,'#FF8F7A');g.addColorStop(1,'#FFC66E');x.fillStyle=g;x.fillRect(-500,-500,W+1000,1400);
 x.fillStyle=`rgba(52,40,92,${.62-.42*sun})`;for(const c of [[300,120,620,70],[1100,70,760,84],[1750,190,560,60],[650,250,520,46],[1450,300,470,40]]){x.beginPath();x.ellipse(c[0],c[1],c[2],c[3],0,0,7);x.fill()}
 g=x.createRadialGradient(1120,620,10,1120,620,820);g.addColorStop(0,`rgba(255,240,190,${.25+.75*sun})`);g.addColorStop(.3,`rgba(255,200,130,${.12+.6*sun})`);g.addColorStop(1,'rgba(255,160,120,0)');x.fillStyle=g;x.fillRect(-500,-500,W+1000,1400);
 const sk=(col,base,seed,hmax)=>{const r=rng(seed);x.fillStyle=col;let px=-420;while(px<W+420){const bw=60+r()*110,bh=60+r()*hmax;x.fillRect(px,base-bh,bw,bh+300);px+=bw}};sk('#B26AA6',640,3,170);sk('#7D4C93',650,5,230);
 x.fillStyle='rgba(255,230,160,.8)';const r2=rng(9);for(let i=0;i<70;i++)x.fillRect(-300+r2()*2500,430+r2()*210,5,7)}
export function streetBuildings(x){x.fillStyle='#4C2D63';x.fillRect(-260,150,860,560);x.fillStyle='#2F9A98';x.fillRect(-240,500,820,210);x.fillStyle='#237F80';x.fillRect(-240,500,820,14);
 let g=x.createLinearGradient(0,240,0,620);g.addColorStop(0,'#FFD08A');g.addColorStop(1,'#FF9B62');x.fillStyle=g;x.fillRect(-190,250,720,380);x.strokeStyle='#3B2352';x.lineWidth=16;x.strokeRect(-190,250,720,380);x.lineWidth=11;for(const lx of [50,290]){x.beginPath();x.moveTo(lx,250);x.lineTo(lx,630);x.stroke()}
 for(const lx of [-60,170,410]){x.strokeStyle='#3B2352';x.lineWidth=4;x.beginPath();x.moveTo(lx,250);x.lineTo(lx,320);x.stroke();x.fillStyle='#8A4A3A';x.beginPath();x.moveTo(lx-34,362);x.lineTo(lx-10,320);x.lineTo(lx+10,320);x.lineTo(lx+34,362);x.closePath();x.fill()}
 x.fillStyle='rgba(90,40,70,.75)';x.beginPath();x.arc(190,500,34,0,7);x.fill();x.fillRect(150,534,80,96);x.fillRect(60,590,270,12);
 x.fillStyle='#E4493F';x.beginPath();x.moveTo(-230,250);x.lineTo(570,250);x.lineTo(610,190);x.lineTo(-270,190);x.closePath();x.fill();x.fillStyle='rgba(255,240,220,.7)';for(let i=0;i<9;i++){x.beginPath();x.moveTo(-200+i*90,250);x.lineTo(-155+i*90,250);x.lineTo(-150+i*93,190);x.lineTo(-200+i*93,190);x.closePath();x.fill()}
 x.fillStyle='#4A3274';x.fillRect(1320,60,1000,660);x.fillStyle='#39255E';x.fillRect(1320,60,20,660);const r=rng(21);for(let j=0;j<3;j++)for(let i=0;i<5;i++){const wx=1400+i*170,wy=130+j*170,on=r()<.55;x.fillStyle=on?'#FFC87E':'#2E2050';x.fillRect(wx,wy,92,118);x.fillStyle='#2A1838';x.fillRect(wx+43,wy,6,118);x.fillRect(wx-6,wy+118,104,9)}
 x.fillStyle='#2F7F86';x.fillRect(1340,600,1000,120);x.strokeStyle='rgba(15,50,60,.4)';x.lineWidth=3;for(let i=0;i<9;i++){x.beginPath();x.moveTo(1340,612+i*12);x.lineTo(2340,612+i*12);x.stroke()}
 const lx=980;x.fillStyle='#2A1838';x.fillRect(lx-5,240,10,480);x.fillRect(lx-5,240,70,8);x.beginPath();x.moveTo(lx+36,246);x.lineTo(lx+104,246);x.lineTo(lx+94,262);x.lineTo(lx+46,262);x.closePath();x.fill();g=x.createLinearGradient(0,262,0,700);g.addColorStop(0,'rgba(255,214,150,.3)');g.addColorStop(1,'rgba(255,200,130,0)');x.fillStyle=g;x.beginPath();x.moveTo(lx+46,262);x.lineTo(lx+94,262);x.lineTo(lx+260,720);x.lineTo(lx-120,720);x.closePath();x.fill()}
