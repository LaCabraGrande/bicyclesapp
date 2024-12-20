import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import Bicycles from './pages/Bicycles.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import Vision from './pages/Vision.jsx'
import Components from './pages/Components.jsx'
import Dealers from './pages/DealersNew.jsx'

const router = createBrowserRouter(
 createRoutesFromElements(
  <Route path='/' element={<MainLayout />}>
    <Route index element={<Vision />}/>
    <Route path = 'Bicycles' element = {<Bicycles />}/>
    <Route path = 'Components' element = {<Components />}/>
    <Route path = 'Dealers' element = {<Dealers />}/>
  </Route>
 )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
