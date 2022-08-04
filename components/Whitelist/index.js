import { useEffect } from "react"

export default function WhiteList({collections, setCollections}) {
  let collectionList = []

  const kalamintContractAddress = "KT1EpGgjQs73QfFJs9z7m1Mxm5MTnpC2tqse"
  const BMAccount = "tz1RH8gwbXe4PBTNrJzCDLuhDnDJw8ck5tm6"
  const apiCollectionNames = `https://api.tzkt.io/v1/accounts/${BMAccount}/operations?entrypoint=mint`

  const getCollections = async () => {
  
    console.log("LOADING YOUR API CALL")
    const res = await fetch(apiCollectionNames);
    console.log(res);
    if(res.ok){
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
    if(collectionList.length != 0 && collectionList[0].holders.length != 0) {
      setCollections(collectionList)
    }
    console.log(collections)
    await getHolders()
    }
  }

  const getHolders = async () => {
    let cutOffDate = 1659358800
    console.log("LOADING YOUR HOLDER CALL")
    let dup = 0
    for(let i = 0; i<collectionList.length; i++){
      
    const apiHolders = `https://api.tzkt.io/v1/tokens/balances?token.contract=${kalamintContractAddress}&token.metadata.name=${collectionList[i].collectionName}&balance=1&account.ne=${BMAccount}`;

    const res = await fetch(apiHolders);
    console.log(res);
    if(res.ok){
    const data = await res.json()
    console.log(`${collectionList[i].collectionName}`)
    console.log(data);
    for(let k = 0; k<data.length; k++) {
      dup = 0
      let index = collectionList.findIndex(e => e.collectionName === `${collectionList[i].collectionName}`);
      const holdingDate = new Date((data[k].lastTime.split("T"))[0]);
      const unixTimeStamp = Math.floor(holdingDate.getTime() / 1000);
      // console.log(unixTimeStamp)
      // console.log(cutOffDate)
      
      const holder = data[k].account.address
      if(data.length-1 >= collectionList[index].holders.length) {
          if(collectionList[index].holders.length > 0) {
              // if(collectionList[index].holders.includes(`${holder}`)) {
              //   dup = 1
              // }
              // if (dup == 0) {
                if(unixTimeStamp < cutOffDate) {
                  collectionList[index].holders = [...collectionList[index].holders, `${data[k].account.address}`];
                }      
              //}
          } else {
            if(unixTimeStamp < cutOffDate) {
              collectionList[index].holders = [...collectionList[index].holders, `${data[k].account.address}`];
            }
          }
        }
      }
    }
  }
  setCollections([...collections, collectionList])
  console.log("COLLECTIONS")

  sendToFile();
}

const sendToFile = () => {
try {
  fs.writeFileSync('../../data/text.txt', collectionList);
  // file written successfully
} catch (err) {
  console.error(err);
}

}
useEffect( () => {
  const fetchData = async () => {
    await getCollections();
  }
  fetchData()
  .catch(console.error);;
}, []);
// GO TO THIS LINK TO SOLVE THE ERRROR WITH THE RERENDERING https://blog.logrocket.com/how-when-to-force-react-component-re-render/
// const start = async () => {
//   await getCollections()
// }

// start()
  return (
    <div className=" bg-slate-600 flex justify-center h-fit p-10 m-10 rounded-xl">
      <ul>
        {collections.map(item => {
          return(
            <>
              {item.map((item) => {
                return(
                  <>
                    <li key={item.collectionName} className="m-2">{item.collectionName}</li>
                    <ol className="bg-green-200 text-black rounded p-2">
                      {item.holders.length != 0 &&
                        <>
                          {item.holders.map(holder => {
                            return(
                              <li className="m-1">{holder}</li>
                            ) 
                          })}
                        </>
                      }
                    </ol>
                  </>
                )
              })}
              
            </>
          )
        })}
      </ul>
    </div>
  )

}

//              <li>{item.holders.map(item => item)}</li>
