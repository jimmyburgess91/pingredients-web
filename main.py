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
    cursor = request.args.get('cursor') or ''
    query = request.args.get('query') or ''
    response = requests.get(get_pingredients_url() + '/recipes?cursor=' + cursor + '&query=' + query,
                            headers={'oauth_token': oauth_token, 'user_id': user_id})
    return jsonify(response.json())