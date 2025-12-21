import React from 'react';
import Err from '../../assets/err.png';
import Navbar from '../../Shared/Navbar';
import Footer from '../../Shared/Footer';
const Error = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='max-w-7xl mx-auto text-center my-10'>
                <img src={Err} alt="Error" />
                <button className='btn btn-primary my-10' onClick={() => window.location.href = '/'}>Go Home</button>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Error;