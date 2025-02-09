import { axiosGemini } from "./axios.js";

export const geminiHelper = async(language, text) => {
    const prompt = `
                Return only the translated text if no translation is possible, return No Translation Available.\n
                Translate the following to ${language}: ${text}`
    const data = {
        contents: [{
            parts: [{ text: prompt }]
        }]
    };
    const response = await axiosGemini.post("", data)
    //console.log(response.data.candidates?.[0]?.content?.parts?.[0]?.text)
    const translatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Translation not available";
    //console.log(translatedText)
    if (!response.status==200) {
        console.log(response);
        return;
    }
    return translatedText ;            
}