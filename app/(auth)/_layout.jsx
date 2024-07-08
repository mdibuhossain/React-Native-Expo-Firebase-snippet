import { Redirect, Stack } from "expo-router";
import React from "react";
import { useGlobalContext } from "../../context/GlobalProvider";

const AuthLayout = () => {
  const { isLoggedIn, user } = useGlobalContext();

  if (isLoggedIn && user?.email) return <Redirect href="/home" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
};

export default AuthLayout;
