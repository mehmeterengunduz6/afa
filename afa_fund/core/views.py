from rest_framework import viewsets
from django.views import View
from .models import Stock, StockPrice
from .serializer import StockSerializer, StockPriceSerializer
from django.http import JsonResponse
# Create your views here.

class StockPriceView(View):
    def get(self, request):
        stock_price = StockPrice.objects.all().order_by('date')
    
        stock_price_data = StockPriceSerializer(stock_price, many=True).data
        
        return JsonResponse(stock_price_data, safe=False)
    

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all().order_by('-weight')
    serializer_class = StockSerializer
    
class MonthlyStockView(View):
    def get(self, request, year, month):
        stocks = Stock.objects.filter(date__year=year, date__month=month).order_by('-weight')
        
        stock_data = StockSerializer(stocks, many=True).data
        
        return JsonResponse(stock_data, safe=False)
    
class StockDetailView(View):
    def get(self, request, symbol):
        stock_data = Stock.objects.filter(symbol=symbol).order_by('date')
        if not stock_data.exists():
            return JsonResponse({'error': 'Stock not found'}, status=404)
        
        serialized_data = StockSerializer(stock_data, many=True).data
        return JsonResponse(serialized_data, safe=False)
        
    
