import { View, Text, Button, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  textStyle,
  isLoading,
  isDisabled,
  handlePress,
  containerStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${
        isLoading || isDisabled ? "bg-gray-600" : "bg-secondary"
      } rounded-xl ${containerStyle} ${isLoading ? "opacity-75" : ""}`}
      activeOpacity={0.8}
      disabled={isLoading || isDisabled}
    >
      <Text
        className={`text-primary font-mPbold text-lg text-center ${textStyle}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
