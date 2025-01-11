import 'package:flutter/material.dart';
import 'package:shoppers/components/grid_card.dart';
import 'package:shoppers/components/loader.dart';
import 'package:shoppers/models/product.dart';
import 'package:shoppers/screens/login.dart';
import 'package:shoppers/screens/product.dart';
import 'package:shoppers/utils/firestore.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final data = ["1", "2"];
  Future<List<Product>>? products;

  @override
  void initState() {
    super.initState();
    products = FirestoreUtil.getProducts([]);
  }

  @override
  Widget build(BuildContext context) {
    onCardPress(Product product) {
      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => ProductScreen(
                product: product,
              )));
    }

    return FutureBuilder<List<Product>>(
        future: products,
        builder: (context, AsyncSnapshot<List<Product>> snapshot) {
          if (snapshot.hasData && snapshot.data != null) {
            return GridView.builder(
                itemCount: snapshot.data?.length,
                padding: const EdgeInsets.symmetric(vertical: 30),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2, mainAxisSpacing: 30, crossAxisSpacing: 30),
                itemBuilder: (BuildContext context, int index) {
                  return GridCard(
                      product: snapshot.data![index],
                      index: index,
                      onPress: () {
                        onCardPress(snapshot.data![index]);
                      });
                });
          } else {
            return const Center(child: Loader());
          }
        });
  }
}
