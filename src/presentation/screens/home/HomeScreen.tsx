import {useInfiniteQuery} from '@tanstack/react-query';
import {getProductsByPage} from '../../../actions/products/get-products-by-page';
import {MainLayout} from '../../layouts/MainLayout';
import {FullScreenLoader} from '../../components/ui/FullScreenLoader';
import {ProductList} from '../../components/product/ProductList';
import {FAB} from '../../components/ui/FAB';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParams} from '../../navigation/NavigationStack';

export const HomeScreen = () => {
  /* const {isLoading, data: products = []} = useQuery({
    queryKey: ['products', 'infinite'],
    staleTime: 1000 * 60 * 5, //5 minutos
    queryFn: () => getProductsByPage(0),
  }); */
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const {isLoading, data, fetchNextPage} = useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    staleTime: 1000 * 60 * 5, //5 minutos
    initialPageParam: 0,
    queryFn: async params => {
      const products = await getProductsByPage(params.pageParam);
      return products;
    },
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });

  return (
    <>
      <MainLayout title="Teslo Shop - Products" subtitle="Admin app">
        {isLoading ? (
          <FullScreenLoader />
        ) : (
          <ProductList
            products={data?.pages.flat() ?? []}
            fetchNextPage={fetchNextPage}
          />
        )}
      </MainLayout>
      <FAB
        style={{position: 'absolute', bottom: 30, right: 20}}
        iconName="plus-outline"
        onPress={() => navigation.navigate('ProductScreen', {productId: 'new'})}
      />
    </>
  );
};
