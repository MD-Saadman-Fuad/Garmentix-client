import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
// Using WebP for 55-61% smaller file sizes
import banner1 from '../../../assets/Slide1.webp';
import banner2 from '../../../assets/Slide2.webp';
import banner3 from '../../../assets/Slide3.webp';
import logo from '../../../assets/logo.png';
import { Link } from 'react-router';

const images = [banner1, banner2, banner3];

const Banner = () => {
    const [index, setIndex] = useState(0);

    // Auto change images
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 6000); // change every 6s
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Background image slider */}
            <AnimatePresence>
                <motion.img
                    key={index}
                    src={images[index]}
                    // First slide loads eagerly (it's the LCP image, preloaded in index.html)
                    // Subsequent slides load lazily to avoid wasting bandwidth upfront
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'low'}
                    width={1920}
                    height={1080}
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 3,
                        ease: "easeInOut",
                    }}
                    className="absolute inset-0 w-full h-full object-cover brightness-75"
                    alt={`Garmentix banner slide ${index + 1}`}
                />
            </AnimatePresence>

            {/* Hero content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <div className="flex items-center justify-center mb-6 w-full scale-300 md:scale-[3] -ml-4 md:-ml-8">
                        <Link to="/">
                            <div className='flex items-end '>
                                <img className="w-8 h-8 md:w-12 md:h-12" src={logo} alt="Garmentix Logo" width={48} height={48} />
                                <h3 className=' md:text-2xl text-white font-bold -ms-2 mb-1'>Garmentix</h3>
                            </div>
                        </Link>
                    </div>
                    <p className="text-sm md:text-base text-gray-200 tracking-widest uppercase mb-4 drop-shadow-lg">
                        Premium Fashion Collection
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl mb-6">
                        Elevate Your Style
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-100 mt-4 drop-shadow-lg mb-4 max-w-3xl">
                        Discover Premium Garments Crafted for the Modern Individual
                    </p>
                    <p className="text-base md:text-lg text-gray-200 drop-shadow-md mb-8 max-w-2xl">
                        Experience unmatched quality, timeless designs, and comfort that defines your identity. From everyday essentials to statement pieces.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/products" className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:scale-105">
                            Shop Now
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Banner;