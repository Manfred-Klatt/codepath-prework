import unittest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mongomock import MongoClient
from bson import ObjectId
from executor import execute_modification_query, execute_search_query

from commands import FIRST_QUERY, SECOND_QUERY, THIRD_QUERY, FOURTH_QUERY, FIFTH_QUERY, SIXTH_QUERY, SEVENTH_QUERY, EIGTH_QUERY, NINETH_QUERY, TENTH_QUERY, ELEVENTH_QUERY, TWELVETH_QUERY, THIRTEENTH_QUERY, FOURTEENTH_QUERY, FIVETEENTH_QUERY, SIXTEENTH_QUERY

class MoviesTests(unittest.TestCase):

    def test_insert_new_user(self):
        client = MongoClient()
        db = client.test_database
        pre_user_counts = db.users.count_documents({})
        execute_modification_query(FIRST_QUERY, db)
        user_counts = db.users.count_documents({})
        self.assertGreater(user_counts, pre_user_counts)

    def test_find_director(self):
        client = MongoClient()
        db = client.test_database
        movie1=dict(name="Movie 1", directors="Christopher Nolan")
        movie2=dict(name="Movie 2", directors="Other Director")
        movie3=dict(name="Movie 3", directors="Christopher Nolan")
        objects = [movie1,movie2,movie3]
        db.movies.insert_many(objects)
        result = execute_search_query(SECOND_QUERY, db)
        self.assertNotEqual(result,None)
        self.assertEqual(len(list(result)),2)
        self.assertEqual(result[0]["directors"],"Christopher Nolan")

    def test_find_action_sort_by(self):
        client = MongoClient()
        db = client.test_database
        movie1=dict(name="Movie 1", genres="Action", year=2020)
        movie2=dict(name="Movie 2", genres="Drama", year=2010)
        movie3=dict(name="Movie 3", genres="Horror", year=2019)
        movie4=dict(name="Movie 4", genres="Action", year=2024)
        movie5=dict(name="Movie 5", genres="Action", year=1990)
        objects = [movie1,movie2,movie3,movie4, movie5]
        db.movies.insert_many(objects)
        result = execute_search_query(THIRD_QUERY, db)
        self.assertNotEqual(result,None)
        self.assertEqual(len(list(result)),3)
        self.assertEqual(result[0]["year"],2024)
        self.assertEqual(result[1]["year"],2020)
        self.assertEqual(result[2]["year"],1990)

    def test_find_greater_rating(self):
        client = MongoClient()
        db = client.test_database
        movie1=dict(title="Movie 1", imdb=dict(rating=5),genre="Action")
        movie2=dict(title="Movie 2", imdb=dict(rating=1),genre="Horror")
        movie3=dict(title="Movie 3", imdb=dict(rating=9),genre="Drama")
        movie4=dict(title="Movie 4", imdb=dict(rating=8),genre="Action")
        movie5=dict(title="Movie 5", imdb=dict(rating=10),genre="Action")
        objects = [movie1,movie2,movie3,movie4, movie5]
        db.movies.insert_many(objects)
        result = execute_search_query(FOURTH_QUERY, db)
        self.assertNotEqual(result,None)
        self.assertEqual(len(list(result)),2)
        self.assertNotIn("genre",result[0])

    def test_find_staff_include(self):
        client = MongoClient()
        db = client.test_database
        movie1=dict(title="Movie 1", cast=["Kim Basinger","Homer Simpson"])
        movie2=dict(title="Movie 2", cast=["Tom Hanks","Tim Allen","Homer Simpson"])
        movie3=dict(title="Movie 3", cast=["Tom Hanks","Tim Allen"])
        objects = [movie1,movie2,movie3]
        db.movies.insert_many(objects)
        result = execute_search_query(FIFTH_QUERY, db)
        self.assertNotEqual(result,None)
        self.assertEqual(len(list(result)),2)

    def test_find_staff_exclusive(self):
        client = MongoClient()
        db = client.test_database
        movie1=dict(title="Movie 1", cast=["Kim Basinger","Homer Simpson"])
        movie2=dict(title="Movie 2", cast=["Tom Hanks","Tim Allen","Homer Simpson"])
        movie3=dict(title="Movie 3", cast=["Tom Hanks","Tim Allen"])
        objects = [movie1,movie2,movie3]
        db.movies.insert_many(objects)
        result = execute_search_query(SIXTH_QUERY, db)
        self.assertNotEqual(result,None)
        self.assertEqual(len(list(result)),1)

    def test_find_by_director(self):
        client = MongoClient()
        db = client.test_database
        movie1=dict(title="Movie 1", genres="Comedy", directors="John Doe")
        movie2=dict(title="Movie 2", genres="Comedy", directors="Steven Spielberg")
        movie3=dict(title="Movie 3", genres="Other", directors="Steven Spielberg and Other guy")
        movie4=dict(title="Movie 4", genres="Horror", directors="Steven Spielberg")
        objects = [movie1,movie2,movie3,movie4]
        db.movies.insert_many(objects)
        result = execute_search_query(SEVENTH_QUERY, db)
        self.assertNotEqual(result,None)
        self.assertEqual(len(list(result)),1)

    def test_insert_field(self):
        client = MongoClient()
        db = client.test_database
        movie1=dict(title="The Matrix")
        db.movies.insert_one(movie1)
        execute_modification_query(EIGTH_QUERY, db)
        movie1 = db.movies.find_one({"title" : "The Matrix"})
        self.assertIn("available_on", movie1)

    def test_increment_field(self):
        client = MongoClient()
        db = client.test_database
        movie1=dict(title="The Matrix", metacritic=73)
        db.movies.insert_one(movie1)
        execute_modification_query(NINETH_QUERY, db)
        changed_movie = db.movies.find_one({"title" : "The Matrix"})
        self.assertIn("metacritic",changed_movie)
        self.assertEqual(changed_movie["metacritic"],74)

    def test_update_many(self):
        client = MongoClient()
        db = client.test_database
        movie1=dict(title="Movie 1", genres=["Horror"], year=1997)
        movie2=dict(title="Movie 2", genres=["Horror"], year=1998)
        movie3=dict(title="Movie 3", genres=["Horror"], year=1998)
        movie4=dict(title="Movie 4", genres=["Horror"], year=1997)
        objects = [movie1,movie2,movie3,movie4]
        db.movies.insert_many(objects)
        execute_modification_query(TENTH_QUERY, db)
        movies = db.movies.find( {"year" : 1997, "genres": "Gen Z"})
        self.assertEqual(len(list(movies)),2)

    def test_increment_many(self):
        client = MongoClient()
        db = client.test_database
        movie1=dict(title="Movie 1", imdb=dict(rating=3),genre="Action")
        movie2=dict(title="Movie 2", imdb=dict(rating=1),genre="Horror")
        movie3=dict(title="Movie 3", imdb=dict(rating=9),genre="Drama")
        movie4=dict(title="Movie 4", imdb=dict(rating=8),genre="Action")
        movie5=dict(title="Movie 5", imdb=dict(rating=10),genre="Action")
        objects = [movie1,movie2,movie3,movie4,movie5]
        db.movies.insert_many(objects)
        execute_modification_query(ELEVENTH_QUERY, db)
        movie_changed = db.movies.find_one({"title":"Movie 2"})
        self.assertEqual(movie_changed["imdb"]["rating"],2)
        movie_changed = db.movies.find_one({"title":"Movie 1"})
        self.assertEqual(movie_changed["imdb"]["rating"],4)

    def test_delete_one(self):
        client = MongoClient()
        db = client.test_database
        comment1=dict(author="The Matrix", comment="Hello",_id=ObjectId("5a9427648b0beebeb6957a21"))
        comment2=dict(author="Second Author", comment="World")
        db.comments.insert_one(comment1)
        db.comments.insert_one(comment2)
        execute_modification_query(TWELVETH_QUERY, db)
        movies = db.comments.find({})
        self.assertEqual(len(list(movies)),1)

    def test_delete_many_comments(self):
        client = MongoClient()
        db = client.test_database
        comment1=dict(author="The Matrix", comment="Hello")
        comment2=dict(author="The Matrix", comment="World")
        comment3=dict(author="The Matrix", comment="Spam")
        comment4=dict(author="Second Author", comment="World")
        db.comments.insert_one(comment1)
        db.comments.insert_one(comment2)
        db.comments.insert_one(comment3)
        db.comments.insert_one(comment4)
        execute_modification_query(THIRTEENTH_QUERY, db)
        comments = db.comments.find({})
        self.assertNotEqual(comments, None)
        self.assertEqual(len(list(comments)),1)

    def test_delete_many_movies(self):
        client = MongoClient()
        db = client.test_database
        movie1=dict(title="Movie 1", imdb=dict(rating=3),genres="Action")
        movie2=dict(title="Movie 2", imdb=dict(rating=1),genres="Horror")
        movie3=dict(title="Movie 3", imdb=dict(rating=9))
        movie4=dict(title="Movie 4", imdb=dict(rating=8),genres="Action")
        movie5=dict(title="Movie 5", imdb=dict(rating=10))
        objects = [movie1,movie2,movie3,movie4,movie5]
        db.movies.insert_many(objects)
        execute_modification_query(FOURTEENTH_QUERY, db)
        movies = db.movies.find({})
        self.assertEqual(len(list(movies)),3)

    def test_group_by_year(self):
        client = MongoClient()
        db = client.test_database
        movie1=dict(title="Movie 1", genre="Comedy", directors="John Doe",year=2010)
        movie2=dict(title="Movie 2", genre="Comedy", directors="Steven Spielberg",year=2009)
        movie3=dict(title="Movie 3", genre="Other", directors="Steven Spielberg and Other guy",year=2014)
        movie4=dict(title="Movie 4", genre="Horror", directors="Steven Spielberg",year=2009)
        objects = [movie1,movie2,movie3,movie4]
        db.movies.insert_many(objects)
        result = execute_search_query(FIVETEENTH_QUERY, db)
        self.assertNotEqual(result,None)
        aggregated_results = []
        for doc in result:
            aggregated_results.append(doc)
        self.assertEqual(len(aggregated_results), 3)
        self.assertEqual(aggregated_results[0]['_id'], 2009)
        self.assertEqual(aggregated_results[0]['count'], 2)
        self.assertEqual(aggregated_results[-1]['_id'], 2014)

    def test_group_by_director(self):
        client = MongoClient()
        db = client.test_database
        movie1=dict(title="Movie 1", genre="Comedy", directors="John Doe", imdb=dict(rating=1))
        movie2=dict(title="Movie 2", genre="Comedy", directors="Steven Spielberg", imdb=dict(rating=4))
        movie3=dict(title="Movie 3", genre="Other", directors="Steven Spielberg and Other guy",imdb=dict(rating=5))
        movie4=dict(title="Movie 4", genre="Horror", directors="Steven Spielberg",imdb=dict(rating=9))
        objects = [movie1,movie2,movie3,movie4]
        db.movies.insert_many(objects)
        result = execute_search_query(SIXTEENTH_QUERY, db)
        self.assertNotEqual(result,None)
        aggregated_results = []
        for doc in result:
            aggregated_results.append(doc)
        self.assertEqual(len(aggregated_results), 3)
        self.assertEqual(aggregated_results[0]['_id'], "Steven Spielberg")
        self.assertEqual(aggregated_results[0]['averageRating'], 6.5)
        self.assertEqual(aggregated_results[-1]['_id'], "John Doe")

if __name__ == '__main__':
    unittest.main()