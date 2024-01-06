import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../config/theme";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

const Orders = () => {
  const navigation = useNavigation();

  const connectToMongoDB = async () => {
    fetch("https://indic-fusion.vercel.app/api/products")
      .then((response) => response.json())
      .then((data) => {
        console.log(data[0]);
      })
      .catch((error) => console.error("Error fetching options:", error));
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        // console.log(uid);
      } else {
        console.log("User is signed out.");
      }
    });
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.light.primary,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: colors.light.tertiary,
          marginBottom: 20,
        }}
      >
        Orders
      </Text>
      <TouchableOpacity
        onPress={() => connectToMongoDB()}
        style={{
          backgroundColor: colors.light.accent,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 5,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: colors.light.primary,
          }}
        >
          Explore
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Orders;
