import { Argument, Permission } from ".";

export type OpenUrlActionUrlTypeHint = "URL_TYPE_HINT_UNSPECIFIED" | "AMP_CONTENT";

export type ImageDisplayOptionsType = "DEFAULT" | "WHITE" | "CROPPED";

export type PriceType = "UNKNOWN" | "ESTIMATE" | "ACTUAL";

export type ReasonType = "UNKNOWN" | "PAYMENT_DECLINED" | "INELIGIBLE" | "PROMO_NOT_APPLICABLE" | "UNAVAILABLE_SLOT";

export type MediaType = "MEDIA_TYPE_UNSPECIFIED" | "AUDIO";

export type HorizontalAlignment = "LEADING" | "CENTER" | "TRAILING";

export type PaymentMethodTokenizationType = "UNSPECIFIED_TOKENIZATION_TYPE" | "PAYMENT_GATEWAY" | "DIRECT";

export type ProvidedPaymentOptionsSupportedCardNetwork = "UNSPECIFIED_CARD_NETWORK" | "AMEX" | "DISCOVER" | "MASTERCARD" | "VISA" | "JCB";

export type CustomerInfoPropertyType = "CUSTOMER_INFO_PROPERTY_UNSPECIFIED" | "EMAIL";

export type OrdersPaymentInfoPaymentType = "PAYMENT_TYPE_UNSPECIFIED" | "PAYMENT_CARD" | "BANK" | "LOYALTY_PROGRAM" | "ON_FULFILLMENT" | "GIFT_CARD";

export type OrdersLineItemType = "UNSPECIFIED" | "REGULAR" | "TAX" | "DISCOUNT" | "GRATUITY" | "DELIVERY" | "SUBTOTAL" | "FEE";

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
 * !!! IN ASSISTANTJS USE DIALOGFLOW WEBHOOK FORMAT !!!
 * AppResponse is the response for the HTTP API call to the app.
 * The response to AppRequest must occur within 5 seconds of the app receiving a request.
 * If you are using Dialogflow to create Actions, your fulfillment communicates with Dialogflow through its own,
 * standard webhook format instead of the Actions on Google conversation webhook format.
 * The Dialogflow webhook format contains all the information of the conversation webhook format along with additional Dialogflow-specific data,
 * such as information about contexts and parameters.
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

/**
 * List of inputs the app expects, each input can be a built-in intent, or an input taking list of possible intents. Only one input is supported for now.
 */
export interface ExpectedInput {
  /** The customized prompt used to ask user for input. */
  inputPrompt?: InputPrompt;
  /** List of intents that can be used to fulfill this input. To have the Google Assistant just return the raw user input, the app should ask for the actions.intent.TEXT intent. */
  possibleIntents?: ExpectedIntent;
  /** List of phrases the app wants Google to use for speech biasing. Up to 1000 phrases are allowed. */
  speechBiasingHints?: string;
}

/**
 * Intent that can be used to fulfill this input. To have the Google Assistant just return the raw user input, the app should ask for the actions.intent.TEXT intent.
 */
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

/**
 * The customized prompt used to ask user for input.
 */
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

/**
 * A rich response that can include audio, text, cards, suggestions and structured data.
 */
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

/**
 * Items like Voice and text-only response, basic- or table cards.
 */
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

/**
 * A simple response containing speech or text to show the user.
 */
export interface SimpleResponse {
  /** Plain text of the speech output, e.g., "where do you want to go?" Mutually exclusive with ssml. */
  textToSpeech?: string;
  /** Structured spoken response to the user in the SSML format */
  ssml?: string;
  /** Optional text to display in the chat bubble. If not given, a display rendering of the textToSpeech or ssml above will be used. Limited to 640 chars. */
  displayText?: string;
}

/**
 * A basic card for displaying some information, e.g. an image and/or text.
 */
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
  imageDisplayOptions?: ImageDisplayOptionsType;
}

/**
 * An image displayed in the card. The height is fixed to 192dp.
 */
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

/**
 * A button object that usually appears at the bottom of a card.
 */
export interface Button {
  /** Title of the button. Required. */
  title?: string;
  /** Action to take when a user taps on the button. Required. */
  openUrlAction?: OpenUrlAction;
}

/**
 * Action to take when a user taps on the button.
 */
export interface OpenUrlAction {
  /** The url field which could be any of: - http/https urls for opening an App-linked App or a webpage */
  url?: string;
  /** Information about the Android App if the URL is expected to be fulfilled by an Android App. */
  androidApp?: AndroidApp;
  /** Indicates a hint for the url type. */
  urlTypeHint?: OpenUrlActionUrlTypeHint;
}

