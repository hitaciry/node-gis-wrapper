import {v4} from 'node-uuid'
const task_id1=v4()
const task_id2=v4() 
const db ={
  goals:{
    [task_id1]:{
      name:'opens',
      plans:10,
      fact:5
    },
    [task_id2]:{
      name: 'approves',
      plans: 8,
      fact: 3 
    }
  },
  
}