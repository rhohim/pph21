from flask import Flask, flash, redirect, render_template, request, url_for

app = Flask(__name__)
@app.route('/', methods = ["POST","GET"])
def index():
    
    return render_template('index.html')

@app.route('/login', methods = ["POST","GET"])
def login():
    
    return render_template('login.html')

@app.route('/home', methods = ["POST","GET"])
def home():
    
    return render_template('index.html')
 
if __name__ == "__main__":
    app.run(debug=True)