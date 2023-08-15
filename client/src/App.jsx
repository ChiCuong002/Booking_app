import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import AccountPage from './pages/AccountPage'
import PlacesPage from './pages/PlacesPage'
import AddPlacePage from './pages/AddPlacePage'

axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.withCredentials = true;

function App() {
  const [count, setCount] = useState(0)

  return (
    <UserContextProvider>
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<IndexPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/account/:subpages?' element={<AccountPage/>} />
        <Route path='/account/:subpages/:action' element={<PlacesPage/>}/>
        <Route path='/account/places/new' element={<AddPlacePage /> } />
        <Route path='/account/places/:id' element={<AddPlacePage/>} />
      </Route>
    </Routes>
    </UserContextProvider>
  )
}

export default App
