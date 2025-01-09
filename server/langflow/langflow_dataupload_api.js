const dotenv = require("dotenv");
dotenv.config();

class LangflowClient {
  constructor(baseURL, applicationToken) {
    this.baseURL = baseURL;
    this.applicationToken = applicationToken;
  }
  async post(endpoint, body, headers = { "Content-Type": "application/json" }) {
    headers["Authorization"] = `Bearer ${this.applicationToken}`;
    headers["Content-Type"] = "application/json";
    const url = `${this.baseURL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      const responseMessage = await response.json();
      if (!response.ok) {
        throw new Error(
          `${response.status} ${response.statusText} - ${JSON.stringify(
            responseMessage
          )}`
        );
      }
      return responseMessage;
    } catch (error) {
      console.error("Request Error:", error.message);
      throw error;
    }
  }

  async initiateSession(
    flowId,
    langflowId,
    inputValue,
    inputType = "chat",
    outputType = "chat",
    stream = false,
    tweaks = {}
  ) {
    const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
    return this.post(endpoint, {
      input_value: inputValue,
      input_type: inputType,
      output_type: outputType,
      tweaks: tweaks,
    });
  }

  handleStream(streamUrl, onUpdate, onClose, onError) {
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };

    eventSource.onerror = (event) => {
      console.error("Stream Error:", event);
      onError(event);
      eventSource.close();
    };

    eventSource.addEventListener("close", () => {
      onClose("Stream closed");
      eventSource.close();
    });

    return eventSource;
  }

  async runFlow(
    flowIdOrName,
    langflowId,
    inputValue,
    inputType = "chat",
    outputType = "chat",
    tweaks = {},
    stream = false,
    onUpdate,
    onClose,
    onError
  ) {
    try {
      const initResponse = await this.initiateSession(
        flowIdOrName,
        langflowId,
        inputValue,
        inputType,
        outputType,
        stream,
        tweaks
      );
      console.log("Init Response:", initResponse);
      if (
        stream &&
        initResponse &&
        initResponse.outputs &&
        initResponse.outputs[0].outputs[0].artifacts.stream_url
      ) {
        const streamUrl =
          initResponse.outputs[0].outputs[0].artifacts.stream_url;
        console.log(`Streaming from: ${streamUrl}`);
        this.handleStream(streamUrl, onUpdate, onClose, onError);
      }
      return initResponse;
    } catch (error) {
      console.error("Error running flow:", error);
      onError("Error initiating session");
    }
  }
}

async function main(
  inputValue,
  collectionName,
  inputType = "chat",
  outputType = "chat",
  stream = false
) {
  const flowIdOrName = "817ba240-4c04-4a86-9bae-97921a9efd94";
  const langflowId = "3203e051-8a37-49eb-9dda-0225f0f47176";
  const applicationToken =process.env.LangflowDataUploadToken;
  const langflowClient = new LangflowClient(
    "https://api.langflow.astra.datastax.com",
    applicationToken
  );

  try {
    console.log("langflow collcetion name", collectionName)
    const tweaks = {
      "Google Generative AI Embeddings-NwgsI": {
        api_key: "GoogleApi",
        model_name: "models/text-embedding-004",
      },
      "AstraDB-gFUAO": {
        advanced_search_filter: "{}",
        api_endpoint:
        process.env.AstraDB_Url,
        batch_size: null,
        bulk_delete_concurrency: null,
        bulk_insert_batch_concurrency: null,
        bulk_insert_overwrite_concurrency: null,
        collection_indexing_policy: "",
        collection_name: `${collectionName}`,
        embedding_choice: "Embedding Model",
        keyspace: "",
        metadata_indexing_exclude: "",
        metadata_indexing_include: "",
        metric: "cosine",
        number_of_results: 4,
        pre_delete_collection: false,
        search_filter: {},
        search_input: "",
        search_score_threshold: 0,
        search_type: "Similarity",
        setup_mode: "Sync",
        token: "ASTRA_DB_APPLICATION_TOKEN",
      },
      "TextInput-WY494": {
        input_value: `${inputValue}`,
      },
      "CustomComponent-d6SbF": {
        chunk_overlap: 200,
        chunk_size: 1000,
        csv_text: "",
        separator: "\n",
      },
    };
    response = await langflowClient.runFlow(
      flowIdOrName,
      langflowId,
      inputValue,
      inputType,
      outputType,
      tweaks,
      stream,
      (data) => console.log("Received:", data.chunk), // onUpdate
      (message) => console.log("Stream Closed:", message), // onClose
      (error) => console.log("Stream Error:", error) // onError
    );
    if (!stream && response && response.outputs) {
      const flowOutputs = response.outputs[0].outputs; ///TODO : Accessing this still note complete 
      // const firstComponentOutputs = flowOutputs.outputs[0];
      // const output = firstComponentOutputs.outputs.message;

      // console.log(`Yohohoh ${flowOutputs}`)

      // Return success message with collection name
      return {
        success: true,
        message: `Processing completed successfully with collection: ${collectionName}`,
        // result: output.message.text, // Include the result if necessary
        result: flowOutputs, // Include the result if necessary
      };
    } else {
      // If no valid response or error, return an error message
      return {
        success: false,
        message: `Error processing the flow with collection: ${collectionName}`,
      };
    }
  } catch (error) {
    console.error("Main Error", error.message);
    return {
      success: false,
      message: `Error: ${error.message} - Collection: ${collectionName}`,
    };
  }
}

module.exports = main;