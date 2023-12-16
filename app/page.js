import Image from 'next/image'

export default function Home() {
  return (
    <main >
        
    
    <header className="bg-blue-800 text-white py-20 text-center">
        <div className="container mx-auto">
            <h1 className="text-4xl font-semibold">E-Barta - Secure Messaging</h1>
            <p className="mt-2">Your Privacy Matters. Chat securely with E-Barta.</p>
            <a href="/login" className="mt-4 inline-block bg-white text-blue-800 py-2 px-4 rounded-lg transition duration-300 hover:bg-blue-200">Get Started</a>
        </div>
    </header>

    <section className="py-16">
        <div className="container mx-auto">
            <h2 className="text-3xl font-semibold text-center">Features</h2>
            <div className="flex flex-wrap mt-8">
                <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold">End-to-End Encryption</h3>
                        <p className="mt-2">Your messages are always safe and private with our strong encryption.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold">Multi-Platform Support</h3>
                        <p className="mt-2">Access your messages from anywhere, on any device.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold">User-Friendly Interface</h3>
                        <p className="mt-2">Easily navigate and chat with friends and family in a clean interface.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </main>
  )
}
