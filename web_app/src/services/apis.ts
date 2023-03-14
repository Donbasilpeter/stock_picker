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


export const  getSelectedStockData = (selectedStock:number)=>{
    const url = "http://localhost:3000/normalisedStock/get-stock-data"
    const data = {scripcode:selectedStock}
    return axios.get(url,{params:data}).then((data:any)=>{
        if(data.data[0]){
            return {status:"sucess", data: data.data[0]}
        }
        else{
            return {status:"error"}
        }
    })
    
    }

    export const  searchStockList = (searchType: string,searchField:number|string)=>{
        const url = "http://localhost:3000/normalisedStock/search-stock-list"
        const data = {searchType: searchType,searchField:searchField}
        return axios.get(url,{params:data}).then((data:any)=>{
            if(data.data[0]){
                return {status:"sucess", data: data.data}
            }
            else{
                return {status:"error"}
            }
        })
        
        }

    export const  generatePF =  (selectedStocks:number[])=>{
        const url = "http://localhost:3000/normalisedStock/generate-portfolio"
        return  axios.post(url,{data:{scripcodeArray:selectedStocks}}).then((data:any)=>{

            if(data.data){
                return {status:"sucess", data: data.data}
            }
            else{
                return {status:"error"}
            }
        })
        
        }