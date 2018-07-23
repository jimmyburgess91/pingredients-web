from flask import Flask

app = Flask(__name__)

@app.route('/jimmy')
def form():
    return 'HEllooooo JImmy!!'

