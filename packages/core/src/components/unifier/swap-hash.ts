export function swapHash(configHash) {
  let result = {};
  Object.keys(configHash).forEach(parameterType => {
    configHash[parameterType].forEach(parameter => {
      result[parameter] = parameterType;
    });

    // Add type as possible parameter, for answer prompt
    result[parameterType] = parameterType;
  });

  return result;
}
