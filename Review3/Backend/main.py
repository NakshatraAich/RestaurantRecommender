from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from recommender import RestaurantRecommender
import os 
import pandas as pd
import json

# Function to initialize recommender and define routes
def initialize_database(name):
    dirname = os.path.dirname(__file__)
    file_path = os.path.join(dirname, name)
    df = pd.read_csv(file_path, encoding='latin1')
    df = df[df['Country Code'] == 1]
    return df

df = initialize_database('zomato.csv')

# Create an instance of the FastAPI class
app = FastAPI()

# Initialize the recommender system
recommender = RestaurantRecommender(df)

# Add CORS middleware
origins = [
    "http://localhost",
    "http://localhost:3000",  # Adjust the port if necessary
    "http://localhost:5173"   # Add your frontend origin here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],  # Allow only POST requests for this route
    allow_headers=["*"],
)

# Define a route with a POST method
@app.post("/")
def create_item(item: dict):
    rec = recommender.recommend_similar_cuisines(item)
    return rec
