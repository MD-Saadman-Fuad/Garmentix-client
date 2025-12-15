import React from 'react';
import image from '../../../assets/agent-pending.png'
const BeUs = () => {
    return (
        <div className='bg-primary flex flex-col md:flex-row justify-around items-center p-10 md:p-16 mt-20 rounded-2xl shadow-2xl'>

            <div className='text-white w-full md:w-2/3 text-left'>
                <h2 className='text-3xl md:text-4xl font-bold pt-6 md:pt-10 leading-tight'>Streamline Your Garment Production with Industry-Leading Technology</h2>
                <p className='text-base md:text-lg mt-4 mb-8 md:mb-10 leading-relaxed opacity-95'>Join 500+ factories already transforming their production management. Track every stage from cutting to finishing, reduce delays by 40%, and achieve 99% on-time delivery with real-time analytics and seamless buyer collaboration.</p>
                <div className='m-1 gap-4 flex flex-col sm:flex-row'>
                    <button className="btn btn-primary rounded-full text-black font-semibold hover:scale-105 transition-transform">Start Free Trial</button>
                    <button className="btn bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-700 transition-all">Schedule a Demo</button>
                </div>
            </div>
            <img src={image} alt="Garment Production Management" className='mt-8 md:mt-0' />

        </div>
    );
};

export default BeUs;