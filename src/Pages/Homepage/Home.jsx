import React, { Suspense } from 'react';
import Banner from './Banner/Banner';
import Reviews from './Reviews/Reviews';
import Faq from './FAQ/Faq';
import BeUs from './BeUs/BeUs';
import Partners from './Partners/Partners';
import FeaturedProducts from './FeaturedProducts/FeaturedProducts';
import ErrorBoundary from '../../Components/ErrorBoundary';

// Fetch starts immediately when module loads (before React renders) — good for waterfall avoidance
const reviewsPromise = fetch('/reviews.json').then(res => res.json());

const Home = () => {
    return (
        <div>
            <ErrorBoundary>
                <Banner />
            </ErrorBoundary>
            <div data-aos="fade-up">
                <ErrorBoundary>
                    <FeaturedProducts />
                </ErrorBoundary>
            </div>
            <div data-aos="fade-up">
                <ErrorBoundary>
                    <BeUs />
                </ErrorBoundary>
            </div>
            <div data-aos="fade-up">
                <ErrorBoundary>
                    <Partners />
                </ErrorBoundary>
            </div>
            <div data-aos="fade-up">
                {/* Suspense required for React.use(promise) in Reviews component */}
                <ErrorBoundary>
                    <Suspense fallback={
                        <div className="flex justify-center items-center py-20">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    }>
                        <Reviews reviewsPromise={reviewsPromise} />
                    </Suspense>
                </ErrorBoundary>
            </div>
            <div data-aos="fade-up">
                <ErrorBoundary>
                    <Faq />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default Home;