from rest_framework import serializers
from .models import Stock, StockPrice

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        if isinstance(representation['weight'], str):
            representation['weight'] = float(representation['weight'])
        return representation

class StockPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockPrice
        fields = '__all__'
    