from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
import os

import matplotlib.pyplot as plt
import numpy as np

import tensorflow as tf
from tensorflow import keras
import tensorflow_datasets as tfds

# Grabbing the dataset
mnist = tf.keras.datasets.mnist

(train_images, train_labels), (test_images, test_labels) = mnist.load_data()

# Creating the Model
model = keras.Sequential([
    keras.layers.Flatten(input_shape=(28, 28)),
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

model.fit(train_images, train_labels, epochs=10)

predictions = model.predict(test_images)

model.save('number_model.h5')

## Line of code to grab the dataset
# model = tf.keras.models.load_model('models/number_model.h5')
