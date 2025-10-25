import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceCard({ service }) {
    const IconComponent = service.icon;

    return (
        <Link to={service.to || '#'} className="block">
            <div className="bg-white rounded-xl overflow-hidden shadow-md  transition-all duration-300 cursor-pointer group transform hover:-translate-y-1">
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                    <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-5 flex items-center justify-between" >
                    <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                            {service.title}
                        </h3>

                        {/* Service Icon and Description */}
                        {/* <div className="flex items-center gap-1 mb-4">
                            {IconComponent && (
                                <IconComponent className="w-4 h-4 text-[#0064D2] flex-shrink-0" />
                            )}
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {service.description}
                            </p>
                        </div> */}
                    </div>
                    <div className="border border-[#C0C0C0] p-2 rounded-full">
                        <ArrowRight className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
