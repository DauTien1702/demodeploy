import ProductCard from "./ProductCard";

const ProductList = ({ products }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "20px",
    }}
  >
    {products.map((p) => (
      <ProductCard key={p.id} product={p} />
    ))}
  </div>
);

export default ProductList;
