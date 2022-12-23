from flask import Flask, request, jsonify
from PIL import Image
from traceback import format_exc
from cv_utils import image_has_face
from flask_cors import cross_origin


app = Flask(__name__)

@app.post("/verify-presence")
@cross_origin()
def verify_presence():
    try:
        file = request.files.get('photo')
        if not file:
            raise Exception("you must provide a photo!")
        photo = Image.open(file.stream)
        return { 'valid': image_has_face(photo) }
    except:
        return jsonify({ 'error': format_exc() })
