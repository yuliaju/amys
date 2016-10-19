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
