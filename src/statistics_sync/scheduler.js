import {getLCs,  getStatistics  } from "./getexpastat"
import {updateLCs,updateStatistics} from "./updatedbstat"

getLCs.then(updateLCs);

const years=[2017,2018];
const months = [1,2,3,4,5,6,7,8,9,10,11,12];
const firstDayOfMonth=(year,month)=>new Date(year,month,1);
const lastDayOfMonth = (year, month)=>new Date(year,month,-1);

const types=["person","opportunity"]
const programs={1:"GV",2:"GT",5:"GE"}

years.forEach(year=>{
  months.forEach(month=>{
    const startDate=firstDayOfMonth(year,month);
    const lastDate=lastDayOfMonth(year,month);
    types.forEach(type=>{
      Object.keys(programs).forEach(program=>{
        getStatistics(startDate,lastDate,program,type).then(expaStat=>{
          expaStat.month=month;
          expaStat.year=year;
          updateStatistics(expaStat);
        });
      });
    });
  });
});