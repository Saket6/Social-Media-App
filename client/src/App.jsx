import {Routes,Route} from 'react-router-dom'
import { Home } from './Pages/Home'
import { Login } from './Pages/Login'
import { Register } from './Pages/Register'
import { Profile } from './Components/Profile'
import { useSelector } from 'react-redux'
function App() {

  return (
   
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<Profile/>}/>
    </Routes>
  )
}

export default App
