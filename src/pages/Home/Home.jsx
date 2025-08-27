import React from 'react';
import Hero from './Hero/Hero';
import Impact from './Impact/Impact';
import MostVisitedHotels from './MostVisitedHotels/MostVisitedHotels';
import ExploreAllServices from './ExploreAllServices/ExploreAllServices';
export default function Home() {
    return <div>
        <Hero />
        <Impact />
        <MostVisitedHotels />
        <ExploreAllServices />
    </div>;
}