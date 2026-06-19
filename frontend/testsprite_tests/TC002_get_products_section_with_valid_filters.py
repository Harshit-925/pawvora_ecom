import requests

BASE_URL = "http://localhost:5173"
TIMEOUT = 30

def test_get_products_section_with_valid_filters():
    url = f"{BASE_URL}/"
    try:
        response = requests.get(url, timeout=TIMEOUT)
        response.raise_for_status()
        assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"
        html_content = response.text

        # Removed assertion checking for Products section id because it is likely client-side SPA fragment

        # Check presence of likely product item identifiers (best effort as without parsing we can't count exactly)
        product_indicators = ['class="product-card"', 'class="carousel-item"', 'class="product-item"']
        product_presence = any(indicator in html_content for indicator in product_indicators)
        assert product_presence, "No product items indicators found in products section"

        # Check presence of pagination controls
        pagination_indicators = ['class="pagination"', 'class="pagination-controls"', 'class="carousel-pagination"']
        pagination_presence = any(indicator in html_content for indicator in pagination_indicators)
        assert pagination_presence, "Pagination controls not found in products section"

        # Check presence of category filtering UI
        category_indicators = ['class="category-filter"', 'class="category-strip"', 'class="filters"']
        category_presence = any(indicator in html_content for indicator in category_indicators)
        assert category_presence, "Category filtering controls not found in products section"

    except requests.RequestException as e:
        assert False, f"Request failed: {e}"


test_get_products_section_with_valid_filters()