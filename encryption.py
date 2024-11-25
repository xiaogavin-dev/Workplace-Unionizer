from flask import Flask, request, jsonify
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
import os
from flask_cors import CORS
import base64
app = Flask(__name__)
CORS(app)

@app.route('/create-symmetric-key')
def create_symmetric_key():
    new_symmetric_key = os.urandom(32)
    symmetric_key_utf = base64.b64encode(new_symmetric_key).decode('utf-8')
    return jsonify({
        'symmetric_key':symmetric_key_utf
    })

@app.route('/encrypt-symmetric', methods=['POST'])
def encrypt_symmetric_key():
    try:
        data = request.get_json()
        print("Received data:", data)

        public_keys = data.get("public_keys")
        symmetric_key_UTF = data.get("symmetric_key")
        symmetric_key = base64.b64decode(symmetric_key_UTF)
        print("Public Keys:", public_keys)
        print("Symmetric Key:", symmetric_key_UTF)

        if not public_keys or not symmetric_key:
            return jsonify({"error": "Both public_keys and symmetric_key are required"}), 400

        encrypted_results = {}

        for index, public_key_base64 in enumerate(public_keys):
            try:
                public_key_pem = base64.b64decode(public_key_base64).decode('utf-8')
                public_key = serialization.load_pem_public_key(public_key_pem.encode('utf-8'))

                encrypted_data = public_key.encrypt(
                    symmetric_key,
                    padding.OAEP(
                        mgf=padding.MGF1(algorithm=hashes.SHA256()),
                        algorithm=hashes.SHA256(),
                        label=None
                    )
                )

                encrypted_results[f"{public_key_base64}"] = base64.b64encode(encrypted_data).decode('utf-8')


            except Exception as e:
                print(f"Failed to encrypt with key: {public_key_base64}. Error: {e}")
                encrypted_results[f"{public_key_base64}"] = f"Error: {str(e)}"

        return jsonify({"encrypted_results": encrypted_results})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@app.route('/generate-rsa-key-pair', methods=['GET'])
def generate_RSA_key_pair():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=4096
    )
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    public_key = private_key.public_key()
    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    return jsonify({
        'publicKey': public_pem.decode('utf-8'),
        'privateKey': private_pem.decode('utf-8'),
    })    

@app.route('/encrypt', methods=['POST'])
def encrypt_data():
    try:
        # Debug request JSON
        data = request.get_json()
        print("Received data:", data)

        # Extract values
        public_key_pem = data.get("public_key")
        DATA_TO_ENCRYPT = data.get("message")
        print("Public Key:", public_key_pem)
        print("Message:", DATA_TO_ENCRYPT)

        # Validate inputs
        if not public_key_pem or not DATA_TO_ENCRYPT:
            return jsonify({"error": "Both public_key and message are required"}), 400

        # Deserialize the public key
        public_key = serialization.load_pem_public_key(public_key_pem.encode())

        # Encrypt the data
        encrypted_data = public_key.encrypt(
            str(DATA_TO_ENCRYPT).encode(),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )

        # Return the encrypted data as a hex string
        return jsonify({"encrypted_data": encrypted_data.hex()})
    except Exception as e:
        print(f"Error during encryption: {e}")
        return jsonify({"error": f"Encryption failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
