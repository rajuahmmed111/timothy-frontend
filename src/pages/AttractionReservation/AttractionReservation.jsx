import React from "react";
import WhyChooseFASIFY from "../Home/WhyChooseFASIFY/WhyChooseFASIFY";
import Testimonials from "../Home/Testimonials/Testimonials";
import Showcase from "../Home/Showcase/Showcase";
import TopDestination from "./TopDestination";
import AttractionsHero from "./AttractionsHero";

export default function AttractionReservation() {

    return (
        <div>
            <AttractionsHero />
            <TopDestination />
            <WhyChooseFASIFY />
            <Testimonials />
            <Showcase />
        </div>
    )
}