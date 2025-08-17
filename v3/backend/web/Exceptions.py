


class InvalidKeyException(Exception):
    pass

class AuthenticationException(Exception):
    def __init__(self, message):
        self.message = message