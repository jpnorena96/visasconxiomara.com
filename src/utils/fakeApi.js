export async function loginApi(email,password){
  if(email==='admin@xiomara.com' && password==='admin123') return { ok:true, user:{ name:'Admin', role:'admin', email } }
  if(email && password) return { ok:true, user:{ name:'Cliente', role:'client', email } }
  return { ok:false, message:'Credenciales inválidas' }
}
export async function uploadFilesApi(files){
  await new Promise(r=>setTimeout(r,600)); return { ok:true, uploaded: files.map(f=>({ name:f.name, size:f.size })) }
}
