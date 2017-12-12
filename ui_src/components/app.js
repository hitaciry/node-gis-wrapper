
import GetQRCodeForm from './get_qr_code_form'
import RegistrationForm from'./registration_form'
import CheckInForm from './check_in_form'
import ErrorHandler from './error_handler'
import ResponseHandler from './response_handler'
import Dashboard from './dashboard'
import UsersTable from './usersTable'
import MasterClassTable from './masterClassTable'
import {Link,Route, BrowserRouter,Switch } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import React from 'react'

const App = store=>{
console.log(store)
return(
     <MuiThemeProvider><div>
        <ErrorHandler />
        {store.respoce&&<ResponseHandler responce={store.responce} />}
        {/* Tell the Router to use our enhanced history */} 
        <BrowserRouter > 
            <Switch>       
            <Route path="/getqrcode" component={GetQRCodeForm}/>
            <Route path="/registration" component={RegistrationForm}/>
            <Route path="/checkin/:userId" component={CheckInForm}/>
            <Route exact path="/dashboard" render={({ history}) =><Dashboard history={history}><p>Select tab</p></Dashboard>}/>
            <Route exact path='/dashboard/users' render={({ history}) =><Dashboard history={history}><UsersTable/></Dashboard>}/>
            <Route exact path='/dashboard/masterclass' render={({ history}) =><Dashboard history={history}><MasterClassTable/></Dashboard>} />
            <Route exact path="/">
                {
                // <ul>
                //     <li><Link to="/getqrcode" >qr code</Link></li>
                //     <li><Link to="/registration">registration</Link></li>
                //     <li><Link to="/checkin/(:userId)">check in</Link></li>
                //     <li><Link to="/dashboard" >dashboard</Link></li>
                // </ul>
                }
            </Route>
            </Switch>
        </BrowserRouter></div>
    </MuiThemeProvider>
)}
export default App