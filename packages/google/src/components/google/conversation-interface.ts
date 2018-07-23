export type Permission = "UNSPECIFIED_PERMISSION" | "NAME" | "DEVICE_PRECISE_LOCATION" | "DEVICE_COARSE_LOCATION" | "UPDATE";

export type SkuType = "TYPE_UNSPECIFIED" | "IN_APP" | "SUBSCRIPTION" | "APP";

export type ConversationType = "TYPE_UNSPECIFIED" | "NEW" | "ACTIVE";

export type InputType = "UNSPECIFIED_INPUT_TYPE" | "TOUCH" | "VOICE" | "KEYBOARD";

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
 * The request includes Actions on Google-specific information
 * @example
 * {
 * "user": object,
 * "device": object,
 * "surface": object,
 * "conversation": object,
 * "inputs": object[],
 * "isInSandbox": boolean,
 * "availableSurfaces": object[]
 * }
 */
export interface RequestBody {
  /** User who initiated the conversation. */
  user?: User;
  /** Information about the device the user is using to interact with the app. */
  device?: Device;
  /** Information about the surface the user is interacting with, e.g. whether it can output audio or has a screen. */
  surface?: Surface;
  /** Holds session data like the conversation ID and conversation token. */
  conversation?: Conversation;
  /**
   * List of inputs corresponding to the expected inputs specified by the app.
   * For the initial conversation trigger, the input contains information on how the user triggered the conversation.
   */
  inputs?: Input[];
  /** Indicates whether the request should be handled in sandbox mode. */
  isInSandbox?: boolean;
  /** Surfaces available for cross surface handoff. */
  availableSurfaces?: Surface[];
}

export interface User {
  /**
   * Token representing the user's identity.
   * This is a Json web token including encoded profile.
   * The definition is at https://developers.google.com/identity/protocols/OpenIDConnect#obtainuserinfo.
   */
  idToken?: string;
  /** Information about the end user. Some fields are only available if the user has given permission to provide this information to the app. */
  profile?: UserProfile;
  /**
   * An OAuth2 token that identifies the user in your system.
   * Only available if [Account Linking][google.actions.v2.AccountLinking] configuration is defined in the action package and the user links their account.
   */
  accessToken?: string;
  /** Contains permissions granted by user to this app. */
  permission?: Permission[];
  /** Primary locale setting of the user making the request. Follows IETF BCP-47 language code  */
  locale?: string;
  /** The timestamp of the last interaction with this user. This field will be omitted if the user has not interacted with the agent before. */
  lastSeen?: string;
  /** An opaque token supplied by the application that is persisted across conversations for a particular user. The maximum size of the string is 10k characters. */
  userStorage?: string;
  /** List of user entitlements for every package name listed in action package, if any. */
  packageEntitlements?: PackageEntitlement[];
}

export interface UserProfile {
  /** The user's full name as specified in their Google account. Requires the NAME permission. */
  displayName?: string;
  /** The user's first name as specified in their Google account. Requires the NAME permission. */
  givenName?: string;
  /** The user's last name as specified in their Google account. Note that this field could be empty. Requires the NAME permission. */
  familyName?: string;
}

export interface PackageEntitlement {
  /** Should match the package name in action package */
  packageName?: string;
  /** List of entitlements for a given app */
  entitlements?: Entitlement[];
}

export interface Entitlement {
  /** Product sku. Package name for paid app, suffix of Finsky docid for in-app purchase and in-app subscription. Match getSku() in Play InApp Billing API. */
  sku?: string;
  /** The type of SKU, like "inapp" or "subs", or "app". */
  skuType?: SkuType;
  /** Only present for in-app purchase and in-app subs. */
  inAppDetails?: SignedData;
}

export interface SignedData {
  /**
   * Match INAPP_PURCHASE_DATA from getPurchases() method.
   * Contains all inapp purchase data in JSON format
   * See details in table 6 of https://developer.android.com/google/play/billing/billing_reference.html.
   */
  inAppPurchaseData?: {
    [key: string]: any;
  };
  /** Matches IN_APP_DATA_SIGNATURE from getPurchases() method in Play InApp Billing API. */
  inAppDataSignature?: string;
}

export interface Device {
  /** Represents actual device location such as lat, lng, and formatted address. Requires the DEVICE_COARSE_LOCATION or DEVICE_PRECISE_LOCATION permission. */
  location?: Location;
}

export interface Location {
  /** Geo coordinates. Requires the DEVICE_PRECISE_LOCATION permission. */
  coordinates?: LatLng;
  /** Display address, e.g., "1600 Amphitheatre Pkwy, Mountain View, CA 94043". Requires the DEVICE_PRECISE_LOCATION permission. */
  formattedAddress?: string;
  /** Zip code. Requires the DEVICE_PRECISE_LOCATION or DEVICE_COARSE_LOCATION permission. */
  zipCode?: string;
  /** City. Requires the DEVICE_PRECISE_LOCATION or DEVICE_COARSE_LOCATION permission. */
  city?: string;
  /** Postal address. Requires the DEVICE_PRECISE_LOCATION or DEVICE_COARSE_LOCATION permission. */
  postalAddress?: PostalAddress;
  /** Name of the place */
  name?: string;
  /** Phone number of the location, e.g. contact number of business location or phone number for delivery location. */
  phoneNumber?: string;
  /** Notes about the location */
  notes?: string;
  /** ṔlaceId is used with Places API to fetch details of a place. See https://developers.google.com/places/web-service/place-id */
  placeId?: string;
}

