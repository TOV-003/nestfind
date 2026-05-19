import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import Home from './pages/Home.jsx'
import Listings from './pages/Listings.jsx'
import ListingPage from './pages/ListingPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Home />,
        index: true
      },
      {
        element: <Listings />,
        path: "/Listings"
      },
      {
        element: <ListingPage />,
        path: "/Listings/:id"
      }

    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
