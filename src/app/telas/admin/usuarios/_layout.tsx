import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CriarUsuario from './criar';
//import Visualizar from './visualizar';

const Tab = createMaterialTopTabNavigator();

export default function UsuariosTopTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'gray',
        tabBarIndicatorStyle: { backgroundColor: 'orange' },
        tabBarLabelStyle: { fontSize: 14, fontWeight: '500' },
      }}
    >
      <Tab.Screen name="Criar" component={CriarUsuario} />
    </Tab.Navigator>
  );
}
