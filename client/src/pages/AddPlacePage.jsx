import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import AccountNav from "../AccountNav";

export default function AddPlacePage() {
    const {id} = useParams();
    const [price, setPrice] = useState('')
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extra, setExtra] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuest, setMaxGuest] = useState(1);
    const [redirectToPlacesList, setRedirectToPlacesList] = useState(false)

    useEffect(() => {
        if(!id){
            return;
        } else {
            axios.get('/places/'+id).then(response => {
                const {data} = response;
                console.log({data})
                setTitle(data.title);
                setAddress(data.address);
                setAddedPhotos(data.photos);
                setDescription(data.description);
                setPerks(data.perks);
                setExtra(data.extraInfo);
                setCheckIn(data.checkIn);
                setCheckOut(data.checkOut);
                setMaxGuest(data.maxGuest);
                setPrice(data.price)
            })
        }
    }, [id])
    useEffect(() => {
        console.log("addedPhotos:", addedPhotos);
        console.log("perks:", perks);
    }, [addedPhotos, perks]);
    function preInput(header, des) {
        return (
            <>
                <h2 className="text-2xl mt-4">{header}</h2>
                <p className="text-gray-500 text-sm">{des}</p>
            </>
        )
    }
    async function savePlace(ev) {
        ev.preventDefault();
        if(id){
            //update 
            await axios.put('/places', {
                id,
                title, addedPhotos, address, description, perks, extra, checkIn, checkOut, maxGuest, price
            })

        } else {
            //add new place
            const placeData = { title, addedPhotos, address, description, perks, extra, checkIn, checkOut, maxGuest, price }
            const { data } = await axios.post('/places', placeData)
            setRedirectToPlacesList(true)
        }
    }
    if (redirectToPlacesList) {
        return <Navigate to={'/account/places'} />
    }
    return(
        <div>
            <AccountNav />
            <form onSubmit={savePlace}>
                {preInput('Title', 'title for your place')}
                <input type="text" placeholder="title, for example: My lovely apt" value={title} onChange={ev => setTitle(ev.target.value)} />
                {preInput('Address', 'address for your place')}
                <input type="text" placeholder="address" value={address} onChange={ev => setAddress(ev.target.value)} />
                {preInput('Photos', 'the more photo you have, the better the apperance')}
                {addedPhotos !== null && ( // Check if addedPhotos is not null
                    <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                )}
                {preInput('Description', 'description of your place')}
                <textarea rows={10} value={description} onChange={ev => setDescription(ev.target.value)} />
                {preInput('Perks', 'select all the perks of your place')}
                <div className="grid mt-2 gird-clos-2 md:grid-cols-4 lg:grid-cols-6">
                    <Perks selected={perks} onChange={setPerks} />
                </div>
                {preInput('Extra info', 'house rules, etc')}
                <textarea value={extra} onChange={ev => setExtra(ev.target.value)} />
                {preInput('Price, Price for your place')}
                <input type="number" value={price} onChange={(ev) => setPrice(ev.target.value)}/>
                {preInput('Check in&out time, max guests', 'add check in and out times')}
                <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                        <h3 className="mt-2 mt-4">Check in time</h3>
                        <input type="text" placeholder="14:00" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} />
                    </div>
                    <div>
                        <h3 className="mt-2 mt-4">Check out time</h3>
                        <input type="text" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} />
                    </div>
                    <div>
                        <h3 className="mt-2 mt-4">Max guests</h3>
                        <input type="number" value={maxGuest} onChange={ev => setMaxGuest(ev.target.value)} />
                    </div>
                </div>
                <div>
                    <button className="primary my-4">Save</button>
                </div>
            </form>
        </div>
    )
}