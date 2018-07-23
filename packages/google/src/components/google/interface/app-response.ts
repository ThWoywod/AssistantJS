import { Argument } from "./common";

export type OpenUrlActionUrlTypeHint = "URL_TYPE_HINT_UNSPECIFIED" | "AMP_CONTENT";

export type ImageDisplayOptions = "DEFAULT" | "WHITE" | "CROPPED";

export type PriceType = "UNKNOWN" | "ESTIMATE" | "ACTUAL";

export type ReasonType = "UNKNOWN" | "PAYMENT_DECLINED" | "INELIGIBLE" | "PROMO_NOT_APPLICABLE" | "UNAVAILABLE_SLOT";

export type MediaType = "MEDIA_TYPE_UNSPECIFIED" | "AUDIO";

export type HorizontalAlignment = "LEADING" | "CENTER" | "TRAILING";

export type ActionType =
  | "UNKNOWN"
  | "VIEW_DETAILS"
  | "MODIFY"
  | "CANCEL"
  | "RETURN"
  | "EXCHANGE"
  | "EMAIL"
  | "CALL"
  | "REORDER"
  | "REVIEW"
  | "CUSTOMER_SERVICE"
  | "FIX_ISSUE";

/**
 * AppResponse is the response for the HTTP API call from the Assistant to the app.
 * The response to AppRequest must occur within 5 seconds of the app receiving a request.
 * @example
 * {
 * "conversationToken": string,
 * "userStorage": string,
 * "resetUserStorage": boolean,
 * "expectUserResponse": boolean,
 * "expectedInputs": [object],
 * "finalResponse": object
 * "customPushMessage": object
 * "isInSandbox": boolean
 * }
 */

export interface AppResponse {
  /** An opaque token that is recirculated to the app every conversation turn. */
  conversationToken?: string;
  /**
   * An opaque token controlled by the application that is persisted across conversations for a particular user.
   * If empty or unspecified, the existing persisted token will be unchanged
   */
  userStorage?: string;
  /** Whether to clear the persisted userStorage. If set to true, then in the next interaction with the user, the userStorage field will be empty. */
  resetUserStorage?: string;
  /** Indicates whether the app is expecting a user response. This is true when the conversation is ongoing, false when the conversation is done. */
  expectUserResponse?: boolean;
  /** List of inputs the app expects, each input can be a built-in intent, or an input taking list of possible intents. Only one input is supported for now. */
  expectedInputs?: ExpectedInput[];
  /** Final response when the app does not expect user's input. */
  finalResponse?: RichResponse;
  /** Custom Push Message allows developers to send structured data to Google for interactions on the Assistant. */
  customPushMessage?: CustomPushMessage;
  /** Indicates whether the response should be handled in sandbox mode. This bit is needed to push structured data to Google in sandbox mode. */
  isInSandbox?: boolean;
}

export interface ExpectedInput {
  /** The customized prompt used to ask user for input. */
  inputPrompt?: InputPrompt;
  /** List of intents that can be used to fulfill this input. To have the Google Assistant just return the raw user input, the app should ask for the actions.intent.TEXT intent. */
  possibleIntents?: ExpectedIntent;
  /** List of phrases the app wants Google to use for speech biasing. Up to 1000 phrases are allowed. */
  speechBiasingHints?: string;
}

export interface ExpectedIntent {
  /**
   * The built-in intent name, e.g. actions.intent.TEXT, or intents defined in the action package.
   * If the intent specified is not a built-in intent, it is only used for speech biasing and the input provided by the Google Assistant will be the actions.intent.TEXT intent.
   */
  intent?: string;
  /**
   * Additional configuration data required by a built-in intent. Possible
   * values for the built-in intents: `actions.intent.OPTION ->`
   * [google.actions.v2.OptionValueSpec], `actions.intent.CONFIRMATION ->`
   * [google.actions.v2.ConfirmationValueSpec],
   * `actions.intent.TRANSACTION_REQUIREMENTS_CHECK ->`
   * [google.actions.v2.TransactionRequirementsCheckSpec],
   * `actions.intent.DELIVERY_ADDRESS ->`
   * [google.actions.v2.DeliveryAddressValueSpec],
   * `actions.intent.TRANSACTION_DECISION ->`
   * [google.actions.v2.TransactionDecisionValueSpec],
   * `actions.intent.PLACE ->`
   * [google.actions.v2.PlaceValueSpec],
   * `actions.intent.Link ->`
   * [google.actions.v2.LinkValueSpec]
   */
  inputValueData?: {
    [key: string]: any;
  };
  /** Optionally, a parameter of the intent that is being requested. Only valid for requested intents. Used for speech biasing. */
  parameterName?: string;
}

