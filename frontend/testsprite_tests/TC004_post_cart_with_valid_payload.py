import requests

BASE_URL = "http://localhost:5173"
CART_ENDPOINT = f"{BASE_URL}/cart"
TIMEOUT = 30

def test_post_cart_with_valid_payload():
    # Example valid payload for cart mutation
    valid_payload = {
        "items": [
            {"productId": "petfood-001", "quantity": 2},
            {"productId": "petfood-005", "quantity": 1}
        ]
    }
    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(CART_ENDPOINT, json=valid_payload, headers=headers, timeout=TIMEOUT)
        # Verify status code 200
        assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"

        # Response should be a JSON object confirming updated cart state
        json_data = response.json()
        assert isinstance(json_data, dict), "Response is not a JSON object"

        # Check keys typically in cart state response: items and item count
        assert "items" in json_data, "'items' key not found in response"
        assert "totalItemCount" in json_data or "itemCount" in json_data or "count" in json_data, "Item count key not found in response"
        
        # Validate item count equals sum of quantities in payload
        returned_items = json_data.get("items", [])
        total_quantity_returned = sum(item.get("quantity", 0) for item in returned_items)
        expected_quantity = sum(item.get("quantity", 0) for item in valid_payload["items"])
        assert total_quantity_returned == expected_quantity, (
            f"Returned total quantity {total_quantity_returned} does not match expected {expected_quantity}"
        )

        # UI reflection validation is out of scope for API test,
        # but ensuring response consistency suffices here
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"
    except ValueError as ve:
        assert False, f"Response JSON parsing failed: {ve}"

test_post_cart_with_valid_payload()