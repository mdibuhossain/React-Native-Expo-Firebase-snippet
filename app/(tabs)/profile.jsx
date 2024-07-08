import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import CustomButton from "../../components/CustomButton";
import { logOut, updateUserData, verifyEmail } from "../../lib/firebaseService";
import { useGlobalContext } from "../../context/GlobalProvider";
import ScreenLayout from "../../components/ScreenLayout";
import { images } from "../../constants";
import CustomInpurField from "../../components/CustomInpurField";
import FeatherIcons from "@expo/vector-icons/Feather";

const Profile = () => {
  const { user, checkUser, isLoading } = useGlobalContext();
  const [newName, setNewName] = React.useState("");

  const handleUpdateFullName = async () => {
    try {
      if (newName.trim() === "") return alert("Name cannot be empty");
      const result = await updateUserData({ displayName: newName.trim() });
      if (result) {
        checkUser();
        setNewName("");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await verifyEmail();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ScreenLayout>
      <View className="flex-1 items-center">
        <View className="absolute top-0 right-0">
          <TouchableOpacity onPress={logOut}>
            <FeatherIcons name="log-out" size={25} color="#FF9C01" />
          </TouchableOpacity>
        </View>
        <View className="w-full items-center">
          <View className="p-1 justify-center items-center rounded-full bg-gray-700">
            <Image
              className="w-20 h-20 rounded-full"
              resizeMode="contain"
              source={images.profile}
            />
          </View>
          <Text className="text-white text-base font-mPbold mt-2">
            {isLoading ? "Loading..." : user?.displayName || "No name found"}
          </Text>
          <Text className="text-white text-xs font-mPregular">
            {isLoading
              ? "Loading..."
              : `${user?.email}${user?.emailVerified ? " ✅" : " ❌"}`}
          </Text>
          {!user?.emailVerified && (
            <CustomButton
              title="Verify Email"
              containerStyle="px-4 py-1 rounded-full mt-3 active:bg-red-600"
              textStyle="text-white text-xs uppercase"
              handlePress={handleVerifyEmail}
            />
          )}
        </View>
        <View className="w-full">
          <CustomInpurField
            value={newName}
            label="Full Name"
            containerStyle="mt-5"
            inputFieldContainerStyle="flex-1 focus:!border-secondary"
            handleChangeText={setNewName}
            GroupedButton={
              <CustomButton
                title="Update"
                containerStyle="justify-center items-center px-2 rounded-none active:bg-red-600"
                textStyle="text-white text-xs uppercase"
                handlePress={handleUpdateFullName}
              />
            }
          />
        </View>
        <View className="flex-1 justify-end">
          <CustomButton
            title="Sign Out"
            containerStyle="px-4 py-1 rounded-full mt-3 active:bg-red-600"
            textStyle="text-white uppercase"
            handlePress={logOut}
          />
        </View>
      </View>
    </ScreenLayout>
  );
};

export default Profile;
