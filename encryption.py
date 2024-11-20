from flask import Flask, request, jsonify
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/create-symmetric-key')
def create_symmetric_key():
    new_symmetric_key = os.urandom(32)
    print(new_symmetric_key)
    return jsonify({
        'symmetric_key':new_symmetric_key
    })

@app.route('/encrypt-symmetric', methods = ['POST'])
def encrypt_symmetric_key():
    try:
        # Parse the incoming JSON data
        data = request.get_json()
        print("Received data:", data)

        # Extract the public keys and the symmetric key
        public_keys = data.get("public_keys")
        symmetric_key = data.get("symmetric_key")
        print("Public Keys:", public_keys)
        print("Symmetric Key:", symmetric_key)

        # Validate inputs
        if not public_keys or not symmetric_key:
            return jsonify({"error": "Both public_keys and symmetric_key are required"}), 400

        # Prepare the result dictionary
        encrypted_results = {}

        # Encrypt the symmetric key with each public key
        for public_key_pem in public_keys:
            try:
                # Deserialize the public key from PEM format
                public_key = serialization.load_pem_public_key(public_key_pem.encode())

                # Encrypt the symmetric key
                encrypted_data = public_key.encrypt(
                    str(symmetric_key).encode(),
                    padding.OAEP(
                        mgf=padding.MGF1(algorithm=hashes.SHA256()),
                        algorithm=hashes.SHA256(),
                        label=None
                    )
                )

                # Convert the encrypted data to hex format for readability
                encrypted_results[public_key_pem] = encrypted_data.hex()

            except Exception as e:
                print(f"Failed to encrypt with key: {public_key_pem}. Error: {e}")
                encrypted_results[public_key_pem] = f"Error: {str(e)}"

        # Return the result as a JSON object
        return jsonify({"encrypted_results": encrypted_results})

    except Exception as e:
        print(f"Error during encryption: {e}")
        return jsonify({"error": f"Encryption failed: {str(e)}"}), 500


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
