import React from 'react'
import { Provider } from 'react-redux'
import storeConfig from '../storeConfig.js'
import App from './app'

const store = storeConfig()
store.dispatch({type:null})
const Root = ()=>{
  return <Provider store={store}>  
            <App store={store.getState().combineReducer}/> 
         </Provider>
}
export default Root