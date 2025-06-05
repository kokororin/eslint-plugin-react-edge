import * as preferNamedPropertyAccess from './prefer-named-property-access';
import * as varNaming from './var-naming';

export const rules = {
  [preferNamedPropertyAccess.RULE_NAME]: preferNamedPropertyAccess.default,
  [varNaming.RULE_NAME]: varNaming.default,
};