export interface LatLng {
  /** The latitude in degrees. It must be in the range [-90.0, +90.0]. */
  latitude?: number;
  /** The longitude in degrees. It must be in the range [-180.0, +180.0]. */
  longitude?: number;
}

export interface PostalAddress {
  /** The schema revision of the PostalAddress. This must be set to 0, which is the latest revision. All new revisions must be backward compatible with old revisions. */
  revision?: number;
  /** Required. CLDR region code of the country/region of the address. This is never inferred and it is up to the user to ensure the value is correct. */
  regionCode: string;
  /**
   * Optional. BCP-47 language code of the contents of this address (if known).
   * This is often the UI language of the input form or is expected to match one of the languages used in the address' country/region, or their transliterated equivalents
   */
  languageCode?: string;
  /** Optional. Postal code of the address */
  postalCode?: string;
  /** Optional. Additional, country-specific, sorting code. */
  sortingCode?: string;
  /** Optional. Highest administrative subdivision which is used for postal addresses of a country or region. */
  administrativeArea?: string;
  /** Optional. Generally refers to the city/town portion of the address */
  locality?: string;
  /** Optional. Sublocality of the address. For example, this can be neighborhoods, boroughs, districts. */
  sublocality?: string;
  /**
   * Unstructured address lines describing the lower levels of an address.
   * For more information see: https://developers.google.com/actions/reference/rest/Shared.Types/PostalAddress
   */
  addressLines?: string[];
  /** Optional. The recipient at the address. This field may, under certain circumstances, contain multiline information. For example, it might contain "care of" information. */
  recipients?: string[];
  /** Optional. The name of the organization at the address. */
  organization?: string;
}

export interface Surface {
  /** A list of capabilities the surface supports at the time of the request e.g. actions.capability.AUDIO_OUTPUT */
  capabilities?: Capability[];
}

export interface Capability {
  /** The name of the capability, e.g. actions.capability.AUDIO_OUTPUT */
  name?: string;
}

export interface Conversation {
  /** Unique ID for the multi-turn conversation. It's assigned for the first turn. After that it remains the same for subsequent conversation turns until the conversation is terminated. */
  conversationId?: string;
  /** Type indicates the state of the conversation in its life cycle. */
  type?: ConversationType;
  /** Opaque token specified by the app in the last conversation turn. It can be used by an app to track the conversation or to store conversation related data */
  conversationToken?: string;
}

export interface Input {
  /**
   * Raw input transcription from each turn of conversation that was used to provide this input.
   * Multiple conversation turns that don't involve the app may be required for the assistant to provide some types of input.
   */
  rawInputs?: RawInput[];
  /**
   * Indicates the user's intent. For the first conversation turn, the intent will refer to the intent of the action that is being triggered.
   * For subsequent conversation turns, the intent will be a built-in intent.
   */
  intent?: string;
  /** A list of provided argument values for the input requested by the app. */
  arguments?: Argument[];
}

export interface RawInput {
  /** Indicates how the user provided this input: a typed response, a voice response, unspecified, etc. */
  inputType?: InputType;
  /**
   * !! Union field input. The actual input value input can be only one of the following: !!
   */
  /** Typed or spoken input from the end user. */
  query?: string;
  /** The triggering URL. */
  url?: string;
}

export interface Argument {
  /** Name of the argument being provided for the input. */
  name?: string;
  /** The raw text, typed or spoken, that provided the value for the argument. */
  rawText?: string;
  /** Specified when query pattern includes a $org.schema.type.Text type or expected input has a built-in intent: actions.intent.TEXT, or actions.intent.OPTION. */
  textValue?: string;
  /**
   * Specified when an error was encountered while computing the argument.
   * For example, the built-in intent "actions.intent.PLACE" can return an error status if the user denied the permission to access their device location.
   */
  status?: Status;
  /**
   * !! Union field input. The actual input value input can be only one of the following: !!
   */
  /** Specified when query pattern includes a $org.schema.type.Number type or expected input has a built-in intent: "assistant.intent.action.NUMBER". */
  intValue?: string; // int64 format
  /** Specified for built-in intent: "actions.intent.NUMBER" */
  floatValue?: number;
  /** Specified when query pattern includes a $org.schema.type.YesNo type or expected input has a built-in intent: actions.intent.CONFIRMATION. */
  boolValue?: boolean;
  /** Specified for the built-in intent: actions.intent.DATETIME. */
  datetimeValue?: DateTime;
  /** Specified when query pattern includes a $org.schema.type.Location type or expected input has a built-in intent: "actions.intent.PLACE". */
  placeValue?: Location;
  /** Extension whose type depends on the argument */
  extension?: any;
  /** Specified when Google needs to pass data value in JSON format. */
  structuredValue?: {
    [key: string]: any;
  };
}

export interface Status {
  /** The status code, which should be an enum value of google.rpc.Code. */
  code?: number;
  /** A developer-facing error message, which should be in English. */
  message?: string;
  /** A list of messages that carry the error details. There is a common set of message types for APIs to use */
  details?: any[];
}

export interface DateTime {
  /** Represents a whole calendar date, e.g. date of birth */
  date?: {
    year: number;
    month: number;
    day: number;
  };
  /** Represents a time of day */
  time?: {
    hours: number;
    minutes: number;
    seconds: number;
    nanos: number;
  };
}

export interface ResponseBody {
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
  /** Prompt payload. */
  richInitialPrompt?: RichResponse;
  /** Prompt used to ask user when there is no input from user. */
  noInputPrompts?: SimpleResponse[];
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
