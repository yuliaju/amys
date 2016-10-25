import * as _ from 'lodash'

export function serialize(obj: Object): string {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export function serializeTerm(str: String): string {
  return "&" + encodeURIComponent("term") + "=" + encodeURIComponent(str);
}

function isEqual_yelp(first: Object, second: Object): boolean {
  return ((first.name === second.name) && (_.isEqual(first.location, second.location)));
}

export const intersect2 = (xs,ys) => xs.filter(x => ys.some(y => {
  return isEqual_yelp(y, x);
}));
export const intersect = (xs,ys,...rest) => ys === undefined ? xs : intersect(intersect2(xs,ys),...rest);
