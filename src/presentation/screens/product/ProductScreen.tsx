import {
  Button,
  ButtonGroup,
  Input,
  Layout,
  useTheme,
} from '@ui-kitten/components';
import {MainLayout} from '../../layouts/MainLayout';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/NavigationStack';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getProductById} from '../../../actions/products/get-product-by-id';
import {useRef} from 'react';
import {FlatList, Image, ScrollView} from 'react-native';
import {FadeInImage} from '../../components/ui/FadeInImage';
import {Gender, Product, Size} from '../../../domain/entities/product';
import {CustomIcon} from '../../components/ui/CustomIcon';
import {Formik} from 'formik';
import {updateCreateProduct} from '../../../actions/products/update-create-product';
import {CameraAdapter} from '../../../config/adapters/camera-adapter';

const sizes: Size[] = [Size.Xs, Size.S, Size.M, Size.L, Size.Xl, Size.Xxl];
const genders: Gender[] = [Gender.Kid, Gender.Men, Gender.Women, Gender.Unisex];

interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'> {}

export const ProductScreen = ({route}: Props) => {
  const productIdRef = useRef(route.params.productId);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const {data: product, isLoading} = useQuery({
    queryKey: ['product', productIdRef.current],
    staleTime: 100 * 60 * 5,
    queryFn: () => getProductById(productIdRef.current),
  });

  const mutation = useMutation({
    mutationFn: (data: Product) =>
      updateCreateProduct({...data, id: productIdRef.current}),
    onSuccess(data: Product) {
      productIdRef.current = data.id; //creacion

      queryClient.invalidateQueries({queryKey: ['products', 'infinite']});
      queryClient.invalidateQueries({queryKey: ['product', data.id]});
    },
  });

  if (!product) {
    return <MainLayout title="Cargando..." />;
  }

  return (
    <Formik initialValues={product} onSubmit={mutation.mutate}>
      {({handleChange, handleSubmit, values, errors, setFieldValue}) => (
        <MainLayout
          title={values.title}
          rightAction={async () => {
            const photos = await CameraAdapter.getPicturesFromLibrary();
            console.log(photos);
            setFieldValue('images', [...values.images, ...photos]);
          }}
          rightActionIcon="image-outline">
          <ScrollView style={{flex: 1}}>
            <Layout
              style={{
                marginVertical: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {values.images.length === 0 ? (
                <Image
                  source={require('../../../assets/no-product-image.png')}
                  style={{width: 300, height: 300}}
                />
              ) : (
                <FlatList
                  data={values.images}
                  keyExtractor={item => item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => (
                    <FadeInImage
                      uri={item}
                      style={{width: 300, height: 300, marginHorizontal: 7}}
                    />
                  )}
                />
              )}
            </Layout>

            {/* Formulario */}
            <Layout style={{marginHorizontal: 10}}>
              <Input
                label="Titulo"
                style={{marginVertical: 5}}
                value={values.title}
                onChangeText={handleChange('title')}
              />
              <Input
                label="Slug"
                style={{marginVertical: 5}}
                value={values.slug}
                onChangeText={handleChange('slug')}
              />
              <Input
                label="Descripcion"
                value={values.description}
                onChangeText={handleChange('description')}
                multiline
                numberOfLines={5}
                style={{marginVertical: 5}}
              />
            </Layout>

            {/* Precion e inventario */}
            <Layout
              style={{
                marginHorizontal: 15,
                flexDirection: 'row',
                gap: 10,
                marginVertical: 5,
              }}>
              <Input
                label="Precio"
                style={{flex: 1}}
                value={values.price.toString()}
                onChangeText={handleChange('price')}
                keyboardType="numeric"
              />
              <Input
                label="Inventario"
                style={{flex: 1}}
                value={values.stock.toString()}
                onChangeText={handleChange('stock')}
                keyboardType="numeric"
              />
            </Layout>

            {/* Selectores */}
            <ButtonGroup
              size="medium"
              appearance="outline"
              style={{
                margin: 2,
                marginTop: 20,
                marginHorizontal: 15,
              }}>
              {sizes.map(size => (
                <Button
                  style={{
                    flex: 1,
                    backgroundColor: values.sizes.includes(size)
                      ? theme['color-primary-200']
                      : undefined,
                  }}
                  key={size}
                  onPress={() =>
                    setFieldValue(
                      'sizes',
                      values.sizes.includes(size)
                        ? values.sizes.filter(s => s !== size)
                        : [...values.sizes, size],
                    )
                  }>
                  {size}
                </Button>
              ))}
            </ButtonGroup>

            <ButtonGroup
              size="medium"
              appearance="outline"
              style={{
                margin: 2,
                marginTop: 20,
                marginHorizontal: 15,
              }}>
              {genders.map(gender => (
                <Button
                  style={{
                    flex: 1,
                    backgroundColor: values.gender.startsWith(gender)
                      ? theme['color-primary-200']
                      : undefined,
                  }}
                  key={gender}
                  onPress={() => setFieldValue('gender', gender)}>
                  {gender}
                </Button>
              ))}
            </ButtonGroup>

            {/*Boton guardar */}
            <Button
              accessoryLeft={<CustomIcon name="save-outline" white />}
              onPress={() => handleSubmit()}
              disabled={mutation.isPending}
              style={{margin: 15}}>
              Guardar
            </Button>

            <Layout style={{height: 200}} />
          </ScrollView>
        </MainLayout>
      )}
    </Formik>
  );
};
