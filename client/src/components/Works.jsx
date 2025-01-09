import React from 'react';
import DB from '../assets/db.jpg'
import LangFlow from '../assets/lang.svg'
import Gpt from '../assets/gpt.png'

const Works = () => {
    const features = [
        {
            title: 'Data Collection',
            description:'Store engagement data securely in DataStax Astra DB. Ensure scalable and efficient data management for seamless access.',
            icon: DB,
        },
        {
            title: 'Analyze Performance',
            description: 'Use Langflow to calculate metrics by post type. Gain detailed insights to evaluate performance effectively.',
            icon: LangFlow,
        },
        {
            title: 'Generate Insights',
            description: 'Receive GPT-powered insights for informed decisions. Leverage AI-driven analysis to enhance strategic planning.',
            icon: Gpt,
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        How it works
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                    A step-by-step guide to understanding the process effortlessly
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white rounded-lg shadow p-6 text-center hover:scale-105 hover:shadow-lg">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 ">
                                <img src={feature.icon} alt="" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Works;
