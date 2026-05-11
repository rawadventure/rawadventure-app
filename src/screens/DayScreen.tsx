import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DAYS } from '../data/days';
import { RootStackParamList } from '../../App';
import ChecklistScreen  from './ChecklistScreen';
import ProtocolScreen   from './ProtocolScreen';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Day'>;
  route: RouteProp<RootStackParamList, 'Day'>;
};

export default function DayScreen({ navigation, route }: Props) {
  const { dayId } = route.params;
  const day = DAYS.find(d => d.id === dayId)!;

  if (day.type === 'checklist') {
    return <ChecklistScreen navigation={navigation} route={route} day={day} />;
  }
  return <ProtocolScreen navigation={navigation} route={route} day={day} />;
}
