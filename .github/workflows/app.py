from flask import Flask, render_template, request, jsonify
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Google Sheets Authentication
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
client = gspread.authorize(creds)
sheet = client.open("Book1").sheet1  # Change to your actual sheet name

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/update_sheet", methods=["POST"])
def update_sheet():
    try:
        data = request.json
        number_value = data.get("number")

        if number_value is None:
            return jsonify({"error": "No number provided"}), 400

        now = datetime.now().strftime("%Y-%m-%d")

        next_row = len(sheet.get_all_values()) + 1
        sheet.update(f"A{next_row}", [[now, number_value]])

        return jsonify({"success": True, "row": next_row})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_sell_data")
def get_sell_data():
    """Fetch the last 10 rows of sales data."""
    try:
        records = sheet.get_all_values()[-10:]  # Get last 10 rows
        data = [{"date": row[0], "sales": row[1]} for row in records if len(row) >= 2]
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
