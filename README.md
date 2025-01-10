# AI Data Analytics and Chatbot Platform

This project is a comprehensive platform for uploading CSV data, generating AI-driven analytics, summaries, and statistical visualizations, as well as providing an AI-powered chatbot for further exploration of user data. It leverages modern technologies including React, Express, LangFlow, and AstraDB vector store.

---

## Features

### 1. **CSV Data Upload**
- Users can upload their CSV files through a simple and intuitive interface.
- The uploaded data is processed and stored in the AstraDB vector store for efficient querying and analysis.

### 2. **AI Analytics and Summaries**
- Generates detailed AI-driven analytics and summaries from the uploaded data.
- Powered by LangFlow, the platform extracts meaningful insights from user data.

### 3. **Statistical Charts**
- Provides interactive and visually appealing statistical charts to help users better understand their data.
- Charts include bar graphs, pie charts, histograms, and more.

### 4. **AI Chatbot**
- An AI-powered chatbot allows users to ask questions about their data.
- Uses LangFlow to generate accurate and context-aware responses.

---

## Technology Stack

### **Frontend**
- **React**: Used to create a responsive and dynamic user interface.
- **Tailwind CSS**: For styling components with a modern and consistent look.
- **React Router**: Enables seamless navigation between different pages.

### **Backend**
- **Express.js**: Serves as the backend framework to handle API requests and responses.
- **LangFlow**: Facilitates natural language understanding and data querying.
- **AstraDB Vector Store**: Efficiently stores and retrieves vectorized data for fast analytics and AI operations.

---

## Installation and Setup

### Prerequisites
- **Node.js** (v16+)
- **npm** or **yarn**
- **AstraDB Account**

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/joker45op/tea-insights.git
   cd tea-insights
   ```

2. **Install Dependencies**
   - For the frontend:
     ```bash
     cd client
     npm install
     ```
   - For the backend:
     ```bash
     cd server
     npm install
     ```

3. **Set Up AstraDB**
   - Create an account on [AstraDB](https://www.datastax.com/astra).
   - Set up a vector database and update the configuration in the backend.

4. **Configure LangFlow**
   - Install and set up LangFlow for natural language understanding.
   - Update the API endpoint in the backend configuration.

5. **Run the Application**
   - Start the backend server:
     ```bash
     cd server
     npm start
     ```
   - Start the frontend development server:
     ```bash
     cd client
     npm run dev
     ```

---

## Usage

1. **Upload CSV Data**:
   - Navigate to the homepage and upload your CSV file.
   - Wait for the file to be processed.

2. **View Analytics and Charts**:
   - Access the summary and interactive charts generated from your data.

3. **Interact with the AI Chatbot**:
   - Ask questions about your data through the chatbot interface to get deeper insights.

---

## Folder Structure
```
project-root
├── client
│   ├── src
│   │   ├── components
│   │   └── App.js
├── server
│   ├── utils
│   └── index.js
├── README.md
└── package.json
```
---

Happy Data Analyzing! 🚀

