import React from "react";
import ProductCard from "../../component/ProductCard/ProductCard";
const RelatedProducts = ({ products }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default RelatedProducts;
