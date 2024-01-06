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

const Filter = () => {
  const navigation = useNavigation();
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

  const setSelectedCat = () => {};

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.light.primary,
      }}
    >
      <ScrollView
        style={{
          backgroundColor: colors.light.secondary,
          paddingTop: 20,
        }}
      >
        <Text
          style={{
            alignSelf: "center",
            fontSize: 17,
            fontWeight: "600",
            paddingBottom: 10,
          }}
        >
          Select Product Category
        </Text>
        <View
          style={{
            padding: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <TouchableOpacity style={styles.cat}>
            <Image
              source={require("../images/apparels/jeans.jpeg")}
              style={{
                borderRadius: 50,
                width: 80,
                height: 80,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cat}>
            <Image
              source={require("../images/apparels/shirt1.jpg")}
              style={{
                borderRadius: 50,
                width: 80,
                height: 80,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cat}>
            <Image
              source={require("../images/apparels/tshirt.jpeg")}
              style={{
                borderRadius: 50,
                width: 80,
                height: 80,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <TouchableOpacity style={styles.cat}>
            <Image
              source={require("../images/decors/decor1.jpg")}
              style={{
                borderRadius: 50,
                width: 80,
                height: 80,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cat}>
            <Image
              source={require("../images/decors/decor3.jpeg")}
              style={{
                borderRadius: 50,
                width: 80,
                height: 80,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cat}>
            <Image
              source={require("../images/decors/decor2.jpeg")}
              style={{
                borderRadius: 50,
                width: 80,
                height: 80,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding: 15,
            paddingBottom: 30,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            borderBottomColor: colors.light.gray,
            borderBottomWidth: 0.5,
          }}
        >
          <TouchableOpacity style={styles.cat}>
            <Image
              source={require("../images/toys/toy1.jpg")}
              style={{
                borderRadius: 50,
                width: 80,
                height: 80,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cat}>
            <Image
              source={require("../images/toys/toy2.jpeg")}
              style={{
                borderRadius: 50,
                width: 80,
                height: 80,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cat}>
            <Image
              source={require("../images/toys/toy3.jpeg")}
              style={{
                borderRadius: 50,
                width: 80,
                height: 80,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: "center",
            paddingVertical: 50,
            paddingTop: 30,
          }}
        >
          <Text
            style={{
              fontSize: 15,
            }}
          >
            Price range:{" "}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              ₹{range.min} - ₹{range.max}
            </Text>
          </Text>
          <RangeSlider
            containerStyle={{ width: 220, height: 80 }}
            gravity="center"
            min={500}
            max={10000}
            step={1}
            selectionColor="#3df"
            value={range}
            blankColor="#f618"
            toValueOnChange={(value) => toValueOnChange(value)}
            onValueChanged={(value) => handlePriceValueChange(value)}
            fromValueOnChange={(value) => fromValueOnChange(value)}
            styleSize="small"
          />
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
              backgroundColor: colors.light.pink,
            }}
            onPress={() =>
              navigation.navigate("Shop", {
                title: "Filtred Items...",
              })
            }
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                color: colors.light.secondary,
              }}
            >
              Filter
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  dropdownButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#3498db",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cat: {
    borderRadius: 50,
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: colors.light.gray,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.light.primary,
  },
});
