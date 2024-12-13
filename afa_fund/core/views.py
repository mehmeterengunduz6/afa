from rest_framework import viewsets
from django.views import View
from .models import Stock
from .serializer import StockSerializer
from django.http import JsonResponse
# Create your views here.

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all().order_by('-weight')
    serializer_class = StockSerializer
    
class MonthlyStockView(View):
    def get(self, request, year, month):
        stocks = Stock.objects.filter(date__year=year, date__month=month).order_by('-weight')
        
        stock_data = StockSerializer(stocks, many=True).data
        
        return JsonResponse(stock_data, safe=False)
    
