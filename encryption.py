from flask import Flask, request, jsonify
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.padding import PKCS7
import os
from flask_cors import CORS
import base64
app = Flask(__name__)
CORS(app)


#utility functions 
def decrypt_symmetric_key(encrypted_key_b64, private_key_pem):
    # Decode the encrypted symmetric key
    encrypted_key = base64.b64decode(encrypted_key_b64)
    
    # Load the private key
    private_key = serialization.load_pem_private_key(
        private_key_pem,
        password=None,
        backend=default_backend()
    )
    
    # Decrypt the symmetric key using RSA private key
    symmetric_key = private_key.decrypt(
        encrypted_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return symmetric_key


def aes_encrypt(message, symmetric_key):
    iv = os.urandom(16)  # Generate a random IV
    cipher = Cipher(algorithms.AES(symmetric_key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()

    # Pad the message to be AES block size compatible
    padder = PKCS7(algorithms.AES.block_size).padder()
    padded_message = padder.update(message.encode()) + padder.finalize()

    # Encrypt the padded message
    ciphertext = encryptor.update(padded_message) + encryptor.finalize()
    
    # Combine IV and ciphertext for storage
    return base64.b64encode(iv + ciphertext).decode('utf-8')


def aes_decrypt(encrypted_message_b64, symmetric_key):
    encrypted_message = base64.b64decode(encrypted_message_b64)
    iv = encrypted_message[:16]  # Extract the IV
    ciphertext = encrypted_message[16:]  # Extract the ciphertext

    cipher = Cipher(algorithms.AES(symmetric_key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()

    # Decrypt the ciphertext
    padded_message = decryptor.update(ciphertext) + decryptor.finalize()

    # Remove padding
    unpadder = PKCS7(algorithms.AES.block_size).unpadder()
    message = unpadder.update(padded_message) + unpadder.finalize()
    return message.decode('utf-8')


@app.route('/encrypt-message', methods=['POST'])
def encrypt_message():
    data = request.json
    message = data['message']
    encrypted_symmetric_key = data['encryptedSymmetricKey']
    private_key_pem = data['privateKey'].encode()

    # Decrypt the symmetric key
    symmetric_key = decrypt_symmetric_key(encrypted_symmetric_key, private_key_pem)

    # Encrypt the message using the symmetric key
    encrypted_message = aes_encrypt(message, symmetric_key)

    return jsonify({
        'encryptedMessage': encrypted_message
    })

@app.route('/decrypt-message', methods=['POST'])
def decrypt_message():
    data = request.json
    messages = data['messages']  # List of messages
    keys = data['keys']  # List of keys
    private_key_pem = data['privateKey'].encode()

    decrypted_messages = []

    for message in messages:
        key_version_id = message['keyVersionId']
        
        # Find the matching key
        key_data = next(key for key in keys if key['versionId'] == key_version_id)
        encrypted_symmetric_key = key_data['encryptedKey']

        # Decrypt the symmetric key
        symmetric_key = decrypt_symmetric_key(encrypted_symmetric_key, private_key_pem)

        # Decrypt the message
        decrypted_message = aes_decrypt(message['content'], symmetric_key)
        decrypted_messages.append({
            'messageId': message['id'],
            'decryptedContent': decrypted_message
        })

    return jsonify(decrypted_messages)

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


if __name__ == '__main__':
    app.run(debug=True)
