from django.db import models

# Create your models here.

class Stock(models.Model):
    symbol = models.CharField(max_length=10)
    name = models.CharField(max_length=100)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    date = models.DateField(auto_now=False, auto_now_add=False, null=True,blank=True)
    is_AFA = models.BooleanField(default=True)
    

    def __str__(self):
        return self.symbol
    
class StockPrice(models.Model):
    date = models.DateField(auto_now=False, auto_now_add=False, null=True, blank=True)
    afaPrice = models.DecimalField(max_digits=6, decimal_places=4)
    spPrice = models.DecimalField(max_digits=6, decimal_places=2)
    
    def __str__(self):
        return str(self.date)