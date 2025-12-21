import React from 'react';
import Banner from './Banner/Banner';
import Reviews from './Reviews/Reviews';
import Faq from './FAQ/Faq';
import BeUs from './BeUs/BeUs';
import Partners from './Partners/Partners';
import FeaturedProducts from './FeaturedProducts/FeaturedProducts';
const reviewsPromise = fetch('/reviews.json').then(res => res.json());

const Home = () => {
    return (
        <div>
            <Banner />
            <div data-aos="fade-up">
                <FeaturedProducts />
            </div>
            <div data-aos="fade-up">
                <BeUs />
            </div>
            <div data-aos="fade-up">
                <Partners />
            </div>
            <div data-aos="fade-up">
                <Reviews reviewsPromise={reviewsPromise} />
            </div>
            <div data-aos="fade-up">
                <Faq />
            </div>
        </div>
    );
};

export default Home;