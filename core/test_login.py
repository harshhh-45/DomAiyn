import requests

def test_login():
    url = "http://127.0.0.1:8000/login/"
    s = requests.Session()
    r = s.get(url)
    csrf = s.cookies.get('csrftoken')
    data = {
        'username': 'testuser',
        'password': 'Password123',
        'csrfmiddlewaretoken': csrf
    }
    r = s.post(url, data=data, allow_redirects=False)
    print(f"Status Code: {r.status_code}")
    print(f"Location: {r.headers.get('Location')}")

if __name__ == "__main__":
    test_login()
