import forge from "@/utils/forge.min";
function myencode(msg) {
    var pubkey = '-----BEGIN PUBLIC KEY-----\n' +
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArjogDwUq+J/qzNdTFjhG\n' +
        'bGppDKgF7YusfY3c2fIZ3sQNZDnvE7Ny/2E8N6MfrPLHxV2LAidfspc3ORgdUSa8\n' +
        'zFh2P209pGZXwtCyYMD2sQu5sTW5xAb1L7vHTUi53c8w8eSp/dKsE8YzP7Ws8U60\n' +
        'IdRv9AxveDaG/kvyOx8Q024TWbVh70iyXx2OdhZlmkSPmpFHcQHbRNmaBVKqDzDf\n' +
        '64qsMMJYHlMFRlrB+InxMmetHMh/1tNWGFRVSjpa1pXibWl0oSfS/HiB+RVf0d3D\n' +
        '4woILRRmc4O6xQ/m54P+h8EOij8U+LqLimT5y5INPyD2tDbVx+Is+o5VBg3NotiK\n' +
        'FQIDAQAB\n' +
        '-----END PUBLIC KEY-----';

    var pki = forge.pki;
    var publickey = pki.publicKeyFromPem(pubkey);
    var data = publickey.encrypt(msg, 'RSA-OAEP', {
        md: forge.md.sha1.create(),
        mgf1: {
            md: forge.md.sha1.create()
        }
    });
    var org_code = forge.util.encode64(data);

    var code = org_code.replace(/\+/g, '-');

    return code.replace(/\//g, '_');
}
export default myencode