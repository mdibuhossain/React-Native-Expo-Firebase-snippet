import { View, Text, ScrollView } from "react-native";
import React from "react";

const ScreenLayout = ({ children }) => {
  return (
    <View className="bg-primary h-full px-4 py-5">
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      {children}
      {/* </ScrollView> */}
    </View>
  );
};

export default ScreenLayout;
