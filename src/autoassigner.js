import EXPA from './wrapper'
//import * as serviceAccount from "db.json"
import firebase from "firebase"

const login = 'a.shitikov90@gmail.com'
const password = 'hitaciry90'

const config = {
  apiKey: "7OlVhkAn0Q5NDiUeuK50MXhTCt9hqn7hRvSV5vyI",
  authDomain: "bot-db-935c6.firebaseapp.com",
  databaseURL: "https://bot-db-935c6.firebaseio.com"
}
const db = firebase.database(firebase.initializeApp(config))

const expa = EXPA(login, password)

const newLC = async () => {
  const date = new Date()
  console.log('start')
  const dbData = db.ref('LC').once('value', (data) => data).then(data => {
    data = data.val() 
    console.log(Object.keys(data))
    Object.keys(data).forEach(async (k) => {
      console.log(`start for ${k}`)
      const all_ep = await expa.get('https://gis-api.aiesec.org/v2/people.json', {
        'filters[home_committee]': k,
        'per_page': 10000
      }).then(response=>response.data)
      console.log(`all ep for ${data[k].name} - ${all_ep.length}`)
      const team = await expa.get(`https://gis-api.aiesec.org/v2/teams/${data[k].ogx_group_id}/positions.json`).then(resp=>resp.data)
      console.log('team',team)
      const tl_id = team.filter(f=>f.role==='Team Leader').id
      const team_members_ids = team.filter(f=>f.role!=='Team Leader').reduce((last, cur)=>last.push(cur.id),[])
      let ep_per_member_count = all_ep.reduce((last, current)=>{
        if(current.managers){
          current.managers.foreach(f=>{
            if(team_members_ids.includes(f.id)){
              last[team_members_ids.indexOf(f.id)]++
            }
          })
        }
        return last
      },new Array(team_members_ids.length))
      //member with min number of EPs
      const today_ep= all_ep.filter(f=>f.created_at.slice(0, 10) === date.toJSON().slice(0, 10)
                                     &&f.managers.length===0)
      for (const ep in today_ep){
        const min_index=ep_per_member_count.indexOf( Math.min(...ep_per_member_count))
        const assign_candidate =team_members_ids[min_index]
        ep_per_member_count[min_index]++
        const result =await expa.patch('https://gis-api.aiesec.org/v2/people.json',{
          person:{
            "manager_ids":[tl_id,assign_candidate]
          }
        })

      }
      console.log('done')
    })
  })
}

newLC()