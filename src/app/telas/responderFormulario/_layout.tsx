import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ou true, se quiser o header
      }}
    />
  );
}
