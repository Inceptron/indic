import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Modal,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../config/theme";
import { Ionicons } from "@expo/vector-icons";
import RangeSlider from "react-native-range-slider-expo";

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [range, setRange] = useState({ min: 500, max: 10000 });

  const handlePriceValueChange = (newRange) => {
    setRange(newRange);
    // Perform any additional actions when the value changes
  };

  const toValueOnChange = (newMax) => {
    setRange((prevRange) => ({ ...prevRange, max: newMax }));
  };

  const fromValueOnChange = (newMin) => {
    setRange((prevRange) => ({ ...prevRange, min: newMin }));
  };

  const items = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

  const inputRef = React.createRef();

  useEffect(() => {
    inputRef.current?.focus();
  });

  const searchProduct = () => {
    setSearchText("");
    navigation.navigate("Shop", { query: searchText, title: searchText });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.light.primary,
        paddingTop: 40,
      }}
    >
      <View
        style={{
          height: 50,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 0.5,
          borderColor: colors.light.secondary,
          backgroundColor: colors.light.primary,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: colors.light.primary,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color={colors.light.tint}
            onPress={() => navigation.goBack()}
            style={{
              marginLeft: 15,
            }}
          />
          <TextInput
            style={{
              color: colors.light.text,
              fontSize: 16,
              width: 200,
              height: 40,
              paddingHorizontal: 10,
            }}
            ref={inputRef}
            value={searchText}
            onChangeText={(e) => setSearchText(e)}
            onSubmitEditing={() => searchProduct()}
            placeholder="Serach products..."
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: colors.light.primary,
          }}
        >
          <View
            style={{
              alignItems: "center",
              marginRight: 15,
              backgroundColor: colors.light.secondary,
              borderRadius: 50,
              paddingVertical: 6,
              paddingHorizontal: 7,
            }}
          >
            <Ionicons
              name="heart-outline"
              size={25}
              color={colors.light.tint}
              onPress={() => navigation.navigate("Wishlist")}
            />
          </View>
          <View
            style={{
              alignItems: "center",
              marginRight: 15,
              backgroundColor: colors.light.secondary,
              borderRadius: 50,
              paddingVertical: 6,
              paddingHorizontal: 7,
            }}
          >
            <Ionicons
              name="basket-outline"
              size={25}
              color={colors.light.tint}
              onPress={() => navigation.navigate("Basket")}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            paddingHorizontal: 30,
            borderRadius: 5,
            backgroundColor: colors.light.accent,
            marginTop: 50,
          }}
          onPress={() => navigation.navigate("Filter")}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "400",
              color: colors.light.primary,
            }}
          >
            Filter by Category & Price
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
