import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  query,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../config/firebase";
import { colors } from "../config/theme";
import { onAuthStateChanged } from "firebase/auth";

const screenHeight = Dimensions.get("screen").height;

const Wishlish = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    getWishlist(user.email);
    setRefreshing(false);
  };

  const getWishlist = async (email) => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        console.log("User is signed out.");
      }
    });

    const q = query(collection(db, "users", email, "wishlist"));
    onSnapshot(q, async (querySnapshot) => {
      const wishlistData = querySnapshot.docs.map((doc) => doc.data());
      if (wishlistData) {
        setWishlist(wishlistData);

        const productItems = [];
        await Promise.all(
          wishlist.map(async (item) => {
            fetch("https://indic-fusion.vercel.app/api/products")
              .then((response) => response.json())
              .then((data) => {
                setProducts(data);
                setIsLoading(false);
              })
              .catch((error) => {
                ToastAndroid.show(error, ToastAndroid.SHORT);
                setIsLoading(false);
              });
          })
        );
        setProducts(productItems);
        setIsLoading(false);
      }
    });
  };

  const deleteProduct = async (pId) => {
    const subCollRef = collection(db, "users/" + user.email + "/wishlist/");
    await deleteDoc(doc(subCollRef, "product" + pId))
      .then(() => {
        ToastAndroid.show("Removed from wishlist.", ToastAndroid.BOTTOM);
        getWishlist(user.email);
      })
      .catch((err) => {
        ToastAndroid.show("Something went wrong.", ToastAndroid.BOTTOM);
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        getWishlist(authUser.email);
      } else {
        console.log("User is signed out.");
      }
    });
    onRefresh();
  }, []);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.light.pink}
        style={[
          styles.loadingIndicator,
          { backgroundColor: colors.light.primary },
        ]}
      />
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={{
          backgroundColor: colors.light.secondary,
        }}
      >
        {wishlist.map((bItem, id) => (
          <View key={id}>
            {products.map((item, id) =>
              bItem.productId == item._id ? (
                <View
                  key={id}
                  style={{
                    width: "100%",
                    height: 200,
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    marginVertical: 5,
                    backgroundColor: colors.light.primary,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Product", {
                        title: item.title,
                        pId: item.id,
                      })
                    }
                    style={{
                      width: "35%",
                      height: 180,
                    }}
                  >
                    <Image
                      style={styles.image}
                      // source={{ uri: item.thumbnail }}
                      source={require("../images/decors/decor2.jpeg")}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: "65%",
                      paddingHorizontal: 10,
                      alignContent: "flex-start",
                    }}
                  >
                    <View
                      style={{
                        marginBottom: 5,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: "600" }}>
                        {item.productName}
                      </Text>
                      <Ionicons
                        name="trash-outline"
                        size={15}
                        color="black"
                        onPress={() => deleteProduct(item._id)}
                      />
                    </View>
                    <Text numberOfLines={3} style={{ fontSize: 12 }}>
                      {item.productCartDesc}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.light.gray,
                        marginVertical: 3,
                      }}
                    >
                      BRAND:{" "}
                      <Text style={{ color: colors.light.text }}>
                        {item.brand}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: colors.light.red,
                        marginVertical: 2,
                      }}
                    >
                      ₹{item.finalPrice}{" "}
                      <Text
                        style={{
                          color: colors.light.text,
                          textDecorationLine: "line-through",
                        }}
                      >
                        ₹
                        {parseFloat(
                          (item.finalPrice * item.finalPrice) / 100 +
                            item.finalPrice
                        ).toFixed(2)}
                      </Text>
                      {parseInt(item.productStock)}% Off
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: colors.light.text,
                        marginVertical: 3,
                      }}
                    >
                      14 Days{" "}
                      <Text
                        style={{
                          color: colors.light.gray,
                          fontWeight: "normal",
                        }}
                      >
                        return available
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "normal",
                        color: colors.light.gray,
                        marginVertical: 3,
                      }}
                    >
                      Delivery by:{" "}
                      <Text
                        style={{ color: colors.light.text, fontWeight: "600" }}
                      >
                        30 August
                      </Text>
                    </Text>
                  </View>
                </View>
              ) : null
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 180,
    marginVertical: 5,
  },
});

export default Wishlish;
