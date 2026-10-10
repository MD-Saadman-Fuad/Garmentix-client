import React, { useEffect, useState } from 'react';
import ProductsCard from './ProductsCard/ProductsCard';

// Skeleton card — same layout as ProductsCard for a smooth loading experience
const ProductCardSkeleton = () => (
    <div className="card bg-base-100 shadow-xl overflow-hidden animate-pulse">
        <div className="h-64 bg-gray-200 w-full"></div>
        <div className="card-body p-6 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="flex justify-between items-center pt-2">
                <div>
                    <div className="h-3 bg-gray-200 rounded w-12 mb-2"></div>
                    <div className="h-7 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="text-right">
                    <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                </div>
            </div>
            <div className="flex gap-3 pt-2">
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
            </div>
        </div>
    </div>
);

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_backend_url}/products`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            {/* Header Section */}
            <div className="text-center mb-12" data-aos="fade-up">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Products</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore our wide range of quality garments available for bulk orders.
                    Perfect for buyers looking for reliable suppliers.
                </p>
            </div>

            {/* Products Grid — shows skeletons while loading */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-aos="fade-up">
                {loading
                    ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                    : products.map(product => (
                        <ProductsCard key={product._id} product={product} />
                    ))
                }
            </div>

            {/* Empty State */}
            {products.length === 0 && !loading && (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500">No products available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default AllProducts;