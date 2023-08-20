from flask import Flask, request, jsonify
from diffusers import StableDiffusionPipeline
import torch
from server.config import special_instructions




class generate_image:
      def __init__(self, bp, config: dict) -> None:
        self.bp = bp
        self.routes = {
            '/image-api/v2/image': {
                'function': self._generateImage,
                'methods': ['POST']
            }
        }

      def _generateImage(self):
        try:
            torch.cuda.empty_cache()
            PYTORCH_CUDA_ALLOC_CONF=0.7
            prompt = request.json['generatedPrompt']
            token = request.json['token']
            print(prompt)
            model_id = "runwayml/stable-diffusion-v1-5"
            pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
            pipe = pipe.to("cuda")
            image = pipe(prompt).images[0]  
            filename = f"client/images/{token}.png"
        
        # Save the image with the constructed filename
            image.save(filename)
        
            response_data = {'image_url': '/' + filename}  # Create a dictionary with the image URL

            return jsonify(response_data)
        
        except Exception as e:
            print(e)
            print(e.__traceback__.tb_next)

            return {
                '_action': '_ask',
                'success': False,
                "error": f"an error occurred {str(e)}"
             }, 400

            

        



