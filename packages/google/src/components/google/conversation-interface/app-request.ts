import { Argument } from "./common";

/**
 * Possible values for permission.
 */
export type Permission = "UNSPECIFIED_PERMISSION" | "NAME" | "DEVICE_PRECISE_LOCATION" | "DEVICE_COARSE_LOCATION" | "UPDATE";

/**
 * The type of SKU, like "inapp" or "subs", or "app".
 */
export type SkuType = "TYPE_UNSPECIFIED" | "IN_APP" | "SUBSCRIPTION" | "APP";

/**
 * Type indicates the state of the conversation in its life cycle.
 */
export type ConversationType = "TYPE_UNSPECIFIED" | "NEW" | "ACTIVE";

/**
 * Indicates the input source, typed query or voice query.
 */
export type InputType = "UNSPECIFIED_INPUT_TYPE" | "TOUCH" | "VOICE" | "KEYBOARD";

/**
 * AppRequest is sent by the Google Assistant to apps to ask for the app to drive feature-specific conversations.
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
export interface AppRequest {
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

/**
 * User, who initiated the conversation
 */
export interface User {
  /**
   * id of user
   */
  userId?: string

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

/**
 * Contains the user's personal info. Fields are only populated if the user user grants the permission to the app for a particular field.
 */
export interface UserProfile {
  /** The user's full name as specified in their Google account. Requires the NAME permission. */
  displayName?: string;
  /** The user's first name as specified in their Google account. Requires the NAME permission. */
  givenName?: string;
  /** The user's last name as specified in their Google account. Note that this field could be empty. Requires the NAME permission. */
  familyName?: string;
}

/**
 * List of entitlements related to a package name
 */
export interface PackageEntitlement {
  /** Should match the package name in action package */
  packageName?: string;
  /** List of entitlements for a given app */
  entitlements?: Entitlement[];
}

/**
 * Defines a user's digital entitlement. Types of possible entitlements: paid-app,in-app purchases, in-app subscriptions.
 */
export interface Entitlement {
  /** Product sku. Package name for paid app, suffix of Finsky docid for in-app purchase and in-app subscription. Match getSku() in Play InApp Billing API. */
  sku?: string;
  /** The type of SKU, like "inapp" or "subs", or "app". */
  skuType?: SkuType;
  /** Only present for in-app purchase and in-app subs. */
  inAppDetails?: SignedData;
}

/**
 * Contains all inapp purchase data in JSON format
 */
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

/**
 * Information about the device the user is using to interact with the Google Assistant.
 */
export interface Device {
  /** Represents actual device location such as lat, lng, and formatted address. Requires the DEVICE_COARSE_LOCATION or DEVICE_PRECISE_LOCATION permission. */
  location?: Location;
}

/**
 * Information specific to the Google Assistant client surface the user is interacting with.
 * Surface is distinguished from Device by the fact that multiple Assistant surfaces may live on the same device.
 */
export interface Surface {
  /** A list of capabilities the surface supports at the time of the request e.g. actions.capability.AUDIO_OUTPUT */
  capabilities?: Capability[];
}

/**
 * Represents a unit of functionality that the surface is capable of supporting.
 */
export interface Capability {
  /** The name of the capability, e.g. actions.capability.AUDIO_OUTPUT */
  name?: string;
}

/**
 * Represents a conversation
 */
export interface Conversation {
  /** Unique ID for the multi-turn conversation. It's assigned for the first turn. After that it remains the same for subsequent conversation turns until the conversation is terminated. */
  conversationId?: string;
  /** Type indicates the state of the conversation in its life cycle. */
  type?: ConversationType;
  /** Opaque token specified by the app in the last conversation turn. It can be used by an app to track the conversation or to store conversation related data */
  conversationToken?: string;
}

/**
 * List of inputs corresponding to the expected inputs specified by the app.
 */
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

/**
 * Raw input transcription from each turn of conversation that was used to provide this input.
 */
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
