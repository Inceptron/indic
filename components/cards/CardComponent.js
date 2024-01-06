import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { colors } from "../../config/theme";
import { useNavigation } from "@react-navigation/native";
import AWS from "aws-sdk";

const CardComponent = ({ id, imageSource, title, description }) => {
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
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.light.secondary }]}
      onPress={() => navigation.navigate("Product", { title: title, pId: id })}
    >
      <Image
        style={styles.image}
        // source={{ uri: imageURL }}
        source={require("../../images/decors/decor2.jpeg")}
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
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    flexDirection: "row",
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  contentContainer: {
    padding: 10,
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#777",
    flexWrap: "wrap",
    overflow: "hidden",
    lineHeight: 18,
    maxHeight: 36,
  },
});

export default CardComponent;
