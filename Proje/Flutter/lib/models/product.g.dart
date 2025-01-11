
part of 'product.dart';

Product _$ProductFromJson(Map<String, dynamic> json) => Product(
      json['title'] as String,
      (json['price'] as num).toDouble(),
      json['id'] as String,
      json['description'] as String,
      json['image'] as String,
      json['category'] as String? ?? '',
    );

Map<String, dynamic> _$ProductToJson(Product instance) => <String, dynamic>{
      'title': instance.title,
      'price': instance.price,
      'id': instance.id,
      'description': instance.description,
      'image': instance.image,
      'category': instance.category,
    };
