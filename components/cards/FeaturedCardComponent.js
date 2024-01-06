import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../config/theme";
import { useNavigation } from "@react-navigation/native";
import AWS from "aws-sdk";

const FeaturedCardComponent = ({ imageSource }) => {
  const navigation = useNavigation();

  const [imageURL, setImageURL] = useState(null);

  const bucketName = "naahar";
  const signedUrlExpireSeconds = 60 * 1;

  const getImages = () => {
    AWS.config.update({
      accessKeyId: "AKIAZLRNTB3H7QGOH4VB",
      secretAccessKey: "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",
      region: "ap-south-1",
    });

    const s3 = new AWS.S3();

    s3.getSignedUrl(
      "getObject",
      {
        Bucket: bucketName,
        Key: encodeURI(imageSource),
        Expires: signedUrlExpireSeconds,
      },
      (err, url) => {
        if (err) {
          console.error("Error fetching signed URL:", err);
        } else {
          setImageURL(url);
        }
      }
    );
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <View>
      <Image
        style={styles.image}
        // source={{ uri: imageURL }}
        source={require("../../images/decors/decor1.jpg")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
});

export default FeaturedCardComponent;
