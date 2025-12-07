import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Tab = createMaterialTopTabNavigator();

interface TabItem {
    name: string;
    component: React.ComponentType<any>;
}

interface CustomTopTabsProps {
    tabs: TabItem[];
}

export default function CustomTopTabs({ tabs }: CustomTopTabsProps) {
    return (
        <Tab.Navigator
            screenOptions={{
                swipeEnabled: true,
                animationEnabled: true,
                tabBarShowLabel: false,
            }}
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            {tabs.map((tab) => (
                <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
            ))}
        </Tab.Navigator>
    );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "center",
                gap:30,
                backgroundColor: "#f5f5f5",
                paddingVertical: 10,
            }}
        >
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={{
                            backgroundColor: isFocused ? "#FF7A00" : "#fff",
                            paddingVertical: 8,
                            paddingHorizontal: 20,
                            borderRadius: 20,
                            elevation: isFocused ? 2 : 0,

                            // iOS
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4.65,
                        }}
                    >
                        <Text
                            style={{
                                color: isFocused ? "#fff" : "#000",
                                fontWeight: "bold",
                                fontSize:18
                            }}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
