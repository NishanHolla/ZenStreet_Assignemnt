import json
from pymongo import MongoClient

# MongoDB connection string
# Replace '<username>', '<password>', '<cluster-url>', and '<database-name>' with your MongoDB cluster credentials and database details
# Example: mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
connection_string = "mongodb+srv://nishan:nishan@cluster0.wshjf6z.mongodb.net/demo?retryWrites=true&w=majority&appName=Cluster0"

# Path to your tree-data.json file
json_file = 'tree-data.json'

def upload_to_mongodb(json_file, connection_string):
    # Load JSON data from file
    with open(json_file, 'r') as file:
        data = json.load(file)

    # Connect to MongoDB
    client = MongoClient(connection_string)
    db = client.get_database()

    # Assuming 'treeDataCollection' is the collection name
    collection = db.treeDataCollection

    # Insert data into MongoDB collection
    result = collection.insert_one(data)

    print(f"Uploaded document ID: {result.inserted_id}")

if __name__ == "__main__":
    upload_to_mongodb(json_file, connection_string)
