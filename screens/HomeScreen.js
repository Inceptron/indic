import React, { useContext, useState, useRef } from "react";
import { colors } from "../config/theme";
import { ThemeContext } from "../context/ThemeContext";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import CategoryTabSection from "../components/sections/CategoryTabSection";
import FeaturedItemsSection from "../components/sections/FeaturedItemsSection";
import HorizontalDealsSection from "../components/sections/HorizontalDealsSection";
import Banners from "../components/sections/Banners";

const HomeScreens = () => {
  const navigation = useNavigation();

  return (
    <>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: colors.light.primary,
          borderBottomWidth: 0.5,
          borderColor: colors.light.gray,
        }}
      >
        <TouchableOpacity
          style={{
            borderRadius: 5,
            borderWidth: 1,
            borderColor: colors.light.gray,
            height: 40,
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: 3,
          }}
          onPress={() => navigation.navigate("SearchScreen")}
        >
          <EvilIcons name="search" size={30} color="black" />
          <Text style={{ marginLeft: 5 }}>
            Search for Products, Brands and more...
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[
          {
            backgroundColor: colors.light.primary,
          },
          styles.Container,
        ]}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ flexGrow: 1 }}>
          <Banners />
          <CategoryTabSection />
          <FeaturedItemsSection title="Featured Items" start="12" />
          <HorizontalDealsSection title="Todays Deals" start="20" />
          <FeaturedItemsSection title="Live Sale" start="42" />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  sectionTitle: {
    marginTop: 25,
    marginLeft: 25,
    marginBottom: 25,
  },
});

export default HomeScreens;
