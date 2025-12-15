import React from 'react';
import ElectronicsSlider from './ElectronicsSlider';

export const FeaturedProducts = () => (
  <ElectronicsSlider 
    featuredOnly={true}
    maxProducts={10}
  />
);

export const CategoryProducts = ({ categoryId, categoryName }) => (
  <ElectronicsSlider 
    category={categoryId}
    featuredOnly={false}
    maxProducts={12}
  />
);

export const AllProducts = () => (
  <ElectronicsSlider 
    featuredOnly={false}
    maxProducts={20}
  />
);

export const NewArrivals = () => (
  <div className="bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-light text-gray-900 mb-4">
          New Arrivals
        </h2>
        <p className="text-gray-500">
          Discover our latest products just in
        </p>
      </div>
      <ElectronicsSlider 
        category={null}
        featuredOnly={false}
        maxProducts={8}
      />
    </div>
  </div>
);

export const BestSellers = () => (
  <div className="bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-light text-gray-900 mb-4">
          Best Sellers
        </h2>
        <p className="text-gray-500">
          Our most popular products
        </p>
      </div>
      <ElectronicsSlider 
        category={null}
        featuredOnly={false}
        maxProducts={6}
      />
    </div>
  </div>
);