
import {db, fromDb } from '../databaseConfig'

export const INCREMENT_MASTER_CLASS = 'INCREMENT_MASTER_CLASS'
export const DECREMENT_MASTER_CLASS = 'DECREMENT_MASTER_CLASS'
export const ERROR= 'ERROR'
export const GET_USER = 'GET_USER'
export const GET_USERS = 'GET_USERS'
export const GET_USERS_EMAILS = 'GET_USERS_EMAILS'
export const UPDATE_USER = 'UPDATE_USER'
export const UPDATE_MASTER_CLASSES = 'UPDATE_MASTER_CLASSES'
export const UPDATE_USERS = 'UPDATE_USERS'
export const ADD_USER = 'ADD_USER'
export const CHANGE_REGISTRATION_STATE ='CHANGE_REGISTRATION_STATE'

export const getUsersEmails= async ()=>{
  const emails = await db.ref('Users').once('value',(data)=>data).catch(console.log)
  let emails_=[]
  emails.forEach((child)=>{
    emails_.push(child.val()['emailAddress'])
  })
  return {type:GET_USERS_EMAILS,emails:emails_}
}
export const getUserByMail= async email=>{
  const user= await db.ref('Users').orderByChild('emailAddress').equalTo(email).once('value',(data)=>data)
  if(user.val()){
    const user_=Object.assign(user.val()[Object.keys(user.val())[0]],{key:Object.keys(user.val())[0]})
    return {type:GET_USER, user:user_ }
  }
  else
    return {type:ERROR, error:'Пользователь не найден'}
}

export const updateUser= async user=> {
  const response= await db.ref('Users/'+user.key).set(user)
  return {type:UPDATE_USER,response:response}
}
export const getUser= async userId=>{
  const user=await db.ref('Users/'+userId).once('value',(data)=>data).catch(console.log)
  
  return {type:GET_USER, user:user.val() }
}


//This is so strange method
export const userCheckIn = async (user,time, masterClassId,masterClassName, dispatch)=>{
  const date =(new Date()).toLocaleDateString('ru').split('.').join('')
  const prop ={}
  prop[masterClassId]=masterClassName
  if(user[date]&&user[date][time]){
    if(user[date][time]===prop)
      return;
    else
      dispatch(await decrementMasterClassAttendee(Object.keys(user[date][time])[0]))
  }else{
    if(!user[date]) user[date]={}
    if(!user[date][time]) user[date][time]={}
  }
    user[date][time]=prop
    dispatch(await incrementMasterClassAttendee(masterClassId))
    dispatch(await updateUser(user))
    dispatch(await getMasterClassesForUser(date,user.section))
}


export const incrementMasterClassAttendee =async id=>{
  const attends=await db.ref(`MasterClasses/${id}/attends`).once('value', data=>data)
  const response = await db.ref(`MasterClasses/${id}/attends`).set(attends.val()+1)
  return{type:INCREMENT_MASTER_CLASS, response:response}       
}                          
export const decrementMasterClassAttendee =async id=>{
  const attends=await db.ref(`MasterClasses/${id}/attends`).once('value', data=>data)
  const response = await db.ref(`MasterClasses/${id}/attends`).set(attends.val()-1)
  return {type:DECREMENT_MASTER_CLASS, response: response}
} 
export const getMasterClasses = async () =>{
  const masterclasses=await db.ref('MasterClasses').once('value',(data)=>data).catch(console.log)
  
  return updateMasterClasses(masterclasses.val())
} 
export const getMasterClassesForUser = async (date,section) =>{
  const masterclasses=await db.ref(`MasterClasses`).once('value',(data)=>data).catch(console.log)
  return updateMasterClasses(Object.values(masterclasses.val()).filter(f=>f.date===date&&(!f.section||f.section===section)).reduce((res,next)=>{res[next.time]?res[next.time].push(next):res[next.time]=[next];return res},[]))
}

export const updateMasterClasses= (masterclasses) =>({type:UPDATE_MASTER_CLASSES,masterclasses})
export const updateUsers= (users) =>({type:UPDATE_USERS,users})
export const trowError = (error)=> ({type:ERROR, error:error}) 

export const addUser = async (user)=>{
  const response = await db.ref('Users/'+user.id).set(user)
  return{type:ADD_USER,user:user, response:response }
}


export const changeRegistrationState=async (id, state) => {
  const response = await db.ref(`MasterClasses/${id}/isBlocked`).set(!state)
  console.log(response)
  return {type:CHANGE_REGISTRATION_STATE, response:response }
} 
export const getUsers = async()=>{
  const users= await db.ref('Users').once('value',(data)=>data).catch(console.log)
  return {type:GET_USERS, users:users.val()}
}