"""Reconstruct local, already signed release bytes; verify both base and target."""
import gzip,json,hashlib,pathlib,urllib.request,struct,sys,collections
ROOT='https://github.com/OscarD0823/auralis-frontier/releases/download/v0.9.0/'
ALLOWED={'Auralis-Frontier-Android.apk','Auralis-Frontier-Windows-Setup.exe','Auralis-Design-Standard-v1.zip','Auralis-Design-Standard-v2.zip'}
def digest(b): return hashlib.sha256(b).hexdigest()
groups=collections.defaultdict(list)
for source in sys.argv[1:]:
    source=pathlib.Path(source);base,separator,part=source.name.partition('.part-')
    groups[base].append((int(part) if separator else 0,source))
for pieces in groups.values():
    pieces.sort()
    if [i for i,_ in pieces]!=list(range(len(pieces))): raise ValueError('Incomplete transfer')
    raw=gzip.decompress(b''.join(p.read_bytes() for _,p in pieces));n=struct.unpack('<I',raw[:4])[0]
    if n>5000000: raise ValueError('Oversize manifest')
    m=json.loads(raw[4:4+n]);literal=raw[4+n:]
    if m['version']!=1 or m['name'] not in ALLOWED or m['baseAsset'] not in ALLOWED or not 0<m['size']<250000000: raise ValueError('Invalid release recipe')
    basePath=pathlib.Path('baseline')/m['baseAsset'];basePath.parent.mkdir(exist_ok=True)
    if not basePath.exists(): urllib.request.urlretrieve(ROOT+m['baseAsset'],basePath)
    base=basePath.read_bytes()
    if digest(base)!=m['baseSha256']: raise ValueError('Baseline checksum mismatch')
    result=bytearray()
    for mode,offset,size in m['commands']:
        if mode not in (0,1) or offset<0 or size<1 or size>16384: raise ValueError('Invalid copy instruction')
        data=base if mode==0 else literal
        if offset+size>len(data) or len(result)+size>m['size']: raise ValueError('Copy bounds exceeded')
        result.extend(data[offset:offset+size])
    if len(result)!=m['size'] or digest(result)!=m['sha256']: raise ValueError('Reconstructed artifact checksum mismatch')
    pathlib.Path(m['name']).write_bytes(result)
    print(m['name'],len(result),'verified SHA-256',m['sha256'],flush=True)
