import {Icon, useTheme} from '@ui-kitten/components';
import {StyleSheet, Text, View} from 'react-native';

interface Props {
  name: string;
  color?: string;
  white?: boolean;
}

export const CustomIcon = ({name, color, white = false}: Props) => {
  const theme = useTheme();

  if (white) {
    color = theme['color-basic-100'];
  } else if (!color) {
    color = theme['text-basic-color'];
  } else {
    color = theme[color] ?? theme['text-basic-color'];
  }

  return <Icon name={name} style={styles.icon} fill={color} />;
};

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
  },
});
