import requests

BASE_URL = "http://localhost:5173"
TIMEOUT = 30

def test_get_main_webpage_navigation_header():
    try:
        response = requests.get(f"{BASE_URL}/", timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
        content = response.text
        # Basic validations for global navbar and sliding cart drawer indicators in HTML
        assert "navbar" in content.lower(), "Navbar not found in the HTML content"
        assert "cart" in content.lower() or "drawer" in content.lower(), "Sliding cart drawer not found in the HTML content"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_get_main_webpage_navigation_header()