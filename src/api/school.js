const cfg=require('../../set.json')
async function search(req,res){
  const q=req.query.q
  if(!q)return res.json([])
  const url=cfg.neis.schoolInfoUrl+`?KEY=${cfg.apiKey}&Type=json&SCHUL_NM=${encodeURIComponent(q)}`
  const r=await fetch(url)
  const j=await r.json()
  const rows=j.schoolInfo?.[1]?.row||[]
  res.json(rows.map(v=>({
    id:v.SD_SCHUL_CODE,
    edu:v.ATPT_OFCDC_SC_CODE,
    name:`${v.ATPT_OFCDC_SC_NM} ${v.SCHUL_NM}`
  })))
}
module.exports={search}

