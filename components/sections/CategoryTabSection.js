import React, { useRef, useState, useContext, useEffect } from "react";
import { View, ScrollView, Dimensions, Text } from "react-native";
import CategoryCard from "../cards/CategoryTabCard";
import CategoryContent from "../content/CategoryContent";
import { colors } from "../../config/theme";
import { ThemeContext } from "../../context/ThemeContext";

const CategoryTabSection = () => {
  const { theme } = useContext(ThemeContext);
  const [options, setOptions] = useState([]);
  let activeColors = colors[theme.mode];

  const categoriesScrollViewRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryPress = (category, index) => {
    setSelectedCategory(category);

    const screenWidth = Dimensions.get("window").width;
    const categoryWidth = 150;
    const scrollToX = index * categoryWidth - (screenWidth - categoryWidth) / 2;

    categoriesScrollViewRef.current.scrollTo({
      x: scrollToX,
      animated: true,
    });
  };

  useEffect(() => {
    fetch("https://indic-fusion.vercel.app/api/options")
      .then((response) => response.json())
      .then((data) => {
        setOptions(data);
        setSelectedCategory(data[0].docId);
      })
      .catch((error) => console.error("Error fetching options:", error));
  }, []);

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={categoriesScrollViewRef}
        contentContainerStyle={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {options.map((items, index) => (
          <CategoryCard
            key={index}
            index={index + 1}
            title={items.optionName}
            onPress={() => handleCategoryPress(items.docId, index)}
            isActive={items.docId === selectedCategory}
          />
        ))}
      </ScrollView>

      <CategoryContent selectedCategory={selectedCategory} />
    </View>
  );
};

export default CategoryTabSection;
