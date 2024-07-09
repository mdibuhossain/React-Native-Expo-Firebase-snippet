import { View, Text, TextInput } from "react-native";
import React from "react";

const CustomInpurField = (props) => {
  const {
    type,
    label,
    value,
    setValue,
    labelStyle,
    GroupedButton,
    specialStyle,
    containerStyle,
    inputFieldStyle,
    handleChangeText,
    inputFieldContainerStyle,
    ...rest
  } = props;

  const [inputValue, setInputValue] = React.useState("");

  const cbProcessInputValue = () => {
    return new Promise((resolve, resject) => {
      resolve(inputValue);
    });
  };

  return (
    <View className={`w-full ${containerStyle}`}>
      <Text className={`text-gray-400 ${labelStyle}`}>{label}</Text>
      <View className={`w-full mt-2 flex-row ${specialStyle}`}>
        <View
          className={`w-full h-10 border border-gray-700 focus:border-blue-600 ${inputFieldContainerStyle}`}
        >
          <TextInput
            type={type}
            value={value || inputValue}
            onChangeText={handleChangeText || setInputValue}
            secureTextEntry={type === "password"}
            keyboardType={type === "email" ? "email-address" : "default"}
            className={`flex-1 text-base text-gray-300 p-2 ${inputFieldStyle}`}
            {...rest}
          />
        </View>
        {GroupedButton && <GroupedButton cbFn={cbProcessInputValue} />}
      </View>
    </View>
  );
};

export default CustomInpurField;
