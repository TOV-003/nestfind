
function Footer() {
    return (
        <footer className="w-full py-8 border-t border-gray-300 bg-white">
            <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">

                <div>
                    <p className="text-lg font-bold text-gray-900">
                        &copy; {new Date().getFullYear()} NestFind. All rights reserved.
                    </p>
                    <p>Made with ❤️ by <a href="https://github.com/TOV-003" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Victor Toba-Ogunleye</a></p>
                </div>
                <div className="flex gap-6 text-sm text-gray-600">
                    <a href="/about" className="hover:text-primary transition-colors">About</a>
                    <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
                    <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GitHub</a>
                </div>

            </div>
        </footer>
    )
}

export default Footer
