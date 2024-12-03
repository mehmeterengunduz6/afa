from rest_framework import viewsets
from .models import Stock
from .serializer import StockSerializer
# Create your views here.

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all().order_by('-weight')
    serializer_class = StockSerializer
