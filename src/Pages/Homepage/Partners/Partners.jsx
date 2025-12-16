import React from 'react';
// import Swiper JS
// import Swiper styles
// import 'swiper/css';
import Marquee from "react-fast-marquee";
import image1 from '../../../assets/brands/g1.png';
import image2 from '../../../assets/brands/g2.png';
import image3 from '../../../assets/brands/g3.png';
import image4 from '../../../assets/brands/g4.png';
import image5 from '../../../assets/brands/g5.png';
import image6 from '../../../assets/brands/g6.png';
import image7 from '../../../assets/brands/g7.png';
import image8 from '../../../assets/brands/g8.png';
// import { image } from 'framer-motion/client';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination } from 'swiper/modules';



const images = [image1, image2, image3, image4, image5, image6, image7, image8];
const Helped = () => {
    return (
        <div className='my-2 p-5 border-b border-dotted'>
            <div>
                <h3 className='text-5xl mb-3 font-bold text-center'>Our Partners</h3>
            </div>
            {
                <Marquee pauseOnHover={true} gradient={false} speed={50}>
                    {
                        images.map((img, index) => (
                            <img className='mr-20 flex items-center' key={index} src={img} alt={`brand-${index}`} />
                        ))
                    }
                </Marquee>
            }
        </div>
    );
};

export default Helped;


// <div className='border-b border-dotted'>
//     <div className='my-8'>
//         <h1 className="text-2xl text-secondary font-bold text-center">We helped Thousands of sales team</h1>
//     </div>
//     <div className=' grid grid-cols-3 md:grid-cols-6 my-5'>
//         {
//             images.map((img, index) => (
//                 <div key={index} className='inline-block m-4'>
//                     <img src={img} alt={`brand-${index}`} />
//                 </div>
//             ))
//         }
//     </div>
// </div>




{/* <Swiper
            slidesPerView={4}
            centeredSlides={true}
            spaceBetween={30}
            grabCursor={true}
            loop={true}
            autoplay={{
                delay: 1000,
                disableOnInteraction: false,
            }}
            pagination={{
                clickable: true,
            }}
            modules={[Pagination, Autoplay]}
            className="mySwiper"
        >
            {
                images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img src={img} alt={`brand-${index}`} />
                    </SwiperSlide>
                ))
            }

        </Swiper> */}

