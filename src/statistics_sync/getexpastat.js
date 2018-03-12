import EXPA from '../wrapper.js'

import {expaCredential} from "../credentials" 

const expa = EXPA(expaCredential.login, expaCredential.password)

const getLCs= expa.get('https://gis-api.aiesec.org/v2/committees/1618.json')
.then((response) =>  response.suboffices.filter(f => !f.name.includes('Closed')).map(u =>({
                        id:u.id,
                        name:u.name
                      })))
.catch(console.log);

const getStatistics= (startDate,endDate,program,type)=>expa.get('https://gis-api.aiesec.org/v2/applications/analyze.json',{
  "basic[home_office_id]":1618,
"basic[type]":type,
"end_date":endDate,
"programmes[]":program,
"start_date":startDate
})
.then((response) => ({
  program:program,
  type:type,
  facts:response.analytics.children.buckets}))
.catch(console.log);

export {getLCs,getStatistics}