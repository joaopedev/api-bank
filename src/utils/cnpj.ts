export function validaCNPJ(cnpj: string): string {
  let cnpjRegex = cnpj.match(/^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/);

  if (cnpjRegex) {
    let cnpjBD = cnpjRegex[0];
    cnpjBD = cnpjBD.replaceAll(".", "");
    cnpjBD = cnpjBD.replaceAll("-", "");
    cnpjBD = cnpjBD.replaceAll("/", "");

    if (cnpjBD.length == 14) {
      return cnpjBD;
    } else {
      return "";
    }
  } else {
    return "";
  }
}