/**
 * Specification of the Android App for fulfillment restrictions
 */
export interface AndroidApp {
  /** Package name Package name must be specified when specifing Android Fulfillment. */
  packageName?: string;
  /** When multiple filters are specified, any filter match will trigger the app. */
  versions?: VersionFilter[];
}

/**
 * VersionFilter should be included if specific version/s of the App are required.
 */
export interface VersionFilter {
  /** Min version code or 0, inclusive. */
  minVersion?: number;
  /** Max version code, inclusive. The range considered is [minVersion:maxVersion]. A null range implies any version.  */
  maxVersion?: number;
}

/**
 * The response defined for app to respond with structured data.
 */
export interface StructuredResponse {
  /** App provides an order update (e.g. Receipt) after receiving the order. */
  orderUpdate?: OrderUpdate;
}

/**
 * Update to an order.
 */
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

/**
 * Current order state.
 */
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

/**
 * A follow-up action associated with the order update.
 */
export interface Action {
  /** Type of action. */
  type?: ActionType;
  /** Button label and link. */
  button?: Button;
}

/**
 * Receipt when state is CONFIRMED or any other state (e.g. IN_TRANSIT, FULFILLED) inclusive of CONFIRMED state.
 */
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

/**
 * Price in order.
 */
export interface Price {
  /** Type of Price. Required */
  type: PriceType;
  /**  Monetary amount. Required. */
  amount: Money;
}

/**
 * Represents an amount of money with its currency type.
 */
export interface Money {
  /** The 3-letter currency code defined in ISO 4217. */
  currencyCode: string;
  /** The whole units of the amount. For example if currencyCode is "USD", then 1 unit is one US dollar */
  units: string; // int64 format
  /** Number of nano (10^-9) units of the amount. The value must be between -999,999,999 and +999,999,999 inclusive */
  nanos: number;
}

/**
 * Updates for individual line items. At least one of orderState or price should be specified.
 */
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

/**
 * Optional user notification to display as part of the Order update.
 */
export interface UserNotification {
  /** The title for the user notification. */
  title?: string;
  /** The contents of the notification. */
  text?: string;
}

/**
 * The rejection info when state is REJECTED. This message can be populated in the initial order update in conversation or through subsequent async order update.
 */
export interface RejectionInfo {
  /** Rejection type. */
  type?: ReasonType;
  /** Reason for the error. */
  reason?: string;
}

/**
 * The response indicating a set of media to be played within the conversation.
 */
export interface MediaResponse {
  /** Type of the media within this response. */
  mediaType?: MediaType;
  /** The list of media objects. */
  mediaObjects?: MediaObject[];
}

/**
 * Represents one media object which is returned with MediaResponse. Contains information about the media, such as name, description, url, etc.
 */
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

/**
 * Presents a set of AMP documents as a carousel of large-tile items. Items may be selected to launch their associated AMP document in an AMP viewer.
 */
export interface CarouselBrowse {
  /** Min: 2. Max: 10. */
  items?: CarouselItem[];
  /** Tyoe if image display option */
  imageDisplayOptions?: ImageDisplayOptionsType;
}

/**
 * Item in the carousel.
 */
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

/**
 * A table card for displaying a table of text.
 */
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

/**
 * Keeps properties of columns (including headers).
 */
export interface ColumnProperties {
  /** Header text for the column. */
  header?: string;
  /** Horizontal alignment of content w.r.t column. If unspecified, content will be aligned to the leading edge. */
  horizontalAlignment?: HorizontalAlignment;
}

/**
 * Describes a row in the table.
 */
export interface Row {
  /** Text content of the cell. */
  cells: Array<{
    text: string;
  }>;
  /** ndicates whether there should be a divider after each row. */
  dividerAfter?: boolean;
}

/**
 * Creates a suggestion chip that allows the user to jump out to the App or Website associated with this agent.
 */
export interface LinkOutSuggestion {
  /** The name of the app or site this chip is linking to. The chip will be rendered with the title "Open ". Max 20 chars. Required. */
  destinationName: string;
  /** The URL of the App or Site to open when the user taps the suggestion chip */
  openUrlAction?: OpenUrlAction;
}

/**
 * A custom push message that holds structured data to push for the Actions Fulfillment API.
 */
