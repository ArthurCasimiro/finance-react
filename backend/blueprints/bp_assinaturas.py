from flask import Blueprint, request, jsonify
from blueprints.middleware import requer_token
from servicos import assinatura_servico

bp_assinaturas = Blueprint("assinaturas", __name__, url_prefix="/api/assinaturas")


@bp_assinaturas.get("/")
@requer_token
def listar(usuario):
    assinaturas = assinatura_servico.listar_assinaturas(usuario.id)
    return jsonify(assinaturas), 200


@bp_assinaturas.post("/")
@requer_token
def criar(usuario):
    dados = request.get_json()

    assinatura, erro = assinatura_servico.criar_assinatura(
        usuario_id=usuario.id,
        nome=dados.get("nome", ""),
        valor=dados.get("valor"),
        ciclo=dados.get("ciclo", "")
    )

    if erro:
        return jsonify({"erro": erro}), 400

    return jsonify(assinatura), 201


@bp_assinaturas.delete("/<int:assinatura_id>")
@requer_token
def cancelar(usuario, assinatura_id):
    sucesso, erro = assinatura_servico.cancelar_assinatura(assinatura_id, usuario.id)

    if erro:
        return jsonify({"erro": erro}), 404

    return jsonify({"mensagem": "Assinatura cancelada"}), 200
