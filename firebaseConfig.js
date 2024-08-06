import admin from "firebase-admin";

const serviceAccount = {
    "type": "service_account",
    "project_id": "hoteldemo-c1f24",
    "private_key_id": "5e0710505600e0a45e3e99e4e3e63f711a42e86c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFEF7C9f9c4KsZ\n1S9ls37iMyvHvu/px+SGdByUTlqgxnY8tWj12cFkjlnxEqYZBfVPRCTxd5WLr+7X\nFqHZU5vHawMPe2Oz4cV31mYaP+7afpUR0pzJ+nPxNcmm08hFR8/YQe2jSbYh1iXo\nGTM92Z1PsH7j6TMH3vlAF89AMbU8Tpx7A75VKRoyexpa3ja4JFs/wObnwLoAZeFs\n8oTir7tz1XynrW8V/d03Gfvi5RA9AeZ2aQUkdxa2MK2L4hFo83zjlOGkD2NYGPQ6\n+fXQlMlzTwRUAMJG4jEnTTDn8VVN+Z2MtCHchDcW5TZ9q/24yJpgbE7ptvXSa2n+\nVYWlHHKhAgMBAAECggEAIs879fNPOuBCyQrj1vKoeJtyYdPD/Ec/glKTU80tbBXy\nf9HJqxfedf1BPPi+10+6n9hZMEAf7e9TYLISP9npfAXWog75Myav43W/Tma5seXH\nPkE2SeVQQqzuJGZni3leaQRoTj4winSR+Jgu+X9trsxt9aNVTNAhtiUeimfdbDvl\nO+g5n6PDZVTeFpjXZ/RgGR9phRiH4Aljwdvf/lAJ0TKkAgKeakqWeAKmPB39+Fxz\nFl5lQ4/X9rmYgERtELSre7h301WO9ZXYyF4/Zt58zT7Wcf3Ac77aB6snhL/ywKOY\nvpOvAZf2gJb0LOk8aLu1yntSIh+KyAPnYT/TyrwaIwKBgQDnm8QoSjDcC7l4eaUc\nRmOjDpKqzx+uduLUJudUCirVVfNRd/r3DVmkmCXxslyhVkjK1dBgIuCPXjJlixyy\nbaGNAaV8/w/y+ue9uWGUNkKOWXL6qFnFf9A9B+s6oDkL7Cqq/g8KxQ3A/Z1DR3J7\neeag38PdmTzYTTwuvJgEUJaOtwKBgQDZ0UX8w6fCSkPoA62IPmMqgl7+ESGjIvbr\n5gAucTmcFe87vwZTb/13caaPDeL/iiJv2gPZYjNeuB7ZjxBI/JYe40YqoiikNOIU\n6/Y3Dahy2xB8xsU9hAaJbFh1xKQpvxOXWFtwP4tsTRsKzJP9wG7+WjBI8mmIN8g/\n/y8uGogxZwKBgQCgZezcZj0eN3R0LfKd+VWJmE8UwirTvXvrpyGvvvbZFhRTiH8i\n13kMl1432+lwxnvVFWyhF6ZjQ74tOsFeBLTMHabJQS9/fCo/54HfjhBb2zDYzPyW\n3aSOj8xlpo67ZgxKrXYnZD7ZOArQjEuJneuN4EoaTsSnnB2g1HWHD3SlUwKBgFpu\naTk03gxrGuBTzpMXG8LFV7zxzd5WIN/1oLOnbHyiGq3adDzl7PzPIZCY+lqPthZs\nFFcHTz6PALfgjqlOvODcCQCgTHFIR2jaQmG++OWej6zONYuBqdkaM2vJlUKDwxV9\nqJDkwPTY2lZUc0jRwQM23H8crbXROwFe5+6jM1IXAoGAMjCQKtMtVAbKdNIrQA92\npeNTznLIZuqjsFH0Oal72juCfKGmohTGU80AViLrQlblN/2t4eJab3hgR68PC3fh\naMc7uLZtmr/VMBlwP+0AqZdLrsMj8OQjKKasc21AXbZ0nmhqolqxzEt7qifihKYO\nUeVsTlMz61DhKgJhIq5OX5c=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-wx2bs@hoteldemo-c1f24.iam.gserviceaccount.com",
    "client_id": "116495824223436571966",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wx2bs%40hoteldemo-c1f24.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hoteldemo-c1f24-default-rtdb.europe-west1.firebasedatabase.app"
});
const db = admin.database();
module.exports = db;