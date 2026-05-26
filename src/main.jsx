import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthContext.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import Home from './pages/Home.jsx'
import Listings from './pages/Listings.jsx'
import ListingPage from './pages/ListingPage.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import Host from './pages/Host.jsx'
import HostSearch from './pages/HostSearch.jsx'
import Saved from './pages/Saved.jsx'
import Enquiries from './pages/Enquiries.jsx'
import Dashboard from './pages/Dashboard.jsx'

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
      },
      {
        element: <Host />,
        path: "/Host/:id"
      },
      {
        element: <Register />,
        path: "/Register"
      },
      {
        element: <Login />,
        path: "/Login"
      },
      {
        element: <Profile />,
        path: "/Profile"
      },
      {
        element: <HostSearch />,
        path: "/Search"
      },
      {
        element: <Saved />,
        path: "/Saved"
      },
      {
        element: <Enquiries />,
        path: "/Enquiries"
      },
      {
        element: <Dashboard />,
        path: "/Dashboard"
      }
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
