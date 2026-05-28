from flask import Blueprint, request, jsonify
from servicos import auth_servico

bp_auth = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp_auth.post("/registrar")
def registrar():
    dados = request.get_json()
    nome = dados.get("nome", "")
    email = dados.get("email", "")
    senha = dados.get("senha", "")

    usuario, erro = auth_servico.registrar_usuario(nome, email, senha)

    if erro:
        return jsonify({"erro": erro}), 400

    token = auth_servico.gerar_token(usuario.id)
    return jsonify({
        "token": token,
        "usuario": {"id": usuario.id, "nome": usuario.nome, "email": usuario.email}
    }), 201


@bp_auth.post("/login")
def login():
    dados = request.get_json()
    email = dados.get("email", "")
    senha = dados.get("senha", "")

    usuario, erro = auth_servico.autenticar_usuario(email, senha)

    if erro:
        return jsonify({"erro": erro}), 401

    token = auth_servico.gerar_token(usuario.id)
    return jsonify({
        "token": token,
        "usuario": {"id": usuario.id, "nome": usuario.nome, "email": usuario.email}
    }), 200
