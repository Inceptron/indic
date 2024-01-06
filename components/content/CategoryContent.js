import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import CardComponent from "../cards/CardComponent";

const CategoryContent = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://indic-fusion.vercel.app/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <ScrollView vertical showsHorizontalScrollIndicator={false}>
      {products
        .filter((product) => product.optionId === selectedCategory)
        .slice(0, 7)
        .map((product, index) => (
          <CardComponent
            key={index}
            index={index}
            imageSource={product.productImage}
            title={product.productName}
            id={product._id}
            description={product.productLongDesc}
          />
        ))}
    </ScrollView>
  );
};

export default CategoryContent;
