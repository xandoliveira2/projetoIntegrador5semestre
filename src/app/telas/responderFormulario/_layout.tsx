// import { Stack, useRouter } from "expo-router";
// import React from "react";
// import { Image, TouchableOpacity, View } from "react-native";

// export default function Layout() {
//   const router = useRouter();

//   return (
//     <Stack
//       screenOptions={{
//         headerShown: true,
//         header: () => (
//           <View
//             style={{
//               height: 60, // 🔥 Aqui sim funciona
//               backgroundColor: "#fff",
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "space-between",
//               paddingHorizontal: 15,
//             }}
//           >
//             <TouchableOpacity
//               onPress={() => router.back()}
//               style={{
//                 borderWidth: 1.5,
//                 borderColor: "#ccc",
//                 borderRadius: 50,
//                 width: 40,
//                 height: 40,
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Image
//                 source={require("@/../assets/icons/seta_esquerda.png")}
//                 style={{ width: 20, height: 20 }}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => console.log("Menu aberto")}
//               style={{
//                 borderWidth: 1.5,
//                 borderColor: "#ccc",
//                 borderRadius: 50,
//                 width: 40,
//                 height: 40,
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Image
//                 source={require("@/../assets/icons/menu_tres_pontos.png")}
//                 style={{ width: 20, height: 20 }}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </View>
//         ),
//       }}
//     />
//   );
// }
