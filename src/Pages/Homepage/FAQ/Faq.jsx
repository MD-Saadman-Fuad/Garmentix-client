import React from 'react';

const Faq = () => {
    const faqs = [
        {
            q: "What is Garmentix and who is it for?",
            a: "Garmentix is a comprehensive production management platform designed for garment manufacturers and buyers. It helps factory managers track production from cutting to finishing, while giving buyers real-time visibility into their order status and delivery timelines.",
        },
        {
            q: "How does real-time tracking work?",
            a: "Our platform provides live updates at every production stage - cutting, sewing, finishing, and quality control. Both factory managers and buyers can monitor progress, identify bottlenecks, and receive instant notifications about order status changes.",
        },
        {
            q: "Can buyers track multiple orders from different factories?",
            a: "Yes! Buyers can manage and monitor all their orders from multiple factories in one centralized dashboard. You'll get complete visibility into production progress, quality reports, and estimated delivery dates for all your orders.",
        },
        {
            q: "How does Garmentix help reduce production delays?",
            a: "Our platform identifies bottlenecks in real-time, sends automated alerts for delays, provides analytics to optimize workflows, and enables instant communication between managers and buyers. This has helped our clients reduce delays by up to 40%.",
        },
        {
            q: "What features are available for factory managers?",
            a: "Factory managers get production line tracking, worker assignment tools, quality control monitoring, automated reporting, analytics dashboards, and buyer communication tools - all designed to streamline daily operations and improve efficiency.",
        },
        {
            q: "Is training provided for using the platform?",
            a: "Absolutely! We provide comprehensive onboarding, training sessions for your team, ongoing customer support, and detailed documentation. Our support team is always ready to assist both managers and buyers.",
        },
        {
            q: "How secure is our production data?",
            a: "We use enterprise-grade security with encrypted data transmission, secure cloud storage, role-based access control, and regular security audits. Your production data and order information are completely protected.",
        },
        {
            q: "What's your on-time delivery rate?",
            a: "Our platform has helped achieve a 99% on-time delivery rate across 500+ factories and 10,000+ tracked orders. The combination of real-time tracking, proactive alerts, and streamlined communication ensures timely deliveries.",
        },
    ];
    return (
        <section className='border-b border-dotted my-20 px-4'>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
            <p className='text-gray-600 text-center max-w-3xl mx-auto mb-10 leading-relaxed'>Get answers to common questions about Garmentix. Learn how our platform helps factory managers and buyers streamline production, track orders, and achieve on-time delivery.</p>


            <div className="space-y-4 p-4 pb-20">
                {faqs.map((item, idx) => (
                    <details
                        key={idx}
                        className="group border-2 border-primary rounded-2xl p-5 hover:shadow-primary/40 transition-all"
                    >
                        <summary className="cursor-pointer text-lg font-semibold flex justify-between items-center">
                            {item.q}
                            <span className=" transition-transform group-open:rotate-180 text-xl">⌄</span>
                        </summary>
                        <p className="mt-3 text-base opacity-80 leading-relaxed">{item.a}</p>
                    </details>
                ))}
            </div>
        </section>
    );
};

export default Faq;