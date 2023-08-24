# Gen-AI-powered-fashion-outfit-generator
demo video - https://drive.google.com/file/d/1OdoXteyUaq2b9STpyOiy-8EmbESEFypD/view?usp=drive_link
## Description
This project's mission is to enhance the user's shopping experience by offering personalized, trendy, and cohesive outfit ideas. The Fashion Outfit Generator integrates multiple components to cater to user preferences, historical data, and the latest fashion trends.
## Components

### 1. User Interaction and Input Gathering

- Utilizes a fine-tuned Large Language Model (LLM), base model - ChatGPT-4.
- Captures user preferences dynamically, including style, color, and occasion.
- Generates comprehensive prompts for AI-driven outfit creation.
  
![block_diagram](https://github.com/ByteWiizard/Gen-AI-powered-fashion-outfit/assets/100038222/be5915ff-55f9-4704-9591-b5d9d03472f8)

### 2. Prompt Generation and Outfit Creation

- Fine-tuned LLM constructs prompts that combine user inputs.
- Creates AI-friendly prompts for outfit generation, aligned with preferences.
- Provides instructions for AI models to conceptualize outfits that match user tastes.

![llm1](https://github.com/ByteWiizard/Gen-AI-powered-fashion-outfit/assets/100038222/7f750ce9-8d84-413d-8a3b-ab12d7f233bf)
![llm4](https://github.com/ByteWiizard/Gen-AI-powered-fashion-outfit/assets/100038222/bde83c64-57bd-47ef-9b41-b65cd54fd68c)


### 3. Image Generation and Sourcing
- Offers users the choice between real-time trend images or AI-generated visuals.
- Web scraping API extracts trend-relevant images aligned with user inputs.
- Text-to-Image API synthesizes images from LLM-generated prompts.

![webscraping](https://github.com/ByteWiizard/Gen-AI-powered-fashion-outfit/assets/100038222/c0ba98c7-42af-48bf-a415-fef90d9ddc41)

### 4. Fashion Ensemble Explorer

- Leverages a finely-tuned ResNet50, a Deep Neural Network.
- Analyzes user-provided images to fetch five closely-resembling outfit images.
- Utilizes KNN (k=5) algorithm to ensure the retrieved images are in line with user preferences.

  ![fashion_ensemble_explorer0](https://github.com/ByteWiizard/Gen-AI-powered-fashion-outfit/assets/100038222/ab0e4d2f-99b4-42ae-ac4b-91c4d842838f)

### 5. Clothing GAN Customization 
(forked existing project by @mfrashad - https://github.com/mfrashad/ClothingGAN )
- Finetuned StyleGAN2-ADA on Lookbook dataset(8726 images, transfer learning using FFHQ)
- Parameters include sleeve, structure, style, truncation, cleavage, color etc.
- Users wield creative control over outfit elements for personalization.
- augments outfit customization with AI-driven techniques.

  ![clothingGAN](https://github.com/ByteWiizard/Gen-AI-powered-fashion-outfit/assets/100038222/3f6b7469-3ea7-4a02-80eb-78cada0c5428)


### 6. User Feedback Loop and Adjustments

- Allows users to actively participate by refining generated images.
- Empowers users to tailor outfits based on personal feedback and adjustments.
- Ensures personalized satisfaction and adaptation through continuous engagement.


## Future Scope

- Enhance image generation realism using advanced AI techniques.
- Implement dynamic user profiling for accurate personalized suggestions.
- Incorporate semantic understanding for nuanced prompt generation.
- Integrate augmented reality try-on for an immersive experience.

Acknowledgments - 
This project was inspired by the Flipkart GRID 5.0 and is built upon the advancements in Generative AI technology.

Authors - Dhruv Mishra, Yaman Goyal, Amit Kumar
