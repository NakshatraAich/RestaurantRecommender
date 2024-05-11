from geopy.distance import geodesic
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import pandas as pd

class BudgetHandler:
    def filter_by_budget(self, df, budget):
        return df[df['Average Cost for two'] <= budget]

class LocationHandler:
    def filter_by_location(self, df, latitude, longitude, max_distance_km):
        return df[df.apply(lambda x: geodesic((x['Latitude'], x['Longitude']), (latitude, longitude)).kilometers <= max_distance_km, axis=1)]

class CuisineHandler:
    def filter_by_cuisine(self, df, cuisine):
        return df[df['Cuisines'].str.contains(cuisine)]

class RestaurantRecommender:
    def __init__(self, df):
        self.df = df
        self.tfidf_vectorizer = TfidfVectorizer()
        self.budget_handler = BudgetHandler()
        self.location_handler = LocationHandler()
        self.cuisine_handler = CuisineHandler()
        
    def recommend_restaurants(self, custom_row):
        latitude = custom_row.get('latitude')
        longitude = custom_row.get('longitude')
        cuisine = custom_row.get('cuisine')
        budget = custom_row.get('budget')
        max_distance_km = custom_row.get('max_distance_km', 100)  # Default max distance is 100 km
        
        budget_filtered = self.budget_handler.filter_by_budget(self.df, budget)
        location_filtered = self.location_handler.filter_by_location(budget_filtered, latitude, longitude, max_distance_km)
        cuisine_filtered = self.cuisine_handler.filter_by_cuisine(location_filtered, cuisine)
        return cuisine_filtered

    def recommend_similar_cuisines(self, custom_row):
        latitude = custom_row.get('latitude')
        longitude = custom_row.get('longitude')
        cuisine = custom_row.get('cuisine')
        budget = custom_row.get('budget')
        max_distance_km = custom_row.get('max_distance_km', 100)  # Default max distance is 100 km
        
        restaurants = self.recommend_restaurants(custom_row)
        
        if restaurants.empty:
            return "No restaurants available"
        
        tfidf_matrix = self.tfidf_vectorizer.fit_transform(restaurants['Cuisines'])
        custom_cuisine_tfidf = self.tfidf_vectorizer.transform([cuisine])
        
        cosine_similarities = linear_kernel(custom_cuisine_tfidf, tfidf_matrix).flatten()
        
        similar_cuisine_indices = [i for i, sim in sorted(enumerate(cosine_similarities), key=lambda x: x[1], reverse=True) if sim > 0.25]
        
        similar_cuisine_restaurants = restaurants.iloc[similar_cuisine_indices[:10]]
        
        # Convert recommended restaurants DataFrame to a list of dictionaries
        similar_cuisine_restaurants = similar_cuisine_restaurants.to_dict(orient="records")
        
        return similar_cuisine_restaurants
 