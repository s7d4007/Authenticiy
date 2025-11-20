import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# 1. Load environment variables
load_dotenv()
API_KEY = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY")
GOOGLE_API_URL = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={API_KEY}"

# 2. Setup the Flask App
app = Flask(__name__)
CORS(app)  # This allows your frontend to talk to this backend

# 3. The Check Route
@app.route('/api/check-url', methods=['POST'])
def check_url():
    data = request.get_json()
    url_to_check = data.get('url')

    if not url_to_check:
        return jsonify({"error": "URL is required"}), 400

    # Prepare the payload for Google
    payload = {
        "client": {
            "clientId": "authenticity-app",
            "clientVersion": "1.0.0"
        },
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [
                {"url": url_to_check}
            ]
        }
    }

    try:
        # Send request to Google
        response = requests.post(GOOGLE_API_URL, json=payload)
        response_data = response.json()
        
        # Check matches
        matches = response_data.get('matches', [])

        if matches:
            # THREAT FOUND
            threat_type = matches[0]['threatType']
            return jsonify({
                "status": "dangerous",
                "title": "Dangerous Link Detected",
                "message": f"This URL is flagged as {threat_type.replace('_', ' ')}. Do not visit."
            })
        else:
            # SAFE
            return jsonify({
                "status": "safe",
                "title": "No Threats Found",
                "message": "Google Safe Browsing has not flagged this URL as dangerous."
            })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "status": "error",
            "title": "Server Error",
            "message": "Could not connect to the security database."
        }), 500

# 4. Run the server
if __name__ == '__main__':
    app.run(debug=True, port=5000)