import React, { useRef, useEffect, useContext, useState } from "react";
import { View, ScrollView, Image, Dimensions } from "react-native";
import { colors } from "../../config/theme";
import { ThemeContext } from "../../context/ThemeContext";

const images = [
  require("../../images/banners/banner1.jpg"),
  require("../../images/banners/banner3.jpg"),
  require("../../images/banners/banner2.jpeg"),
  require("../../images/banners/banner4.jpg"),
];

const Banners = () => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const screenWidth = Dimensions.get("window").width;

  const scrollViewRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(screenWidth);
  const scrollSpeed = 3000; // Adjust as needed
  const contentWidth = screenWidth * (images.length + 2);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextScrollPosition = scrollPosition + screenWidth;

      if (nextScrollPosition >= contentWidth) {
        // Transition to the first duplicated image
        scrollViewRef.current &&
          scrollViewRef.current.scrollTo({
            x: screenWidth,
            y: 0,
            animated: true,
          });
        setScrollPosition(screenWidth);
      } else {
        setScrollPosition(nextScrollPosition);
        scrollViewRef.current &&
          scrollViewRef.current.scrollTo({
            x: nextScrollPosition,
            y: 0,
            animated: true,
          });
      }
    }, scrollSpeed);

    return () => {
      clearInterval(timer);
    };
  }, [scrollPosition]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={true}
      contentContainerStyle={{ width: contentWidth }}
    >
      <Image
        style={{
          width: screenWidth,
          height: 200,
        }}
        source={images[images.length - 1]}
      />
      {images.map((imageSource, index) => (
        <Image
          key={index}
          style={{
            width: screenWidth,
            height: 200,
          }}
          source={imageSource}
        />
      ))}
      <Image
        style={{
          width: screenWidth,
          height: 200,
        }}
        source={images[0]}
      />
    </ScrollView>
  );
};

export default Banners;
