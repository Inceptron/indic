import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";

import { colors } from "../config/theme";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";

const Payment = ({ route }) => {
  // const { paymentSignedUrl } = route.params;
  const paymentSignedUrl = "https://decoderashish.me/google-forms/";
  const navigation = useNavigation();

  const [userData, setUserData] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleWebViewMessage = (event) => {
    const scrapedData = event.nativeEvent.data;
    console.log("Scraped Data:", scrapedData);
  };

  const webViewScript = `
    const academicHeadingElement = document.querySelector('.custom-control-label');
    
    if (academicHeadingElement) {
      const academicHeadingText = academicHeadingElement.textContent.trim();
      
      window.ReactNativeWebView.postMessage(academicHeadingText);
    } else {
      window.ReactNativeWebView.postMessage('Element with class "custom-control-label" not found');
    }
  `;

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
    <WebView
      style={{
        marginTop: 0,
      }}
      source={{ uri: paymentSignedUrl }}
      onLoadStart={() => setIsLoading(false)}
      onLoad={() => setIsLoading(true)}
      injectedJavaScript={webViewScript}
      onMessage={handleWebViewMessage}
    />
  );
};

const styles = {
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};

export default Payment;
