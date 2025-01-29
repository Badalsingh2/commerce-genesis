import google.generativeai as genai
import pyttsx3
from flask import Flask, jsonify, request
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Set up Gemini API
genai.configure(api_key="AIzaSyD3WpBuyiuLUNlmGefFyxBcgkIVTOXWijo")

# Function to generate response using Gemini API
def get_gemini_response(text):
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(text)
    return response.text

# Route for text-based chat
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    print(data)
    user_input = data.get("text")
    print(user_input)
    
    if not user_input:
        return jsonify({"error": "No text input provided"}), 400

    response_text = get_gemini_response(user_input)
    print(response_text)
    return jsonify({"response": response_text})

# Run the Flask app
if __name__== "__main__":
    app.run(debug=True)
