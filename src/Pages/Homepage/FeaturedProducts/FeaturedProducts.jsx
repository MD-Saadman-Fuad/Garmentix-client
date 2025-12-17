import React, { useEffect, useState } from 'react';
import ProductsCard from '../../Products/ProductsCard/ProductsCard';

const FeaturedProducts = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState();
    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_backend_url}/products/featured`)
            .then(res => res.json())
            .then(data => {
                setFeaturedProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching featured products:', error);
                setLoading(false);
            });
    }, []);
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Products</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore our wide range of quality garments available for bulk orders.
                    Perfect for buyers looking for reliable suppliers.
                </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                    <ProductsCard key={product._id} product={product} />
                ))}
            </div>

            {/* Empty State */}
            {featuredProducts.length === 0 && !loading && (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500">No products available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default FeaturedProducts;