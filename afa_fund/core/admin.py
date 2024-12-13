from django.contrib import admin
<<<<<<< HEAD
from .models import Stock

# Register your models here.

class StockAdmin(admin.ModelAdmin):
    search_fields = ['symbol',]

admin.site.register(Stock, StockAdmin)
=======

# Register your models here.
>>>>>>> origin/main
