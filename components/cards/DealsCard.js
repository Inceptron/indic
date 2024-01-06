import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { colors } from "../../config/theme";
import { useNavigation } from "@react-navigation/native";
import AWS from "aws-sdk";

const CardComponent = ({ imageSource, title, description, id }) => {
  const navigation = useNavigation();

  const [imageURL, setImageURL] = useState(null);

  const bucketName = "naahar";
  const signedUrlExpireSeconds = 60 * 1;

  const getImages = () => {
    AWS.config.update({
      accessKeyId: "***********************",
      secretAccessKey: "*************************************",
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
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.light.primary }]}
      onPress={() => navigation.navigate("Product", { title, pId: id })}
    >
      <Image
        style={styles.image}
        // source={{ uri: imageURL }}
        source={require("../../images/decors/decor3.jpeg")}
      />
      <View style={styles.contentContainer}>
        <Text
          style={[styles.title, { color: colors.light.text }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          style={[styles.description, { color: colors.light.tertiary }]}
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    flexDirection: "column",
    margin: 10,
    padding: 8,
  },
  image: {
    width: 184,
    height: 100,
    borderRadius: 0,
  },
  contentContainer: {
    padding: 10,
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#777",
    flexWrap: "wrap", // Add this line to wrap the text
    overflow: "hidden", // Add this line to hide overflowing text
    lineHeight: 18, // Add this line to improve line spacing
    maxHeight: 36, // Add this line to limit the number of lines to 2
  },
});

export default CardComponent;
