import  firebase from 'firebase'

const config ={
  apiKey: "AIzaSyCU13mNT73uE-s9-Yv1zB5yaXorwlxWlR0",
  authDomain: "youlead-registration.firebaseapp.com",
  databaseURL: "https://youlead-registration.firebaseio.com"
}
export const db = firebase.database(firebase.initializeApp(config))

export const fromDb = (_db=db, dispatch, actionCreator,path) =>
                db.ref(path).on('value', data => data.val() && dispatch(actionCreator(data.val())))
              