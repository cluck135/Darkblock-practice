

export default function WhiteList({collections, setCollections}) {

  console.log(collections)

  return (
    <div className=" bg-slate-600 flex justify-center h-fit p-10 m-10 rounded-xl">
      <ul >
        {collections.map((item) => <li>{item}</li>)}
      </ul>
    </div>
  )



}