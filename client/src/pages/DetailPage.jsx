import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import BookingWidget from "../BookingWidget";


export default function DetailPage() {
    const { id } = useParams();
    const [place, setPlace] = useState(null)
    const [showAllPhotos, setShowAllPhotos] = useState(false)
    useEffect(() => {
        if (!id) {
            return
        } else {
            axios.get('/places/' + id).then(res => {
                setPlace(res.data)
            })
        }

    }, [id])
    if (!place) return '';
    if (showAllPhotos) {
        return (
            <div className="absolute inset-0 bg-white min-w-full min-h-screen">
                <div className="bg-black p-8 relative">
                    <div>
                        <h2 className="text-3xl text-white py-8 mr-48">Photos of {place.title}</h2>
                        <button
                            className="fixed right-12 top-8 gap-1 py-2 px-4 rounded-2xl bg-white text-black rounded-2xl shadow shadow-black"
                            onClick={() => setShowAllPhotos(false)}
                            style={{ zIndex: 1 }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {place?.photos?.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                            {place.photos.map((photo, index) => (
                                <div key={index} className="aspect-[1:1] relative">
                                    <img
                                        src={'http://localhost:4000/uploads/' + photo}
                                        alt={`Photo ${index + 1}`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 mt-4 bg-gray-100 -mx-8 px-8">
            <h1 className="text-3xl">{place.title}</h1>
            <a className="flex gap-2 py-4 my-2 block font-semibold underline" target="_blank" href={'https://maps.google.com/?q=' + place.address}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>

                {place.address}
            </a>
            <div className="relative">
                <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
                    <div>
                        {place.photos?.[0] && (
                            <div>
                                <img onClick={() => setShowAllPhotos(true)} className="cursor-pointer aspect-square object-cover" src={'http://localhost:4000/uploads/' + place.photos[0]} />
                            </div>
                        )}
                    </div>
                    <div className="grid ">
                        {place.photos?.[1] && (
                            <div>
                                <img onClick={() => setShowAllPhotos(true)} className="cursor-pointer aspect-square object-cover" src={'http://localhost:4000/uploads/' + place.photos[1]} />
                            </div>
                        )}
                        <div className="overflow-hidden">
                            {place.photos?.[2] && (
                                <img onClick={() => setShowAllPhotos(true)} className="cursor-pointer aspect-square object-cover relative top-2" src={'http://localhost:4000/uploads/' + place.photos[2]} />
                            )}
                        </div>
                    </div>
                </div>
                <button onClick={() => setShowAllPhotos(true)} className="absolute bottom-2 right-2 py-2 px-4 bg-white shadow shadow-md shadow-gray-500 font-bold">Show all photos</button>
            </div>
            <div className="mt-8 mb-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr] ">
                <div>
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        {place.description}
                    </div>
                    Check-in: {place.checkIn}<br />
                    Check-out: {place.checkOut}<br />
                    Max number of guests: {place.maxGuest}

                </div>
                <div>
                    <BookingWidget place={place} />
                </div>
            </div>
            <div className="bg-white -mx-8 px-8 py-8 border-t">
                <div>
                    <h2 className="font-semibold text-2xl">Extra info</h2>
                </div>
                <div className="mt-2 text-sm text-gray-700 leading-5">
                    {place.extraInfo}
                </div>
            </div>
        </div>
    )
}