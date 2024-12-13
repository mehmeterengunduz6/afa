from django.shortcuts import redirect
from .models import Stock

class RedirectIfNoDataMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        print(f"Request path: {request.path}")  # Debugging line
        
        # Redirect root path to /2024/11
        if request.path == '/':
            return redirect('http://localhost:3000/2024/11/')
        
        # Allow requests to /2024/11 and /2024/10 to proceed
        if request.path in ['/2024/11/', '/2024/10/']:
            return self.get_response(request)

        # Redirect all other requests to /2024/11
        return redirect('http://localhost:3000/2024/11/')