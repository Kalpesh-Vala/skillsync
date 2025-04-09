const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://127.0.0.1:27017'; // Default MongoDB URL
const dbName = 'mydatabase'; // Replace with your database name

async function main() {
    // Create a new MongoClient
    const client = new MongoClient(url);

    try {
        // Connect the client to the server
        await client.connect();
        console.log('Connected successfully to MongoDB server');

        // Access the database
        const db = client.db(dbName);

        // You can perform operations on the database here
        // For example, listing collections
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections);

    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    } finally {
        // Close the connection
        await client.close();
    }
}

main().catch(console.error);