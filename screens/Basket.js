import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Image,
  Text,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  query,
  getDoc,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
  deleteField,
} from "firebase/firestore";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../config/firebase";
import { colors } from "../config/theme";
import { onAuthStateChanged } from "firebase/auth";

const screenHeight = Dimensions.get("screen").height;

const Basket = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [basket, setBasket] = useState([]);
  const [products, setProducts] = useState([]);
  const [documentCount, setDocumentCount] = useState(0);
  const [isAddress, setIsAddress] = useState(false);
  const [address, setAddress] = useState({});

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    getBasket(user.email);
    setRefreshing(false);
  };

  const getAddress = async () => {
    try {
      const addressDocRef = doc(db, "address", user.email);
      const addressDocSnapshot = await getDoc(addressDocRef);

      if (addressDocSnapshot.exists()) {
        const addressData = addressDocSnapshot.data();
        setAddress(addressData);
        setIsAddress(true);
      } else {
        // No address found for the user
        console.log("No address found for the user");
        setIsAddress(false);
      }
    } catch (error) {
      console.error("Error checking address existence:", error.message);
      return false;
    }
  };

  const getBasket = async (email) => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        console.log("User is signed out.");
      }
    });

    const q = query(collection(db, "users", email, "basket"));
    onSnapshot(q, async (querySnapshot) => {
      const countedDocs = querySnapshot.size;
      const basketData = querySnapshot.docs.map((doc) => doc.data());
      if (basketData) {
        setBasket(basketData);
        setDocumentCount(countedDocs);
        await Promise.all(
          basket.map(async (item) => {
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
      }
    });
  };

  const deleteProduct = async (pId) => {
    const subCollRef = collection(db, "users/" + user.email + "/basket/");
    await deleteDoc(doc(subCollRef, "product" + pId))
      .then(() => {
        ToastAndroid.show("Removed from basket.", ToastAndroid.BOTTOM);
        getBasket(user.email);
      })
      .catch((err) => {
        ToastAndroid.show("Something went wrong.", ToastAndroid.BOTTOM);
      });
  };

  const placeOrder = async () => {
    // navigation.navigate("Payment", {
    //   paymentSignedUrl:
    //     "https://test.instamojo.com/@rahul_sharma_d558e/27dd4d4aae284d6fa72e64db43d7f142",
    // });

    const subCollRef = collection(db, "users", user.email, "basket");

    const querySnapshot = await getDocs(subCollRef);

    const deletePromises = querySnapshot.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
    });

    await Promise.all(deletePromises);

    deleteField(doc(collection(db, "users", user.email)), "basket");

    ToastAndroid.show("Order Placed.", ToastAndroid.BOTTOM);
    getBasket(user.email);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        getBasket(authUser.email);
      } else {
        console.log("User is signed out.");
      }
    });
    getAddress();
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
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            backgroundColor: colors.light.secondary,
            marginBottom: 50,
          }}
        >
          <View
            style={{
              width: "100%",
              paddingVertical: 5,
              paddingHorizontal: 15,
              marginVertical: 5,
              backgroundColor: colors.light.primary,
            }}
          >
            {isAddress == true ? (
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    marginBottom: 10,
                  }}
                >
                  {address.name}
                </Text>
                <Text style={{ color: colors.light.gray }}>
                  {address.landmark}
                </Text>
                <Text style={{ color: colors.light.gray }}>
                  {address.address}
                </Text>
                <Text style={{ color: colors.light.gray }}>
                  {address.city +
                    ", " +
                    address.state +
                    " - " +
                    address.pinCode}
                </Text>
                <Text style={{ color: colors.light.gray, marginTop: 10 }}>
                  Mobile:{" "}
                  <Text style={{ color: colors.light.text, fontWeight: "600" }}>
                    +91 {address.mobile}
                  </Text>
                </Text>
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 40,
                    borderColor: colors.light.gray,
                    borderWidth: 0.5,
                    borderRadius: 2,
                    marginVertical: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => navigation.navigate("Address")}
                >
                  <Text>Edit Address</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={{ alignSelf: "center" }}>No addresses found</Text>
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 40,
                    borderColor: colors.light.gray,
                    borderWidth: 0.5,
                    borderRadius: 2,
                    marginVertical: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => navigation.navigate("Address")}
                >
                  <Text>Add Address</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {basket.map((bItem, id) => (
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
                          title: item.productName,
                          pId: item._id,
                        })
                      }
                      style={{
                        width: "35%",
                        height: 180,
                      }}
                    >
                      <Image
                        style={styles.image}
                        // source={{ uri: item.imageURL }}
                        source={require("../images/decors/decor3.jpeg")}
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
                          style={{
                            color: colors.light.text,
                            fontWeight: "600",
                          }}
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
          {documentCount != 0 ? (
            <View
              style={{
                width: "100%",
                paddingVertical: 5,
                paddingHorizontal: 15,
                marginVertical: 5,
                backgroundColor: colors.light.primary,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "600" }}>
                Product details{" "}
                <Text style={{ fontWeight: "normal" }}>
                  ({documentCount} items)
                </Text>
              </Text>
              <View style={styles.horizontalLine}></View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: 3,
                }}
              >
                <Text style={{ fontSize: 13, color: colors.light.gray }}>
                  Total MRP
                </Text>
                <Text style={{ fontSize: 13, color: colors.light.text }}>
                  ₹4657
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: 3,
                }}
              >
                <Text style={{ fontSize: 13, color: colors.light.gray }}>
                  Discount on MRP
                </Text>
                <Text style={{ fontSize: 13, color: colors.light.text }}>
                  -₹2174
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: 3,
                }}
              >
                <Text style={{ fontSize: 13, color: colors.light.gray }}>
                  Convenience Fee
                </Text>
                <Text style={{ fontSize: 13, color: colors.light.text }}>
                  ₹50
                </Text>
              </View>
              <View style={styles.horizontalLine}></View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.light.text,
                    fontWeight: "600",
                  }}
                >
                  Total
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.light.text,
                    fontWeight: "600",
                  }}
                >
                  ₹2150
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.bottomBtn, { backgroundColor: colors.light.pink }]}
          onPress={() => placeOrder()}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: colors.light.primary,
            }}
          >
            Place order
          </Text>
        </TouchableOpacity>
      </View>
    </>
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
  bottom: {
    width: "100%",
    height: 50,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  bottomBtn: {
    width: "100%",
    height: 50,
    borderTopWidth: 0,
    borderWidth: 0.5,
    borderColor: colors.light.pink,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  horizontalLine: {
    borderBottomColor: colors.light.secondary,
    borderBottomWidth: 1,
    marginVertical: 5,
  },
});

export default Basket;
