import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from modelos.usuario import Usuario
from repositorios.usuario_repositorio import UsuarioRepositorio

CHAVE_SECRETA = "fintrack-chave-super-secreta-2025"

repositorio = UsuarioRepositorio()


def registrar_usuario(nome, email, senha):
    if not nome or not email or not senha:
        return None, "Todos os campos são obrigatórios"

    if repositorio.buscar_por_email(email):
        return None, "E-mail já cadastrado"

    if len(senha) < 6:
        return None, "Senha deve ter pelo menos 6 caracteres"

    usuario = Usuario(
        nome=nome,
        email=email,
        senha_hash=generate_password_hash(senha)
    )
    repositorio.salvar(usuario)
    return usuario, None


def autenticar_usuario(email, senha):
    if not email or not senha:
        return None, "E-mail e senha são obrigatórios"

    usuario = repositorio.buscar_por_email(email)

    if not usuario:
        return None, "Credenciais inválidas"

    if not check_password_hash(usuario.senha_hash, senha):
        return None, "Credenciais inválidas"

    return usuario, None


def gerar_token(usuario_id):
    payload = {
        "usuario_id": usuario_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=8)
    }
    return jwt.encode(payload, CHAVE_SECRETA, algorithm="HS256")


def verificar_token(token):
    try:
        payload = jwt.decode(token, CHAVE_SECRETA, algorithms=["HS256"])
        return payload.get("usuario_id"), None
    except jwt.ExpiredSignatureError:
        return None, "Token expirado"
    except jwt.InvalidTokenError:
        return None, "Token inválido"
