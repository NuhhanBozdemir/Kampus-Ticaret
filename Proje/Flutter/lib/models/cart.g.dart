
part of 'cart.dart';

Cart _$CartFromJson(Map<String, dynamic> json) => Cart(
      json['title'] as String,
      (json['price'] as num).toDouble(),
      json['id'] as String,
      json['description'] as String,
      json['image'] as String,
      json['category'] as String? ?? '',
      (json['count'] as num).toInt(),
    );

Map<String, dynamic> _$CartToJson(Cart instance) => <String, dynamic>{
      'title': instance.title,
      'price': instance.price,
      'id': instance.id,
      'description': instance.description,
      'image': instance.image,
      'category': instance.category,
      'count': instance.count,
    };
