import React from 'react';
import Hero from './Hero/Hero';
import Impact from './Impact/Impact';
import MostVisitedHotels from './MostVisitedHotels/MostVisitedHotels';
import ExploreAllServices from './ExploreAllServices/ExploreAllServices';
import RecommendedAttractions from './RecommendedAttractions/RecommendedAttractions';
export default function Home() {
    return <div>
        <Hero />
        <Impact />
        <MostVisitedHotels />
        <ExploreAllServices />
        <RecommendedAttractions />
    </div>;
}