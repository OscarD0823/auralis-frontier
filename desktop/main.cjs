const {app,BrowserWindow,shell,protocol,net,session}=require('electron');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
protocol.registerSchemesAsPrivileged([{scheme:'auralis',privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}}]);
let window;
const externalAllowed=href=>{try{const u=new URL(href);return u.protocol==='https:'&&['github.com','oscard0823.github.io'].includes(u.hostname);}catch{return false;}};
app.whenReady().then(()=>{
  const root=path.resolve(__dirname,'../dist');
  protocol.handle('auralis',request=>{
    const url=new URL(request.url);let relative;
    try{relative=decodeURIComponent(url.pathname);}catch{return new Response('Bad request',{status:400});}
    if(url.hostname!=='game')return new Response('Forbidden',{status:403});
    const target=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));
    if(!target.startsWith(root+path.sep))return new Response('Forbidden',{status:403});
    return net.fetch(pathToFileURL(target).href);
  });
  session.defaultSession.setPermissionRequestHandler((_wc,_p,cb)=>cb(false));
  window=new BrowserWindow({width:1440,height:940,minWidth:800,minHeight:600,show:!process.argv.includes('--smoke-test'),title:'Auralis Frontier',backgroundColor:'#14252d',icon:path.join(__dirname,'../dist/icon-512.png'),autoHideMenuBar:true,webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}});
  window.webContents.setWindowOpenHandler(({url})=>{if(externalAllowed(url))shell.openExternal(url);return {action:'deny'};});
  window.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith('auralis://game/')){event.preventDefault();if(externalAllowed(url))shell.openExternal(url);}});
  window.loadURL('auralis://game/');
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)app.relaunch();});
