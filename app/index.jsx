import { Image, ScrollView, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import ScreenLayout from "../components/ScreenLayout";
import { useGlobalContext } from "../context/GlobalProvider";

const index = () => {
  const { isLoggedIn, isLoading, user } = useGlobalContext();

  if (isLoading) {
    return (
      <>
        <Text>Loading...</Text>
      </>
    );
  }

  if (isLoggedIn && user?.email) return <Redirect href="/home" />;

  return (
    <>
      <ScreenLayout>
        <View className="justify-center w-full h-full items-center">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover endless possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>
            <Image
              source={images.path}
              resizeMode="contain"
              className="w-[136px] h-[15px] absolute -bottom-[6px] -right-8"
            />
          </View>
          <Text className="text-xs text-gray-100 mt-7 text-center">
            Where creativity meets innovations: embark on a journey of a
            limitless exploration with Aora.
          </Text>
          <CustomButton
            handlePress={() => router.push("/sign-in")}
            containerStyle="w-full h-14 justify-center items-center mt-7"
            textStyle="text-mPsemibold"
            title="Continue with email"
          />
        </View>
        <StatusBar style="light" />
      </ScreenLayout>
    </>
  );
};

export default index;
