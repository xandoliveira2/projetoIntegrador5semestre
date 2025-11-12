import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="criar"
        
        options={{ headerShown: false }} // 👈 Esconde o header da aba
      />
    </Stack>
  );
}
