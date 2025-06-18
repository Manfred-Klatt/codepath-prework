# MongoDB Queries for Operations

# 1. Create - Insert a new user
FIRST_QUERY = """
db.users.insertOne({
    "name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": new Date()
})
"""

# 2. Read Operations
# 2.1 Find all movies directed by Christopher Nolan
SECOND_QUERY = 'db.movies.find({"directors": "Christopher Nolan"})'

# 2.2 Find action movies sorted by year (descending)
THIRD_QUERY = 'db.movies.find({"genres": "Action"}).sort({"year": -1})'

# 2.3 Find movies with IMDb rating > 8, returning only title and IMDB info
FOURTH_QUERY = '''
db.movies.find(
    {"imdb.rating": {$gt: 8}},
    {"title": 1, "imdb": 1, "_id": 0}
)
'''

# 2.4 Find movies that starred both "Tom Hanks" and "Tim Allen"
FIFTH_QUERY = '''
db.movies.find({
    "cast": {
        $all: ["Tom Hanks", "Tim Allen"]
    }
})
'''

# 2.5 Find movies that starred exactly "Tom Hanks" and "Tim Allen"
SIXTH_QUERY = '''
db.movies.find({
    "cast": {
        $all: ["Tom Hanks", "Tim Allen"],
        $size: 2
    }
})
'''

# 2.6 Find comedy movies directed by Steven Spielberg
SEVENTH_QUERY = '''
db.movies.find({
    "genres": "Comedy",
    "directors": "Steven Spielberg"
})
'''

# 3. Update Operations
# 3.1 Add "available_on" field to "The Matrix"
EIGTH_QUERY = '''
db.movies.updateOne(
    {"title": "The Matrix"},
    {$set: {"available_on": "Sflix"}}
)
'''

# 3.2 Increment metacritic of "The Matrix" by 1
NINETH_QUERY = '''
db.movies.updateOne(
    {"title": "The Matrix"},
    {$inc: {"metacritic": 1}}
)
'''

# 3.3 Add "Gen Z" genre to all movies from 1997
TENTH_QUERY = '''
db.movies.updateMany(
    {"year": 1997},
    {$addToSet: {"genres": "Gen Z"}}
)
'''

# 3.4 Increase IMDb rating by 1 for movies with rating < 5
ELEVENTH_QUERY = '''
db.movies.updateMany(
    {"imdb.rating": {$lt: 5}},
    {$inc: {"imdb.rating": 1}}
)
'''

# 4. Delete Operations
# 4.1 Delete a comment with specific ID
TWELVETH_QUERY = 'db.comments.deleteOne({"_id": ObjectId("507f1f77bcf86cd799439011")})'

# 4.2 Delete all comments for "The Matrix"
THIRTEENTH_QUERY = 'db.comments.deleteMany({"name": "The Matrix"})'

# 4.3 Delete all movies without genres
FOURTEENTH_QUERY = '''
db.movies.deleteMany({
    $or: [
        {"genres": {$exists: false}},
        {"genres": {$eq: []}},
        {"genres": null}
    ]
})
'''

# 5. Aggregation Operations
# 5.1 Count movies released each year, sorted chronologically
FIFTEENTH_QUERY = '''
db.movies.aggregate([
    {$group: {
        _id: "$year",
        count: {$sum: 1}
    }},
    {$sort: {"_id": 1}}
])
'''

# 5.2 Average IMDb rating by director, sorted highest to lowest
SIXTEENTH_QUERY = '''
db.movies.aggregate([
    {$match: {"imdb.rating": {$exists: true, $ne: ""}}},
    {$unwind: "$directors"},
    {$group: {
        _id: "$directors",
        avg_rating: {$avg: "$imdb.rating"}
    }},
    {$sort: {"avg_rating": -1}}
])
'''