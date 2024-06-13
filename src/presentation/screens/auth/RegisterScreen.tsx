import {Button, Input, Layout, Text} from '@ui-kitten/components';
import {Alert, ScrollView, useWindowDimensions} from 'react-native';
import {CustomIcon} from '../../components/ui/CustomIcon';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/NavigationStack';
import {useAuthStore} from '../../store/auth/useAuthStore';
import {useState} from 'react';

interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'> {}

export const RegisterScreen = ({navigation}: Props) => {
  const {register} = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const {height} = useWindowDimensions();

  const onRegister = async () => {
    if (
      form.email.length === 0 ||
      form.password.length === 0 ||
      form.fullName.length === 0
    ) {
      return;
    }

    setIsLoading(true);
    const success = await register(form.email, form.password, form.fullName);
    setIsLoading(false);

    if (success) return;

    Alert.alert('Error', 'Hubo un problema al registrar el usuario');
  };

  return (
    <Layout style={{flex: 1}}>
      <ScrollView style={{marginHorizontal: 40}}>
        <Layout style={{paddingTop: height * 0.3}}>
          <Text category="h1">Crear cuenta</Text>
          <Text category="p2">Por favor, crea una cuenta para continuar</Text>
        </Layout>

        {/* Inputs */}
        <Layout style={{marginTop: 20}}>
          <Input
            placeholder="Nombre completo"
            accessoryLeft={<CustomIcon name="person-outline" />}
            style={{marginBottom: 10}}
            value={form.fullName}
            onChangeText={fullName => setForm({...form, fullName})}
          />

          <Input
            placeholder="Correo electronico"
            keyboardType="email-address"
            autoCapitalize="none"
            accessoryLeft={<CustomIcon name="email-outline" />}
            style={{marginBottom: 10}}
            value={form.email}
            onChangeText={email => setForm({...form, email})}
          />

          <Input
            placeholder="Contraseña"
            autoCapitalize="none"
            secureTextEntry
            accessoryLeft={<CustomIcon name="lock-outline" />}
            style={{marginBottom: 10}}
            value={form.password}
            onChangeText={password => setForm({...form, password})}
          />
        </Layout>

        <Layout style={{height: 20}} />

        <Layout>
          <Button
            disabled={isLoading}
            onPress={onRegister}
            appearance="filled"
            accessoryRight={<CustomIcon name="arrow-forward-outline" white />}>
            Crear
          </Button>
        </Layout>

        <Layout style={{height: 50}} />

        <Layout
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text>¿Ya tienes cuenta?</Text>
          <Text
            status="primary"
            category="s1"
            onPress={() => navigation.goBack()}>
            {' '}
            Ingresar{' '}
          </Text>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
