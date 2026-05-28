from functools import wraps
from flask import request, jsonify
from servicos.auth_servico import verificar_token
from repositorios.usuario_repositorio import UsuarioRepositorio

repositorio = UsuarioRepositorio()


def requer_token(f):
    @wraps(f)
    def decorador(*args, **kwargs):
        cabecalho = request.headers.get("Authorization", "")

        if not cabecalho.startswith("Bearer "):
            return jsonify({"erro": "Token ausente"}), 401

        token = cabecalho.split(" ")[1]
        usuario_id, erro = verificar_token(token)

        if erro:
            return jsonify({"erro": erro}), 401

        usuario = repositorio.buscar_por_id(usuario_id)
        if not usuario:
            return jsonify({"erro": "Usuário não encontrado"}), 401

        return f(usuario, *args, **kwargs)

    return decorador