export interface CustomPushMessage {
  /** The specified target for the push request. */
  target?: Target;
  /** An order update updating orders placed through transaction APIs. */
  orderUpdate?: OrderUpdate;
  /** If specified, displays a notification to the user with specified title and text. */
  userNotification?: UserNotification;
}

/**
 * The specified target for the push request.
 */
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

export namespace ValueSpecifications {
  /**
   * Input for AskForConfirmation
   */
  export interface ConfirmationValueSpec {
    /** Configures dialog that asks for confirmation. */
    dialogSpec?: {
      /** This is the question asked by confirmation sub-dialog. For example "Are you sure about that?" */
      requestConfirmationText?: string;
    };
  }
  /**
   * Spec to control asking the user for a datetime.
   */
  export interface DateTimeValueSpec {
    /** Control datetime prompts. */
    dialogSpec?: DateTimeDialogSpec;
  }

  /**
   * Speech configurations for asking for datetime. The fields in the dialogSpec are used to create prompt for the datetime dialog
   */
  export interface DateTimeDialogSpec {
    /** This is used to create initial prompt by datetime sub-dialog. Example question: "What date and time do you want?" */
    requestDatetimeText?: string;
    /** This is used to create prompt to ask for date only. For example: What date are you looking for? */
    requestDateText?: string;
    /** This is used to create prompt to ask for time only. For example: What time? */
    requestTimeText?: string;
  }

  /**
   * Passed by the app as input for actions.intent.DELIVERY_ADDRESS
   */
  export interface DeliveryAddressValueSpec {
    /** Configuration for delivery address dialog. */
    addressOptions?: AddressOptions;
  }

  /**
   * Options when asking for a delivery address.
   */
  export interface AddressOptions {
    /**
     * App can optionally pass a short text giving user a hint why delivery address is requested. For example,
     * "Grubhub is asking your address for [determining the service area].", the text in [] is the custom TTS that should be populated here.
     */
    reason?: string;
  }

  /**
   * Passed from the app as input for actions.intent.LINK.
   */
  export interface LinkValueSpec {
    /** Destination that the app should link to. Could be a web URL, a conversational link or an Android intent. */
    openUrlAction?: OpenUrlAction;
    /** Prompts related metadata for helper sub-dialogs. */
    dialogSpec?: {
      /** Holds helper specific dialog specs if any. For example: ConfirmationDialogSpec for confirmation helper. */
      extension?: {
        [key: string]: any;
      };
    };
  }

  /**
   * Ask the user to select one of the options.
   */
  export interface OptionValueSpec {
    /**
     * !!! Union field input. The actual input value input can be only one of the following: !!!
     */
    /** A simple select with no associated GUI */
    simpleSelect?: SimpleSelect;
    /** A select with a list card GUI */
    listSelect?: ListSelect;
    /** A select with a card carousel GUI */
    carouselSelect?: CarouselSelect;
  }

  /**
   * A simple select with no associated GUI. Please update assistant.logs.actions.SimpleSelect to reflect any changes made.
   */
  export interface SimpleSelect {
    /** List of items users should select from. */
    items?: SimpleSelectItem[];
  }

  export interface SimpleSelectItem {
    /** Item key and synonyms. */
    optionInfo?: OptionInfo;
    /** Title of the item. It will act as synonym if it's provided. Optional */
    title?: string;
  }

  /**
   * Additional info about the option item related to triggering it in a dialog. Please update assistant.logs.actions.OptionInfo to reflect any changes made.
   */
  export interface OptionInfo {
    /** A unique key that will be sent back to the agent if this response is given. */
    key?: string;
    /** A list of synonyms that can also be used to trigger this item in dialog. */
    synonyms?: string[];
  }

  /** A card for presenting a list of options to select from. */
  export interface ListSelect {
    /** Overall title of the list. Optional. */
    title?: string;
    /** An item in the list. min: 2 max: 30 */
    items?: ListItem[];
  }

  /**
   * An item in a ListSelect
   */
  export interface ListItem {
    /** Information about this option. See google.actions.v2.OptionInfo for details. Required. */
    optionInfo: OptionInfo;
    /**
     * Title of the list item. When tapped, this text will be posted back to the conversation verbatim as if the user had typed it.
     * Each title must be unique among the set of list items. Required.
     */
    title: string;
    /** Main text describing the item. Optional. */
    description?: string;
    /** Square image. Optional. 48px x 48px */
    image?: Image;
  }

  /**
   * A card for presenting a carousel of options to select from.
   */
  export interface CarouselSelect {
    /** An item in the carousel */
    items?: CarouselSelectCarouselItem[];
  }

