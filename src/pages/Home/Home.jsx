import React from 'react';
import Hero from './Hero/Hero';
import Impact from './Impact/Impact';
import MostVisitedHotels from './MostVisitedHotels/MostVisitedHotels';
import ExploreAllServices from './ExploreAllServices/ExploreAllServices';
import RecommendedAttractions from './RecommendedAttractions/RecommendedAttractions';
import WhyChooseFASIFY from './WhyChooseFASIFY/WhyChooseFASIFY';
import Testimonials from './Testimonials/Testimonials';
export default function Home() {
    return <div>
        <Hero />
        <Impact />
        <MostVisitedHotels />
        <ExploreAllServices />
        <RecommendedAttractions />
        <WhyChooseFASIFY />
        <Testimonials />
    </div>;
}