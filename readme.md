# SQL Query Visualization Project

This project is a web application that allows users to upload SQLite or CSV files, query the data using natural language, and visualize the results. It's built with Next.js and uses LangChain for natural language processing.

This repository was created to provider a server to manage and query .sqlite and .csv files for the Database Visualization project sponsored by Langchain. Here are the repositories for the project:

- [LangGraph Cloud Backend](https://github.com/DhruvAtreja/DataVisualization)
- [Server to handle .sqlite and .csv files](https://github.com/DhruvAtreja/DataVisualization)

The project is deployed [here](https://data-visualization-frontend-gamma.vercel.app/).

## Features

- File upload support for SQLite and CSV files
- Natural language querying of uploaded data (Text to SQL)
- LangGraph cloud API
- Automatic visualization of query results
- Sample dataset available for demo purposes
- Trace viewing for query execution

## Getting Started

### Installation

1. Clone the repository

2. Install dependencies:

   ```
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required values:
     ```
     LANGSMITH_API_KEY=your_langsmith_api_key
     NEXT_PUBLIC_SQLITE_URL=https://sqllite-server.onrender.com (a custom server I made to host the sqlite and csv databases)
     LANGSMITH_API_URL=your_langsmith_api_url
     ```

### Running the Application

1. Start the development server:

   ```
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Upload a SQLite or CSV file, or use the provided sample dataset.
2. Enter a natural language query in the input field.
3. View the results, which will be automatically visualized if applicable.
4. Click "See Traces" to view the query execution process.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
