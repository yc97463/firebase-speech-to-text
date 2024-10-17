import * as functions from "firebase-functions";
import {Translate} from "@google-cloud/translate/build/src/v2";

// 初始化 Google Cloud Translation
const translate = new Translate();

interface TranslateTextRequest {
    text: string;
    targetLanguage: string;
}

exports.translateText = functions.https.onCall(
  async (request: functions.https.CallableRequest<TranslateTextRequest>) => {
    const {text, targetLanguage} = request.data;

    try {
      const [translation] = await translate.translate(text, targetLanguage);
      return {translation};
    } catch (error) {
      // 明確 error 為 Error 類型以便訪問 .message 屬性
      if (error instanceof Error) {
        console.error("Translation error:", error.message);
        return {error: `Translation failed: ${error.message}`};
      } else {
        console.error("Unknown error:", error);
        return {error: "Translation failed due to an unknown error"};
      }
    }
  }
);
