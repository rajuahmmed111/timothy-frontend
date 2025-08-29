import React from "react";
import CarReservationHero from "./CarReservationHero";
import WhyChooseFASIFY from "../Home/WhyChooseFASIFY/WhyChooseFASIFY";
import Testimonials from "../Home/Testimonials/Testimonials";
import Showcase from "../Home/Showcase/Showcase";
import PopularCar from "./PopularCar";
export default function CarReservation() {

    return (
        <div>
            <CarReservationHero />
            <PopularCar />
            <WhyChooseFASIFY />
            <Testimonials />
            <Showcase />
        </div>
    )
}