  export interface CarouselSelectCarouselItem {
    /** See google.actions.v2.OptionInfo for details. Required. */
    optionInfo: OptionInfo;
    /**
     * Title of the carousel item. When tapped, this text will be posted back to the conversation verbatim as if the user had typed it.
     * Each title must be unique among the set of carousel items. Required.
     */
    title: string;
    /** Body text of the card. */
    description?: string;
    /** Optional */
    image?: Image;
  }

  /**
   * Spec for asking for permission.
   */
  export interface PermissionValueSpec {
    /** The context why agent needs to request permission. */
    optContext?: string;
    /** List of permissions requested by the agent. */
    permissions?: Permission[];
    /** Additional information needed to fulfill update permission request. */
    updatePermissionValueSpec?: UpdatePermissionValueSpec;
  }

  /**
   * Additional information needed for requesting an update permission
   */
  export interface UpdatePermissionValueSpec {
    /** The intent that the user wants to get updates from. */
    intent?: string;
    /** The list of arguments necessary to fulfill an update */
    arguments?: Argument[];
  }

  /**
   * Returned to app as output for actions.intent.SIGN_IN.
   */
  export interface SignInValueSpec {
    /** The optional context why the app needs to ask the user to sign in, as a prefix of a prompt for user consent, e.g. "To track your exercise", or "To check your account balance". */
    optContext?: string;
  }

  /**
   * Passed by the app as input for actions.intent.TRANSACTION_REQUIREMENTS_CHECK
   */
  export interface TransactionRequirementsCheckSpec {
    /** Options associated with the order. */
    orderOptions?: OrderOptions;
    /** Payment options for this Order, or empty if no payment is associated with the Order. */
    paymentOptions?: OrderPaymentOptions;
  }

  /**
   * Options for payment associated with a order.
   */
  export interface OrderPaymentOptions {
    /** Info for an Action-provided payment instrument for display on receipt. */
    googleProvidedOptions?: GoogleProvidedPaymentOptions;
    /** Requirements for Google provided payment instrument. */
    actionProvidedOptions?: ActionProvidedPaymentOptions;
  }

  /**
   * Requirements for Google-provided payment method.
   */
  export interface GoogleProvidedPaymentOptions {
    /**
     * Required field for requesting Google provided payment instrument.
     * These tokenization parameters will be used for generating payment token for use in transaction. The app should get these parameters from their payment gateway.
     */
    tokenizationParameters?: PaymentMethodTokenizationParameters;
    /** Card network that may be used in the transaction */
    supportedCardNetworks?: ProvidedPaymentOptionsSupportedCardNetwork[];
    /** If true, disallow prepaid cards from being used in the transaction. */
    prepaidCardDisallowed?: boolean;
    /** If true, billing address will be returned. */
    billingAddressRequired?: boolean;
  }

  /**
   * Options associated with the order.
   */
  export interface OrderOptions {
    /** If true, delivery address is required for the associated Order. */
    requestDeliveryAddress?: boolean;
    /** The app can request customer info by setting this field. If set, the corresponding field will show up in ProposedOrderCard for user's confirmation. */
    customerInfoOptions?: CustomerInfoOptions;
  }

  /**
   * The app can request customer info by setting this field.
   * If set, the corresponding field will show up in ProposedOrderCard for user's confirmation.
   */
  export interface CustomerInfoOptions {
    customerInfoProperties?: CustomerInfoPropertyType[];
  }

  /**
   * Partner MUST specify the tokenization parameters if payment methods user saved with Google will be used in the transaction.
   * Partner should be able to get these parameters from its own Payment Gateway.
   */
  export interface PaymentMethodTokenizationParameters {
    /** Required */
    tokenizationType: PaymentMethodTokenizationType;
    /**
     * If tokenizationType is set to PAYMENT_GATEWAY then the list of parameters should contain payment gateway specific parameters required to tokenize payment method
     * as well as parameter with the name "gateway" with the value set to one of the gateways that we support e.g. "stripe" or "braintree".
     * For further informaion see: https://developers.google.com/actions/reference/rest/Shared.Types/PaymentOptions#PaymentMethodTokenizationParameters#GoogleProvidedPaymentOptions
     */
    parameters?: {
      [key: string]: string;
    };
  }

