import { useState } from "react";

export default function AboutSection() {
    const tabs = ["Story", "Mission", "Success", "Team & Others"];
    const [activeTab, setActiveTab] = useState("Story");

    const content = {
        Story: `
    Garmentix was born from a vision to revolutionize garment production management. 
    What started as a solution for a single factory has evolved into a comprehensive platform 
    trusted by hundreds of garment manufacturers and buyers worldwide. Our journey has been 
    shaped by the real challenges faced by production managers and buyers in the apparel industry.

    From tracking cutting operations to monitoring finishing lines, from managing buyer orders 
    to ensuring on-time delivery — we've built a system that brings clarity and control to every 
    stage of garment production. Today, Garmentix stands as a bridge between manufacturers and 
    buyers, streamlining workflows and fostering transparent collaboration in the fashion supply chain.
  `,

        Mission: `
    Our mission is to empower garment manufacturers and buyers with real-time visibility and 
    data-driven insights. We believe that production management should be seamless, transparent, 
    and accessible to everyone involved — from factory floor managers to international buyers.

    Through powerful tracking tools, intuitive dashboards, and automated reporting, we enable 
    managers to optimize workflows, reduce delays, and maintain quality control. For buyers, 
    we provide complete transparency into order status, production progress, and delivery timelines.

    We are committed to transforming the garment industry by eliminating communication gaps, 
    reducing production bottlenecks, and ensuring that every stakeholder has the information 
    they need to make informed decisions. Together, we're building a more efficient and 
    connected apparel ecosystem.
  `,

        Success: `
    Our success is measured by the efficiency gains of our factory partners and the satisfaction 
    of buyers who trust us with their production tracking. We've helped reduce production delays 
    by up to 40%, improved order accuracy, and enabled faster communication between manufacturers 
    and brands.

    What sets Garmentix apart is our deep understanding of the garment industry's unique challenges. 
    From handling complex order variations to managing multiple production lines simultaneously, 
    our platform adapts to the real-world needs of modern apparel manufacturing.

    With over 500 active factories, 10,000+ orders successfully tracked, and a 99% on-time 
    delivery rate, we continue to grow by listening to our users and innovating solutions that 
    truly make a difference. Every feature we build is designed to save time, reduce costs, 
    and improve collaboration across the supply chain.
  `,

        "Team & Others": `
    Behind Garmentix is a passionate team of industry experts, software engineers, and 
    customer success specialists who understand both technology and textiles. Our team includes 
    former factory managers, supply chain professionals, and tech innovators working together 
    to solve real production challenges.

    We work closely with production managers who rely on our platform daily to monitor cutting, 
    sewing, finishing, and quality control. Our buyer-facing team ensures brands have instant 
    access to production updates, shipment tracking, and quality reports.

    Beyond our core team, we partner with garment factories, textile suppliers, logistics 
    providers, and fashion brands to create an integrated ecosystem. Our commitment extends 
    to providing training, ongoing support, and continuous platform improvements based on 
    user feedback. Together with our partners, we're shaping the future of smart garment 
    manufacturing — one factory, one order, one success story at a time.
  `,
    };


    return (
        <section className=" bg-base-100  px-4 py-16">
            {/* Header */}
            <div data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-2">About Us</h2>
                <p className="text-gray-600 max-w-2xl mb-12">
                    Transform your garment production with real-time tracking and powerful analytics.
                    From cutting to finishing — we bring transparency and efficiency to every stage of manufacturing.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto" data-aos="fade-up">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 font-medium transition-all whitespace-nowrap ${activeTab === tab
                            ? "border-b-2 border-primary"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="text-gray-700 leading-relaxed" data-aos="fade-up">
                <p>{content[activeTab]}</p>
            </div>
        </section>
    );
}
