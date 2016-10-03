from flask import Flask, render_template
from flask_restful import reqparse, Resource, Api
import json

from yelp.client import Client
from yelp.oauth1_authenticator import Oauth1Authenticator
from yelp.obj.coordinate import Coordinate
from yelp.obj.response_object import ResponseObject
from flask.json import jsonify

app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()

@app.route('/')
def index():
    return render_template('index.html')

# @app.route('/search/', defaults={'location': None})
@app.route('/search/<string:location>')
def search(location):
    return format_yelp(search_yelp(location))

auth = Oauth1Authenticator(
	consumer_key="pOp-F362lI6DjElAL2NqaQ",
	consumer_secret="WX1BThwEZmQQ-gY8dGGZRK2GMjQ",
	token="Km-Z6utkLuStUz3OTxpX-rY7CJc872Ur",
	token_secret="U776Xr9-qR7e1y_1FCP1zE3Xmq8"
)

yelp = Client(auth)

def search_yelp(location):
    params = {
        'term': 'food'
    }
    result = yelp.search(location, **params)
    # print(type(result))
    return result

def format_yelp(searchResponse):
    # modify search response
    response = map(lambda x : serializeResponse(x), searchResponse.businesses)
    return jsonify(response)

def serializeResponse(business):
    # convert business to a dict
    business = business.__dict__
    # convert location to a dict
    business["location"] = business["location"].__dict__
    business["location"]["coordinate"] = business["location"]["coordinate"].__dict__
    return business

if __name__ == '__main__':
    app.run(debug=True)
