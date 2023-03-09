import axios from "axios";
export const  getNormalisedStockSdCagrValues = ()=>{
const url = "http://localhost:3000/normalisedStock/get-normalised-data"
return axios.get(url).then((data)=>{
    if(data.data){
        return {status:"sucess", data: data.data}
    }
    else{
        return {status:"error"}
    }
})

}