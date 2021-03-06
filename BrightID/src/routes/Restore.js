import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import { useTranslation } from 'react-i18next';
import RecoveryCodeScreen from '@/components/Recovery/RecoveryCodeScreen';
import RestoreScreen from '@/components/Recovery/RestoreScreen';

const Stack = createStackNavigator();

const Restore = () => {
  // const { t } = useTranslation();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecoveryCode" component={RecoveryCodeScreen} />
      <Stack.Screen name="Restore" component={RestoreScreen} />
    </Stack.Navigator>
  );
};

export default Restore;
