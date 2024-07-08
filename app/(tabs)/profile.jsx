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
import { images, svgs } from "../../constants";
import CustomInpurField from "../../components/CustomInpurField";
import FeatherIcons from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { FlatList } from "react-native-gesture-handler";

const Profile = () => {
  const { user, checkUser, isLoading, setUser } = useGlobalContext();
  const [newName, setNewName] = React.useState("");
  const [isLoadingForPhoto, setIsLoadingForPhoto] = React.useState(false);
  const [isLoadingForName, setIsLoadingForName] = React.useState(false);
  const [isLoadingForEmailVerify, setIsLoadingForEmailVerify] =
    React.useState(false);

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
    setIsLoadingForEmailVerify(true);
    try {
      await verifyEmail();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoadingForEmailVerify(false);
    }
  };

  const handleUpdateProfilePicture = async () => {
    setIsLoadingForPhoto(true);
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
    setIsLoadingForPhoto(false);
  };

  const signOut = async () => {
    await logOut();
    setUser(null);
  };

  return (
    <ScreenLayout>
      <View className="flex-1 items-center">
        <View className="absolute top-0 right-0">
          <TouchableOpacity onPress={signOut}>
            <FeatherIcons name="log-out" size={25} color="#FF9C01" />
          </TouchableOpacity>
        </View>
        <FlatList
          className="w-full"
          ListHeaderComponent={() => (
            <>
              <View className="w-full items-center">
                <View className="relative w-[90] h-[90] justify-center items-center rounded-full bg-gray-700">
                  {isLoadingForPhoto ? (
                    <Image
                      className="w-16 h-16 rounded-full"
                      resizeMode="contain"
                      source={images.spinning}
                    />
                  ) : (
                    <Image
                      className="w-20 h-20 rounded-full"
                      resizeMode="contain"
                      source={
                        user?.photoURL
                          ? { uri: user?.photoURL }
                          : images.profile
                      }
                    />
                  )}
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
                  {isLoading
                    ? "Loading..."
                    : user?.displayName || "No name found"}
                </Text>
                <Text className="text-white text-xs font-mPregular">
                  {isLoading
                    ? "Loading..."
                    : `${user?.email}${user?.emailVerified ? " ✅" : " ❌"}`}
                </Text>
                {!user?.emailVerified && (
                  <CustomButton
                    title={
                      isLoadingForEmailVerify ? "Loading..." : "Verify Email"
                    }
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
            </>
          )}
          data={[
            {
              title: "My Orders",
              icon: svgs.orders,
              onPress: () => {},
            },
            {
              title: "My Address",
              icon: svgs.address,
              onPress: () => {},
            },
            {
              title: "My Payment",
              icon: svgs.payment,
              onPress: () => {},
            },
            {
              title: "My Wishlist",
              icon: svgs.wishlist,
              onPress: () => {},
            },
            {
              title: "My Reviews",
              icon: svgs.reviews,
              onPress: () => {},
            },
            {
              title: "My Coupons",
              icon: svgs.coupons,
              onPress: () => {},
            },
            {
              title: "My Notifications",
              icon: svgs.notifications,
              onPress: () => {},
            },
            {
              title: "My Settings",
              icon: svgs.settings,
              onPress: () => {},
            },
            {
              title: "Sign Out",
              icon: svgs.settings,
              onPress: signOut,
            },
          ]}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                onPress={item.onPress}
                activeOpacity={0.7}
                className="flex-row items-center justify-between py-3"
              >
                <View className="flex-row items-center">
                  {item.icon}
                  <Text className="text-white text-base font-mPregular ml-3">
                    {item.title}
                  </Text>
                </View>
                <FeatherIcons name="chevron-right" size={20} color="#FF9C01" />
              </TouchableOpacity>
              <View className="border-t border-gray-700 w-full" />
            </View>
          )}
        />
      </View>
    </ScreenLayout>
  );
};

export default Profile;
