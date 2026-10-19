// Lossless release transport: signed/native files are reconstructed byte for byte.
import fs from 'node:fs';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';
const [baseFile,targetFile,baseAsset]=process.argv.slice(2);if(!baseFile||!targetFile||!baseAsset)throw Error('Usage: node scripts/release-delta.mjs BASE TARGET BASE_ASSET');
const base=fs.readFileSync(baseFile),target=fs.readFileSync(targetFile),sha=b=>createHash('sha256').update(b).digest('hex');
let seed=984573;const gear=Array.from({length:256},()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return seed|0;});
function* chunks(buf){for(let start=0;start<buf.length;){let h=0,end=Math.min(buf.length,start+2048),limit=Math.min(buf.length,start+16384);for(;end<limit;end++){h=(h<<1)+gear[buf[end]]|0;if((h&4095)===0){end++;break;}}yield[start,end];start=end;}}
const index=new Map();for(const[a,b]of chunks(base))index.set(sha(base.subarray(a,b)),[a,b-a]);const commands=[],literal=[];let offset=0,copied=0;
for(const[a,b]of chunks(target)){const bytes=target.subarray(a,b),match=index.get(sha(bytes));if(match){commands.push([0,...match]);copied+=bytes.length;}else{commands.push([1,offset,bytes.length]);literal.push(bytes);offset+=bytes.length;}}
const meta={version:1,name:targetFile.split(/[\\/]/).at(-1),baseAsset,baseSha256:sha(base),sha256:sha(target),size:target.length,commands},header=Buffer.from(JSON.stringify(meta)),size=Buffer.alloc(4);size.writeUInt32LE(header.length);const out=targetFile+'.auralis-delta.gz';fs.writeFileSync(out,gzipSync(Buffer.concat([size,header,...literal]),{level:9}));console.log(JSON.stringify({out,bytes:fs.statSync(out).size,copied,target:target.length,sha256:meta.sha256}));
