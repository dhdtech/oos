import random
from cryptography.fernet import Fernet

def encrypt_secret_value(
        secret_value: str
) -> tuple[str, str]:
        """
        Encrypts a secret value with a given hex key.

        :param secret_value: Secret value to be encrypted
        :type secret_value: str
        :param hex_key: Hex key to be used to encrypt the secret value
        :type hex_key: str

        :return: Encrypted secret value and key
        :rtype: tuple[str, str]
                """
        key = Fernet.generate_key()
        fernet = Fernet(key)

        return fernet.encrypt(secret_value.encode()).decode(), key.decode() 


def decrypt_secret_value_with_key(key: str, encrypted_secret_value: str) -> str:
        """
        Decrypts a secret value with a given hex key.
        
        :param key: Hex key to be used to decrypt the secret value
        :type key: str
        :param encrypted_secret_value: Encrypted secret value to be decrypted
        :type encrypted_secret_value: str
        
        :return: Decrypted secret value
        :rtype: str
        """
        fernet = Fernet(key)
        
        try:
                return fernet.decrypt(encrypted_secret_value).decode()
        except Exception as e:
                return ""