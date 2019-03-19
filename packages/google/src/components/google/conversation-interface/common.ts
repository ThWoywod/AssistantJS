/**
 * /** A list of provided argument values for the input requested by the app.
 */
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

/**
 * The Status type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs
 */
export interface Status {
  /** The status code, which should be an enum value of google.rpc.Code. */
  code?: number;
  /** A developer-facing error message, which should be in English. */
  message?: string;
  /** A list of messages that carry the error details. There is a common set of message types for APIs to use */
  details?: any[];
}

/**
 * Date and time argument value parsed from user input. Does not include time zone information.
 */
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

/**
 * Container that represents a location.
 */
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

/**
 * An object representing a latitude/longitude pair. This is expressed as a pair of doubles representing degrees latitude and degrees longitude.
 * Unless specified otherwise, this must conform to the WGS84 standard. Values must be within normalized ranges.
 */
export interface LatLng {
  /** The latitude in degrees. It must be in the range [-90.0, +90.0]. */
  latitude?: number;
  /** The longitude in degrees. It must be in the range [-180.0, +180.0]. */
  longitude?: number;
}

/**
 * Represents a postal address, e.g. for postal delivery or payments addresses. Given a postal address, a postal service can deliver items to a premise, P.O. Box or similar.
 * It is not intended to model geographical locations (roads, towns, mountains).
 */
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
