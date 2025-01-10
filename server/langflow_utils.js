import langFlowUpload from "./langflow/langflow_dataupload_api.js";
import langFlowAsk from "./langflow/langflow_api.js";
import callLangFlowAskQuestion from "./langflow/langflow_ask_question.js";

export async function callLangFlowAsk(inputQuestion, collectionName) {
  try {
    const result = await langFlowAsk(inputQuestion, collectionName);

    console.log("Yoohoho")

    // Check if the result contains a success flag (this depends on how your `main` function works)
    if (result && result.success) {
      console.log("Success:", result.message);
      return result; // Return success message
    } else {
      console.log("Error:", result ? result.message : "No message in result");
      return result; // Return error message
    }
  } catch (error) {
    console.log("Error:", result ? result.message : "No message in result");
    return result;
  }
}

export async function langFlowAskQuestion(inputQuestion, collectionName) {
  try {
    console.log("Yoohoho",inputQuestion,collectionName)
    const result = await callLangFlowAskQuestion(inputQuestion, collectionName);
    console.log("Yoohoho 2",inputQuestion,collectionName)


    // Check if the result contains a success flag (this depends on how your `main` function works)
    if (result && result.success) {
      console.log("Success:", result.message);
      return result; // Return success message
    } else {
      console.log("Error:", result ? result.message : "No message in result");
      return result; // Return error message
    }
  } catch (error) {
    console.log("Error:", result ? result.message : "No message in result");
    return result;
  }
}


// langflow file upload function
export async function callMain(inputValue, collectionName) {
  try {
    // Call the main function with the input data and collection name
    const result = await langFlowUpload(inputValue, collectionName); // Assuming 'main' is an async function

    // Check if the result contains a success flag (this depends on how your `main` function works)
    if (result && result.success) {
      console.log("Success:", result.message);
      return { success: true, message: result.message }; // Return success message
    } else {
      console.log("Error:", result ? result.message : "No message in result");
      return {
        success: false,
        message: result ? result.message : "Unknown error occurred",
      }; // Return error message
    }
  } catch (error) {
    console.error("Error calling main function:", error.message);
    return { success: false, message: `Error: ${error.message}` }; // Return error message
  }
}
