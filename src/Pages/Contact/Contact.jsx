import React from 'react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Get In Touch</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Have questions about Garmentix? We're here to help streamline your garment production management.
                    </p>
                </div>

                {/* Contact Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Contact Information Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
                        <div className="space-y-6">
                            {/* Phone */}
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#5089e6' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                                    <a href="tel:+8801914995953" className="text-gray-600 hover:text-blue-600 transition-colors">
                                        +880 1914 995953
                                    </a>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#5089e6' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                    <a href="mailto:md.saadman.fuad@gmail.com" className="text-gray-600 hover:text-blue-600 transition-colors">
                                        md.saadman.fuad@gmail.com
                                    </a>
                                </div>
                            </div>

                            {/* LinkedIn */}
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#5089e6' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-6 h-6">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">LinkedIn</h3>
                                    <a href="https://www.linkedin.com/in/saadmanfuad/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors break-all">
                                        linkedin.com/in/saadmanfuad
                                    </a>
                                </div>
                            </div>

                            {/* GitHub */}
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#5089e6' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-6 h-6">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">GitHub</h3>
                                    <a href="https://github.com/MD-Saadman-Fuad" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors break-all">
                                        github.com/MD-Saadman-Fuad
                                    </a>
                                </div>
                            </div>

                            {/* Portfolio */}
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#5089e6' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Portfolio</h3>
                                    <a href="https://saadmanfuad.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors break-all">
                                        saadmanfuad.netlify.app
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Message Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Send a Message</h2>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    rows="5"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Tell us about your garment production needs..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                style={{ backgroundColor: '#5089e6' }}
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="text-center bg-white rounded-2xl shadow-xl p-12">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Production?</h3>
                    <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                        Join hundreds of garment factories already streamlining their workflows with Garmentix.
                    </p>
                    <a
                        href="mailto:md.saadman.fuad@gmail.com"
                        className="inline-block px-8 py-4 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        style={{ backgroundColor: '#5089e6' }}
                    >
                        Get Started Today
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Contact;