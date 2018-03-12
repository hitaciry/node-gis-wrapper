import {Db, MongoClient} from 'mongodb'
import  {mongodbUri} from '../credentials' //"mongodb+srv://kay:myRealPassword@cluster0.mongodb.net/test";

const db =(action)=>{
  MongoClient.connect(mongodbUri, (err, client)=> {
    client
    action(client);
  });
}

const updateLCs =(LCs)=>{
  db((client)=>{
    
    let dbLCs=client.collection("LC");
    LCs.forEach(element => {
      dbLCs.updateOne({id:element.id},element,{upsert:true});
    });
    client.close();
  })
}

const updateStatistics =(Statistics)=>{
  db(client=>{
    let dbStatistics=client.collection("Statistics");
      if(Statistics.plan)
        dbStatistics.updateOne({
          type:Statistics.type,
          year:Statistics.month,
          month:Statistics.year,
          program:Statistics.program,
        },{
          $set:{plans:Statistics.plans}},{upsert:true});
      if(Statistics.facts)
        dbStatistics.updateOne({
          type:Statistics.type,
          year:Statistics.month,
          month:Statistics.year,
          program:Statistics.program,
        },{
          $set:{facts:Statistics.facts}},{upsert:true});
          client.close();
    });
}

export  {updateLCs,updateStatistics}