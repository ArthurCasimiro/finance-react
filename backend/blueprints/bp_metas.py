from flask import Blueprint, request, jsonify
from blueprints.middleware import requer_token
from servicos import meta_servico

bp_metas = Blueprint("metas", __name__, url_prefix="/api/metas")


@bp_metas.get("/")
@requer_token
def listar(usuario):
    metas = meta_servico.listar_metas(usuario.id)
    return jsonify(metas), 200


@bp_metas.post("/")
@requer_token
def criar(usuario):
    dados = request.get_json()

    meta, erro = meta_servico.criar_meta(
        usuario_id=usuario.id,
        nome=dados.get("nome", ""),
        valor_alvo=dados.get("valor_alvo")
    )

    if erro:
        return jsonify({"erro": erro}), 400

    return jsonify(meta), 201


@bp_metas.patch("/<int:meta_id>/depositar")
@requer_token
def depositar(usuario, meta_id):
    dados = request.get_json()

    meta, erro = meta_servico.depositar_meta(
        meta_id=meta_id,
        usuario_id=usuario.id,
        valor=dados.get("valor")
    )

    if erro:
        return jsonify({"erro": erro}), 400

    return jsonify(meta), 200


@bp_metas.delete("/<int:meta_id>")
@requer_token
def excluir(usuario, meta_id):
    sucesso, erro = meta_servico.excluir_meta(meta_id, usuario.id)

    if erro:
        return jsonify({"erro": erro}), 404

    return jsonify({"mensagem": "Meta excluída"}), 200
