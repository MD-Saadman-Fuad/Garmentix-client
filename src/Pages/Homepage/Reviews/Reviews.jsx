import React, { use } from 'react';
// import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';


// import required modules
// import { EffectCoverflow, Pagination } from 'swiper/modules';
import ReviewCard from './ReviewCard';

const Reviews = ({ reviewsPromise }) => {
    const reviews = use(reviewsPromise);
    // console.log(reviews);
    return (
        <div className='my-2   overflow-hidden'>
            <div className='text-center mb-24 px-4'>
                <h3 className="text-3xl md:text-4xl text-center font-bold my-8">What Our Clients Say</h3>
                <p className='max-w-3xl mx-auto text-gray-600 leading-relaxed'>Trusted by garment manufacturers and buyers worldwide, our clients consistently praise real-time production tracking, seamless workflow management, and exceptional support. Discover how factory managers and buyers have improved efficiency, reduced delays, and achieved 99% on-time delivery with Garmentix.</p>
            </div>

            <Swiper
                loop={true}
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={1}
                breakpoints={{
                    640: {
                        slidesPerView: 3,
                    },
                }}
                coverflowEffect={{
                    rotate: 30,
                    stretch: '50%',
                    depth: 200,
                    modifier: 1,
                    scale: 1,
                    slideShadows: true,
                }}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                pagination={true}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                className="mySwiper"
            >
                {
                    reviews.map(review => <SwiperSlide key={review.id}>
                        <ReviewCard review={review}></ReviewCard>
                    </SwiperSlide>)
                }
            </Swiper>

        </div>
    );
};

export default Reviews;