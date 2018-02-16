import {Db, MongoClient} from 'mongodb'
import  uri from '../credential.json' //"mongodb+srv://kay:myRealPassword@cluster0.mongodb.net/test";

const db =(action)=>{
  MongoClient.connect(uri, function(err, client) {
    action(client);
    client.close();
  });
}

const updateLCs =(LCs)=>{
  db((client)=>{
    
  })
}