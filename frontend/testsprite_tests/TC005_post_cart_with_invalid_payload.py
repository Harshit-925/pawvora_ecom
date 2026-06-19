import requests

BASE_URL = "http://localhost:5173"
CART_ENDPOINT = f"{BASE_URL}/cart"
TIMEOUT = 30


def post_cart_with_invalid_payload():
    # Step 1: Establish a known good cart state by posting a valid payload
    valid_payload = {
        "items": [
            {"productId": "pet-food-001", "quantity": 1}
        ]
    }
    try:
        valid_response = requests.post(CART_ENDPOINT, json=valid_payload, timeout=TIMEOUT)
        assert valid_response.status_code == 200, f"Setup failed: Expected 200 but got {valid_response.status_code}"
        previous_cart_state = valid_response.json()

        # Step 2: Attempt to post an invalid/malformed payload
        # Examples of invalid payloads: missing required fields, wrong types, or totally incorrect format
        invalid_payloads = [
            None,
            "",
            {},
            {"items": "not-a-list"},
            {"invalidField": 123},
            {"items": [{"productId": None, "quantity": "two"}]},
            "this is not a json object",
        ]
        for payload in invalid_payloads:
            headers = {"Content-Type": "application/json"}
            if isinstance(payload, str):
                # Send raw text if payload is a string (simulate malformed JSON)
                response = requests.post(CART_ENDPOINT, data=payload, headers=headers, timeout=TIMEOUT)
            elif payload is None:
                # Send no body or null JSON
                response = requests.post(CART_ENDPOINT, json=None, timeout=TIMEOUT)
            else:
                response = requests.post(CART_ENDPOINT, json=payload, timeout=TIMEOUT)

            # Assert that a 4xx client error is received
            assert 400 <= response.status_code < 500, (
                f"Expected 4xx error for invalid payload {payload}, got {response.status_code}"
            )

            # Step 3: Verify cart state is not updated by refetching or comparing with previous valid state
            # No API for GET cart is described, so we rely on the response from a valid POST still representing correct state
            # Re-post the valid payload and compare results to ensure no change
            verify_response = requests.post(CART_ENDPOINT, json=valid_payload, timeout=TIMEOUT)
            assert verify_response.status_code == 200, "Failed to verify cart state after invalid attempt"
            current_cart_state = verify_response.json()
            assert current_cart_state == previous_cart_state, "Cart state changed after invalid payload"

    except requests.RequestException as e:
        assert False, f"HTTP request failed: {str(e)}"


post_cart_with_invalid_payload()