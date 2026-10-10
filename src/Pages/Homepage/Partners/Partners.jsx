import React from 'react';
import Marquee from "react-fast-marquee";
import image1 from '../../../assets/brands/g1.png';
import image2 from '../../../assets/brands/g2.png';
import image3 from '../../../assets/brands/g3.png';
import image4 from '../../../assets/brands/g4.png';
import image5 from '../../../assets/brands/g5.png';
import image6 from '../../../assets/brands/g6.png';
import image7 from '../../../assets/brands/g7.png';
import image8 from '../../../assets/brands/g8.png';

const images = [image1, image2, image3, image4, image5, image6, image7, image8];

const Helped = () => {
    return (
        <div className='my-2 p-5 border-b border-dotted'>
            <div>
                <h3 className='text-5xl mb-3 font-bold text-center'>Our Partners</h3>
            </div>
            <Marquee pauseOnHover={true} gradient={false} speed={50}>
                {
                    images.map((img, index) => (
                        <img
                            className='mr-20 flex items-center'
                            key={index}
                            src={img}
                            alt={`Partner brand ${index + 1}`}
                            loading="lazy"
                            width={120}
                            height={60}
                        />
                    ))
                }
            </Marquee>
        </div>
    );
};

export default Helped;
