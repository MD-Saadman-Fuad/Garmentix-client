import React from 'react';
import Banner from './Banner/Banner';
import Reviews from './Reviews/Reviews';
import Faq from './FAQ/Faq';
import BeUs from './BeUs/BeUs';
import Partners from './Partners/Partners';
const reviewsPromise = fetch('/reviews.json').then(res => res.json());

const Home = () => {
    return (
        <div>
            <Banner />
            <BeUs />
            <Partners />
            <Reviews reviewsPromise={reviewsPromise} />
            <Faq />
        </div>
    );
};

export default Home;