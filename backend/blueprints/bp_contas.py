from flask import Blueprint, request, jsonify
from blueprints.middleware import requer_token
from servicos import conta_servico

bp_contas = Blueprint("contas", __name__, url_prefix="/api/contas")


@bp_contas.get("/")
@requer_token
def listar(usuario):
    contas = conta_servico.listar_contas(usuario.id)
    return jsonify(contas), 200


@bp_contas.post("/")
@requer_token
def criar(usuario):
    dados = request.get_json()

    conta, erro = conta_servico.criar_conta(
        usuario_id=usuario.id,
        descricao=dados.get("descricao", ""),
        valor=dados.get("valor"),
        vencimento_str=dados.get("vencimento", "")
    )

    if erro:
        return jsonify({"erro": erro}), 400

    return jsonify(conta), 201


@bp_contas.patch("/<int:conta_id>/pagar")
@requer_token
def pagar(usuario, conta_id):
    conta, erro = conta_servico.pagar_conta(conta_id, usuario.id)

    if erro:
        return jsonify({"erro": erro}), 400

    return jsonify(conta), 200


@bp_contas.delete("/<int:conta_id>")
@requer_token
def excluir(usuario, conta_id):
    sucesso, erro = conta_servico.excluir_conta(conta_id, usuario.id)

    if erro:
        return jsonify({"erro": erro}), 404

    return jsonify({"mensagem": "Conta excluída"}), 200
