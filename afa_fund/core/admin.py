from django.contrib import admin
from .models import Stock, StockPrice

# Register your models here.

class StockAdmin(admin.ModelAdmin):
    search_fields = ['symbol',]

admin.site.register(Stock, StockAdmin)
admin.site.register(StockPrice)
