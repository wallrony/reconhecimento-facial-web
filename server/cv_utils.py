import cv2
from PIL.Image import Image
import numpy


def image_has_face(photo: Image):
    face_cascade = cv2.CascadeClassifier('./haarcascade_frontalface_default.xml')
    image = numpy.array(photo.convert("RGB"))[:, :, ::-1].copy()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    if len(faces) == 1:
        return True
    return False
