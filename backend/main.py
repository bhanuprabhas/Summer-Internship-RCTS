from flask import Flask, render_template, request, jsonify, request, send_file, make_response, send_from_directory
from flask_cors import CORS
# from datetime import datetime
import pymongo
import pandas as pd
from urllib.parse import quote
from bson import json_util
from flask import jsonify



app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# MongoDB connection
client = pymongo.MongoClient('mongodb://localhost:27017')
db = client['IIITH_TASK']
collection = db['Data']


uploaded_file_name = None

@app.route('/submit', methods=['POST'])
def submit_form():
    form_data = request.get_json()
    collection.insert_one(form_data)
    # print(form_data)
    return jsonify({'message': 'Form submitted successfully'})


@app.route('/uploadexcel', methods=['POST'])
def upload_excel():
    global uploaded_file_name

    file = request.files.get('file')    
    if file:
        # file_name = file.filename
        uploaded_file_name = file.filename
        # Record the upload time
        # upload_time = datetime.now().strftime('%d-%m-%Y')
        # Read the Excel file using pandas
        df = pd.read_excel(file)
        collection_name = uploaded_file_name
        collection = db[collection_name]
        collection.insert_many(df.to_dict('records'))

        column_names = list(df.columns)
        print(column_names)
        return jsonify({'columns': column_names, 'message': 'File uploaded successfully'})


       # return jsonify(message=f'Successfully uploaded {file_name} as the "{collection_name}" collection in MongoDB at {upload_time}!')
    else:
        return jsonify(error='No file uploaded or name provided.'), 400


@app.route('/excels', methods=['GET'])
def get_excels():
    # Get a list of all collections in the database
    collection_names = db.list_collection_names()

    # Filter the collection names to only include Excel files
    excel_collections = [name for name in collection_names if 'xlsx' in name]

    return {'excels': excel_collections}


@app.route('/columns/<file_name>', methods=['GET'])
def get_column_data(file_name):
    # Set the collection name based on the file name
    collection_name = file_name

    # Retrieve the documents from the collection
    documents = db[collection_name].find()

    column_data = {}
    for document in documents:
        for key, value in document.items():
            if key != '_id':
                if key not in column_data:
                    column_data[key] = {}
                if value not in column_data[key]:
                    column_data[key][value] = 0
                column_data[key][value] += 1

    return jsonify({'columns': list(column_data.keys()), 'data': column_data})





@app.route('/excel/<filename>', methods=['GET'])
def download_excel(filename):
    # Retrieve the uploaded file from MongoDB
    collection = db[filename]
    df = pd.DataFrame(list(collection.find()))
    
    df = df.drop('_id', axis=1)
    # Save the DataFrame as an Excel file temporarily
    temp_file_path = 'temp.xlsx'
    df.to_excel(temp_file_path, index=False)
    
    # Set the response headers
    response = send_from_directory('.', 'temp.xlsx', as_attachment=False)
    response.headers['Content-Type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    response.headers['Content-Disposition'] = 'inline; filename=temp.xlsx'
    
    return response







if __name__ == '__main__':
    app.run(debug=True)

