const fetch=require('node-fetch')
const cfg=require('../../set.json')
function ymdToDate(s){
  return new Date(Date.UTC(
    Number(s.slice(0,4)),
    Number(s.slice(4,6))-1,
    Number(s.slice(6,8))
  ))
}
function fmt(d){
  const y=d.getUTCFullYear()
  const m=String(d.getUTCMonth()+1).padStart(2,'0')
  const da=String(d.getUTCDate()).padStart(2,'0')
  return `${y}${m}${da}`
}
async function make(req,res){
  const {schoolId,edu,year,excludeWeekend}=req.query
  if(!schoolId||!edu||!year)return res.status(400).end()
  const url=cfg.neis.scheduleUrl+`?KEY=${cfg.apiKey}&Type=json&ATPT_OFCDC_SC_CODE=${edu}&SD_SCHUL_CODE=${schoolId}&AY=${year}`
  const r=await fetch(url)
  const j=await r.json()
  let rows=j.SchoolSchedule?.[1]?.row||[]
  if(excludeWeekend){
    rows=rows.filter(v=>{
      const d=ymdToDate(v.AA_YMD)
      const g=d.getUTCDay()
      return g!==0&&g!==6
    })
  }
  const out=[]
  out.push('BEGIN:VCALENDAR')
  out.push('VERSION:2.0')
  out.push('PRODID:-//neis-ics//KR')
  rows.forEach(v=>{
    const start=ymdToDate(v.AA_YMD)
    const end=new Date(start.getTime())
    end.setUTCDate(end.getUTCDate()+1)
    out.push('BEGIN:VEVENT')
    out.push('SUMMARY:'+v.EVENT_NM)
    out.push('DTSTART;VALUE=DATE:'+fmt(start))
    out.push('DTEND;VALUE=DATE:'+fmt(end))
    out.push('END:VEVENT')
  })
  out.push('END:VCALENDAR')
  res.setHeader('Content-Type','text/calendar; charset=utf-8')
  res.setHeader('Content-Disposition','attachment; filename="school.ics"')
  res.send(out.join('\r\n'))
}
module.exports={make}