export interface InputPrompt {
  /**
   * Initial prompts asking user to provide an input. Only a single initial_prompt is supported.
   * THIS ITEM IS DEPRECATED.
   */
  initialPrompts?: SpeechResponse;
  /** Prompt payload. */
  richInitialPrompt?: RichResponse;
  /** Prompt used to ask user when there is no input from user. */
  noInputPrompts?: SimpleResponse[];
}

export interface SpeechResponse {
  /** Structured spoken response to the user in the SSML format */
  ssml?: string;
  /** Plain text of the speech output, e.g., "where do you want to go?"/ */
  textToSpeech?: string;
}

export interface RichResponse {
  /**
   * A list of UI elements which compose the response
   * For the requirements see: https://developers.google.com/actions/reference/rest/Shared.Types/AppResponse#RichResponse
   */
  items?: Item[];
  /** A list of suggested replies. These will always appear at the end of the response. If used in a FinalResponse, they will be ignored. */
  suggestions?: Array<{
    title: string;
  }>;
  /** An additional suggestion chip that can link out to the associated app or site. */
  linkOutSuggestion?: LinkOutSuggestion[];
}

export interface Item {
  /**
   * !! Union field input. The actual input value input can be only one of the following: !!
   */
  /** Voice and text-only response. */
  simpleResponse?: SimpleResponse;
  /** A basic card */
  basicCard?: BasicCard;
  /** Structured payload to be processed by Google. */
  structuredResponse?: StructuredResponse;
  /** Response indicating a set of media to be played. */
  mediaResponse?: MediaResponse;
  /** Carousel browse card. */
  carouselBrowse?: CarouselBrowse;
  /** tableCard */
  tableCard?: TableCard;
}

export interface SimpleResponse {
  /** Plain text of the speech output, e.g., "where do you want to go?" Mutually exclusive with ssml. */
  textToSpeech?: string;
  /** Structured spoken response to the user in the SSML format */
  ssml?: string;
  /** Optional text to display in the chat bubble. If not given, a display rendering of the textToSpeech or ssml above will be used. Limited to 640 chars. */
  displayText?: string;
}

export interface BasicCard {
  /** Overall title of the card. Optional. */
  title?: string;
  /** Optional. */
  subtitle?: string;
  /** Body text of the card. Supports a limited set of markdown syntax for formatting. Required, unless image is present. */
  formattedText?: string;
  /** A hero image for the card. The height is fixed to 192dp. Optional. */
  image?: Image;
  /** Buttons. Currently at most 1 button is supported. Optional. */
  buttons?: Button[];
  /** Type of image display option. Optional. */
  imageDisplayOptions?: ImageDisplayOptions;
}

export interface Image {
  /** The source url of the image. Images can be JPG, PNG and GIF (animated and non-animated). Required */
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
  title?: string;
  /** Action to take when a user taps on the button. Required. */
  openUrlAction?: OpenUrlAction;
}

export interface OpenUrlAction {
  /** The url field which could be any of: - http/https urls for opening an App-linked App or a webpage */
  url?: string;
  /** Information about the Android App if the URL is expected to be fulfilled by an Android App. */
  androidApp?: AndroidApp;
  /** Indicates a hint for the url type. */
  urlTypeHint?: OpenUrlActionUrlTypeHint;
}

