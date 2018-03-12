import {Db, MongoClient} from 'mongodb'
import  {mongodbUri} from '../credentials' //"mongodb+srv://kay:myRealPassword@cluster0.mongodb.net/test";

const db =(action)=>{
  MongoClient.connect(mongodbUri, (err, client)=> {
    client
  });
}
