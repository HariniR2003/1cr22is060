from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import time, uuid

app = Flask(__name__)
CORS(app)


urls = {}   

@app.route("/shorten", methods=["POST"])
def shorten_url():
    data = request.json
    original_url = data.get("url")
    short_code = str(uuid.uuid4())[:6]
    created_at = time.strftime("%Y-%m-%d %H:%M:%S")
    expires_at = "2025-12-31"

    urls[short_code] = {
        "original_url": original_url,
        "created_at": created_at,
        "expires_at": expires_at,
        "clicks": []
    }
    return jsonify({"short_url": f"http://localhost:5000/{short_code}"})

@app.route("/<short_code>")
def redirect_url(short_code):
    if short_code in urls:
        click_info = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "source": request.headers.get("User-Agent"),
            "ip": request.remote_addr
        }
        urls[short_code]["clicks"].append(click_info)
        return redirect(urls[short_code]["original_url"])
    return "URL not found", 404

@app.route("/stats", methods=["GET"])
def get_stats():
    stats = {}
    for code, data in urls.items():
        stats[code] = {
            "original_url": data["original_url"],
            "created_at": data["created_at"],
            "expires_at": data["expires_at"],
            "total_clicks": len(data["clicks"]),
            "clicks": data["clicks"]
        }
    return jsonify(stats)

if __name__ == "__main__":
    app.run(debug=True)