  /**
   * Requirements for Action-provided payment method.
   */
  export interface ActionProvidedPaymentOptions {
    /** Type of payment. Required. */
    paymentType: OrdersPaymentInfoPaymentType;
    /** ame of the instrument displayed on the receipt. Required for action-provided payment info. For PAYMENT_CARD, this could be "VISA-1234" */
    displayName?: string;
  }

  /**
   * Passed from the app as input for actions.intent.TRANSACTION_DECISION.
   */
  export interface TransactionDecisionValueSpec {
    /**
     * Options associated with the order.
     */
    orderOptions?: ProposedOrder;
    /**
     * Payment options for this order, or empty if no payment
     * is associated with the order.
     */
    paymentOptions?: OrderOptions;
    /**
     * Options used to customize order presentation to the user.
     */
    presentationOptions?: PaymentOptions;
    /**
     * The proposed order that's ready for user to approve.
     */
    proposedOrder?: ProposedOrder;
  }

  export interface ProposedOrder {
    /** User's items. */
    cart?: Cart;
    /**
     * Extension to the proposed order based on the kind of order.
     * For example, if the order includes a location then this extension will
     * contain a OrderLocation value.
     */
    extension?: {
      [key: string]: any;
    };
    /** Optional id for this ProposedOrder. Included as part of the ProposedOrder returned back to the integrator at confirmation time. */
    id?: string;
    /**
     * Image associated with the proposed order.
     */
    image?: Image;
    /** Fees, adjustments, subtotals, etc. */
    otherItems?: OrdersLineItemType[];
    /** A link to the terms of service that apply to this proposed order. */
    termsOfServiceUrl?: string;
    /** Total price of the proposed order. If of type `ACTUAL`, this is the amount the caller will charge when the user confirms the proposed order. */
    totalPrice?: Price;
  }

  export interface Cart {
    /** Optional id for this cart. Included as part of the Cart returned back to the integrator at confirmation time. */
    id?: string;
    /** Merchant for the cart, if different from the caller. */
    merchant?: Merchant;
    /** The good(s) or service(s) the user is ordering. There must be at least one line item. */
    lineItems?: OrdersLineItemType[];
    /** Adjustments entered by the user, e.g. gratuity. */
    otherItems?: OrdersLineItemType[];
    /** Notes about this cart. */
    notes: string;
    /** Optional. Promotional coupons added to the cart. Eligible promotions will be sent back as discount line items in proposed order. */
    promotions?: Array<{
      /** Required. Coupon code understood by 3P. For ex: GOOGLE10. */
      coupon?: string;
    }>;
    /** Extension to the cart based on the type of order. An object containing fields of an arbitrary type. An additional field "@type" contains a URI identifying the type. */
    extension?: {
      [key: string]: any;
    };
  }

  /**
   * Merchant for the cart.
   */
  export interface Merchant {
    /** Id of the merchant. */
    id?: string;
    /** User-visible name of the merchant. Required. */
    name?: string;
  }

  /**
   * Line item in order.
   */
  export interface OrdersLineItem {
    /** Unique id of the line item within the Cart/Order. Required. */
    id: string;
    /** Name of the line item as displayed in the receipt. Required. */
    name: string;
    /** Type of line item. */
    type: OrdersLineItemType;
    /** Number of items included. */
    quantity?: number;
    /** Description of the item. */
    description?: string;
    /** Small image associated with this item. */
    image: Image;
    /** Each line item should have a price, even if the price is 0. Required. This is the total price as displayed on the receipt for this line (i.e. unit price * quantity). */
    price: Price;
    /** Sub-line item(s). Only valid if type is REGULAR. */
    subLines?: SubLine[];
    /** Optional product or offer id for this item. */
    offerId?: string;
    /** Extension to the cart based on the type of order. An object containing fields of an arbitrary type. An additional field "@type" contains a URI identifying the type. */
    extension?: {
      [key: string]: any;
    };
  }

  /**
   * SubLine item associated with line item in order.
   */
  export interface SubLine {
    /**
     * !!! Union field input. The actual input value input can be only one of the following: !!!
     */
    /** */
    lineItem?: OrdersLineItem;
    /** A note associated with the line item. */
    note?: string;
  }

  /**
   * Input for AskForPlace.
   */
  export interface PlaceValueSpec {
    /** Speech configuration for askForPlace dialog. The extension should be used to define the PlaceDialogSpec configuration. */
    dialogSpec?: {
      /** Holds helper specific dialog specs if any. For example: ConfirmationDialogSpec for confirmation helper. */
      extension?: {
        [key: string]: any;
      };
    };
  }
}
