import './App.css'
import Container from './Components/Container/Container'
import Navbar from './Components/Navbar/Navbar'
import Signup from './Components/Signup/Signup'
import Login from './Components/Login/Login'
import {Routes, Route} from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <>
        <Navbar />
        <Container />
        </>
       } />
       <Route path='/signup' element={<Signup />} />
       <Route path='/login' element={<Login />} />
    </Routes>
  );
}

export default App;