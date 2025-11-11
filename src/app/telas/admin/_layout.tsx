import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function AdminLayout() {
  return (
    <Tabs
      initialRouteName="formulario"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#fff', height: 70, paddingBottom: 6 },
        tabBarIcon: ({ color, focused, size }) => {
          const name =
            route.name === 'formulario'
              ? focused ? 'document-text' : 'document-text-outline'
              : focused ? 'people' : 'people-outline';
          return <Ionicons name={name as any} size={24} color={color} />;
        },
        tabBarLabel: ({ color }) => (
          <Text style={{ color, fontSize: 12 }}>
            {route.name === 'formulario' ? 'Formulário' : 'Usuários'}
          </Text>
        ),
      })}
    >
      <Tabs.Screen name="formulario" />
      <Tabs.Screen name="usuarios" />
    </Tabs>
  );
}
