import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import CustomButton from "../../components/CustomButton";
import {
  logOut,
  updateUserData,
  uploadProfilePicture,
  verifyEmail,
} from "../../lib/firebaseService";
import { useGlobalContext } from "../../context/GlobalProvider";
import ScreenLayout from "../../components/ScreenLayout";
import { images } from "../../constants";
import CustomInpurField from "../../components/CustomInpurField";
import FeatherIcons from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const { user, checkUser, isLoading, setUser } = useGlobalContext();
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

  const handleUpdateProfilePicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      selectionLimit: 1,
    });
    if (!result.canceled) {
      uploadProfilePicture({
        mimeType: result.assets[0].mimeType,
        uri: result.assets[0].uri,
      })
        .then(async (url) => {
          const response = await updateUserData({
            photoURL: url,
          });
          if (response) {
            setUser({ ...user, photoURL: url });
          }
        })
        .catch((error) => {
          alert(error.message);
        });
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
          <View className="relative p-1 justify-center items-center rounded-full bg-gray-700">
            <Image
              className="w-20 h-20 rounded-full"
              resizeMode="contain"
              source={user?.photoURL ? { uri: user?.photoURL } : images.profile}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              className="absolute right-0 bottom-0 bg-gray-700 rounded-full p-1"
            >
              <MaterialCommunityIcons
                onPress={handleUpdateProfilePicture}
                name="image-edit-outline"
                color="#FF9C01"
                size={20}
              />
            </TouchableOpacity>
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
        <View className="w-full flex-1 mt-5">
          <ScrollView className="w-full">
            <View>
              <TouchableOpacity
                onPress={logOut}
                activeOpacity={0.7}
                className="w-full p-2"
              >
                <View>
                  <Text className="text-gray-300 font-mPmedium text-lg">
                    Sign out
                  </Text>
                </View>
              </TouchableOpacity>
              <View className="border-t border-gray-700 w-full" />
            </View>
          </ScrollView>
        </View>
      </View>
    </ScreenLayout>
  );
};

export default Profile;
