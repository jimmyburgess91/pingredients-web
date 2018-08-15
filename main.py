import os
import requests
import traceback
import requests_toolbelt.adapters.appengine

from flask import Flask, render_template, jsonify, request
from decorators.request import authorize

requests_toolbelt.adapters.appengine.monkeypatch()
app = Flask(__name__, template_folder='frontend', static_folder='frontend/dist')


def get_pingredients_url():
    if not os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine/'):
        return 'http://localhost:8080/'
    return 'https://pingredients-192501.appspot.com/'


@app.errorhandler(500)
def internal_error(error):
    print error
    traceback.print_exc()


@app.route('/')
def web_view():
    return render_template('index.html')


@app.route('/users/<user_id>', methods=['PUT'])
@authorize(token_only=True)
def create_user(oauth_token, user_id):
    response = requests.put(get_pingredients_url() + '/users/' + user_id,
                            headers={'oauth_token': oauth_token, 'user_id': user_id})
    return jsonify(response.json())


@app.route('/recipes')
@authorize()
def get_recipe_pins(oauth_token, user_id):
    cursor = request.args.get('cursor')
    query = request.args.get('query')
    url = get_pingredients_url() + '/recipes?'
    if cursor:
        url += 'cursor=' + cursor
    if query:
        if cursor:
            url += '&'
        url += 'query=' + query
    response = requests.get(url, headers={'oauth_token': oauth_token, 'user_id': user_id})
    return jsonify(response.json())


@app.route('/making-recipes', methods=['POST'])
@authorize()
def make_recipe(oauth_token, user_id):
    response = requests.post(get_pingredients_url() + '/making-recipes', json=request.get_json(),
                             headers={'oauth_token': oauth_token, 'user_id': user_id})
    return jsonify(response.json())


@app.route('/making-recipes/<recipe_id>', methods=['DELETE'])
@authorize()
def unmake_recipe(oauth_token, user_id, recipe_id):
    response = requests.delete(get_pingredients_url() + '/making-recipes/' + recipe_id,
                               headers={'oauth_token': oauth_token, 'user_id': user_id})
    return jsonify(response.json())


@app.route('/making-recipes')
@authorize()
def get_making_recipes(oauth_token, user_id):
    response = requests.get(get_pingredients_url() + '/making-recipes',
                            headers={'oauth_token': oauth_token, 'user_id': user_id})
    return jsonify(response.json())
