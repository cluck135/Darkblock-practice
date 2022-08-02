import { useEffect } from "react"

export default function WhiteList({collections, setCollections}) {

  let collectionList = []

  const kalamintContractAddress = "KT1EpGgjQs73QfFJs9z7m1Mxm5MTnpC2tqse"
  const hackedBMAccount = "tz1RH8gwbXe4PBTNrJzCDLuhDnDJw8ck5tm6"
  const apiCollectionNames = `https://api.tzkt.io/v1/accounts/${hackedBMAccount}/operations?entrypoint=mint`

  const getCollections = async () => {
  
    //console.log("LOADING YOUR API2 CALL")
    const res = await fetch(apiCollectionNames);
    //console.log(res);
    const data = await res.json()
    console.log(data)
    for(let i = 0; i<data.length-1; i++){
      let dup = 0
      const collection = data[i].parameter.value.name
      if(collectionList.length > 0) {
        for(let k = 0; k<collectionList.length; k++){ 
          if(Object.values(collectionList[k]).includes(`${collection}`)) {
            dup = 1
          }
        }
        if (dup == 0) {
          collectionList.push({"collectionName": `${collection}`})          
        }
      } else {
        collectionList.push({"collectionName": `${collection}`})
      }
    }
    collectionList.forEach(object => {
      object.holders = [];
    });
    setCollections(collectionList)
  }

  const getHolders = async () => {
    console.log("LOADING YOUR API CALL")
    collectionList = collections

    for(let i = 0; i<collections.length; i++){
      
    const apiHolders = `https://api.tzkt.io/v1/tokens/balances?token.contract=${kalamintContractAddress}&token.metadata.name=${collections[i].collectionName}&balance=1&account.ne=${hackedBMAccount}`;

    const res = await fetch(apiHolders);
    //console.log(res);
    const data = await res.json()
    console.log(`${collections[i].collectionName}`)
    console.log(data);

    for(let k = 0; k<data.length; k++) {
      let index = collectionList.findIndex(e => e.collectionName === `${collections[i].collectionName}`);
      collectionList[index].holders = [...collectionList[index].holders, [`${data[k].account.address}`] ]
    }
    }
    setCollections(collectionList)
}

useEffect( () => {
  const fetchData = async () => {
    await getCollections();
    await getHolders()
  }

  fetchData()
  .catch(console.error);;
}, []);

  return (
    <div className=" bg-slate-600 flex justify-center h-fit p-10 m-10 rounded-xl">
      
        {collections.map(item => {
          return(
            <ul >
              <li>{item.collectionName}</li>
              <li>{item.holders.map(item => item)}</li>
            </ul>
          )
        })}
    </div>
  )



}