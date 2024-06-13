import {useNavigation} from '@react-navigation/native';
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CustomIcon} from '../components/ui/CustomIcon';

interface Props {
  title: string;
  subtitle?: string;

  rightAction?: () => void;
  rightActionIcon?: string;

  children?: React.ReactNode;
}

export const MainLayout = ({
  title,
  subtitle,
  rightAction,
  rightActionIcon,
  children,
}: Props) => {
  const {top} = useSafeAreaInsets();
  const {canGoBack, goBack} = useNavigation();

  const renderBackAction = () => (
    <TopNavigationAction
      icon={<CustomIcon name="chevron-left-outline" />}
      onPress={goBack}
    />
  );

  const RenderRightAction = () => {
    if (rightAction === undefined || rightActionIcon === undefined) {
      return null;
    }
    return (
      <TopNavigationAction
        onPress={rightAction}
        icon={<CustomIcon name={rightActionIcon} />}
      />
    );
  };

  return (
    <Layout style={{paddingTop: top + 10}}>
      <TopNavigation
        title={title}
        subtitle={subtitle}
        alignment="center"
        accessoryLeft={canGoBack() ? renderBackAction : undefined}
        accessoryRight={() => <RenderRightAction />}
      />
      <Divider />
      <Layout style={{height: '100%'}}>{children}</Layout>
    </Layout>
  );
};
