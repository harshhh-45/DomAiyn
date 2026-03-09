import urllib.request
import urllib.error

try:
    response = urllib.request.urlopen('http://127.0.0.1:8000/')
    print("Success")
except urllib.error.HTTPError as e:
    content = e.read().decode('utf-8')
    with open('error_debug.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Error 500 saved to error_debug.html")
except Exception as e:
    print(f"Other error: {e}")
