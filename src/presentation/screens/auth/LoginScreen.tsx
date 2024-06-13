import {Button, Input, Layout, Text} from '@ui-kitten/components';
import {Alert, ScrollView, useWindowDimensions} from 'react-native';
import {CustomIcon} from '../../components/ui/CustomIcon';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/NavigationStack';
import {API_URL} from '@env';
import {useState} from 'react';
import {useAuthStore} from '../../store/auth/useAuthStore';

interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> {}

export const LoginScreen = ({navigation}: Props) => {
  const {login} = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const {height} = useWindowDimensions();

  const onLogin = async () => {
    if (form.email.length === 0 || form.password.length === 0) {
      return;
    }

    setIsLoading(true);
    const success = await login(form.email, form.password);
    setIsLoading(false);
    if (success) return;

    Alert.alert('Error', 'Usuario o contraseña incorrectos');
  };

  return (
    <Layout style={{flex: 1}}>
      <ScrollView style={{marginHorizontal: 40}}>
        <Layout style={{paddingTop: height * 0.35}}>
          <Text category="h1">Ingresar</Text>
          <Text category="p2">Por favor, ingresa para continuar</Text>
        </Layout>

        {/* Inputs */}
        <Layout style={{marginTop: 20}}>
          <Input
            placeholder="Correo electronico"
            keyboardType="email-address"
            autoCapitalize="none"
            accessoryLeft={<CustomIcon name="email-outline" />}
            value={form.email}
            onChangeText={value => setForm({...form, email: value})}
            style={{marginBottom: 10}}
          />

          <Input
            placeholder="Contraseña"
            autoCapitalize="none"
            secureTextEntry
            value={form.password}
            onChangeText={value => setForm({...form, password: value})}
            accessoryLeft={<CustomIcon name="lock-outline" />}
            style={{marginBottom: 10}}
          />
        </Layout>

        <Layout style={{height: 20}} />

        <Layout>
          <Button
            disabled={isLoading}
            onPress={onLogin}
            appearance="filled"
            accessoryRight={<CustomIcon name="arrow-forward-outline" white />}>
            Ingresar
          </Button>
        </Layout>

        <Layout style={{height: 50}} />

        <Layout
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text>¿No tienes cuenta?</Text>
          <Text
            status="primary"
            category="s1"
            onPress={() => navigation.navigate('RegisterScreen')}>
            {' '}
            crea una{' '}
          </Text>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
