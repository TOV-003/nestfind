import { Toaster } from "react-hot-toast"
import { Outlet } from "react-router-dom"
import ScrollToTop from "./components/ScrollToTop"


function App() {


  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />
      <Outlet />
    </>
  )
}

export default App
