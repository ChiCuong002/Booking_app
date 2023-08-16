
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [places, setPlaces] = useState([])
  useEffect(() => {
    axios.get('/places').then(res => {
      setPlaces(res.data)
    })
  }, [])
  useEffect(() => {
    console.log(places)
  }, [places])
  return (
    <div className="mt-8 gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.length > 0 && places.map((place) => (
        <Link to={'/places/' + place._id} key={place._id}>
          <div className="bg-gray-500 mb-2 rounded-2xl flex">
            {place.photos?.[0] && (
              <img className="rounded-2xl aspect-square object-cover" src={'http://localhost:4000/uploads/' + place.photos[0]}/>
            )}
          </div>
          <h2 className="text-sm truncate leading-4">{place.address}</h2>
          <h3 className="font-bold leading-4">{place.title}</h3>
          <div className="mt-1">
            <span className="font-bold">${place.price}</span> per night
          </div>
        </Link>
      ))}
    </div>
  )
}