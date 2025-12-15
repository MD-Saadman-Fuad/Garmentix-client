import React from 'react';
import { Link } from 'react-router';

const ProductsCard = ({ product }) => {
    const { _id, productName, category, image, price, availableQuantity } = product;
    const productId = _id;

    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group">
            {/* Image Section */}
            <figure className="relative overflow-hidden h-64">
                <img
                    src={image}
                    alt={productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 badge badge-primary text-white font-semibold px-4 py-3">
                    {category}
                </div>
            </figure>

            {/* Content Section */}
            <div className="card-body p-6">
                {/* Title */}
                <h2 className="card-title text-xl font-bold text-gray-800 mb-2">
                    {productName}
                </h2>

                {/* Description */}
                {/* <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {description}
                </p> */}

                {/* Price & Quantity Info */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-2xl font-bold text-primary">৳{price}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Available</p>
                        <p className="text-lg font-semibold text-gray-800">{availableQuantity} pcs</p>
                    </div>
                </div>

                {/* Minimum Order */}
                {/* <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-800">Min. Order:</span> {minimumOrder} pieces
                    </p>
                </div> */}

                {/* Payment Options */}
                {/* <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Payment Options:</p>
                    <div className="flex gap-2 flex-wrap">
                        {paymentOptions?.map((option, index) => (
                            <span
                                key={index}
                                className="badge badge-outline badge-sm px-3 py-2"
                            >
                                {option}
                            </span>
                        ))}
                    </div>
                </div> */}

                {/* Action Buttons */}
                <div className="card-actions justify-between mt-4">
                    <Link
                        to={`/products/${productId}`}
                        state={{ product }}
                        className="btn btn-outline btn-primary flex-1 hover:scale-105 transition-transform"
                    >
                        View Details
                    </Link>
                    <button className="btn btn-primary flex-1 text-white hover:scale-105 transition-transform">
                        Order Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductsCard;