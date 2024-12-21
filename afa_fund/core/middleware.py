from django.shortcuts import redirect

class RedirectIfNoDataMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        print(f"Request path: {request.path}")  # Debugging line
        
        # Allow only the root path
        if request.path == '/':
            return self.get_response(request)
        
        # Redirect all other requests to the root path
        return redirect('/')