import admin from "firebase-admin";

const serviceAccount = {
    "type": "service_account",
    "project_id": "fir-hotel-2aebe",
    "private_key_id": "226ce60fb61957b2d2298fab1742e3dd1859c429",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDXoLpe4THsMlLc\nCJCGEq+q0Ifye/1AKz3LYNBaIWWNjZ8yDAFj+Nj4FliYtF60lmdBHppMXb3q0LD3\nzc5ywK4y3r54nrZ2BfUL6ZPm6O7IK7H8ZDzSJ6E041SVmZJZKK2wM+lnXj4sIOtG\nbYeLJu6h8A/YLPubdZ0Y1mgckV+pf5fQ2AqL1t8CnPLhmOBc/0Q6ravpkTAuCSE9\n2F4A7zyR4S7pHgMovnGC0XZhUtaXTHDMUdvL4xEiwyNDt3w05MlqBO99UfR1iY6g\nJvg86e5wwIwATlYeQqSmho7TBpPnbRKz9nRDi2++XRU6OdqyU072/lUWRULkEdHm\nSOzVY2KLAgMBAAECggEAFNmwu9T4cAJWZdAZiDANYYM5lMEti24YUxlg/EjSGj58\nCtRYsWiSM7xsGRQJO7AheuKxK+Tn+j6aJil1/D2qeovJt5MtSeX95zF7wO58Nx9B\nM4p5IR8o5PAohoYWPd3Y8bq1/UNX2Ao020INwxm4JduMmgGQ24b4x7qP0Fde/Ijc\nRlZJr75LytuxrVggkKh03T+qrtgLMhz6+Er20gpPwqwPKT/gQZhPaNHGxNq2vjBK\nz1IPFq8lQrler0LeYEhoTmRGFIDA9x6hEBa/4JWxToTuRwAQmNeimnLIhDRBR5pi\nGGy9Ggo5yb5Ya8CyJhUXX/EhoCZbpbdEWkqloIPMaQKBgQD6pon9N5siUvA2XNZG\ney+XxdeKE6AJ8XBnKKlT8+/6V+Lt8VJ9G54oVWxI16Ka3GorwS9hKhKtmo71EyUF\nbep3arbcy32l2BxwJH8fvHM++WdLiqiEKgLkd/hNLjNpk39FM1dvKTEw5fToYc+b\nztTWySjdzUV4pPVT120ax9fUMwKBgQDcOtaJqyP+8aLfGLbBTesb2TURI1UtLbd/\nvumpBlHRNEjK0MwdqumdmCEGdlpD8quPLh+Z4DJ15A2/KvfjNz+rwoncc3az5POL\nfAUi5GG8yCOUZJ0M1f1ETxz6okTXj5oBZJREQi1U17AYPThTf/egmDDtiOu1KBGJ\nEgsUwuigSQKBgQDlWf5p9be+cKXdGJX5aD7kYeQYNFz8vDBeNJa8eznbmQ/NKkSQ\ntfTCc2fiP25KxeVgpCT2g8kTkZm+JwZ5MVqaastovcr7NgTPmJW6NHY/6XbbaMVK\nKib7Z8uM0/m3YX/TkmcvEEIyvDidauLNbzTSVL9QNcSb4FWbokPzfWnAgQKBgQC6\nT2B9+PWr0ZpbKJo7cIKs/ZWCWSTO4rUxcj5Uiw8ecCAAzKFRm+ylMTUHNYrpntt6\ndqevUtb9mx/yERTC+VN5KEve3yOVzuQmpZXmzdTNk3deK7wdRs9LQa6fbjXVMxwz\nf3ZbRKz68Ll92BTVtxWzm+0QltvpVut2zXfoaXfJWQKBgQCDvIPg/COrRqlE9V9b\nOKSDX0N25NXp7Kfhsra+4vzi9XXnLAltH/wb6R9u668XHVD/u6IIxproDbGm8XbR\ndfTZX13rBxiMSNMsGLSiqt75jwyzKeAWc9hBvXK09DZiVQTIfSuUHNrZnqyFJONd\nID+Q1FacaVPGbwObwPfzJ5ZMHQ==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-qucwa@fir-hotel-2aebe.iam.gserviceaccount.com",
    "client_id": "112024686603762070215",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qucwa%40fir-hotel-2aebe.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com",
  }
  

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-hotel-2aebe-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "gs://fir-hotel-2aebe.appspot.com"
  
});
const db = admin.database();
export default db;