import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ToastAndroid,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { colors } from "../../config/theme";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import FeaturedCardComponent from "../cards/FeaturedCardComponent";

const screenWidth = Dimensions.get("window").width;
const halfScreenWidth = screenWidth / 2;

const FeaturedItemsSection = ({ title, start }) => {
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
          onPress={() =>
            navigation.navigate("Shop", {
              title,
            })
          }
        >
          See all
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {products.map(
          (product, index) =>
            index > start &&
            index < parseInt(start) + parseInt(9) && (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.container,
                    {
                      backgroundColor: colors.light.primary,
                      borderColor: colors.light.gray,
                    },
                  ]}
                  onPress={() =>
                    navigation.navigate("Product", {
                      title: product.productName,
                      pId: product._id,
                    })
                  }
                >
                  <FeaturedCardComponent imageSource={product.productImage} />
                  <View style={styles.textContainer}>
                    <Text
                      style={[styles.title, { color: colors.light.text }]}
                      numberOfLines={1}
                    >
                      {product.productName}
                    </Text>
                    <Text
                      style={[
                        styles.description,
                        { color: colors.light.tertiary },
                      ]}
                      numberOfLines={2}
                    >
                      {product.productLongDesc}
                    </Text>
                    <Text
                      style={[styles.price, { color: colors.light.text }]}
                      numberOfLines={1}
                    >
                      <Text
                        style={{
                          color: colors.light.tertiary,
                          fontWeight: "normal",
                          fontStyle: "italic",
                          textDecorationLine: "line-through",
                        }}
                      >
                        ₹
                        {parseFloat(
                          (product.productStock * product.productStock) / 100 +
                            product.productStock
                        ).toFixed(2)}
                      </Text>{" "}
                      ₹{product.productStock}{" "}
                      <Text
                        style={{
                          color: colors.light.red,
                          fontWeight: "normal",
                        }}
                      >
                        {parseInt(product.productStock)}% Off
                      </Text>
                    </Text>
                    <Text
                      style={{ color: colors.light.tertiary, fontSize: 12 }}
                      numberOfLines={1}
                    >
                      <Ionicons
                        name="star"
                        size={12}
                        color={colors.light.red}
                      />
                      {product.popularity}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: halfScreenWidth,
    padding: 10,
    borderWidth: 0.5,
  },
  textContainer: {
    padding: 0,
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontWeight: "700",
    fontSize: 15,
  },
  description: {
    fontSize: 11,
    color: "#7a7a7a",
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
  },
  wishlist: {
    marginTop: -45,
    marginLeft: 5,
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: "#ddd",
    paddingLeft: 2.5,
    paddingTop: 3,
  },
});

export default FeaturedItemsSection;
