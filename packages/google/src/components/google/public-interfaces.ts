import { OptionalHandlerFeatures, OptionalExtractions } from "assistant-source";
import { Extraction as ApiAiExtraction, HandlerInterface as ApiAiHandler } from "assistant-apiai";
import { Configuration } from "./private-interfaces";

/** Configuration of google component */
export interface GoogleConfiguration extends Partial<Configuration.Defaults>, Configuration.Required {};

/** Property describing the configuration of the google component */
export interface GoogleConfigurationAttribute {
  "google"?: GoogleConfiguration;
}

export interface Extraction extends 
  ApiAiExtraction,
  OptionalExtractions.TemporalAuthExtraction,
  OptionalExtractions.OAuthExtraction {}

export interface HandlerInterface extends
  ApiAiHandler,
  OptionalHandlerFeatures.SSMLHandler,
  OptionalHandlerFeatures.Reprompt,
  OptionalHandlerFeatures.GUI.Card.Simple,
  OptionalHandlerFeatures.GUI.Card.Image,
  OptionalHandlerFeatures.GUI.SuggestionChip,
  OptionalHandlerFeatures.GUI.ChatBubble,
  OptionalHandlerFeatures.AuthenticationHandler {
    getBody(): {
      speech?: string;
      displayText?: string;
      data: {
        google: GoogleWebhook.Response;
      }
    }
  }

/** SIGN IN / AUTH TOKEN */

export namespace GoogleWebhook {

  /** Webhook Response interface, extracted from official API */
  export namespace Response {
    export interface Rich {
      /** 
       * A list of UI elements which compose the response.
       *  The items must meet the following requirements: 
       * 1. The first item must be a google.actions.v2.SimpleResponse 
       * 2. At most two google.actions.v2.SimpleResponse 
       * 3. At most one card (e.g. google.actions.v2.ui_elements.BasicCard or google.actions.v2.StructuredResponse or google.actions.v2.MediaResponse 
       * 4. Cards may not be used if an actions.intent.OPTION intent is used ie google.actions.v2.ui_elements.ListSelect or google.actions.v2.ui_elements.CarouselSelect 
       * 
       * "responseType", the object's key, can only be one of the following: "simpleResponse"|"basicCard"|"structuredResponse"
      */
      items: { [responseType: string]: (Simple|Card.Basic) }[];

      /** A list of suggested replies. These will always appear at the end of the response. */
      suggestions?: SuggestionChip[];

      /** An additional suggestion chip that can link out to the associated app or site. */
      linkOutSuggestion?: LinkOutSuggestion;
    }

    /** The final response when the user input is not expected. */
    export interface Final {
      /** Rich response when user is not required to provide an input. */
      richResponse: Rich;
    }

    /** A simple response containing speech or text to show the user. */
    export interface Simple {
      /** Plain text of the speech output, e.g., "where do you want to go?" Mutually exclusive with ssml. */
      textToSpeech?: string;

      /** Structured spoken response to the user in the SSML format, e.g. <speak> Say animal name after the sound. <audio src = 'https://www.pullstring.com/moo.mps' />, what’s the animal? </speak>. Mutually exclusive with textToSpeech. */
      ssml?: string;

      /** Optional text to display in the chat bubble. If not given, a display rendering of the textToSpeech or ssml above will be used. Limited to 640 chars. */
      displayText?: string; 
    }

    /** A suggestion chip that the user can tap to quickly post a reply to the conversation. */
    export interface SuggestionChip {
      /** The text shown the in the suggestion chip. 
       * When tapped, this text will be posted back to the conversation verbatim as if the user had typed it. 
       * Each title must be unique among the set of suggestion chips. 
       * Max 25 chars. Required.
      */
      title: string;
    }
    
    /** Creates a suggestion chip that allows the user to jump out to the App or Website associated with this agent. */
    export interface LinkOutSuggestion {
      /** The name of the app or site this chip is linking to. The chip will be rendered with the title "Open ". Max 20 chars. Required. */
      destinationName: string;

      /** The URL of the App or Site to open when the user taps the suggestion chip. Ownership of this URL must be validated in the Actions on Google developer console, or the suggestion will not be shown to the user. */
      url: string;
    }

    export namespace Card {
      export interface Basic {
        /** Overall title of the card. Optional. */
        title?: string;

        /** Optional subtitle */
        subtitle?: string

        /** Body text of the card. Supports a limited set of markdown syntax for formatting. Required, unless image is present. */
        formattedText?: string;

        /** A hero image for the card. The height is fixed to 192dp. Optional. */
        image?: Image;

        /** Button objects that usually appears at the bottom of a card. */
        buttons?: Button[];
      }

      export interface Image {
        /** The source url of the image. Images can be JPG, PNG and GIF (animated and non-animated). Required. */
        url: string;

        /** A text description of the image to be used for accessibility, e.g. screen readers. Required. */
        accessibilityText: string;

        /** The height of the image in pixels. Optional. */
        height?: number;

        /** The width of the image in pixels. Optional. */
        width?: number;
      }

      export interface Button {
        /** Title of the button. Required. */
        title: string;

        /** Action to take when a user taps on the button. Required. */
        openUrlAction: {
          /** http or https scheme url. Required. */
          url: string;
        }
      }
    }
  }

  export interface Response {
    /** Shall we end the session after emitting this response? */
    expectUserResponse: boolean;
  
    /** Is SSML used? */
    isSsml: boolean;
  
    /** Used if we are not using finalResponse or richResponse. Contains the text to speak */
    speech?: string;
  
    /** Used if you are using a response containing additional things like suggestions and cards */
    richResponse?: Response.Rich;
  
    /** Used if you are sending the final response */
    finalResponse?: Response.Final;

    /** The expected intent the app is asking the assistant to provide. */
    systemIntent?: any;

    /** Used for reprompting */
    noInputPrompts?: Response.Simple[];
  }
}