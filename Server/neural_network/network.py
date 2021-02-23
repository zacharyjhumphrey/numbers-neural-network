from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
import os
import sys

import matplotlib.pyplot as plt
import numpy as np

import tensorflow as tf
from tensorflow import keras

from PIL import Image

# Removing Warning Message
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

pixel_count = 28

# Line of code to grab the dataset
model = tf.keras.models.load_model('neural_network/models/updated_model.h5')

# FUNCTIONS
# Canvas Conversion Function
def convertCanvas(canvasData):
    newCanvas = []

    # Converting the canvas to an array
    canvasData = canvasData.split(',')

    # Converting the canvas into a 2D array of integers
    for r in range(pixel_count):
        newCanvas.append([])
        for c in range(pixel_count):
            newCanvas[r].append( float(canvasData[(r * pixel_count) + c]) )

    # Converting to Numpy Array
    newCanvas = np.asarray(newCanvas)

    return newCanvas

# # MAIN
# # Getting the canvas as string
canvasString = sys.argv[1]

# Converting the canvas into a 2D Array
images = np.array([convertCanvas(canvasString)])

# Predicting the Number
predictions = model.predict(images)
print(np.argmax(predictions[0]))


# # TESTING/ CREATING MODEL
# # Grabbing the dataset
# mnist = tf.keras.datasets.mnist
#
# (train_images, train_labels), (test_images, test_labels) = mnist.load_data()
#
# # Creating the Model
# model = keras.Sequential([
#     keras.layers.Flatten(input_shape=(28, 28)),
#     keras.layers.Dense(128, activation='relu'),
#     keras.layers.Dense(10, activation='softmax')
# ])
#
# model.compile(optimizer='adam',
#               loss='sparse_categorical_crossentropy',
#               metrics=['accuracy'])
#
# model.fit(train_images, train_labels, epochs=20)
# model.fit(test_images, test_labels, epochs=20)
#
# model.save('updated_model.h5')
