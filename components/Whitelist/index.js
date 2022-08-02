import { useEffect } from "react"
import { Holders } from "../Holders"

export default function WhiteList({collections, getCollections}) {

useEffect( () => {
  const fetchData = async () => {
    await getCollections();
  }
  fetchData()
  .catch(console.error);;
}, []);

const start = async () => {
  await getCollections()
}

start()

  return (
    <div className=" bg-slate-600 flex justify-center h-fit p-10 m-10 rounded-xl">
      <ul>
        {collections.map(item => {
          return(
            <>
              <li className="m-2">{item.collectionName}</li>
              <ol className="bg-green-200 text-black rounded p-2">
                {item.holders.map(holder => {
                  return(
                    <li className="m-1">{holder}</li>
                  ) 
                })}
              </ol>
            </>
          )
        })}
      </ul>
    </div>
  )

}

//              <li>{item.holders.map(item => item)}</li>