export interface AndroidApp {
  /** Package name Package name must be specified when specifing Android Fulfillment. */
  packageName?: string;
  /** When multiple filters are specified, any filter match will trigger the app. */
  versions?: VersionFilter[];
}

export interface VersionFilter {
  /** Min version code or 0, inclusive. */
  minVersion?: number;
  /** Max version code, inclusive. The range considered is [minVersion:maxVersion]. A null range implies any version.  */
  maxVersion?: number;
}

export interface StructuredResponse {
  /** App provides an order update (e.g. Receipt) after receiving the order. */
  orderUpdate?: OrderUpdate;
}

export interface OrderUpdate {
  /** Id of the order is the Google-issued id. */
  googleOrderId?: string;
  /** Required. The canonical order id referencing this order. If integrators don't generate the canonical order id in their system, they can simply copy over googleOrderId included in order */
  actionOrderId?: string;
  /** The new state of the order. */
  orderState?: OrderState;
  /** Updated applicable management actions for the order, e.g. manage, modify, contact support. */
  orderManagementActions?: Action[];
  /** Receipt for order. */
  receipt?: Receipt;
  /** When the order was updated from the app's perspective. */
  updateTime?: string;
  /** New total price of the order */
  totalPrice?: Price;
  /** Map of line item-level changes, keyed by item id. Optional. */
  lineItemUpdates?: {
    [key: string]: LineItemUpdate;
  };
  /** If specified, displays a notification to the user with the specified title and text. Specifying a notification is a suggestion to notify and is not guaranteed to result in a notification. */
  userNotification?: UserNotification;
  /** */
  infoExtension?: {
    [key: string]: LineItemUpdate;
  };
  /**
   * !! Union field input. The actual input value input can be only one of the following: !!
   */
  /** Information about rejection state. */
  rejectionInfo?: RejectionInfo;
  /** Information about cancellation state. */
  cancellationInfo?: {
    reason: string;
  };
  /** Information about in transit state. */
  InTransitInfo?: {
    updatedTime: string;
  };
  /** Information about fulfillment state. */
  fulfillmentInfo?: {
    deliveryTime: string; // (Timestamp format)
  };
  /** Information about returned state. */
  returnInfo?: {
    reason: string;
  };
}

export interface OrderState {
  /**
   * State can be one of the following values:
   *
   * `CREATED`: Order was created at integrator's system.
   * `REJECTED`: Order was rejected by integrator.
   * `CONFIRMED`: Order was confirmed by the integrator and is active.
   * `CANCELLED`: User cancelled the order.
   * `IN_TRANSIT`: Order is being delivered.
   * `RETURNED`: User did a return.
   * `FULFILLED`: User received what was ordered.
   * 'CHANGE_REQUESTED': User has requested a change to the order, and
   *           the integrator is processing this change. The
   *           order should be moved to another state after the
   *           request is handled.
   *
   * Required.
   */
  state: string;
  /** The user-visible string for the state. Required. */
  label: string;
}

export interface Action {
  /** Type of action. */
  type?: ActionType;
  /** Button label and link. */
  button?: Button;
}

export interface Receipt {
  /**
   * DEPRECEATED
   * Confirmed order id when order has been received by the integrator.
   * This is the canonical order id used in integrator's system referencing the order and may subsequently be used to identify the order as actionOrderId.
   */
  confirmedActionOrderId?: string;
  /** Optional. The user facing id referencing to current order, which will show up in the receipt card if present */
  userVisibleOrderId?: string;
}

export interface Price {
  /** Type of Price. Required */
  type: PriceType;
  /**  Monetary amount. Required. */
  amount: Money;
}

export interface Money {
  /** The 3-letter currency code defined in ISO 4217. */
  currencyCode: string;
  /** The whole units of the amount. For example if currencyCode is "USD", then 1 unit is one US dollar */
  units: string; // int64 format
  /** Number of nano (10^-9) units of the amount. The value must be between -999,999,999 and +999,999,999 inclusive */
  nanos: number;
}

