import requests

def test_get_products_section_with_invalid_filters():
    base_url = "http://localhost:5173"
    # Using invalid filter key 'invalidFilter' in query; server returns HTML with 200 status
    url = f"{base_url}/#products?invalidFilter="
    headers = {
        "Accept": "text/html",
    }
    try:
        response = requests.get(url, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request to {url} failed with exception: {e}"

    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert len(response.text) > 0, "Response HTML content is empty"

test_get_products_section_with_invalid_filters()
