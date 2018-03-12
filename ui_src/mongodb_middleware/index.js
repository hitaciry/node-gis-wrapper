import {  mongodbUri }  from "../../src/credentials.js"
import {Db, MongoClient} from 'mongodb'

const db =(action)=>{
  MongoClient.connect(mongodbUri, (err, client)=> {
    client
    action(client);
  });
}
export {url}