const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config()
const { default: mongoose } = require('mongoose');
const User = require('./models/User')
const Place = require('./models/Place')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const imgDownLoader = require('image-downloader')
const multer = require('multer')
const fs = require('fs')

const bcryptSalt = bcrypt.genSaltSync(10)
const jwtSecret = 'fasjlnanavjnwpaijapcjwmsapw'


app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}))
console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI)


app.get('/test', (req, res) => {
    res.json('test ok')
})
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        })
        res.json(userDoc);
    } catch (error) {
        res.status(422).json(error)
    }

})
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userDoc = await User.findOne({ email })
        if (userDoc) {
            const passOK = bcrypt.compareSync(password, userDoc.password)
            if (passOK) {
                jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (error, token) => {
                    if (error) throw error;
                    res.cookie('token', token).json(userDoc)
                });
            } else {
                res.status(422).json('pass not ok')
            }
        } else {
            res.json('not found')
        }
    } catch (error) {

    }
})
app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (error, userInfo) => {
            if (error) throw error
            const { name, email, _id } = await User.findById(userInfo.id)
            console.log({ name, email, _id })
            return res.json({ name, email, _id })
        })
    } else {
        res.json(null)
    }
})
app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true)
})
app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imgDownLoader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName)
})

const photosMiddleware = multer({ dest: 'uploads/' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        console.log(path, originalname, parts, ext)
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath)
        const imageUrl = newPath.replace(/\\/g, '/'); // Replace backslashes with forward slashes
        const finalImageUrl = imageUrl.replace('uploads/', ''); // Remove "uploads/" portion

        uploadedFiles.push(finalImageUrl); // Push the modified image URL
    }
    res.json(uploadedFiles)
})
app.post('/places', async (req, res) => {
    const { token } = req.cookies
    const { title, addedPhotos, address, description, perks, extra, checkIn, checkOut, maxGuest, price } = req.body
    let id
    jwt.verify(token, jwtSecret, {}, async (error, userInfo) => {
        if (error) throw error
        id = userInfo.id
    })
    const placeDoc = await Place.create({
        owner: id,
        title,
        photos: addedPhotos,
        address,
        description,
        perks,
        extraInfo: extra,
        checkIn,
        checkOut,
        maxGuest,
        price,
    })
    return res.json(placeDoc)
})
app.get('/places', (req, res) => {
    const { token } = req.cookies
    jwt.verify(token, jwtSecret, {}, async (error, userData) => {
        if (error) throw error
        const { id } = userData;
        res.json(await Place.find({ owner: id }));
    })
})
app.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
})
app.put('/places', async (req, res) => {
    const { token } = req.cookies
    const { id, title, addedPhotos, address, description, perks, extra, checkIn, checkOut, maxGuest, price } = req.body
    jwt.verify(token, jwtSecret, {}, async (error, userData) => {
        if (error) throw error
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title,
                photos: addedPhotos,
                address,
                description,
                perks,
                extraInfo: extra,
                checkIn,
                checkOut,
                maxGuest,
                price,
            })
            placeDoc.save();
            res.json('ok')
        }
    })
})
app.get('/all-places', async (req, res) => {
    res.json(await Place.find() )
})
app.listen(4000)