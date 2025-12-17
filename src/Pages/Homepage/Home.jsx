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
            <FeaturedProducts />
            <BeUs />
            <Partners />
            <Reviews reviewsPromise={reviewsPromise} />
            <Faq />
        </div>
    );
};

export default Home;