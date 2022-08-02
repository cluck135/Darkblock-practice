

export default function Holders ({holders}) {



    return (
        <ul>
            <li>{holders.map(item => item)}</li>
        </ul>
    )
}