
from io import open
from setuptools import find_packages, setup

setup(
    name="pytorch_pretrained_biggan",
    version="0.1.0",
    author="Thomas Wolf",
    author_email="thomas@huggingface.co",
    description="PyTorch version of DeepMind's BigGAN model with pre-trained models",
    long_description=open("README.md", "r", encoding='utf-8').read(),
    long_description_content_type="text/markdown",
    keywords='BIGGAN GAN deep learning google deepmind',
    license='Apache',
    url="https://github.com/huggingface/pytorch-pretrained-BigGAN",
    packages=find_packages(exclude=["*.tests", "*.tests.*",
                                    "tests.*", "tests"]),
    install_requires=['torch>=0.4.1',
                      'numpy',
                      'boto3',
                      'requests',
                      'tqdm'],
    tests_require=['pytest'],
    entry_points={
      'console_scripts': [
        "pytorch_pretrained_biggan=pytorch_pretrained_biggan.convert_tf_to_pytorch:main",
      ]
    },
    classifiers=[
          'Intended Audience :: Science/Research',
          'License :: OSI Approved :: Apache Software License',
          'Programming Language :: Python :: 3',
          'Topic :: Scientific/Engineering :: Artificial Intelligence',
    ],
)
