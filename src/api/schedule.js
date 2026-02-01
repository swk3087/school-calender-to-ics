const cfg=require('../../set.json')
async function get(req,res){
  const {schoolId,edu,year}=req.query
  if(!schoolId||!edu||!year)return res.json([])
  const url=cfg.neis.scheduleUrl+`?KEY=${cfg.apiKey}&Type=json&ATPT_OFCDC_SC_CODE=${edu}&SD_SCHUL_CODE=${schoolId}&AY=${year}`
  const r=await fetch(url)
  const j=await r.json()
  const rows=j.SchoolSchedule?.[1]?.row||[]
  res.json(rows)
}
module.exports={get}

