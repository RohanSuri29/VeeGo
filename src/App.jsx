import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import CaptainSignup from './pages/CaptainSignup'
import CaptainLogin from './pages/CaptainLogin'
import VerifyEmail from './pages/VerifyEmail'
import VerifyEmailCaptain from './pages/VerifyEmailCaptain'
import ResetToken from './pages/ResetToken'
import ResetTokenCaptain from './pages/ResetTokenCaptain'
import ResetPassword from './pages/ResetPassword'
import ResetPasswordCaptain from './pages/ResetPasswordCaptain'
import StartPage from './pages/StartPage'
import Riding from './pages/Riding'
import CaptainStartPage from './pages/CaptainStartPage'
import CaptainRiding from './pages/CaptainRiding'
import VerifyRide from './pages/VerifyRide'

function App() {

  return (

    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/start' element={<StartPage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/captain-signup' element={<CaptainSignup/>}/>
      <Route path='/captain-login' element={<CaptainLogin/>}/>
      <Route path='/verify-email' element={<VerifyEmail/>}/>
      <Route path='/verify-email-captain' element={<VerifyEmailCaptain/>}/>
      <Route path='/forgot-password' element={<ResetToken/>}/>
      <Route path='/update-password/:token' element={<ResetPassword/>}/>
      <Route path='/forgot-password-captain' element={<ResetTokenCaptain/>}/>
      <Route path='/update-password-captain/:token' element={<ResetPasswordCaptain/>}/>
      <Route path='/riding' element={<Riding/>}/>
      <Route path='/captain-start' element={<CaptainStartPage/>}/>
      <Route path='/captain-riding' element={<CaptainRiding/>}/>
      <Route path='/verify-ride' element={<VerifyRide/>}/>
    </Routes>
  )
}

export default App