export interface LineItemUpdate {
  /** New line item-level state. */
  orderState?: OrderState;
  /** New price for the line item */
  price?: Price;
  /** Reason for the change. Required for price changes. */
  reason?: string;
  /** Update to the line item extension. Type must match the item's existing extension type. */
  extension?: {
    [key: string]: any;
  };
}

export interface UserNotification {
  /** The title for the user notification. */
  title?: string;
  /** The contents of the notification. */
  text?: string;
}

export interface RejectionInfo {
  /** Rejection type. */
  type?: ReasonType;
  /** Reason for the error. */
  reason?: string;
}

export interface MediaResponse {
  /** Type of the media within this response. */
  mediaType?: MediaType;
  /** The list of media objects. */
  mediaObjects?: MediaObject[];
}

export interface MediaObject {
  /** Name of this media object. */
  name?: string;
  /** Description of this media object. */
  description?: string;
  /** The url pointing to the media content */
  contentUrl?: string;
  /**
   * !! Union field input. The actual input value input can be only one of the following: !!
   */
  /** A large image, such as the cover of the album, etc. */
  largeImage?: Image;
  /** A small image icon displayed on the right from the title. It's resized to 36x36 dp. */
  icon?: Image;
}

export interface CarouselBrowse {
  /** Min: 2. Max: 10. */
  item?: CarouselItem[];
  /** Tyoe if image display option */
  imageDisplayOptions?: ImageDisplayOptions;
}

export interface CarouselItem {
  /** Title of the carousel item. Required. */
  title: string;
  /** Description of the carousel item. Optional. */
  description?: string;
  /** Footer text for the carousel item, displayed below the description. Single line of text, truncated with an ellipsis. Optional. */
  footer?: string;
  /** Hero image for the carousel item. Optional. */
  image?: Image;
  /** URL of the document associated with the carousel item. The document can contain HTML content or, if "urlTypeHint" is set to AMP_CONTENT, AMP content. Required. */
  openUrlAction: OpenUrlAction;
}

export interface TableCard {
  /** Overall title of the table. Optional but must be set if subtitle is set. */
  title?: string;
  /** Subtitle for the table. Optional. */
  subtitle?: string;
  /** Image associated with the table. Optional. */
  image?: Image;
  /** Headers and alignment of columns. */
  columnProperties?: ColumnProperties[];
  /** Row data of the table. The first 3 rows are guaranteed to be shown but others might be cut on certain surfaces. */
  rows?: Row[];
  /** Buttons. Currently at most 1 button is supported. Optional. */
  buttons?: Button[];
}

export interface ColumnProperties {
  /** Header text for the column. */
  header?: string;
  /** Horizontal alignment of content w.r.t column. If unspecified, content will be aligned to the leading edge. */
  horizontalAlignment?: HorizontalAlignment;
}

export interface Row {
  /** Text content of the cell. */
  cells: Array<{
    text: string;
  }>;
  /** ndicates whether there should be a divider after each row. */
  dividerAfter?: boolean;
}

export interface LinkOutSuggestion {
  /** The name of the app or site this chip is linking to. The chip will be rendered with the title "Open ". Max 20 chars. Required. */
  destinationName: string;
  /** The URL of the App or Site to open when the user taps the suggestion chip */
  openUrlAction?: OpenUrlAction;
}

export interface CustomPushMessage {
  /** The specified target for the push request. */
  target?: Target;
  /** An order update updating orders placed through transaction APIs. */
  orderUpdate?: OrderUpdate;
  /** If specified, displays a notification to the user with specified title and text. */
  userNotification?: UserNotification;
}

export interface Target {
  /** The user to target. */
  userId?: string;
  /** The intent to the target */
  intent?: string;
  /** The argument to target for an intent. For V1, only one Argument is supported. */
  argument?: Argument;
  /**
   * The locale to target. Follows IETF BCP-47 language code.
   * Can be used by a multi-lingual app to target a user on a specified localized app.
   * If not specified, it will default to en-US.
   */
  locale?: string;
}
