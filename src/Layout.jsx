import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
