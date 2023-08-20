import numpy as np
import pickle
import tensorflow
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPooling2D
from tensorflow.keras.applications.resnet50 import ResNet50,preprocess_input
from sklearn.neighbors import NearestNeighbors
from numpy.linalg import norm
from server.config import special_instructions
from flask import Flask, request, jsonify


def feature_extraction(img_path,model):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    expanded_img_array = np.expand_dims(img_array, axis=0)
    preprocessed_img = preprocess_input(expanded_img_array)
    result = model.predict(preprocessed_img).flatten()
    normalized_result = result / norm(result)

    return normalized_result
    
def recommend(features,feature_list):
    neighbors = NearestNeighbors(n_neighbors=6, algorithm='brute', metric='euclidean')
    neighbors.fit(feature_list)
    distances, indices = neighbors.kneighbors([features])
    return indices

def load_model():
    model = ResNet50(weights='imagenet',include_top=False,input_shape=(None,None,3))
    model.trainable = False

    model = tensorflow.keras.Sequential([
        model,
        GlobalMaxPooling2D()
    ])
    return model



class recommend:
    def __init__(self, bp, config: dict) -> None:
        self.bp = bp
        self.routes = {
            
            '/recommend-api/v2/recommend': {
                'function': self._recommend_product,
                'methods': ['POST']
            }
        }

    def _recommend_product(self):

      try:
            uploaded_file  = request.json['image_path']
            uploaded_file = '/home/adarsh/Desktop/Gan/ClothingGAN/freegpt-webui/client' + uploaded_file
            feature_list = np.array(pickle.load(open('/home/adarsh/Desktop/Gan/ClothingGAN/llm/server/embeddings.pkl','rb')))
            filenames = pickle.load(open('/home/adarsh/Desktop/Gan/ClothingGAN/llm/server/filenames.pkl','rb'))
    

            model = load_model()

            if uploaded_file:
                features = feature_extraction(uploaded_file,model)
                indices = recommend(features,feature_list)

                image_paths = {
                    'image_path1': '/llm/server/' + filenames[indices[0][0]],
                    'image_path2': '/llm/server/' + filenames[indices[0][1]],
                    'image_path3': '/llm/server/' + filenames[indices[0][2]],
                    'image_path4': '/llm/server/' + filenames[indices[0][3]],
                    'image_path5': '/llm/server/' + filenames[indices[0][4]],
                }

                return jsonify(image_paths)            
      except Exception as e:
            print(e)
            print(e.__traceback__.tb_next)

            return {
                '_action': '_ask',
                'success': False,
                "error": f"an error occurred {str(e)}"
            }, 400
          
    




