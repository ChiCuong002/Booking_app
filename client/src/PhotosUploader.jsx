import {useState} from 'react'
import axios from "axios";

export default function PhotosUploader({addedPhotos, onChange}) {
    const [photoLink, setPhotoLink] = useState('');
    console.log(addedPhotos)
    async function addPhotoByLink(ev) {
        ev.preventDefault();
        const { data: filename } = await axios.post('/upload-by-link', { link: photoLink })
        console.log(filename)
        const newAddedPhotos = [...addedPhotos, filename];
        onChange(newAddedPhotos);
        console.log(addedPhotos, addedPhotos.length)
        setPhotoLink('');
    }
    function upLoadPhoto(ev){
        const files = ev.target.files;
        const data = new FormData();
        for(let i = 0; i < files.length; i++){
            data.append('photos', files[i])
        }
        axios.post('/upload', data, {
            headers: {'Content-type': 'multipart/form-data'}
        }).then(res => {
            const {data: filename} = res;
            onChange(prev => {
                const newFiles = Array.isArray(filename) ? filename : [filename];
                return [...prev, ...filename]
            })
        })
    }
    return (
        <>
            <div className="flex gap-2">
                <input type="text" placeholder={'Add photo using a link ...jpg'} value={photoLink} onChange={ev => setPhotoLink(ev.target.value)} />
                <button onClick={addPhotoByLink} className="bg-gray-200 px-2 rounded-2xl">Add&nbsp; photo </button>
            </div>

            <div className="gap-2 grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
                {addedPhotos?.length > 0 && addedPhotos.map((link, index) => {
                    return (
                        <div className="h-32 flex">
                            <img key={index} className="rounded-2xl w-full object-cover" src={'http://localhost:4000/uploads/' + link} />
                        </div>
                    )
                })}
                <label className="cursor-pointer flex justify-center gap-2 border bg-transparent rounded-2xl p-5 text-2xl text-gray-600">
                    <input type="file" multiple className="hidden" onChange={upLoadPhoto} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                    Upload
                </label>
            </div>
        </>
    )
}