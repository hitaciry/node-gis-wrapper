import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'



const loggerMiddleware = createLogger()
const storeConfig = ()=>{
 return createStore(
            reducers,
            applyMiddleware(
              thunkMiddleware, // lets us dispatch() functions
              loggerMiddleware // neat middleware that logs actions
            )
)
}
export default storeConfig ;