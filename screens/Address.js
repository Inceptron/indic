import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RadioButton } from "react-native-paper";

import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { colors } from "../config/theme";
import { auth, db } from "../config/firebase";

const Address = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [addressType, setAddressType] = useState("Home");

  const handleSubmit = async () => {
    if (
      name === "" ||
      mobile === "" ||
      pinCode === "" ||
      state === "" ||
      address === "" ||
      landmark === "" ||
      city === ""
    ) {
      ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT);
    } else {
      try {
        await setDoc(doc(db, "address", userData.email), {
          name,
          mobile,
          pinCode,
          state,
          address,
          landmark,
          city,
          addressType,
        });

        setName("");
        setMobile("");
        setPinCode("");
        setState("");
        setAddress("");
        setLandmark("");
        setCity("");
        setAddressType("Home");

        console.log("Address submitted to Firestore successfully!");
        navigation.navigate("Basket");
      } catch (error) {
        console.error("Error submitting address to Firestore:", error.message);
      }
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData(user);
      } else {
        console.log("User is signed out.");
      }
    });
  });
  return (
    <ScrollView
      style={{
        width: "100%",
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: colors.light.secondary,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "black",
          marginVertical: 10,
        }}
      >
        CONTACT
      </Text>
      <View
        style={{
          backgroundColor: colors.light.primary,
          padding: 5,
          paddingVertical: 3,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Mobile"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="numeric"
        />
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "black",
          marginVertical: 10,
        }}
      >
        ADDRESS
      </Text>
      <View
        style={{
          backgroundColor: colors.light.primary,
          padding: 5,
          paddingVertical: 3,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Landmark"
          value={landmark}
          onChangeText={setLandmark}
        />

        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />

        <TextInput
          style={styles.input}
          placeholder="Pin Code"
          value={pinCode}
          onChangeText={setPinCode}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="State"
          value={state}
          onChangeText={setState}
        />

        <View style={styles.radioGroup}>
          <Text style={styles.radioLabel}>Type of Address:</Text>
          <RadioButton
            value="Home"
            status={addressType === "Home" ? "checked" : "unchecked"}
            onPress={() => setAddressType("Home")}
          />
          <Text style={styles.radioText}>Home</Text>
          <RadioButton
            value="Work"
            status={addressType === "Work" ? "checked" : "unchecked"}
            onPress={() => setAddressType("Work")}
          />
          <Text style={styles.radioText}>Work</Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: colors.light.primary,
          padding: 5,
          marginTop: 10,
        }}
      >
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Address;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "lightgray",
    borderWidth: 1,
    marginVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 3,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  radioLabel: {
    marginRight: 10,
    fontSize: 16,
  },
  radioText: {
    marginRight: 20,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
