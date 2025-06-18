from pymongo import MongoClient
from pprint import pprint

# Connect to MongoDB (assuming localhost and default port)
client = MongoClient('mongodb://localhost:27017/')
db = client['sample_mflix']  # Using sample_mflix database as it contains movies collection

# 1. Create - Insert a new user
def insert_new_user(name, email):
    users = db.users
    result = users.insert_one({
        'name': name,
        'email': email,
        'created_at': datetime.datetime.utcnow()
    })
    return result.inserted_id

# 2. Read Operations
def find_movies_by_director(director_name):
    """Find all movies directed by a specific director"""
    movies = db.movies
    return list(movies.find({'directors': director_name}))

def find_action_movies_sorted():
    """Find action movies sorted by year in descending order"""
    movies = db.movies
    return list(movies.find({'genres': 'Action'}).sort('year', -1))

def find_high_rated_movies():
    """Find movies with IMDb rating > 8, returning only title and IMDB info"""
    movies = db.movies
    return list(movies.find(
        {'imdb.rating': {'$gt': 8}},
        {'title': 1, 'imdb': 1, '_id': 0}
    ))

def find_movies_with_both_actors(actor1, actor2):
    """Find movies that starred both actors"""
    movies = db.movies
    return list(movies.find({
        'cast': {'$all': [actor1, actor2]}
    }))

def find_movies_with_only_two_actors(actor1, actor2):
    """Find movies that starred exactly these two actors"""
    movies = db.movies
    return list(movies.find({
        'cast': {'$all': [actor1, actor2], '$size': 2}
    }))

def find_comedy_by_director(director_name):
    """Find comedy movies by a specific director"""
    movies = db.movies
    return list(movies.find({
        'genres': 'Comedy',
        'directors': director_name
    }))

# 3. Update Operations
def add_streaming_service(movie_title, service):
    """Add a streaming service to a movie"""
    movies = db.movies
    return movies.update_one(
        {'title': movie_title},
        {'$set': {'available_on': service}}
    )

def increment_metacritic(movie_title, increment=1):
    """Increment metacritic score for a movie"""
    movies = db.movies
    return movies.update_one(
        {'title': movie_title},
        {'$inc': {'metacritic': increment}}
    )

def add_genre_to_movies(year, genre):
    """Add a genre to all movies from a specific year"""
    movies = db.movies
    return movies.update_many(
        {'year': year},
        {'$addToSet': {'genres': genre}}
    )

def boost_low_ratings():
    """Increase IMDb rating by 1 for movies with rating < 5"""
    movies = db.movies
    return movies.update_many(
        {'imdb.rating': {'$lt': 5}},
        {'$inc': {'imdb.rating': 1}}
    )

# 4. Delete Operations
def delete_comment(comment_id):
    """Delete a comment by its ID"""
    comments = db.comments
    return comments.delete_one({'_id': comment_id})

def delete_comments_for_movie(movie_title):
    """Delete all comments for a specific movie"""
    comments = db.comments
    return comments.delete_many({'name': movie_title})

def delete_movies_without_genres():
    """Delete all movies that don't have any genres"""
    movies = db.movies
    return movies.delete_many({
        '$or': [
            {'genres': {'$exists': False}},
            {'genres': {'$eq': []}},
            {'genres': None}
        ]
    })

# 5. Aggregation Operations
def movies_per_year():
    """Count movies released each year, sorted chronologically"""
    movies = db.movies
    pipeline = [
        {'$group': {
            '_id': '$year',
            'count': {'$sum': 1}
        }},
        {'$sort': {'_id': 1}}
    ]
    return list(movies.aggregate(pipeline))

def avg_rating_by_director():
    """Calculate average IMDb rating by director, sorted highest to lowest"""
    movies = db.movies
    pipeline = [
        {'$match': {'imdb.rating': {'$exists': True, '$ne': ''}}},
        {'$unwind': '$directors'},
        {'$group': {
            '_id': '$directors',
            'avg_rating': {'$avg': '$imdb.rating'}
        }},
        {'$sort': {'avg_rating': -1}}
    ]
    return list(movies.aggregate(pipeline))

# Example usage
if __name__ == "__main__":
    # Example of how to use these functions
    print("Movies by Christopher Nolan:")
    pprint(find_movies_by_director("Christopher Nolan")[:2])  # Show first 2 results
    
    print("\nAverage rating by director:")
    pprint(avg_rating_by_director()[:5])  # Show top 5 directors
