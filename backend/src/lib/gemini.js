import { axiosGemini } from "./axios.js";

export const geminiHelper = async(language, text) => {
    const prompt = `
                Response structure {"status": false, text:""} \n
                Return only the translated text. Translate the following to ${language}: ${text}\n
                Update the status to true and update text.\n
                If you can't translate update status to false\n
                Respond with the response structure and no other text.\n
                Don't respond in JSON.`
    const data = {
        contents: [{
            parts: [{ text: prompt }]
        }]
    };
    const response = await axiosGemini.post("", data)
    const parsedResponse = JSON.parse(response.data.candidates?.[0]?.content?.parts?.[0]?.text);
    console.log(parsedResponse)
    if (!parsedResponse["status"]) throw new Error("No translation available");
        return parsedResponse["text"];            
}