import { combineReducers } from 'redux'
import { GET_USERS,UPDATE_MASTER_CLASSES,UPDATE_USER,ERROR,GET_USER,GET_USERS_EMAILS,ADD_USER, INCREMENT_MASTER_CLASS, CHANGE_REGISTRATION_STATE, DECREMENT_MASTER_CLASS} from './actions'
function combineReducer(state={},action){
  switch(action.type){
    case UPDATE_MASTER_CLASSES:
    return Object.assign({},state, { masterclasses:action.masterclasses})
    case UPDATE_USER,CHANGE_REGISTRATION_STATE,INCREMENT_MASTER_CLASS,DECREMENT_MASTER_CLASS:
    return Object.assign({},state, { response:action.response})
    case GET_USER:
    return Object.assign({},state, {user:action.user})
    case GET_USERS:
    return Object.assign({},state, {users:action.users})
    case ADD_USER:
    return Object.assign({},state, {user:action.user,response:action.response})
    case GET_USERS_EMAILS:
    return Object.assign({},state,{emails:action.emails})
    case ERROR:
    return Object.assign({},state,{error:action.error})
    default:
    return state
  }
}

const redusers = combineReducers({combineReducer})
export default redusers  
