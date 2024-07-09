import {
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import CustomButton from "../../components/CustomButton";
import {
  logOut,
  updateUserData,
  uploadProfilePicture,
  verifyEmail,
} from "../../lib/firebaseService";
import { useGlobalContext } from "../../context/GlobalProvider";
import { images, svgs } from "../../constants";
import FeatherIcons from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { FlashList } from "@shopify/flash-list";
import CustomInpurField from "../../components/CustomInpurField";

const Profile = () => {
  const { user, setIsLoading, isLoading, setTrigger, trigger, setUser } =
    useGlobalContext();
  const [isLoadingForPhoto, setIsLoadingForPhoto] = React.useState(false);
  const [isLoadingForName, setIsLoadingForName] = React.useState(false);
  const [isLoadingForEmailVerify, setIsLoadingForEmailVerify] =
    React.useState(false);
  const [isLoadingLocal, setIsLoadingLocal] = React.useState(false);

  const handleUpdateFullName = async (newName) => {
    setIsLoadingForName(true);
    try {
      if (newName.trim() === "") return alert("Name cannot be empty");
      const result = await updateUserData({ displayName: newName.trim() });
      if (result?.displayName) {
        setUser({ ...user, displayName: result.displayName });
        setIsLoadingForName(false);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoadingForName(false);
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

  const onRefresh = () => {
    setIsLoading(true);
  };

  React.useEffect(() => {
    if (isLoading) {
      setTrigger(!trigger);
    }
  }, [isLoading]);

  const items = [
    {
      isButton: false,
      title: "My Orders",
      icon: svgs.orders,
      onPress: () => {},
    },
    {
      isButton: false,
      title: "My Address",
      icon: svgs.address,
      onPress: () => {},
    },
    {
      isButton: false,
      title: "My Payment",
      icon: svgs.payment,
      onPress: () => {},
    },
    {
      isButton: false,
      title: "My Wishlist",
      icon: svgs.wishlist,
      onPress: () => {},
    },
    {
      isButton: false,
      title: "My Reviews",
      icon: svgs.reviews,
      onPress: () => {},
    },
    {
      isButton: false,
      title: "My Coupons",
      icon: svgs.coupons,
      onPress: () => {},
    },
    {
      isButton: false,
      title: "My Notifications",
      icon: svgs.notifications,
      onPress: () => {},
    },
    {
      isButton: false,
      title: "My Settings",
      icon: svgs.settings,
      onPress: () => {},
    },
    {
      isButton: true,
      title: "Sign Out",
      icon: svgs.settings,
      onPress: signOut,
    },
  ];

  const renderItem = ({ item }) => {
    return (
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
          {!item.isButton && (
            <FeatherIcons name="chevron-right" size={20} color="#FF9C01" />
          )}
        </TouchableOpacity>
        <View className="border-t border-gray-700 w-full" />
      </View>
    );
  };

  const listHeaderComponent = () => {
    return (
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
                  user?.photoURL ? { uri: user?.photoURL } : images.profile
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
            {isLoading || isLoadingForName
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
              title={isLoadingForEmailVerify ? "Loading..." : "Verify Email"}
              containerStyle="px-4 py-1 rounded-full mt-3 active:bg-red-600"
              textStyle="text-white text-xs uppercase"
              handlePress={handleVerifyEmail}
            />
          )}
        </View>
        <View className="w-full">
          <CustomInpurField
            label="Full Name"
            containerStyle="mt-5"
            inputFieldContainerStyle="flex-1 focus:!border-secondary"
            GroupedButton={({ cbFn }) => (
              <CustomButton
                title="Update"
                containerStyle="justify-center items-center px-2 rounded-none active:bg-red-600"
                textStyle="text-white text-xs uppercase"
                handlePress={() => {
                  cbFn().then(async (value) => {
                    await handleUpdateFullName(value);
                  });
                }}
              />
            )}
          />
        </View>
      </>
    );
  };

  return (
    // <ScreenLayout>
    <View className="bg-primary flex-1 items-center">
      {/* <View className="absolute top-0 right-0">
          <TouchableOpacity onPress={signOut}>
            <FeatherIcons name="log-out" size={25} color="#FF9C01" />
          </TouchableOpacity>
        </View> */}
      <View className="w-full flex-1">
        <FlashList
          data={items}
          estimatedItemSize={10}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 10,
            paddingTop: 10,
          }}
          ListHeaderComponent={listHeaderComponent}
          keyExtractor={(_, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={onRefresh}
              colors={["#FF9C01"]}
            />
          }
        />
      </View>
    </View>
    // </ScreenLayout>
  );
};

export default Profile;
