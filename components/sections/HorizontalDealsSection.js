import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ToastAndroid } from "react-native";
import DealsCard from "../cards/DealsCard";
import { colors } from "../../config/theme";
import { useNavigation } from "@react-navigation/native";

const HorizontalDealsSection = ({ title, start }) => {
  const navigation = useNavigation();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://indic-fusion.vercel.app/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }, []);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "500",
            paddingHorizontal: 10,
            marginTop: 20,
            marginBottom: 15,
            color: colors.light.text,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 14,
            paddingHorizontal: 10,
            marginTop: 20,
            marginBottom: 15,
            color: colors.light.red,
          }}
          onPress={() => navigation.navigate("Shop", { title })}
        >
          See all
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map(
          (product, index) =>
            index > start &&
            index < parseInt(start) + parseInt(9) && (
              <DealsCard
                key={index}
                id={product._id}
                imageSource={product.productImage}
                title={product.productName}
                description={product.productLongDesc}
              />
            )
        )}
      </ScrollView>
    </View>
  );
};

export default HorizontalDealsSection;
