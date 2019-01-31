import { Configuration } from "./private-interfaces";

/** Describes translateHelper's t() method */
export interface ShortT {
  /**
   * Translates the given key using your json translations and a convention-over-configuration-approach.
   * First try is `currentState.currentIntent.platform.device`.
   * @param locals If given: variables to use in response
   */
  t(locals?: { [name: string]: string | number | object }): Promise<string>;

  /**
   * Translates the given key using your json translations.
   * @param key String of the key to look for. If you pass a relative key (beginning with '.'),
   * this method will apply several conventions, first looking for a translation for "currentState.currentIntent.KEY.platform.device".
   * If you pass an absolute key (without "." at beginning), this method will look at given absolute key.
   * @param locals Variables to use in reponse
   */
  t(key?: string, locals?: { [name: string]: string | number | object }): Promise<string>;
}

/** Uses I18next to get translations for keys */
export interface TranslateHelper extends ShortT {
  /**
   * Works the same as regular t(), but returns a list of all examples instead of a sample one.
   * Translates the given key using your json translations.
   * @param key String of the key to look for. If you pass a relative key (beginning with '.'),
   * this method will apply several conventions, first looking for a translation for "currentState.currentIntent.KEY.platform.device".
   * If you pass an absolute key (without "." at beginning), this method will look at given absolute key.
   * @param locals Variables to use in reponse
   * @return string array of all alternatives
   */
  getAllAlternatives(key?: string, locals?: { [name: string]: string | number | object }): Promise<string[]>;

  /**
   * Works the same as regular t(), but returns a list of all examples instead of a sample one.
   * Translates the given key using your json translations and a convention-over-configuration-approach.
   * First try is `currentState.currentIntent.platform.device`.
   * @param locals If given: variables to use in response
   */
  getAllAlternatives(locals?: { [name: string]: string | number | object }): Promise<string[]>;

  /**
   * Works the same as the regular t(), but returns any structure below the given key. The exact structure is returned, regardless
   * if the key points to a string, array or object, except for combinational template strings which are resolved to arrays.
   *
   * @param key String of the key to look for. If you pass a relative key (beginning with '.'),
   * this method will apply several conventions, first looking for a translation for "currentState.currentIntent.KEY.platform.device".
   * If you pass an absolute key (without "." at beginning), this method will look at given absolute key.
   * @param locals Variables to use in reponse
   * @return nested structure with translations
   */
  getObject<T = any>(key?: string, locals?: { [name: string]: string | number | object }): Promise<T>;
}

export interface InterpolationResolver {
  /**
   * resolves all missing interpolations in the given translation iteratively by executing missingInterpolation extensions
   * @param translatedValue text containing missing interpolations
   */
  resolveMissingInterpolations(translatedValue: string, translateHelper: TranslateHelper): Promise<string>;
}

export type TranslateValuesFor = (key: string, options?: any) => Promise<string[]>;

/** Configuration object for AssistantJS user for i18n component */
// tslint:disable-next-line:interface-name
export interface I18nConfiguration extends Partial<Configuration.Defaults>, Configuration.Required {}

/**
 * Extension which is used if an interpolation value is missing
 */
export interface MissingInterpolationExtension {
  /**
   * Returns either a string or undefined, wether or not you want to fill a missingInterpolation
   * If a string is returned, it will be used to fill the missing interpolation value
   * @param missingInterpolationName name of the interpolation that is missing
   */
  execute(missingInterpolationName: string, translateHelper: TranslateHelper): string | undefined | Promise<string | undefined>;
}
