import React from "react";
import SecurityReservationHero from "./SecurityReservationHero";
import AvailableService from "./AvailableService";
import SecurityProviders from "./SecurityProviders";
import Showcase from "../Home/Showcase/Showcase";
import Testimonials from "../Home/Testimonials/Testimonials";
import WhyChooseFASIFY from "../Home/WhyChooseFASIFY/WhyChooseFASIFY";



export default function SecurityReservation() {

    return (
        <div>
            <SecurityReservationHero />
            <AvailableService />
            <SecurityProviders />
            <WhyChooseFASIFY />
            <Testimonials />
            <Showcase />
        </div>
    )
}